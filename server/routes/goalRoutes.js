const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createGoal,
    getMyGoal,
    updateGoal,
    deleteGoal
} = require("../controllers/goalController");

// Create fitness goal
router.post("/", protect, createGoal);

// Get my fitness goal
router.get("/", protect, getMyGoal);

// Update my fitness goal
router.put("/", protect, updateGoal);

// Delete my fitness goal
router.delete("/", protect, deleteGoal);

module.exports = router;