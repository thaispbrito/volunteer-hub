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
    bio: {
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
    skills: {
        type: String,
        required: true,
    },
    modelVol: {
        type: String,
        enum: ["In-Person", "Remote"],
        required: true,
    },
    availability: {
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
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        equired: true,
    },
    comments: {
        type: String,
    },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;