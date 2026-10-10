const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getExercises, getExerciseById } = require("../controllers/exerciseController");

router.get("/", protect, getExercises);
router.get("/:id", protect, getExerciseById);

module.exports = router;
