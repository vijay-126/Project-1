const Listing = require("../models/listing");

//all listing
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// new listing page
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// create new listing

module.exports.newlisting = async (req, res, next) => {
  // let{title,description,price,location,country,image}= req.body;
  // let newListings =  await new Listing({
  //   title:title,
  //   description:description,
  //   image:image,
  //   price:price,
  //   location:location,
  //   country:country
  // });
  // newListings.save().then
  // console.log("newListings");
  // if(!req.body.listing){
  //   throw new ExpressError(400,"send valid data for listing");
  // }

  // console.log(newListing)
  /*if(!newListing.title){
          throw new ExpressError(400,"title is missing");
        
        }
        if(!newListing.description){
            throw new ExpressError(400,"Description is missing");
          
          }
          if(!newListing.location){
              throw new ExpressError(400,"location is missing");
            
            // }*/

  // in place of this if statement we use listing schema
  let { path: url, filename } = req.file;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.category =req.body.listing.category
  console.log(newListing)
  await newListing.save();
  req.flash("success", "New Listing Created ");

  res.redirect("/listings");
  // res.send("newListing")
};

//show page

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "This listing is not  exist ");

    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

//edit page

module.exports.edit = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "This listing is not  exist ");

    return res.redirect("/listings");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_30,w_25")
    res.render("listings/edit.ejs", { listing , originalImageUrl});
  }
};

//update

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
   let { path: url, filename } = req.file;
  listing.image = { url, filename };
  await listing.save();
  }

  req.flash("success", "You Listing is updated ");
  res.redirect(`/listings/${id}`);
};

//delete

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("success", `${deleteListing.title}  Listing is Deleted  `);

  console.log(deleteListing);
  res.redirect("/listings");
};

module.exports.category = async(req,res)=>{
const givenCategory = req.query.category;
let allListings = await Listing.find({category: givenCategory})
  // console.log( givenCategory,"and",listing);
   res.render("listings/index.ejs",{allListings})

}

module.exports.search= async(req,res)=>{
  console.log(req.query.search);
  let search = req.query.search;
  let allListings = await Listing.find({country:search})
  console.log(allListings);
  if(allListings.length === 0 ){
    req.flash("error","This country Listing not exist");
    res.redirect("/listings");
  }else{

    res.render("listings/index.ejs",{allListings})
  }
}