const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User.js");

// GET SIGN UP TEMPLATE
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

// CREATE A USER
router.post("/sign-up", async (req, res) => {
    // Will check to see if username exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }

    // If username is not taken, check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }

    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // Creating a new user
    const user = await User.create(req.body);

    // Sign 'em up, sign 'em in!
    req.session.user = {
        username: user.username,
        _id: user._id,
    };

    req.session.save(() => {
        res.redirect("/");
    });

});

// GET SIGN IN TEMPLATE
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

// POST SIGN IN
router.post("/sign-in", async (req, res) => {
    // Finding user
    const userInDatabase = await User.findOne({ username: req.body.username });

    // User does not exist in db
    if (!userInDatabase) {
        return res.send("Login failed. User not found.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Password does not match.");
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };

    req.session.save(() => {
        res.redirect("/");
    });

});

// SIGN USER OUT!
router.get("/sign-out", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
