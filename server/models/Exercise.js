const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Strength", "Cardio", "Flexibility", "HIIT", "Mobility"],
      required: true,
    },
    muscleGroup: {
      type: String,
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Arms",
        "Legs",
        "Core",
        "Full Body",
      ],
      required: true,
    },
    equipment: {
      type: String,
      default: "Bodyweight",
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    instructions: {
      type: [String],
      default: [],
    },
    caloriesPerMinute: {
      type: Number,
      min: 0,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ name: "text", category: "text", muscleGroup: "text" });

module.exports = mongoose.model("Exercise", exerciseSchema);
