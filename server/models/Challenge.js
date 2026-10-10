const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    name: {
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
      enum: ["Workout", "Calories", "Hydration", "Weight", "Streak"],
      required: true,
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Upcoming", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

challengeSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);
