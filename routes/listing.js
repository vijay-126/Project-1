const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewarse.js");
const ExpressError = require("../utils/ExpressError.js");
const listingConroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage }= require("../cloudConfig.js")
const upload = multer({storage});




router
  .route("/")
  .get(wrapAsync(listingConroller.index))
  .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingConroller.newlisting));
 
//new route
router.get("/search", wrapAsync(listingConroller.search));

router.get("/new", isLoggedIn, listingConroller.new);

router.route("/category")
.get(wrapAsync(listingConroller.category))
router
  .route("/:id")
  .get(wrapAsync(listingConroller.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingConroller.updateListing)
  )
.delete( isLoggedIn, isOwner, wrapAsync(listingConroller.delete));
  
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingConroller.edit));

module.exports = router;


