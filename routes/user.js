const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewarse.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.newUser)

  .post(WrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.loginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
