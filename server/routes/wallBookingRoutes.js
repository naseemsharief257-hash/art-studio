const express = require("express");
const WallBooking = require("../models/WallBooking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// CUSTOMER - CREATE WALL BOOKING
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { date, wallSize, address } = req.body;

        if (wallSize < 10 || wallSize > 500) {
            return res.status(400).json({
                message: "Wall size must be between 10 and 500 sq ft"
            });
        }

        const bookingDate = new Date(date);

        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        bookingDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 7);

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 90);

        if (bookingDate < minDate || bookingDate > maxDate) {
            return res.status(400).json({
                message: "Booking date must be 7 to 90 days from today"
            });
        }

        const existingBooking = await WallBooking.findOne({
            date: bookingDate,
            status: { $ne: "cancelled" }
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "This date is already booked"
            });
        }

        const price = Number(wallSize) * 150;

        const booking = await WallBooking.create({
            customer: req.user.id,
            date: bookingDate,
            wallSize: Number(wallSize),
            address: address,
            price: price,
            status: "requested"
        });

        res.status(201).json({
            message: "Wall painting booking requested successfully",
            booking: booking
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to create wall booking"
        });
    }
});


// ADMIN - GET ALL WALL BOOKINGS
router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const bookings = await WallBooking.find()
                .populate("customer", "name email")
                .sort({ createdAt: -1 });

            res.json(bookings);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to fetch wall bookings"
            });
        }
    }
);


// ADMIN - CONFIRM BOOKING
router.put(
    "/:id/confirm",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const booking = await WallBooking.findById(req.params.id);

            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            if (booking.status !== "requested") {
                return res.status(400).json({
                    message: "Only requested bookings can be confirmed"
                });
            }

            booking.status = "confirmed";

            await booking.save();

            res.json({
                message: "Booking confirmed successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to confirm booking"
            });
        }
    }
);


// ADMIN - DECLINE BOOKING
router.put(
    "/:id/decline",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const booking = await WallBooking.findById(req.params.id);

            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            if (booking.status !== "requested") {
                return res.status(400).json({
                    message: "Only requested bookings can be declined"
                });
            }

            booking.status = "declined";

            await booking.save();

            res.json({
                message: "Booking declined successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to decline booking"
            });
        }
    }
);


// CUSTOMER - GET MY BOOKINGS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const bookings = await WallBooking.find({
            customer: req.user.id
        }).sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch wall bookings"
        });
    }
});


// CUSTOMER - CANCEL BOOKING
router.put("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const booking = await WallBooking.findOne({
            _id: req.params.id,
            customer: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);

        const differenceInTime = bookingDate - today;

        const differenceInDays =
            differenceInTime / (1000 * 60 * 60 * 24);

        if (differenceInDays < 3) {
            return res.status(400).json({
                message:
                    "Booking cannot be cancelled within 3 days of the date"
            });
        }

        booking.status = "cancelled";

        await booking.save();

        res.json({
            message: "Wall booking cancelled successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to cancel wall booking"
        });
    }
});


module.exports = router;