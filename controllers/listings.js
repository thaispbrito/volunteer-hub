const express = require('express')
const router = express.Router()

const Listing = require('../models/Listing');
const Organization = require('../models/Organization');
const Volunteer = require('../models/Volunteer');

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
// router.post('/:listingId/favorited-by/:userId', async (req, res) => {
//     try {
//         await Listing.findByIdAndUpdate(req.params.listingId, {
//             $push: { favoritedByUsers: req.params.userId },
//         })
//         res.redirect(`/listings/${req.params.listingId}`)
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// })


// POST /listings/:listingId/favorite
router.post('/:listingId/favorite', async (req, res) => {
    try {
        // user is guaranteed by isSignedIn
        const volunteer = await Volunteer.findOne({
            userId: req.session.user._id,
        })

        if (!volunteer) {
            return res.send('You must have a volunteer profile to favorite listings.')
            // or: res.redirect('/volunteer/new')
        }

        await Listing.findByIdAndUpdate(req.params.listingId, {
            $addToSet: { favoritedByVolunteers: volunteer._id },
        })

        res.redirect(`/listings/${req.params.listingId}`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})


// DELETE /listings/:listingId/favorited-by/:userId
// Unfavorite a listing
// router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
//     try {
//         await Listing.findByIdAndUpdate(req.params.listingId, {
//             $pull: { favoritedByUsers: req.params.userId },
//         })
//         res.redirect(`/listings/${req.params.listingId}`)
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// })

// DELETE /listings/:listingId/favorite
router.delete('/:listingId/favorite', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({
            userId: req.session.user._id,
        })

        if (!volunteer) {
            return res.redirect('/')
        }

        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByVolunteers: volunteer._id },
        })

        res.redirect(`/listings/${req.params.listingId}`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// GET /listings/:listingId
// Display a single listing
// router.get('/:listingId', async (req, res) => {
//     try {
//         const listing = await Listing.findById(req.params.listingId).populate(
//             'owner'
//         )

//         const volunteerHasFavorited = listing.favoritedByUsers.some((user) =>
//             user.equals(req.session.volunteer._id)
//         )

//         res.render('listings/show.ejs', {
//             listing,
//             volunteerHasFavorited,
//             currentUserId: req.session.user._id,
//         })
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// })

// GET /listings/:listingId
// Display a single listing
router.get('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
            .populate('owner')
            .populate('favoritedByVolunteers')

        let volunteer = null
        let volunteerHasFavorited = false

        if (req.session.user) {
            volunteer = await Volunteer.findOne({
                userId: req.session.user._id,
            })

            if (volunteer) {
                volunteerHasFavorited = listing.favoritedByVolunteers.some(v =>
                    v._id.equals(volunteer._id)
                )
            }
        }
        res.render('listings/show.ejs', {
            listing,
            volunteer,
            volunteerHasFavorited,
            currentUserId: req.session.user._id,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router