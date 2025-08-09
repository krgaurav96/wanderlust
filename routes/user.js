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

const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

// ===== Register Form =====
router.get("/register", (req, res) => {
    res.render("users/register");
});

// ===== Register User =====
router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}));

// ===== Login Form =====
router.get("/login", (req, res) => {
    res.render("users/login");
});

// ===== Login User =====
router.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// ===== Logout =====
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;


