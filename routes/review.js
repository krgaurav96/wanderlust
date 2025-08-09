// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Review = require('../models/review.js');
// const Listing = require('../models/listing.js');
// const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
// const reviewController = require("../controllers/reviews.js");


// // Post Reviews Route
// router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));


// //Delete Review Route
// router.delete("/:reviewId", isLoggedIn,isReviewAuthor,
//   wrapAsync(reviewController.destroyReview));


// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

// ===== Add Review =====
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
}));

// ===== Delete Review =====
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;

