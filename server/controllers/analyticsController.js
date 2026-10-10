const {
  getDashboardAnalytics,
  getWorkoutAnalytics,
  getNutritionAnalytics,
  getProgressAnalytics
} = require("../services/fitnessAnalyticsService");

const getDashboardData = async (req, res) => {
  try {
    const data = await getDashboardAnalytics(req.userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ message: "Server error generating dashboard analytics" });
  }
};

const getWorkoutsData = async (req, res) => {
  try {
    const data = await getWorkoutAnalytics(req.userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Workout Analytics Error:", error);
    res.status(500).json({ message: "Server error generating workout analytics" });
  }
};

const getNutritionData = async (req, res) => {
  try {
    const data = await getNutritionAnalytics(req.userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Nutrition Analytics Error:", error);
    res.status(500).json({ message: "Server error generating nutrition analytics" });
  }
};

const getProgressData = async (req, res) => {
  try {
    const data = await getProgressAnalytics(req.userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Progress Analytics Error:", error);
    res.status(500).json({ message: "Server error generating progress analytics" });
  }
};

module.exports = {
  getDashboardData,
  getWorkoutsData,
  getNutritionData,
  getProgressData
};
