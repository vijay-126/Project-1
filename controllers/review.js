const Review = require("../models/review");
const Listing = require("../models/listing.js");
const review = require("../models/review");

// new reviews create 

module.exports.newReviews = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created ");

    res.redirect(`/listings/${listing._id}`);
  }

  //deleteReview 
  module.exports.delete = async (req, res) => {
      let { id , reviewId } = req.params;
      await Listing.findByIdAndUpdate(id ,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","review deleted");
      res.redirect(`/listings/${id}`);
    }
    