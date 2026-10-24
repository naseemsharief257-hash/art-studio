const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const Painting = require("./models/Painting");
const User = require("./models/User");

dotenv.config();

const seedData = JSON.parse(
    fs.readFileSync("./data/seed.json", "utf-8")
);

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Seed paintings
        await Painting.deleteMany();

        const paintings = seedData.paintings.map((painting) => ({
            title: painting.title,
            artist: painting.artist,
            description: painting.description,
            price: painting.price,
            imageUrl: painting.imageUrl,
            available: painting.status === "available"
        }));

        await Painting.insertMany(paintings);

        console.log("Paintings seeded successfully");

        // Create demo admin if it does not already exist
        const adminEmail = "admin@artstudio.com";

        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(
                "Admin@123",
                10
            );

            await User.create({
                name: "Studio Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });

            console.log("Demo admin created successfully");
        } else {
            console.log("Demo admin already exists");
        }

        process.exit();
    } catch (error) {
        console.log("Seed failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();