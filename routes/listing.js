const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/appAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing } = require("../middleware.js");  
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const { Storage } = require("../cloudConfig.js");
const upload = multer({ storage: Storage });
 


//index route to display all listings
router.get("/", wrapAsync(listingController.index));

//new route to display form for creating a new listing
router.get("/new", isLoggedIn, listingController.newlisting);


//show route to display details of a single listing
if (!listingController.showlisting || typeof listingController.showlisting !== "function") {
    console.error("listingController.showlisting is not defined or not a function. Check your controllers/listing.js export and import.");
    router.get("/:id", (req, res) => {
        res.status(500).send("Internal error: listingController.showlisting is not defined.");
    });
} else {
    router.get("/:id", wrapAsync(listingController.showlisting));
}


// create route
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createlisting)
);

//edit route to display form for editing a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editlisting));
       

//update route
router.put("/:id",
     isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
     validateListing, wrapAsync(listingController.updatelisting));


//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deletelisting)); 

module.exports = router;