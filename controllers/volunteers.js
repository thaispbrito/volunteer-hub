const express = require('express')
const router = express.Router()

const Volunteer = require('../models/Volunteer')

// GET volunteer/profile
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

module.exports = router;