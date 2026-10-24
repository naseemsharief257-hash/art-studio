const express = require("express");
const Painting = require("../models/Painting");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// GET ALL AVAILABLE PAINTINGS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const paintings = await Painting.find({
            available: true
        });

        res.json(paintings);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch paintings"
        });
    }
});


// ADMIN - GET ALL PAINTINGS
router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const paintings = await Painting.find();

            res.json(paintings);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to fetch all paintings"
            });
        }
    }
);


// ADMIN - ADD PAINTING
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            title,
            artist,
            description,
            price,
            imageUrl
        } = req.body;

        const painting = await Painting.create({
            title: title,
            artist: artist,
            description: description,
            price: price,
            imageUrl: imageUrl,
            available: true
        });

        res.status(201).json({
            message: "Painting added successfully",
            painting: painting
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to add painting"
        });
    }
});


// ADMIN - EDIT PAINTING
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            title,
            artist,
            description,
            price,
            imageUrl
        } = req.body;

        const painting = await Painting.findOne({
            _id: req.params.id,
            available: true
        });

        if (!painting) {
            return res.status(404).json({
                message: "Painting not found or already sold"
            });
        }

        painting.title = title;
        painting.artist = artist;
        painting.description = description;
        painting.price = price;
        painting.imageUrl = imageUrl;

        await painting.save();

        res.json({
            message: "Painting updated successfully",
            painting: painting
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update painting"
        });
    }
});


// CUSTOMER - BUY PAINTING
router.post("/:id/buy", authMiddleware, async (req, res) => {
    try {
        const painting = await Painting.findOneAndUpdate(
            {
                _id: req.params.id,
                available: true
            },
            {
                available: false
            },
            {
                new: true
            }
        );

        if (!painting) {
            return res.status(400).json({
                message: "Painting is already sold or not found"
            });
        }

        const order = await Order.create({
            customer: req.user.id,
            painting: painting._id,
            status: "placed"
        });

        res.status(201).json({
            message: "Painting purchased successfully",
            order: order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Purchase failed"
        });
    }
});


module.exports = router;