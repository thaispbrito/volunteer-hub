const express = require('express')
const router = express.Router()

const Volunteer = require('../models/Volunteer')

// GET /volunteer/profile
// View the logged-in user's volunteer profile if any
router.get('/profile', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.redirect("/auth/sign-in")

        const volunteer = await Volunteer.findOne({userId: user._id});
        if (!volunteer) {
            return res.redirect('/volunteer/new');
        }

        res.render('volunteers/show.ejs', { volunteer })

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



module.exports = router;