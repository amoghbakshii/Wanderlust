const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');
const { isLoggedIn, isOwner,validateListing } = require('./middleware');
const User = require('../models/user');
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Routes

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id").get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;