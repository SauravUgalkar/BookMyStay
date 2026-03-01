const Listing = require("../models/listing");
const Review = require("../models/review.js");

//reviw controller
module.exports.reviewroutes = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New review added!");
    console.log("Added review:", newreview);
    res.redirect(`/listings/${id}`);
}

//delete review controller
module.exports.deletereview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    console.log(`Deleted review with id: ${reviewId} from listing with id: ${id}`);
    res.redirect(`/listings/${id}`);
}