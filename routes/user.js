const express = require('express');
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/appAsync.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const { savereturnTo } = require('../middleware.js');
const userController = require("../controllers/users.js");

//register route
router.get("/register", (req, res) => {
    res.render("users/register.ejs");   
});

// Handle POST /register and redirect back to the form
router.post("/register", wrapAsync(userController.registeruser)
);


//login route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",savereturnTo,
     passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), wrapAsync(userController.loginuser));

//logout route
router.get("/logout", userController.logoutuser);

module.exports = router;