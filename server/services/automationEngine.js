/**
 * FitTrack Pro — Fitness Automation Engine
 * Coordinates cross-collection cascades, event hooks, achievement unlocks,
 * challenge progress evaluations, and automatic notifications.
 */

const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const Goal = require("../models/Goal");
const Achievement = require("../models/Achievement");
const Challenge = require("../models/Challenge");
const Notification = require("../models/Notification");
const WeightLog = require("../models/WeightLog");
const WaterLog = require("../models/WaterLog");
const User = require("../models/User");
const masterAchievements = require("../seed/achievementsData");
const { calculateStreak, calculateBMI, calculateGoalWeightProgress, calculateHydrationTarget } = require("./calculationService");

/**
 * Helper to dispatch a notification if a similar unread notification doesn't already exist
 */
async function sendNotification(userId, title, message, type = "Reminder") {
  try {
    const existing = await Notification.findOne({
      user: userId,
      title,
      read: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!existing) {
      await Notification.create({
        user: userId,
        title,
        message,
        type,
        read: false
      });
    }
  } catch (err) {
    console.error("Failed to send notification:", err.message);
  }
}

/**
 * Check and unlock achievements for a user based on latest aggregated stats
 */
async function evaluateAchievements(userId) {
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);

    // Fetch user workouts
    const workouts = await Workout.find({ user: userObjId }).select("date caloriesBurned duration");
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const streak = calculateStreak(workouts.map((w) => w.date));

    // Fetch user goals
    const goal = await Goal.findOne({ user: userObjId });
    const goalProgress = goal?.progress || 0;

    // Fetch user hydration today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const waterLogs = await WaterLog.find({ user: userObjId, date: { $gte: startOfToday } });
    const todayWater = waterLogs.reduce((sum, l) => sum + (l.unit === "L" ? (l.amount * 1000) : l.amount), 0);

    // Fetch currently unlocked achievements
    const existingAchievements = await Achievement.find({ user: userObjId });
    const unlockedMap = {};
    existingAchievements.forEach((a) => {
      unlockedMap[a.title] = a;
    });

    for (const def of masterAchievements) {
      let currentProgress = 0;
      let isUnlocked = false;

      if (def.type === "Workout") {
        currentProgress = totalWorkouts;
        isUnlocked = totalWorkouts >= def.requirement;
      } else if (def.type === "Streak") {
        currentProgress = streak;
        isUnlocked = streak >= def.requirement;
      } else if (def.type === "Milestone") {
        currentProgress = totalCalories;
        isUnlocked = totalCalories >= def.requirement;
      } else if (def.type === "Hydration") {
        currentProgress = todayWater;
        isUnlocked = todayWater >= def.requirement;
      } else if (def.type === "Goal") {
        currentProgress = goalProgress;
        isUnlocked = goalProgress >= def.requirement;
      }

      if (!unlockedMap[def.title]) {
        // Create achievement progress record
        const newAchievement = await Achievement.create({
          user: userObjId,
          title: def.title,
          description: def.description,
          type: def.type,
          icon: def.icon || "🏆",
          progress: Math.min(currentProgress, def.requirement),
          requirement: def.requirement,
          unlockedAt: isUnlocked ? new Date() : null
        });

        if (isUnlocked) {
          await sendNotification(
            userObjId,
            `Achievement Unlocked: ${def.title}!`,
            `Congratulations! You earned the "${def.title}" achievement: ${def.description}`,
            "Achievement"
          );
        }
      } else {
        // Update progress if not already completed
        const existing = unlockedMap[def.title];
        const wasUnlocked = !!existing.unlockedAt;

        existing.progress = Math.min(currentProgress, def.requirement);
        if (isUnlocked && !wasUnlocked) {
          existing.unlockedAt = new Date();
          await existing.save();

          await sendNotification(
            userObjId,
            `Achievement Unlocked: ${def.title}!`,
            `Congratulations! You earned the "${def.title}" achievement: ${def.description}`,
            "Achievement"
          );
        } else if (!wasUnlocked) {
          await existing.save();
        }
      }
    }
  } catch (err) {
    console.error("Evaluate achievements error:", err.message);
  }
}

/**
 * Evaluate and update joined challenge progress
 */
async function evaluateChallenges(userId) {
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const activeChallenges = await Challenge.find({
      participants: userObjId,
      status: "Active"
    });

    if (activeChallenges.length === 0) return;

    for (const chal of activeChallenges) {
      // Check progress within challenge dates
      const filter = {
        user: userObjId,
        date: { $gte: chal.startDate, $lte: chal.endDate }
      };

      if (chal.type === "Workout") {
        const count = await Workout.countDocuments(filter);
        if (count >= chal.target) {
          await sendNotification(
            userObjId,
            `Challenge Completed: ${chal.name}!`,
            `Phenomenal effort! You crushed the challenge "${chal.name}" with ${count} workouts completed!`,
            "Goal"
          );
        }
      } else if (chal.type === "Calories") {
        const workouts = await Workout.find(filter).select("caloriesBurned");
        const cals = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
        if (cals >= chal.target) {
          await sendNotification(
            userObjId,
            `Challenge Completed: ${chal.name}!`,
            `Incredible! You burned ${cals.toLocaleString()} calories and completed "${chal.name}"!`,
            "Goal"
          );
        }
      }
    }
  } catch (err) {
    console.error("Evaluate challenges error:", err.message);
  }
}

/**
 * Automation Hook: Invoked immediately after a workout is logged or updated
 */
async function onWorkoutLogged(userId, workout) {
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);

    // 1. Calculate and update streak
    const workouts = await Workout.find({ user: userObjId }).select("date");
    const streak = calculateStreak(workouts.map((w) => w.date));

    // 2. Update active goal's weekly workouts
    const goal = await Goal.findOne({ user: userObjId });
    if (goal) {
      const now = new Date();
      const startOfWeek = new Date(now);
      const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const thisWeekWorkoutsCount = await Workout.countDocuments({
        user: userObjId,
        date: { $gte: startOfWeek }
      });

      // Send reminder/celebration if weekly target achieved
      if (goal.weeklyWorkoutTarget && thisWeekWorkoutsCount >= goal.weeklyWorkoutTarget) {
        await sendNotification(
          userObjId,
          "Weekly Workout Target Crushed!",
          `High five! You reached your target of ${goal.weeklyWorkoutTarget} workouts for this week.`,
          "Workout"
        );
      }
    }

    // 3. Evaluate Achievements and Challenges
    await evaluateAchievements(userId);
    await evaluateChallenges(userId);

    // 4. Milestone streak notification
    if (streak > 0 && streak % 7 === 0) {
      await sendNotification(
        userObjId,
        `🔥 ${streak}-Day Workout Streak!`,
        `You're unstoppable! You've worked out for ${streak} days in a row!`,
        "Workout"
      );
    }
  } catch (err) {
    console.error("onWorkoutLogged automation error:", err);
  }
}

/**
 * Automation Hook: Invoked immediately after weight is logged
 */
async function onWeightLogged(userId, weightLog) {
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const weight = Number(weightLog.weight);

    // 1. Update user profile weight
    const user = await User.findById(userObjId);
    if (user) {
      user.weight = weight;
      await user.save();
    }

    // 2. Automatically update Goal progress if exists
    const goal = await Goal.findOne({ user: userObjId });
    if (goal) {
      goal.currentWeight = weight;
      const startW = goal.startingWeight || weight;
      const targetW = goal.targetWeight;
      const progressPct = calculateGoalWeightProgress(startW, weight, targetW);

      goal.progress = progressPct;
      if (progressPct >= 100) {
        goal.status = "Completed";
        await sendNotification(
          userObjId,
          "🎯 Goal Achieved!",
          `Congratulations! You reached your goal weight of ${targetW} kg!`,
          "Goal"
        );
      } else {
        goal.status = "In Progress";
      }
      await goal.save();
    }

    // 3. Re-evaluate achievements
    await evaluateAchievements(userId);
  } catch (err) {
    console.error("onWeightLogged automation error:", err);
  }
}

/**
 * Automation Hook: Invoked immediately after water is logged
 */
async function onWaterLogged(userId, waterLog) {
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const logs = await WaterLog.find({ user: userObjId, date: { $gte: startOfToday } });
    const totalMl = logs.reduce((sum, l) => sum + (l.unit === "L" ? (l.amount * 1000) : l.amount), 0);

    const user = await User.findById(userObjId).select("weight");
    const targetMl = calculateHydrationTarget(user?.weight);

    if (totalMl >= targetMl) {
      await sendNotification(
        userObjId,
        "💧 Daily Hydration Target Reached!",
        `Awesome job! You drank ${(totalMl / 1000).toFixed(1)}L of water today, reaching your ${targetMl}ml goal.`,
        "Hydration"
      );
    }

    await evaluateAchievements(userId);
  } catch (err) {
    console.error("onWaterLogged automation error:", err);
  }
}

module.exports = {
  onWorkoutLogged,
  onWeightLogged,
  onWaterLogged,
  evaluateAchievements,
  evaluateChallenges,
  sendNotification
};
