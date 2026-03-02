const Listing = require("../models/listing");
// Import geocoding utility
const geocodeAddress = require("../utils/geocode");

//index
module.exports.index = async (req, res) => {
    console.log("/listings route hit");
    const allListings = await Listing.find({});
    console.log("Fetched listings:", allListings.length);
    res.render("listings/index", {allListings});
}
//new
module.exports.newlisting = (req, res) => {
    res.render("listings/new.ejs"); 
}

//show
module.exports.showlisting = async (req, res) => {
    let {id} = req.params;
    console.log(`Fetching listing with id: ${id}`);
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("Owner");
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

//create
module.exports.createlisting = async (req, res) => {
    const newlisting = req.body.listing;
    // Image is already set by validateListing middleware
    
    // Geocode the address to get coordinates for the map (GeoJSON format)
    // GeoJSON is used for compatibility with mapping libraries and standards
    // Coordinates are [longitude, latitude] as per GeoJSON spec
    const address = `${newlisting.location}, ${newlisting.country}`;
    try {
        newlisting.geometry = {
            type: "Point",
            coordinates: await geocodeAddress(address)
        };
    } catch (err) {
        console.error("Geocoding error:", err.message);
        // Fallback to Delhi if geocoding fails
        newlisting.geometry = {
            type: "Point",
            coordinates: [77.2090, 28.6139]
        };
    }
    newlisting.Owner = req.user._id; // Set the owner of the listing to the currently logged-in user
    await new Listing(newlisting).save();
    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");
}

//Edit
module.exports.editlisting = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";
    if (listing.image && typeof listing.image === "object" && listing.image.url) {
        originalImage = listing.image.url;
    } else if (typeof listing.image === "string" && listing.image.trim()) {
        originalImage = listing.image;
    }
    res.render("listings/edit.ejs", {listing, originalImage});
}

//update
module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    
    // Store old location for comparison
    const oldLocation = `${listing.location}, ${listing.country}`;
    
    // Update all listing fields (middleware already set image correctly)
    Object.assign(listing, req.body.listing);
    
    // Re-geocode if location has changed
    const newLocation = `${listing.location}, ${listing.country}`;
    if (oldLocation !== newLocation) {
        try {
            listing.geometry = {
                type: "Point",
                coordinates: await geocodeAddress(newLocation)
            };
        } catch (err) {
            console.error("Geocoding error:", err.message);
            // Fallback to Delhi if geocoding fails
            listing.geometry = {
                type: "Point",
                coordinates: [77.2090, 28.6139]
            };
        }
    }
    
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

//delete
module.exports.deletelisting = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
    console.log("Deleted listing:", deletedListing);
}
