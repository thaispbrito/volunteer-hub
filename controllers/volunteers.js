const express = require('express')
const router = express.Router()

const Volunteer = require('../models/Volunteer');
const Listing = require('../models/Listing');

// GET /volunteer/profile
// View the logged-in user's volunteer profile
router.get('/profile', async (req, res) => {
    try {
        const user = req.session.user;
        // if (!user) return res.redirect("/auth/sign-in")

        const volunteer = await Volunteer.findOne({userId: user._id});
        if (!volunteer) {
            return res.redirect('/volunteer/new');
        }

        // Listings favorited by this volunteer
        const myFavoriteListings = await Listing.find({
            favoritedByVolunteers: volunteer._id,
        }).populate('owner')

        res.render('volunteers/show.ejs', { 
            volunteer,
            myFavoriteListings, 
        }); 

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /volunteer/new
// Show form to create a volunteer profile
router.get('/new', (req, res) => {
    try {
        res.render('volunteers/new.ejs');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

// POST /volunteer
// Create a volunteer profile
router.post('/', async (req, res) => {
    try {
        req.body.userId = req.session.user._id
        await Volunteer.create(req.body)
        res.redirect('/volunteer/profile')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /volunteer/edit
// Show form to edit a volunteer profile
router.get('/edit', async (req, res) => {
    try {
        const user = req.session.user;
        // if (!user) return res.redirect("/auth/sign-in")

        const volunteer = await Volunteer.findOne({userId: user._id});
        res.render('volunteers/edit.ejs', {
            volunteer: volunteer,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/')
    }  
});

// PUT /volunteer/
// Update volunteer profile
router.put('/', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.redirect("/auth/sign-in")

        const volunteer = await Volunteer.findOne({userId: user._id});
        if (!volunteer) {
            return res.redirect('/');
        }

        await volunteer.updateOne(req.body);
        res.redirect('/volunteer/profile');

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// DELETE /volunteer/
// Delete volunteer profile
router.delete('/', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.redirect("/auth/sign-in");

        const volunteer = await Volunteer.findOne({userId: user._id});
        if (!volunteer) {
            return res.redirect('/');
        }
             
        await volunteer.deleteOne();
        res.redirect('/');

    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

module.exports = router;