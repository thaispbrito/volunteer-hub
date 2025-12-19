const express = require('express')
const router = express.Router({ mergeParams: true }); // details

const Comment = require('../models/Comment');
const Listing = require('../models/Listing');
const Volunteer = require('../models/Volunteer');
const Organization = require('../models/Organization');

// // POST /listings/:listingId/comments
// // Create a comment
// router.post('/', async (req, res) => {
//     try {

//         const user = req.session.user;

//         const listing = await Listing.findById(req.params.listingId);
//         if (!listing) return res.redirect('/');

//         const volunteer = await Volunteer.findOne({ userId: user._id });
//         const organization = await Organization.findOne({ owner: user._id });

//         // Organization can only comment on its own listing
//         // if (organization && !listing.owner.equals(organization._id)) {
//         //     return res.send('Organizations can only comment on their own listings.')
//         // }

//         await Comment.create({
//             listing: listing._id,
//             user: user._id,
//             volunteer: volunteer ? volunteer._id : null,
//             organization: volunteer ? null : organization?._id,
//             content: req.body.content,
//         });

//         res.redirect(`/listings/${listing._id}`)
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// })


router.post('/', async (req, res) => {
    try {
        const user = req.session.user;

        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.redirect('/');

        const volunteer = await Volunteer.findOne({ userId: user._id });

        let commentingOrg = null;

        if (!volunteer) {
            commentingOrg = await Organization.findOne({
                _id: listing.owner,
                owner: user._id
            });

            if (!commentingOrg) {
                return res.send('Organizations can only comment on their own listings.');
            }
        }

        await Comment.create({
            listing: listing._id,
            user: user._id,
            volunteer: volunteer ? volunteer._id : null,
            organization: volunteer ? null : commentingOrg._id,
            content: req.body.content,
        });

        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.redirect('/');
    }
});


// GET /listings/:listingId/comments/:commentId/edit
// Edit comment form
router.get('/:commentId/edit', async (req, res) => {
    try {

        const user = req.session.user;

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.redirect('/');

        // Only comment owner is able to edit
        if (!comment.user.equals(user._id)) {
            return res.send("You don't have permission to edit this comment.")
        }

        res.render('comments/edit.ejs', { comment });
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// PUT /listings/:listingId/comments/:commentId
// Update comment
router.put('/:commentId', async (req, res) => {
    try {

        const user = req.session.user;

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.redirect('/');

        // Only comment owner is able to update
        if (!comment.user.equals(user._id)) {
            return res.send("You don't have permission to update this comment.")
        }

        comment.content = req.body.content;
        await comment.save();

        res.redirect(`/listings/${req.params.listingId}`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
});

// // DELETE /listings/:listingId/comments/:commentId
// // Delete comment
// router.delete('/:commentId', async (req, res) => {
//     try {

//         const user = req.session.user;

//         const comment = await Comment.findById(req.params.commentId);
//         if (!comment) return res.redirect('/');

//         const listing = await Listing.findById(comment.listing);
//         const organization = await Organization.findOne({ owner: user._id });

//         const isCommentOwner = comment.user.equals(user._id);
//         const isListingOwner = organization && listing.owner.equals(organization._id);

//         // Only comment owner OR listing owner org can delete
//         if (!isCommentOwner && !isListingOwner) {
//             return res.send("You don't have permission to delete this comment.")
//         }

//         await comment.deleteOne();
//         res.redirect(`/listings/${listing._id}`)
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// });

// DELETE /listings/:listingId/comments/:commentId
// Delete comment
router.delete('/:commentId', async (req, res) => {
    try {
        const user = req.session.user;

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.redirect('/');

        const listing = await Listing.findById(comment.listing);
        if (!listing) return res.redirect('/');

        // Check if the user is a volunteer
        const volunteer = await Volunteer.findOne({ userId: user._id });

        // Check if the user owns the organization that owns this listing
        const organization = await Organization.findOne({
            _id: listing.owner,
            owner: user._id
        });

        const isCommentOwner = comment.user.equals(user._id);
        const isListingOwner = organization != null;

        // Only the comment owner OR the organization that owns the listing can delete
        if (!isCommentOwner && !isListingOwner) {
            return res.send("You don't have permission to delete this comment.");
        }

        // Delete the comment
        await comment.deleteOne();

        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.redirect('/');
    }
});





module.exports = router;
