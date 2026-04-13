const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            lowerCase: true,
            trim: true,
            unique: true,
            required: true,
        },
        userColor: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userSchema)

module.exports = User
