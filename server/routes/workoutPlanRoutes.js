const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  setActiveWorkoutPlan,
} = require("../controllers/workoutPlanController");

router.post("/", protect, createWorkoutPlan);
router.get("/", protect, getWorkoutPlans);
router.get("/:id", protect, getWorkoutPlanById);
router.put("/:id", protect, updateWorkoutPlan);
router.delete("/:id", protect, deleteWorkoutPlan);
router.patch("/:id/activate", protect, setActiveWorkoutPlan);

module.exports = router;
