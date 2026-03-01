const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    // GeoJSON geometry field for storing coordinates (used by Leaflet map)
    // GeoJSON is a standard for encoding geographic data structures
    // Coordinates are [longitude, latitude] as per GeoJSON spec
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

//mongoose middleware to delete associated reviews when a listing is deleted

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;   
