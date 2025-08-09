// const express = require("express");
// const wrapAsync = require("../utils/wrapAsync");
// const router = express.Router();
// const User = require("../models/user.js");
// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/users.js");


// router.route("/signup")
// .get( userController.renderSignupForm)
// .post(wrapAsync(userController.signup));

// router.route("/login")
// .get(userController.renderLoginForm)
// .post(
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     userController.login
// );

// router.get("/logout", userController.logout);


// module.exports = router;

const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};


