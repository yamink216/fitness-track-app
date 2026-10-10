const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        goalType: {
            type: String,
            enum: [
                "Weight Loss",
                "Muscle Gain",
                "Maintain Weight",
                "Improve Fitness"
            ],
            required: true
        },

        startingWeight: {
            type: Number,
            default: null
        },

        currentWeight: {
            type: Number,
            required: true
        },

        targetWeight: {
            type: Number,
            required: true
        },

        dailyCalories: {
            type: Number,
            default: null
        },

        weeklyWorkoutTarget: {
            type: Number,
            default: 4
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        targetDate: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: ["In Progress", "Completed", "Abandoned"],
            default: "In Progress"
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

goalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Goal", goalSchema);