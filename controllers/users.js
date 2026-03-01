const User = require("../models/user");

//sign up
module.exports.registeruser = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password); // This will hash the password and save the user to the database. It also adds the username and email to the user document.
        console.log("Registered user:", registeredUser);
        req.login(registeredUser, function(err) { // Automatically log in the user after registration
            if (err) {
                console.log("Error during login after registration:", err); 
            }
            req.flash("success", "Registration successful, Welcome to BookMyStay!");
            res.redirect("/listings");
        });
    } catch (e) {
        console.log("Error during registration:", e);
        req.flash("error", e.message);
        res.redirect("/register");
    }
}


//login
module.exports.loginuser = async (req, res) => {
    req.flash("success", "Login successful, Welcome to BookMyStay!");
    const redirectUrl = res.locals.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl); // Redirect to the saved returnTo URL or default to /listings
}

//logout
module.exports.logoutuser = (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
}
