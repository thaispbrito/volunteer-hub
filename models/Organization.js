const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    slogan: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
    },
    cause: {
        type: String,
        enum: ["A", "B", "C", "D"],  //Update fields later
        required: true,
    },
    story: {
        type: String,
        required: true,
    },
    headquarters: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;