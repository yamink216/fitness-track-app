const mongoose = require("mongoose");

const workoutPlanExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: false,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    sets: {
      type: Number,
      default: 0,
      min: 0,
    },
    reps: {
      type: Number,
      default: 0,
      min: 0,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    restTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true }
);

const workoutPlanDaySchema = new mongoose.Schema(
  {
    dayName: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    exercises: [workoutPlanExerciseSchema],
  },
  { _id: true }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },
    sourceSystemPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      default: null,
    },
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
    goal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Maintain Weight", "Improve Fitness"],
      default: "Improve Fitness",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    days: {
      type: [workoutPlanDaySchema],
      default: [],
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

workoutPlanSchema.index({ user: 1, active: 1 });
workoutPlanSchema.index({ isSystem: 1, difficulty: 1 });

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
