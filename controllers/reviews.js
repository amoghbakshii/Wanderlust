const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Create Review
module.exports.createReview = async (req, res) => {
    try {
        console.log(req.params.id);
        let listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("New Review saved");
        req.flash("success", "New review created successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong while creating the review.");
        res.redirect(`/listings/${req.params.id}`);
    }
};

// Delete Review
module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        console.log("Review deleted successfully");
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong while deleting the review.");
        res.redirect(`/listings/${id}`);
    }
};