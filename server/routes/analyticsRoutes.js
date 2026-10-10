const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getDashboardData,
  getWorkoutsData,
  getNutritionData,
  getProgressData
} = require("../controllers/analyticsController");

router.get("/dashboard", protect, getDashboardData);
router.get("/workouts", protect, getWorkoutsData);
router.get("/nutrition", protect, getNutritionData);
router.get("/progress", protect, getProgressData);

module.exports = router;
