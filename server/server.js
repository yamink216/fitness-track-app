const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const goalRoutes = require("./routes/goalRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const workoutPlanRoutes = require("./routes/workoutPlanRoutes");
const mealRoutes = require("./routes/mealRoutes");
const waterRoutes = require("./routes/waterRoutes");
const weightRoutes = require("./routes/weightRoutes");
const progressPhotoRoutes = require("./routes/progressPhotoRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { seedChallenges } = require("./controllers/challengeController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/progress-photos", progressPhotoRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "Fitness Tracker API is running",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({
        message: `Route not found: ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        seedChallenges().catch((err) => {
            console.error("Challenge seeding failed:", err.message);
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database startup failed:", err.message);
        process.exit(1);
    });