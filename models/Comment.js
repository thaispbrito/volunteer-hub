const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        // Store user for permissions
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // If the user commenting is a volunteer
        volunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Volunteer",
            dafault: null,
        },
        // If the user commenting is an organization
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;