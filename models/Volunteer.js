const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,    
    },
    lastName: {
        type: String,
        required: true,
    },
    cause: {
        type: String,
        enum: ["A", "B", "C", "D"],  //Update fields later
        required: true,
    },
    skills: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        enum: ["inPerson", "remote"],
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
    },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;