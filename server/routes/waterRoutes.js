const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { addWater, getWaterLogs, getTodayWaterProgress } = require("../controllers/waterController");

router.post("/", protect, addWater);
router.get("/today", protect, getTodayWaterProgress);
router.get("/", protect, getWaterLogs);

module.exports = router;
