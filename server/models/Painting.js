const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        artist: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Painting", paintingSchema);