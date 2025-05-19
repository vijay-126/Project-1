const User = require("../models/user.js");


// sign up page 
module.exports.newUser =  (req, res) => {
  res.render("users/signup.ejs");
};

// create new user 
 module.exports.signUp = async (req, res) => {
     try {
       let { username, email, password } = req.body;
       const newUser = new User({ email, username });
       let registerUser = await User.register(newUser, password);
       console.log(registerUser);
       req.login(registerUser, (err) => {
         if (err) {
           return next(err);
         }    
       req.flash("success", "Welcome to Wanderlust");
       res.redirect("/listings");
       });
     
     } catch (e) {
       req.flash("error", e.message);
       res.redirect("/signup");
     };
   };

   //logiin page

   module.exports.loginPage = (req, res) => {
   res.render("users/login.ejs");
 };
 
 //login 

 module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

 //logout 

 module.exports.logout =  (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("sucsess", "you are logged out");
    res.redirect("/listings");
  });
}