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

// Alternative for not using the ternary operator
// let port;
// if (process.env.PORT) {
//     port = process.env.PORT;
// } else {
//     port = 3000;
// }

const authController = require("./controllers/auth.js");

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

// GET /
// app.get("/", async (req, res) => {
//     res.render("index.ejs");
// });


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/vip-lounge", isSignedIn, (req, res) => {
    res.send(`Welcome to the party ${req.session.user.username}.`);
});

// app.get("/vip-lounge", (req, res) => {
//     if (req.session.user) {
//         res.send(`Welcome to the party ${req.session.user.username}.`);
//     } else {
//         res.send("Sorry, no guests allowed.");
//     }
// });

// app.use(
//     "/vip-lounge",
//     (req, res, next) => {
//         if (req.session.user) {
//             res.locals.user = req.session.user; // Store user info for use in the next function
//             next(); // Proceed to the next middleware or controller
//         } else {
//             res.redirect("/"); // Redirect unauthenticated users
//         }
//     },
//     authController // The controller handling the '/vip-lounge' route
// );


// /auth routes
app.use("/auth", authController);


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
