const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const paintingRoutes = require("./routes/paintingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wallBookingRoutes = require("./routes/wallBookingRoutes");
const potteryRoutes = require("./routes/potteryRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wall-bookings", wallBookingRoutes);
app.use("/api/pottery", potteryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Art Studio API is running"
    });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});