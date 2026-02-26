const express = require('express')
const router = express.Router()

const Listing = require('../models/Listing');
const Volunteer = require('../models/Volunteer');
const Organization = require('../models/Organization');
const Comment = require('../models/Comment');

// GET /listings
// Index - View all listings from an organization
router.get('/', async (req, res) => {
    try {
        // const listings = await Listing.find().populate('owner');
        // console.log(listings);

        let listings = await Listing.find().populate('owner');

        // Remove listings with no owner
        listings = listings.filter(listing => listing.owner !== null);
            res.render('listings/index.ejs', { listings });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
});

// GET /listings/new/:id
// Display a form to create new listing
router.get('/new/:id', (req, res) => {
    try {
        const organization = req.params.id;
        res.render('listings/new.ejs', { organization });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

// POST /listings/:id
// Create a new listing
router.post('/:id', async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);
        if (!org) {
            return res.send("You don't have an organization to create a listing for.");
        }
        req.body.owner = org._id;
        await Listing.create(req.body);
        res.redirect(`/organizations/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// GET /listings/:listingId/edit
// Display edit form
router.get('/:listingId/edit', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId);
        res.render('listings/edit.ejs', {
            listing: currentListing,
        })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// PUT /listings/:listingId
// Update listing
router.put('/:listingId', async (req, res) => {
    try {
        const userId = req.session.user._id;

        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.send('Listing not found');

        const organization = await Organization.findById(listing.owner);
        if (!organization) return res.send('Organization not found');

        if (!organization.owner.equals(userId)) {
            return res.send("You don't have permission to do that.");
        }

        await listing.updateOne(req.body);
        res.redirect(`/listings/${req.params.listingId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// DELETE /listings/:listingId
// Delete listing
router.delete('/:listingId', async (req, res) => {
    try {
        const userId = req.session.user._id;

        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.send('Listing not found');

        const organization = await Organization.findById(listing.owner);
        if (!organization) return res.send('Organization not found');

        if (!organization.owner.equals(userId)) {
            return res.send("You don't have permission to do that.");
        }

        await listing.deleteOne();
        res.redirect(`/organizations/${organization._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// POST /listings/:listingId/favorite
router.post('/:listingId/favorite', async (req, res) => {
    try {
        // user is guaranteed by isSignedIn
        const volunteer = await Volunteer.findOne({
            userId: req.session.user._id,
        })

        if (!volunteer) {
            return res.send('You must have a volunteer profile to favorite listings.')
        }

        await Listing.findByIdAndUpdate(req.params.listingId, {
            $addToSet: { favoritedByVolunteers: volunteer._id },
        });

        res.redirect(`/listings/${req.params.listingId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// DELETE /listings/:listingId/favorite
router.delete('/:listingId/favorite', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({
            userId: req.session.user._id,
        })

        if (!volunteer) {
            return res.redirect('/');
        }

        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByVolunteers: volunteer._id },
        })

        res.redirect(`/listings/${req.params.listingId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// GET /listings/:listingId
// Display a single listing
router.get('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId)
      .populate('owner')
      .populate('favoritedByVolunteers');

    const comments = await Comment.find({
      listing: req.params.listingId,
    })
      .populate('volunteer', 'firstName lastName')
      .populate('organization', 'orgName')
      .sort({ createdAt: 1 });

    let volunteer = null;
    let volunteerHasFavorited = false;

    if (req.session.user) {
      volunteer = await Volunteer.findOne({
        userId: req.session.user._id,
      });

      if (volunteer) {
        volunteerHasFavorited = listing.favoritedByVolunteers.some(v =>
          v._id.equals(volunteer._id)
        );
      }
    }
    
    res.render('listings/show.ejs', {
      listing,
      comments,
      volunteer,
      volunteerHasFavorited,
      currentUserId: req.session.user?._id,
      organization: listing.owner,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;

