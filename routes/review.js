const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/appAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// review routes
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewroutes));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deletereview));

module.exports = router;
