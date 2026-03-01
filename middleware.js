
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require('./schema.js');



module.exports.isLoggedIn = function(req, res, next) {
    if (typeof req.isAuthenticated !== 'function' || !req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //store the url they are requesting
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
}


module.exports.savereturnTo = function(req, res, next) {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; //make it available in the templates
    }
    next();
}

// --- Middleware for validating listing data using schema.js ---
module.exports.validateListing = function(req, res, next) {
    // Only set image if a file is uploaded, or if creating (POST) and no image is provided
    if (req.file) {
        req.body.listing.image = {
            url: req.file.path || req.file.url || req.file.secure_url,
            filename: req.file.filename
        };
    } else if (req.method === 'POST') {
        // Only set placeholder for new listings
        req.body.listing.image = {
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            filename: "placeholder.jpg"
        };
    }
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
}

//review validation middleware
module.exports.validateReview = function(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }else
        next();
}


module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.Owner && !listing.Owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//rebiew ownership middleware
module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(review.author && !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}