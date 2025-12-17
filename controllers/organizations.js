const express = require('express')
const router = express.Router()

const Organization = require('../models/Organization');
const Listing = require('../models/Listing.js')

// GET /organizations
// Index - List all organizations for logged-in user
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
// Display one organization with its listings and favorites
router.get('/:organizationId', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId).populate('owner');

        // Listings owned by this organization
        const myListings = await Listing.find({
            owner: organization._id,
        }).populate('owner')

        // // Listings favorited by this organization
        // const myFavoriteListings = await Listing.find({
        //     favoritedByUsers: req.session.user._id,
        // }).populate('owner')

        res.render('organizations/show.ejs', {
            organization,
            myListings,
            // myFavoriteListings,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// DELETE /organizations/:organizationId
// Delete organization
router.delete('/:organizationId', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId)
        if (organization.owner.equals(req.session.user._id)) {
            await organization.deleteOne()
            res.redirect('/organizations')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

// GET /organizations/:organizationId/edit
// Display edit form
router.get('/:organizationId/edit', async (req, res) => {
    try {
        const currentOrg = await Organization.findById(req.params.organizationId)
        res.render('organizations/edit.ejs', {
            organization: currentOrg,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// PUT /organizatioins/:organizationId
// Update organization
router.put('/:organizationId', async (req, res) => {
    try {
        const currentOrg = await Organization.findById(req.params.organizationId)
        if (currentOrg.owner.equals(req.session.user._id)) {
            await currentOrg.updateOne(req.body)
            res.redirect('/organizations')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router;






