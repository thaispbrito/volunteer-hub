const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        volunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Volunteer",
            dafault: null,
        },
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