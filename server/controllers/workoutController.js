const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const { onWorkoutLogged } = require("../services/automationEngine");

// ==========================================
// ADD WORKOUT
// ==========================================
const addWorkout = async (req, res) => {
    try {
        const {
            title,
            workoutType,
            duration,
            caloriesBurned,
            distance,
            date,
            notes,
            exercises
        } = req.body;

        if (!workoutType || duration === undefined || caloriesBurned === undefined) {
            return res.status(400).json({
                message: "Workout type, duration and calories burned are required"
            });
        }

        const cleanExercises = Array.isArray(exercises)
            ? exercises.map((ex) => ({
                exerciseId: ex.exerciseId || null,
                name: ex.name || "",
                sets: Math.max(0, Number(ex.sets) || 0),
                reps: Math.max(0, Number(ex.reps) || 0),
                weight: Math.max(0, Number(ex.weight) || 0),
                duration: Math.max(0, Number(ex.duration) || 0),
                restTime: Math.max(0, Number(ex.restTime) || 0)
            }))
            : [];

        const workout = await Workout.create({
            user: req.userId,
            title: title ? title.trim() : "",
            workoutType,
            duration: Number(duration),
            caloriesBurned: Number(caloriesBurned),
            distance: distance !== undefined && distance !== null && distance !== "" ? Number(distance) : undefined,
            date: date ? new Date(date) : new Date(),
            notes: notes ? notes.trim() : "",
            exercises: cleanExercises
        });

        // Trigger Automation Engine (Async, non-blocking)
        onWorkoutLogged(req.userId, workout).catch((err) =>
            console.error("Workout automation error:", err)
        );

        res.status(201).json({
            message: "Workout added successfully",
            workout
        });

    } catch (error) {
        console.error("Add workout error:", error);

        res.status(500).json({
            message: "Server error adding workout"
        });
    }
};


// ==========================================
// GET MY WORKOUTS (WITH SEARCH & FILTERS)
// ==========================================
const getMyWorkouts = async (req, res) => {
    try {
        const { type, search, startDate, endDate, sort } = req.query;

        let query = { user: req.userId };

        if (type && type !== "All") {
            query.workoutType = type;
        }

        if (search) {
            query.$or = [
                { workoutType: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } }
            ];
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        let sortOption = { date: -1 };
        if (sort === "calories_desc") sortOption = { caloriesBurned: -1 };
        if (sort === "calories_asc") sortOption = { caloriesBurned: 1 };
        if (sort === "duration_desc") sortOption = { duration: -1 };
        if (sort === "date_asc") sortOption = { date: 1 };

        const workouts = await Workout.find(query).sort(sortOption);

        res.status(200).json({
            count: workouts.length,
            workouts
        });

    } catch (error) {
        console.error("Get workouts error:", error);

        res.status(500).json({
            message: "Server error fetching workouts"
        });
    }
};


// ==========================================
// GET SINGLE WORKOUT BY ID
// ==========================================
const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        res.status(200).json({
            workout
        });

    } catch (error) {
        console.error("Get workout by id error:", error);

        res.status(500).json({
            message: "Server error fetching workout"
        });
    }
};


// ==========================================
// UPDATE WORKOUT
// ==========================================
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        const {
            title,
            workoutType,
            duration,
            caloriesBurned,
            distance,
            date,
            notes,
            exercises
        } = req.body;

        if (title !== undefined) {
            workout.title = title.trim();
        }

        if (workoutType !== undefined) {
            workout.workoutType = workoutType;
        }

        if (duration !== undefined) {
            workout.duration = Number(duration);
        }

        if (caloriesBurned !== undefined) {
            workout.caloriesBurned = Number(caloriesBurned);
        }

        if (distance !== undefined) {
            workout.distance = distance === "" || distance === null ? undefined : Number(distance);
        }

        if (date !== undefined) {
            workout.date = new Date(date);
        }

        if (notes !== undefined) {
            workout.notes = notes.trim();
        }

        if (exercises !== undefined && Array.isArray(exercises)) {
            workout.exercises = exercises.map((ex) => ({
                exerciseId: ex.exerciseId || null,
                name: ex.name || "",
                sets: Math.max(0, Number(ex.sets) || 0),
                reps: Math.max(0, Number(ex.reps) || 0),
                weight: Math.max(0, Number(ex.weight) || 0),
                duration: Math.max(0, Number(ex.duration) || 0),
                restTime: Math.max(0, Number(ex.restTime) || 0)
            }));
        }

        await workout.save();

        // Trigger Automation Engine (Async, non-blocking)
        onWorkoutLogged(req.userId, workout).catch((err) =>
            console.error("Workout automation error:", err)
        );

        res.status(200).json({
            message: "Workout updated successfully",
            workout
        });

    } catch (error) {
        console.error("Update workout error:", error);

        res.status(500).json({
            message: "Server error updating workout"
        });
    }
};


// ==========================================
// DELETE WORKOUT
// ==========================================
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        res.status(200).json({
            message: "Workout deleted successfully"
        });

    } catch (error) {
        console.error("Delete workout error:", error);

        res.status(500).json({
            message: "Server error deleting workout"
        });
    }
};


// ==========================================
// GET WORKOUT STATS & ANALYTICS
// ==========================================
const getWorkoutStats = async (req, res) => {
    try {
        const userObjId = new mongoose.Types.ObjectId(req.userId);

        // Fetch all workouts for the user
        const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 });

        // Total calculations
        const totalWorkouts = workouts.length;
        const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);

        // Calculate Streak (consecutive days with at least one workout)
        let streak = 0;
        if (workouts.length > 0) {
            // Get unique workout dates formatted as YYYY-MM-DD in local/UTC
            const uniqueDates = Array.from(
                new Set(
                    workouts.map((w) => new Date(w.date).toISOString().split("T")[0])
                )
            ).sort().reverse();

            const todayStr = new Date().toISOString().split("T")[0];
            const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

            let checkDate = new Date();
            // If user hasn't worked out today, check if they worked out yesterday
            if (!uniqueDates.includes(todayStr)) {
                if (uniqueDates.includes(yesterdayStr)) {
                    checkDate = new Date(Date.now() - 86400000);
                } else {
                    streak = 0;
                }
            }

            if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
                let curr = new Date(checkDate);
                while (true) {
                    const dateStr = curr.toISOString().split("T")[0];
                    if (uniqueDates.includes(dateStr)) {
                        streak++;
                        curr.setDate(curr.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        // Calculate Last 7 Days Activity Breakdown
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

            const dayWorkouts = workouts.filter(
                (w) => new Date(w.date).toISOString().split("T")[0] === dateStr
            );

            const dayCalories = dayWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
            const dayMinutes = dayWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0);

            last7Days.push({
                date: dateStr,
                day: dayName,
                calories: dayCalories,
                minutes: dayMinutes,
                count: dayWorkouts.length
            });
        }

        // Calculate Category Breakdown
        const categoryMap = {};
        workouts.forEach((w) => {
            const type = w.workoutType || "Other";
            if (!categoryMap[type]) {
                categoryMap[type] = { count: 0, calories: 0, duration: 0 };
            }
            categoryMap[type].count += 1;
            categoryMap[type].calories += w.caloriesBurned || 0;
            categoryMap[type].duration += w.duration || 0;
        });

        const categoryBreakdown = Object.keys(categoryMap).map((type) => ({
            type,
            count: categoryMap[type].count,
            calories: categoryMap[type].calories,
            duration: categoryMap[type].duration,
            percentage: totalWorkouts > 0 ? Math.round((categoryMap[type].count / totalWorkouts) * 100) : 0
        })).sort((a, b) => b.count - a.count);

        // Calculate This Week's Workouts (Monday to Sunday)
        const now = new Date();
        const startOfWeek = new Date(now);
        const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday = 0
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const thisWeekWorkouts = workouts.filter((w) => new Date(w.date) >= startOfWeek);
        const thisWeekCount = thisWeekWorkouts.length;
        const thisWeekCalories = thisWeekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
        const thisWeekDuration = thisWeekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);

        res.status(200).json({
            totalWorkouts,
            totalCalories,
            totalDuration,
            totalDistance: Number(totalDistance.toFixed(2)),
            streak,
            thisWeek: {
                count: thisWeekCount,
                calories: thisWeekCalories,
                duration: thisWeekDuration
            },
            last7Days,
            categoryBreakdown,
            recentWorkouts: workouts.slice(0, 5)
        });

    } catch (error) {
        console.error("Get workout stats error:", error);

        res.status(500).json({
            message: "Server error generating workout statistics"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
    addWorkout,
    getMyWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    getWorkoutStats
};