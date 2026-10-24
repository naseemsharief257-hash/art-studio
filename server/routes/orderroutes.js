const express = require("express");
const Order = require("../models/Order");
const Painting = require("../models/Painting");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CUSTOMER - VIEW OWN ORDERS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            customer: req.user.id
        }).populate("painting");

        res.json(orders);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
});


// CUSTOMER - CANCEL ORDER
router.put("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            customer: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Order is already cancelled"
            });
        }

        order.status = "cancelled";

        await order.save();

        await Painting.findByIdAndUpdate(
            order.painting,
            {
                available: true
            }
        );

        res.json({
            message: "Order cancelled successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to cancel order"
        });
    }
});


module.exports = router;