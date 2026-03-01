
console.log("Script started");
const mongoose = require("mongoose");
const { data } = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/BookMyStay";

async function main() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        await initDB();

        await mongoose.connection.close();
        console.log("Connection closed");
    } catch (err) {
        console.error("Error in main():", err);
    }
}

async function initDB() {
    try {
        console.log("Deleting all listings...");
        await Listing.deleteMany({});
        // Add owner field to each listing
        const ownerId = '699c0c07270fb94fec427e0c';
        const listingsWithOwner = data.map(obj => ({ ...obj, Owner: ownerId }));
        console.log("Inserting sample data...");
        await Listing.insertMany(listingsWithOwner);
        console.log("Database initialized with sample data!");
    } catch (err) {
        console.error("Error in initDB():", err);
    }
}

main();
