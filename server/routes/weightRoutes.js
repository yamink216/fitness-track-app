const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { addWeightLog, getWeightLogs, getWeightSummary } = require("../controllers/weightController");

router.post("/", protect, addWeightLog);
router.get("/summary", protect, getWeightSummary);
router.get("/", protect, getWeightLogs);

module.exports = router;
