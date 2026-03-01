BookMyStay
A full-stack web application for booking and discovering accommodations. Users can list their properties, browse available stays, leave reviews and ratings, and manage their bookings.

Features
User Authentication: Secure registration and login using Passport.js with local strategy
Property Listings: Create, read, update, and delete property listings with details like title, description, price, and location
Image Upload: Cloudinary integration for hosting listing images
Geolocation: GeoJSON-based geographic data for mapping listing locations
Reviews & Ratings: Users can leave 5-star ratings and comments on properties
Session Management: MongoDB session storage for persistent user sessions
Flash Messages: Real-time user feedback for actions (success/error notifications)
Responsive UI: EJS templating with CSS styling and interactive JavaScript features

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB with Mongoose ODM
Authentication: Passport.js
Image Storage: Cloudinary
Template Engine: EJS with ejs-mate
File Upload: Multer
Validation: Joi
Session Storage: Connect-Mongo
Maps: Leaflet with GeoJSON
