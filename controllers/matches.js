const express = require('express');
const router = express.Router();

const Volunteer = require('../models/Volunteer');
const Listing = require('../models/Listing');
const Organization = require('../models/Organization');


// GET /
// Display matching dashboard 
router.get('/', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ userId: req.session.user._id });
        const organizations = await Organization.find({ owner: req.session.user._id });

        let matchingListings = [];
        if (volunteer) {
            matchingListings = await Listing.find({
                cause: volunteer.cause,
                modelVol: volunteer.modelVol,
                state: volunteer.state
            }).populate('owner');
        }

        const orgMatches = [];
        for (let org of organizations) {
            const listings = await Listing.find({ owner: org._id });  
            
            for (let listing of listings) {
                const volunteers = await Volunteer.find({
                    cause: listing.cause,
                    modelVol: listing.modelVol,
                    state: listing.state
                });
                orgMatches.push({ listing, volunteers });
            }
        }

        res.render('matches/dashboard.ejs', {
            volunteer,
            organizations,
            matchingListings,
            orgMatches
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
