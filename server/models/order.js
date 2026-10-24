const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        painting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Painting",
            required: true
        },

        status: {
            type: String,
            enum: ["placed", "cancelled"],
            default: "placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);