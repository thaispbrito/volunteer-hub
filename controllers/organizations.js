const express = require('express')
const router = express.Router()

const Organization = require('../models/Organization')

// GET /organizations
// Index route: List all organizations for logged-in user
router.get('/', async (req, res) => {
    try {
        const organizations = await Organization.find().populate('owner')
        res.render('organizations/index.ejs', { organizations })  // Make a variable called organizations available to the view
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

module.exports = router;






