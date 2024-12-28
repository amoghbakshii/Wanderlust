const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Listings = require("../routes/listing.js");
const review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("./middleware.js");
const reviewController = require("../controllers/reviews.js");




//Reviews
//Post route create
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;