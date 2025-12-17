const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        cause: {
            type: String,
            required: true,
        },
        skills: {
            type: String,
            required: true,
        },
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        schedule: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
        },
        favoritedByVolunteers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Volunteer",
            },
        ],
    },
    { timestamps: true }
)

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing