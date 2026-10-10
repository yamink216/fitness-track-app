const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getDailyNutritionSummary,
} = require("../controllers/mealController");

router.post("/", protect, createMeal);
router.get("/summary", protect, getDailyNutritionSummary);
router.get("/", protect, getMeals);
router.get("/:id", protect, getMealById);
router.put("/:id", protect, updateMeal);
router.delete("/:id", protect, deleteMeal);

module.exports = router;
