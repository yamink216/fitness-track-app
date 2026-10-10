const Achievement = require("../models/Achievement");
const { evaluateAchievements } = require("../services/automationEngine");

const getAchievements = async (req, res) => {
  try {
    // Run evaluation engine to ensure fresh milestone calculation
    await evaluateAchievements(req.userId);

    const achievements = await Achievement.find({ user: req.userId }).sort({
      unlockedAt: -1,
      progress: -1,
    });

    const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

    res.status(200).json({
      count: achievements.length,
      unlockedCount,
      achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ message: "Server error fetching achievements" });
  }
};

module.exports = {
  getAchievements,
};
