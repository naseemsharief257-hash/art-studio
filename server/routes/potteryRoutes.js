const express = require("express");
const PotteryRequest = require("../models/PotteryRequest");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const allowedItems = [
    "Kulhad",
    "Surahi",
    "Matka",
    "Diya set",
    "Gamla"
];

const allowedGlazes = [
    "Kumkum Red",
    "Haldi Yellow",
    "Mehendi Green",
    "Indigo Blue",
    "Sandalwood Beige",
    "Charcoal Black"
];


// CUSTOMER - CREATE POTTERY REQUEST
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { item, glaze, quantity, neededBy } = req.body;

        if (!allowedItems.includes(item)) {
            return res.status(400).json({
                message: "Invalid pottery item"
            });
        }

        if (!allowedGlazes.includes(glaze)) {
            return res.status(400).json({
                message: "Invalid glaze"
            });
        }

        if (quantity < 1 || quantity > 12) {
            return res.status(400).json({
                message: "Quantity must be between 1 and 12"
            });
        }

        const requestedDate = new Date(neededBy);

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                message: "Invalid needed-by date"
            });
        }

        const today = new Date();
        const minimumDate = new Date(today);
        minimumDate.setDate(today.getDate() + 14);

        if (requestedDate < minimumDate) {
            return res.status(400).json({
                message: "Needed-by date must be at least 14 days from today"
            });
        }

        const request = await PotteryRequest.create({
            customer: req.user.id,
            item: item,
            glaze: glaze,
            quantity: quantity,
            neededBy: requestedDate,
            status: "requested"
        });

        res.status(201).json({
            message: "Pottery request created successfully",
            request: request
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to create pottery request"
        });
    }
});


// CUSTOMER - VIEW OWN POTTERY REQUESTS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const requests = await PotteryRequest.find({
            customer: req.user.id
        });

        res.json(requests);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch pottery requests"
        });
    }
});


// CUSTOMER - EDIT POTTERY REQUEST
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const request = await PotteryRequest.findOne({
            _id: req.params.id,
            customer: req.user.id
        });

        if (!request) {
            return res.status(404).json({
                message: "Pottery request not found"
            });
        }

        if (request.status !== "requested") {
            return res.status(400).json({
                message: "Only requested pottery requests can be edited"
            });
        }

        const { item, glaze, quantity, neededBy } = req.body;

        if (!allowedItems.includes(item)) {
            return res.status(400).json({
                message: "Invalid pottery item"
            });
        }

        if (!allowedGlazes.includes(glaze)) {
            return res.status(400).json({
                message: "Invalid glaze"
            });
        }

        if (quantity < 1 || quantity > 12) {
            return res.status(400).json({
                message: "Quantity must be between 1 and 12"
            });
        }

        const requestedDate = new Date(neededBy);

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                message: "Invalid needed-by date"
            });
        }

        const today = new Date();
        const minimumDate = new Date(today);
        minimumDate.setDate(today.getDate() + 14);

        if (requestedDate < minimumDate) {
            return res.status(400).json({
                message: "Needed-by date must be at least 14 days from today"
            });
        }

        request.item = item;
        request.glaze = glaze;
        request.quantity = quantity;
        request.neededBy = requestedDate;

        await request.save();

        res.json({
            message: "Pottery request updated successfully",
            request: request
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update pottery request"
        });
    }
});


// CUSTOMER - CANCEL POTTERY REQUEST
router.put("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const request = await PotteryRequest.findOne({
            _id: req.params.id,
            customer: req.user.id
        });

        if (!request) {
            return res.status(404).json({
                message: "Pottery request not found"
            });
        }

        if (request.status !== "requested") {
            return res.status(400).json({
                message: "Only requested pottery requests can be cancelled"
            });
        }

        request.status = "cancelled";

        await request.save();

        res.json({
            message: "Pottery request cancelled successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to cancel pottery request"
        });
    }
});


// ADMIN - VIEW ALL POTTERY REQUESTS
router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const requests = await PotteryRequest.find()
                .populate("customer", "name email")
                .sort({ createdAt: -1 });

            res.json(requests);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to fetch pottery requests"
            });
        }
    }
);


// ADMIN - ACCEPT POTTERY REQUEST
router.put(
    "/:id/accept",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const request = await PotteryRequest.findById(req.params.id);

            if (!request) {
                return res.status(404).json({
                    message: "Pottery request not found"
                });
            }

            if (request.status !== "requested") {
                return res.status(400).json({
                    message: "Only requested pottery requests can be accepted"
                });
            }

            request.status = "accepted";

            await request.save();

            res.json({
                message: "Pottery request accepted successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to accept pottery request"
            });
        }
    }
);


// ADMIN - DECLINE POTTERY REQUEST
router.put(
    "/:id/decline",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const request = await PotteryRequest.findById(req.params.id);

            if (!request) {
                return res.status(404).json({
                    message: "Pottery request not found"
                });
            }

            if (request.status !== "requested") {
                return res.status(400).json({
                    message: "Only requested pottery requests can be declined"
                });
            }

            request.status = "declined";

            await request.save();

            res.json({
                message: "Pottery request declined successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to decline pottery request"
            });
        }
    }
);


module.exports = router;