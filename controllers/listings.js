const express = require('express')
const router = express.Router()

const Listing = require('../models/Listing')
const Organization = require('../models/Organization')

// GET /listings
// Index - View all listings from an organization
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find().populate('owner')
        res.render('listings/index.ejs', { listings })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /listings/new
// Display a form to create new listing
router.get('/new', (req, res) => {
    try {
        res.render('listings/new.ejs')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// POST /listings
// Create a new listing
router.post('/', async (req, res) => {
    try {
        const org = await Organization.findOne({ owner: req.session.user._id })
        if (!org) {
            return res.send("You don't have an organization to create a listing for.")
        }
        req.body.owner = org._id
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /listings/:listingId/edit
// Display edit form
router.get('/:listingId/edit', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId)
        res.render('listings/edit.ejs', {
            listing: currentListing,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// PUT /listings/:listingId
// Update listing
router.put('/:listingId', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId)
        if (currentListing.owner.equals(req.session.user._id)) {
            await currentListing.updateOne(req.body)
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// DELETE /listings/:listingId
// Delete listing
router.delete('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        if (listing.owner.equals(req.session.user._id)) {
            await listing.deleteOne()
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

// POST /listings/:listingId/favorited-by/:userId
// Mark a listing as favorited by a user
router.post('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/listings/${req.params.listingId}`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// DELETE /listings/:listingId/favorited-by/:userId
// Unfavorite a listing
router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/listings/${req.params.listingId}`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /listings/:listingId
// Display a single listing
router.get('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate(
            'owner'
        )

        const userHasFavorited = listing.favoritedByUsers.some((user) =>
            user.equals(req.session.user._id)
        )

        res.render('listings/show.ejs', {
            listing,
            userHasFavorited,
            currentUserId: req.session.user._id,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router