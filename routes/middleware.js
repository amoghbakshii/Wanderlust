const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require('../utils/ExpressError');
const { listingSchema, reviewSchema } = require('../schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You do not have permission to edit this page!!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.error("Error in isOwner middleware:", err);
        next(err);
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId).populate("author");
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect(`/listings/${id}`);
        }
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", err);
        next(err);
    }
};
