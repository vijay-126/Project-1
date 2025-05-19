const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/WrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middlewarse.js");

const reviewController = require("../controllers/review.js")
// post review route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.newReviews)
);

//  delete review route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.delete));

module.exports = router;
