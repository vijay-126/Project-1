const Listing =require("./models/listing")
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must have to logged in to create listings");
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

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
let listing =    await Listing.findById(id);
if(!listing || !listing.owner.equals(res.locals.currUser._id)){
req.flash("error","you dont have permission for this listing ")
    return  res.redirect(`/listings/${id}`);

}
next();
}

// validating listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// validating reviews

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//  review author

module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id, reviewId } = req.params;
let review =    await Review.findById(reviewId);
if( !review.author.equals(res.locals.currUser._id)){
req.flash("error","you dont have permission for this review ")
    return  res.redirect(`/listings/${id}`);

}
next();
}