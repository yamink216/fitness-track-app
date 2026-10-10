const WaterLog = require("../models/WaterLog");
const { onWaterLogged } = require("../services/automationEngine");

const addWater = async (req, res) => {
  try {
    const { amount, unit, date, time } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Water amount must be greater than zero" });
    }

    const waterLog = await WaterLog.create({
      user: req.userId,
      amount: Number(amount),
      unit: unit || "ml",
      date: date || new Date(),
      time: time || "",
    });

    // Trigger Automation Engine (Async, non-blocking)
    onWaterLogged(req.userId, waterLog).catch((err) =>
      console.error("Water automation error:", err)
    );

    res.status(201).json({ message: "Water intake logged successfully", waterLog });
  } catch (error) {
    console.error("Add water error:", error);
    res.status(500).json({ message: "Server error logging water intake" });
  }
};

const getWaterLogs = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.userId };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const logs = await WaterLog.find(query).sort({ date: -1 });
    res.status(200).json({ count: logs.length, logs });
  } catch (error) {
    console.error("Get water logs error:", error);
    res.status(500).json({ message: "Server error fetching water logs" });
  }
};

const getTodayWaterProgress = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const logs = await WaterLog.find({
      user: req.userId,
      date: { $gte: start, $lte: end },
    });

    const totalMl = logs.reduce((sum, log) => {
      const amount = Number(log.amount || 0);
      return sum + (log.unit === "L" ? amount * 1000 : amount);
    }, 0);

    const targetMl = 2500;

    res.status(200).json({
      totalMl,
      targetMl,
      progress: Math.min(100, Math.round((totalMl / targetMl) * 100)),
      logs,
    });
  } catch (error) {
    console.error("Get today water progress error:", error);
    res.status(500).json({ message: "Server error generating hydration summary" });
  }
};

module.exports = {
  addWater,
  getWaterLogs,
  getTodayWaterProgress,
};
