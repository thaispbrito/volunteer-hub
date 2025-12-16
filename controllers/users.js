const express = require("express");
const router = express.Router();

const Volunteer = require("../models/Volunteer");
const Organization = require("../models/Organization");

// GET /
// It handles the homepage 
router.get("/", async (req, res, next) => {
  try {
	let volunteer = null;
	let organizations = null;
	const user = req.session.user;
	if (user) {
		volunteer = await Volunteer.findOne({ userId: user._id });
		organizations = await Organization.find({owner: user._id});  
    }
    res.render('index.ejs', { user, volunteer, organizations });  // Make variables called user, volunteer, and organization available to the view

  } catch (err) {
	console.log(err);
    res.redirect("/");
  }
});

module.exports = router;