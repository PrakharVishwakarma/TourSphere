const express = require("express");

const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

const passport = require("passport");

const { saveRedirectUrl } = require("../middlewares/middleware.js");

const userController = require("../controllers/users.js");


router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUpUser));


//SignUp
// router.get("/signup", userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.signUpUser));


router
  .route("/login")
  .get(userController.renderLogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );


//LogIn
// router.get("/login", userController.renderLogInForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.loginUser
// );


// LogOut
router.get("/logout", userController.logOutUser);

module.exports = router;
