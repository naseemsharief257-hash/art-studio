const mongoose = require("mongoose");

const potteryRequestSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        item: {
            type: String,
            required: true
        },

        glaze: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },

        neededBy: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["requested", "accepted", "declined", "cancelled"],
            default: "requested"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PotteryRequest", potteryRequestSchema);