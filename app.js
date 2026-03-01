if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// console.log("Environment variables loaded:", process.env.SECRET);

const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local"); 
const user = require("./models/user.js");



const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

const app = express();
const port = process.env.PORT || 8080;


const sessionOptions = {
    secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
};

if (process.env.USE_MONGO_SESSION === "true") {
    try {
        const store = MongoStore.create({
            mongoUrl: process.env.ATLAS_DB_URL,
            touchAfter: 24 * 3600,
            crypto: {
                secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret!"
            }
        });
        store.on("error", function (e) {
            console.log("Session store error:", e);
        });
        sessionOptions.store = store;
    } catch (err) {
        console.log("Mongo session store disabled:", err.message);
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//session use for persistent login sessions for all routes

passport.use(new LocalStrategy(user.authenticate())); //use static authenticate method of model in LocalStrategy

passport.serializeUser(user.serializeUser()); //serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {id: '...'}.
passport.deserializeUser(user.deserializeUser()); //The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see serializeUser). So your whole object is retrieved with help of that key. That key is usually the user id, but you can use whatever you want.

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; //passport adds user when logged in
    next();
});

// DB Connection
const dbUrl = process.env.ATLAS_DB_URL ;
main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("Error connecting to MongoDB:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);


// 404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", { err, currentUser: req.user });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});