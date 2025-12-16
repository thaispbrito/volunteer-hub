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

// GET /organizations/new
// Display a form to create new organization 
router.get('/new', (req, res) => {
    try {
        res.render('organizations/new.ejs')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// POST /organizations
// Create new organization
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        await Organization.create(req.body)
        res.redirect('/organizations')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /organizations/:organizationId
// Display one organization
router.get('/:organizationId', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId).populate(
            'owner'
        )
        res.render('organizations/show.ejs', {
            organization,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})



module.exports = router;






