const express = require("express");
const router = express.Router();

const Volunteer = require("../models/Volunteer");

// GET /
// It handles the homepage 
router.get("/", async (req, res, next) => {
  try {
    let volunteer = null;
    const user = req.session.user;
    if (user) {
      volunteer = await Volunteer.findOne({ userId: user._id });
    }
    res.render('index.ejs', { user, volunteer });

  } catch (err) {
    console.log(err);
    res.redirect("/")
  }
});

module.exports = router;