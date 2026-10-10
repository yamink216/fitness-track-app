const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["Workout", "Streak", "Nutrition", "Hydration", "Goal", "Milestone"],
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    requirement: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model("Achievement", achievementSchema);
