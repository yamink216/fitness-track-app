const mongoose = require("mongoose");

const workoutExerciseSchema = new mongoose.Schema(
    {
        exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            default: null
        },
        name: {
            type: String,
            trim: true,
            default: ""
        },
        sets: {
            type: Number,
            default: 0,
            min: 0
        },
        reps: {
            type: Number,
            default: 0,
            min: 0
        },
        weight: {
            type: Number,
            default: 0,
            min: 0
        },
        duration: {
            type: Number,
            default: 0,
            min: 0
        },
        restTime: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { _id: true }
);

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            trim: true,
            default: ""
        },

        workoutType: {
            type: String,
            required: true,
            enum: [
                "Running",
                "Walking",
                "Cycling",
                "Swimming",
                "Gym",
                "Yoga",
                "Cardio",
                "Strength Training",
                "Other"
            ]
        },

        duration: {
            type: Number,
            required: true,
            min: 0
        },

        caloriesBurned: {
            type: Number,
            default: 0,
            min: 0
        },

        distance: {
            type: Number,
            default: 0,
            min: 0
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        date: {
            type: Date,
            default: Date.now,
            index: true
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        exercises: {
            type: [workoutExerciseSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, workoutType: 1 });

module.exports = mongoose.model("Workout", workoutSchema);