const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    slogan: {
        type: String,
        required: true,
    },
    orgName: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
    },
    story: {
        type: String,
        required: true,
    },
    cause: {
        type: String,
        enum: [
            "Human Rights",
            "Community Support",
            "Environment",
            "Animals",
            "Health & Wellness",
            "Social Justice & Equality",
            "Arts & Culture",
            "Disaster & Emergency Relief",
            "Education",
            "Technology & Innovation"
        ],
        required: true,
    },
    headquarters: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;