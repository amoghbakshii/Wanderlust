const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("./middleware");
const userController = require("../controllers/users")

//routes
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUpForm));

//login route
router.route("/login")
.get(userController.renderSignInForm)
.post(saveRedirectUrl,passport.authenticate('local',
  {failureRedirect:'/login',
  failureFlash:true,
 }),
   userController.logInForm);

router.get("/logout",userController.logOut);

module.exports = router;