const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');
const { isLoggedIn } = require('./middleware');
const User = require('../models/user');

// Middleware to validate listing
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

// Routes

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}));

// Create Route
// router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
//     console.log("Creating new listing with data:", req.body);
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;  // Assign the logged-in user as the owner
//     await newListing.save();
//     req.flash("success", "New listing added successfully!");
//     res.redirect("/listings");
// }));

router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    console.log("Creating new listing with data:", req.body);
    console.log("Logged in user:", req.user);  // Debugging line
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  // Assign the logged-in user as the owner
    await newListing.save();
    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;