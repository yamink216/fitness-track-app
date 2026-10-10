const Goal = require("../models/Goal");
const WeightLog = require("../models/WeightLog");
const { calculateGoalWeightProgress } = require("../services/calculationService");

// ==========================================
// CREATE GOAL
// ==========================================
const createGoal = async (req, res) => {
    try {
        const {
            goalType,
            startingWeight,
            currentWeight,
            targetWeight,
            dailyCalories,
            weeklyWorkoutTarget,
            startDate,
            targetDate,
            notes
        } = req.body;

        // Required fields
        if (
            !goalType ||
            currentWeight === undefined ||
            targetWeight === undefined
        ) {
            return res.status(400).json({
                message: "Goal type, current weight and target weight are required"
            });
        }

        // Check if user already has a goal
        const existingGoal = await Goal.findOne({
            user: req.userId
        });

        if (existingGoal) {
            return res.status(400).json({
                message: "You already have a fitness goal"
            });
        }

        const startW = startingWeight !== undefined && startingWeight !== null ? Number(startingWeight) : Number(currentWeight);
        const currW = Number(currentWeight);
        const targetW = Number(targetWeight);
        const progress = calculateGoalWeightProgress(startW, currW, targetW);

        const goal = await Goal.create({
            user: req.userId,
            goalType,
            startingWeight: startW,
            currentWeight: currW,
            targetWeight: targetW,
            dailyCalories: dailyCalories ? Number(dailyCalories) : null,
            weeklyWorkoutTarget: weeklyWorkoutTarget ? Number(weeklyWorkoutTarget) : 4,
            startDate: startDate || new Date(),
            targetDate: targetDate || null,
            notes: notes ? notes.trim() : "",
            progress,
            status: progress >= 100 ? "Completed" : "In Progress"
        });

        res.status(201).json({
            message: "Fitness goal created successfully",
            goal
        });

    } catch (error) {
        console.error("Create goal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET MY GOAL
// ==========================================
const getMyGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            user: req.userId
        });

        if (!goal) {
            return res.status(200).json({
                goal: null,
                message: "No fitness goal found"
            });
        }

        // Check if there is a newer weight log
        const latestWeightLog = await WeightLog.findOne({ user: req.userId }).sort({ date: -1 });
        if (latestWeightLog && latestWeightLog.weight !== goal.currentWeight) {
            goal.currentWeight = latestWeightLog.weight;
        }

        const startW = goal.startingWeight || goal.currentWeight;
        goal.progress = calculateGoalWeightProgress(startW, goal.currentWeight, goal.targetWeight);
        if (goal.progress >= 100) {
            goal.status = "Completed";
        }
        await goal.save();

        res.status(200).json({
            goal
        });

    } catch (error) {
        console.error("Get goal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE MY GOAL
// ==========================================
const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            user: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Fitness goal not found"
            });
        }

        const {
            goalType,
            currentWeight,
            targetWeight,
            dailyCalories,
            weeklyWorkoutTarget,
            startDate,
            targetDate,
            notes
        } = req.body;

        if (goalType !== undefined) {
            goal.goalType = goalType;
        }

        if (currentWeight !== undefined) {
            goal.currentWeight = currentWeight;
        }

        if (targetWeight !== undefined) {
            goal.targetWeight = targetWeight;
        }

        if (dailyCalories !== undefined) {
            goal.dailyCalories = dailyCalories;
        }

        if (weeklyWorkoutTarget !== undefined) {
            goal.weeklyWorkoutTarget = weeklyWorkoutTarget;
        }

        if (startDate !== undefined) {
            goal.startDate = startDate;
        }

        if (targetDate !== undefined) {
            goal.targetDate = targetDate;
        }

        if (notes !== undefined) {
            goal.notes = notes;
        }

        await goal.save();

        res.status(200).json({
            message: "Fitness goal updated successfully",
            goal
        });

    } catch (error) {
        console.error("Update goal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// DELETE MY GOAL
// ==========================================
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            user: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Fitness goal not found"
            });
        }

        res.status(200).json({
            message: "Fitness goal deleted successfully"
        });

    } catch (error) {
        console.error("Delete goal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
    createGoal,
    getMyGoal,
    updateGoal,
    deleteGoal
};