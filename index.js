if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

require('dotenv').config();



const express = require("express");

const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userrouter = require("./routes/user.js");
const MongoStore = require("connect-mongo");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);




let port = 8080;
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("DB URL:", process.env.ATLASDB_URL);
    console.log("sucessful connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,

  },
  touchAfter:24*3600,
})


store.on("error",()=>{
  console.log("Error in Mongo")
})
const sessionOption={
  store,
  secret : process.env.SECRET,
 resave :false,
 saveUninitialized:true,
 cookie:{
  expires:Date.now()+7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
httpOnly:true,
 }
}



app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


// //starting check route

// app.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     res.send("hi! i am root");
//   })
// );


app.use("/listings", listingsrouter);
app.use("/listings/:id/review", reviewsrouter);
app.use("/", userrouter);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// err handling middleware

app.use((err, req, res, next) => {
  let { statusCode = 404, message = "Erro Occured" } = err;

  res.status(statusCode).render("error.ejs", { err });

  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("server is listineng", port);
});
