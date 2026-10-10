const WeightLog = require("../models/WeightLog");
const User = require("../models/User");
const { onWeightLogged } = require("../services/automationEngine");

const addWeightLog = async (req, res) => {
  try {
    const { weight, height, date, notes } = req.body;

    if (!weight || Number(weight) <= 0) {
      return res.status(400).json({ message: "Weight is required" });
    }

    const user = await User.findById(req.userId);
    const actualHeight = height || user?.height || 0;

    const weightLog = await WeightLog.create({
      user: req.userId,
      weight: Number(weight),
      height: actualHeight,
      date: date || new Date(),
      notes: notes ? notes.trim() : "",
    });

    if (user && user.weight !== Number(weight)) {
      user.weight = Number(weight);
      await user.save();
    }

    // Trigger Automation Engine (Async, non-blocking)
    onWeightLogged(req.userId, weightLog).catch((err) =>
      console.error("Weight automation error:", err)
    );

    res.status(201).json({ message: "Weight log added successfully", weightLog });
  } catch (error) {
    console.error("Add weight log error:", error);
    res.status(500).json({ message: "Server error adding weight log" });
  }
};

const getWeightLogs = async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.userId }).sort({ date: -1 });
    res.status(200).json({ count: logs.length, logs });
  } catch (error) {
    console.error("Get weight logs error:", error);
    res.status(500).json({ message: "Server error fetching weight logs" });
  }
};

const getWeightSummary = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("weight height");
    const logs = await WeightLog.find({ user: req.userId }).sort({ date: 1 });

    const currentWeight = user?.weight || logs[logs.length - 1]?.weight || 0;
    const startingWeight = logs[0]?.weight || currentWeight;
    const targetWeight = user?.weight || currentWeight;

    const difference = currentWeight - startingWeight;

    res.status(200).json({
      currentWeight,
      startingWeight,
      targetWeight,
      difference,
      logs,
      bmi: currentWeight && user?.height ? Number((currentWeight / ((user.height / 100) ** 2)).toFixed(2)) : 0,
    });
  } catch (error) {
    console.error("Get weight summary error:", error);
    res.status(500).json({ message: "Server error generating weight summary" });
  }
};

module.exports = {
  addWeightLog,
  getWeightLogs,
  getWeightSummary,
};
