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
        modelVol: {
            type: String,
            enum: ["In-Person", "Remote"],
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
        state: {
            type: String,
            enum: [
                "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
                "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
                "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
                "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
                "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
            ],
            required: true,
        },
        schedule: {
            type: String,
            required: true,
        },
        contactInfo: {
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