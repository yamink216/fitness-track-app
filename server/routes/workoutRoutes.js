const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addWorkout,
    getMyWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    getWorkoutStats
} = require("../controllers/workoutController");

// Stats summary route (placed before /:id to prevent routing conflict)
router.get("/stats", protect, getWorkoutStats);

// Create workout
router.post("/", protect, addWorkout);

// Get all workouts (with filtering/search query params)
router.get("/", protect, getMyWorkouts);

// Get single workout
router.get("/:id", protect, getWorkoutById);

// Update workout
router.put("/:id", protect, updateWorkout);

// Delete workout
router.delete("/:id", protect, deleteWorkout);

module.exports = router;