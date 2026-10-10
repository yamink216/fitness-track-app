/**
 * FitTrack Pro — Fitness Analytics Service
 * Implements real MongoDB Aggregation Pipelines ($match, $group, $sort, $project, $facet).
 */

const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const WaterLog = require("../models/WaterLog");
const WeightLog = require("../models/WeightLog");
const Goal = require("../models/Goal");
const User = require("../models/User");
const { calculateStreak, calculateBMI, calculateGoalWeightProgress, calculateHydrationTarget } = require("./calculationService");

/**
 * High-performance single-roundtrip aggregation for the dashboard control center.
 * Uses $facet and $group to aggregate workout activity, today's nutrition, hydration, and goal stats.
 * @param {string|mongoose.Types.ObjectId} userId
 */
async function getDashboardAnalytics(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Time boundaries for today
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 7 days ago boundary
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  // 1. Execute Multi-faceted MongoDB Aggregation on Workouts
  const [workoutAnalytics] = await Workout.aggregate([
    { $match: { user: userObjectId } },
    {
      $facet: {
        // Overall Totals
        totals: [
          {
            $group: {
              _id: null,
              totalWorkouts: { $sum: 1 },
              totalCalories: { $sum: "$caloriesBurned" },
              totalDuration: { $sum: "$duration" },
              totalDistance: { $sum: { $ifNull: ["$distance", 0] } }
            }
          }
        ],

        // This Week's Volume
        thisWeek: [
          { $match: { date: { $gte: startOfWeek } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              calories: { $sum: "$caloriesBurned" },
              duration: { $sum: "$duration" }
            }
          }
        ],

        // Last 7 Days grouped by Day
        last7Days: [
          { $match: { date: { $gte: sevenDaysAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" }
              },
              calories: { $sum: "$caloriesBurned" },
              duration: { $sum: "$duration" },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ],

        // Category Breakdown
        categoryBreakdown: [
          {
            $group: {
              _id: "$workoutType",
              count: { $sum: 1 },
              calories: { $sum: "$caloriesBurned" },
              duration: { $sum: "$duration" }
            }
          },
          { $sort: { count: -1 } }
        ],

        // Today's Workouts
        todayWorkouts: [
          { $match: { date: { $gte: startOfToday, $lte: endOfToday } } },
          {
            $project: {
              title: 1,
              workoutType: 1,
              duration: 1,
              caloriesBurned: 1,
              distance: 1,
              date: 1,
              exercises: 1
            }
          }
        ],

        // Recent Workouts (Latest 5)
        recentWorkouts: [
          { $sort: { date: -1 } },
          { $limit: 5 },
          {
            $project: {
              title: 1,
              workoutType: 1,
              duration: 1,
              caloriesBurned: 1,
              distance: 1,
              date: 1,
              notes: 1,
              exercisesCount: { $size: { $ifNull: ["$exercises", []] } }
            }
          }
        ],

        // All dates for streak calculation
        datesList: [
          { $sort: { date: -1 } },
          { $project: { date: 1 } }
        ]
      }
    }
  ]);

  // 2. Aggregate Today's Nutrition
  const [todayNutrition] = await Meal.aggregate([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: "$totalCalories" },
        totalProtein: { $sum: "$totalProtein" },
        totalCarbs: { $sum: "$totalCarbs" },
        totalFat: { $sum: "$totalFat" },
        mealCount: { $sum: 1 }
      }
    }
  ]);

  // 3. Aggregate Today's Hydration
  const [todayWater] = await WaterLog.aggregate([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    {
      $project: {
        mlAmount: {
          $cond: [
            { $eq: ["$unit", "L"] },
            { $multiply: ["$amount", 1000] },
            "$amount"
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalMl: { $sum: "$mlAmount" },
        logCount: { $sum: 1 }
      }
    }
  ]);

  // 4. Fetch User, Active Goal & Latest Weight
  const [userDoc, goalDoc, latestWeightDoc] = await Promise.all([
    User.findById(userId).select("name email weight height age gender fitnessGoal"),
    Goal.findOne({ user: userObjectId }),
    WeightLog.findOne({ user: userObjectId }).sort({ date: -1 })
  ]);

  // Calculate Streak
  const workoutDates = (workoutAnalytics?.datesList || []).map((w) => w.date);
  const streak = calculateStreak(workoutDates);

  // Compute 7-day padded activity array
  const last7DaysMap = {};
  (workoutAnalytics?.last7Days || []).forEach((d) => {
    last7DaysMap[d._id] = d;
  });

  const padded7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const record = last7DaysMap[dateStr];

    padded7Days.push({
      date: dateStr,
      day: dayName,
      calories: record?.calories || 0,
      duration: record?.duration || 0,
      count: record?.count || 0
    });
  }

  // Hydration Target calculation
  const currentWeight = latestWeightDoc?.weight || userDoc?.weight || 70;
  const hydrationTargetMl = calculateHydrationTarget(currentWeight);
  const currentWaterMl = todayWater?.totalMl || 0;
  const hydrationProgress = Math.min(100, Math.round((currentWaterMl / hydrationTargetMl) * 100));

  // Goal Progress calculation
  let goalData = null;
  if (goalDoc) {
    const startW = goalDoc.startingWeight || currentWeight;
    const targetW = goalDoc.targetWeight;
    const progressPct = calculateGoalWeightProgress(startW, currentWeight, targetW);

    goalData = {
      _id: goalDoc._id,
      goalType: goalDoc.goalType,
      startingWeight: startW,
      currentWeight: currentWeight,
      targetWeight: targetW,
      weeklyWorkoutTarget: goalDoc.weeklyWorkoutTarget || 4,
      targetDate: goalDoc.targetDate,
      progress: progressPct,
      remainingWeight: Number(Math.abs(currentWeight - targetW).toFixed(1)),
      status: progressPct >= 100 ? "Completed" : "In Progress"
    };
  }

  // Weight & BMI
  const bmiInfo = calculateBMI(currentWeight, userDoc?.height);

  // Category percentage calculation
  const totalWorkoutsCount = workoutAnalytics?.totals?.[0]?.totalWorkouts || 0;
  const categoryBreakdown = (workoutAnalytics?.categoryBreakdown || []).map((cat) => ({
    type: cat._id,
    count: cat.count,
    calories: cat.calories,
    duration: cat.duration,
    percentage: totalWorkoutsCount > 0 ? Math.round((cat.count / totalWorkoutsCount) * 100) : 0
  }));

  return {
    user: {
      name: userDoc?.name || "Athlete",
      fitnessGoal: userDoc?.fitnessGoal || "Improve Fitness",
      currentWeight,
      height: userDoc?.height || 0,
      bmi: bmiInfo.bmi,
      bmiCategory: bmiInfo.category
    },
    today: {
      caloriesBurned: workoutAnalytics?.todayWorkouts?.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0) || 0,
      activeMinutes: workoutAnalytics?.todayWorkouts?.reduce((acc, w) => acc + (w.duration || 0), 0) || 0,
      caloriesConsumed: todayNutrition?.totalCalories || 0,
      macros: {
        protein: todayNutrition?.totalProtein || 0,
        carbs: todayNutrition?.totalCarbs || 0,
        fat: todayNutrition?.totalFat || 0
      },
      waterMl: currentWaterMl,
      waterTargetMl: hydrationTargetMl,
      waterProgress: hydrationProgress,
      workoutsCount: workoutAnalytics?.todayWorkouts?.length || 0,
      workouts: workoutAnalytics?.todayWorkouts || []
    },
    totals: {
      totalWorkouts: totalWorkoutsCount,
      totalCalories: workoutAnalytics?.totals?.[0]?.totalCalories || 0,
      totalDuration: workoutAnalytics?.totals?.[0]?.totalDuration || 0,
      totalDistance: Number((workoutAnalytics?.totals?.[0]?.totalDistance || 0).toFixed(2))
    },
    thisWeek: {
      count: workoutAnalytics?.thisWeek?.[0]?.count || 0,
      calories: workoutAnalytics?.thisWeek?.[0]?.calories || 0,
      duration: workoutAnalytics?.thisWeek?.[0]?.duration || 0
    },
    streak,
    last7Days: padded7Days,
    categoryBreakdown,
    recentWorkouts: workoutAnalytics?.recentWorkouts || [],
    goal: goalData
  };
}

/**
 * Aggregation pipeline for detailed workout analytics
 * @param {string|mongoose.Types.ObjectId} userId
 */
async function getWorkoutAnalytics(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return Workout.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        monthlyWorkouts: { $sum: 1 },
        monthlyCalories: { $sum: "$caloriesBurned" },
        monthlyDuration: { $sum: "$duration" },
        avgDuration: { $avg: "$duration" }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 }
  ]);
}

/**
 * Aggregation pipeline for 7-day nutrition trend
 * @param {string|mongoose.Types.ObjectId} userId
 */
async function getNutritionAnalytics(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return Meal.aggregate([
    {
      $match: {
        user: userObjectId,
        date: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        calories: { $sum: "$totalCalories" },
        protein: { $sum: "$totalProtein" },
        carbs: { $sum: "$totalCarbs" },
        fat: { $sum: "$totalFat" },
        mealCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
}

/**
 * Aggregation pipeline for weight history & BMI trajectory
 * @param {string|mongoose.Types.ObjectId} userId
 */
async function getProgressAnalytics(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return WeightLog.aggregate([
    { $match: { user: userObjectId } },
    { $sort: { date: 1 } },
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        weight: 1,
        bmi: 1,
        notes: 1
      }
    }
  ]);
}

module.exports = {
  getDashboardAnalytics,
  getWorkoutAnalytics,
  getNutritionAnalytics,
  getProgressAnalytics
};
