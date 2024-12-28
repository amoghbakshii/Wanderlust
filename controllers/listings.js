const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("./listings/new.ejs");
};


module.exports.showListing = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("./listings/show.ejs", { listing});
});

module.exports.createListing = async (req, res) => {

   let response =  await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
   
        
        
    try {
        let url, filename;

        // Handle image upload from multer
        if (req.file) {
            url = req.file.path;  // Cloudinary/Multer path
            filename = req.file.filename;  // File name
        }

        // Create and save new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log(savedListing);
        
       
        
        req.flash("success", "New listing added successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error during listing creation:", err);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_400");
    res.render("listings/edit.ejs", { listing,originalImageUrl});
});

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    // Update listing details (not image yet)
    listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    let url, filename;

    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
        listing.image = { url, filename }; // Store both URL and filename

        // Save the updated listing with the new image
        await listing.save();
    }

    // After all updates, send success message and redirect
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = (async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
});