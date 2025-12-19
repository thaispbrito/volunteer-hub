const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const session = require('express-session');

// For saving session in MongoDB
const MongoStore = require("connect-mongo").default;  // added .default since the environment is wrapping exports

const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

const path = require('path');

const authController = require("./controllers/auth.js");
const usersController = require("./controllers/users.js");
const volunteersController = require("./controllers/volunteers.js");
const organizationsController = require("./controllers/organizations.js");
const listingsController = require('./controllers/listings.js')
const matchesController = require('./controllers/matches.js')
const commentsController = require('./controllers/comments.js')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));

// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Middleware for css rules
app.use(express.static(path.join(__dirname, 'public')));

// Sessions within browser
// Create a session for every request
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

// Add our custom middleware right after the session middleware
app.use(passUserToView);


// ROUTES

// app.get("/", (req, res) => {
//     res.render("index.ejs");
// });

// app.get("/vip-lounge", isSignedIn, (req, res) => {
//     res.send(`Welcome to the party ${req.session.user.username}.`);
// });

app.use("/auth", authController);
app.use("/", usersController);  // for handling homepage
app.use("/volunteer", isSignedIn, volunteersController);  // singular URL for one-to-one relationship
app.use("/organizations", isSignedIn, organizationsController);  // One-to-many relationship
app.use('/listings', isSignedIn, listingsController);  // One-to-many relationship
app.use('/matches', isSignedIn, matchesController);  
app.use('/listings/:listingId/comments', isSignedIn, commentsController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
