// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require('../models/listing.js');
// const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
// const listingcontroller = require("../controllers/listing.js");
// const multer = require("multer");
// const {storage} = require("../cloudConfig.js");
// const upload = multer({storage});


// router.route("/")
// .get(wrapAsync(listingcontroller.index))
// .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingcontroller.createListing));


// //New Route
// router.get("/new",isLoggedIn, listingcontroller.renderNewForm);

// router.route("/:id")
// .get(wrapAsync(listingcontroller.showListing ))
// .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing,wrapAsync(listingcontroller.updateListing))
// .delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.destroyListing));

// //Edit Route
// router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingcontroller.renderEditForm));

// module.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// ===== All Listings =====
router.get("/", catchAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
}));

// ===== New Listing Form =====
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// ===== Create Listing =====
router.post("/", isLoggedIn, validateListing, catchAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Successfully created listing!");
    res.redirect(`/listings/${listing._id}`);
}));

// ===== Show Listing =====
router.get("/:id", catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("owner").populate({
        path: "reviews",
        populate: { path: "author" }
    });
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

// ===== Edit Listing Form =====
router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

// ===== Update Listing =====
router.put("/:id", isLoggedIn, isOwner, validateListing, catchAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// ===== Delete Listing =====
router.delete("/:id", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;


