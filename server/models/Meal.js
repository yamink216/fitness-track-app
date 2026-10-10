const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      default: "",
      trim: true,
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    protein: {
      type: Number,
      default: 0,
      min: 0,
    },
    carbohydrates: {
      type: Number,
      default: 0,
      min: 0,
    },
    fat: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true }
);

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
      required: true,
    },
    foods: {
      type: [foodItemSchema],
      default: [],
    },
    totalCalories: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFat: {
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
  {
    timestamps: true,
  }
);

mealSchema.index({ user: 1, date: 1 });

mealSchema.pre("save", function () {
  const validFoods = Array.isArray(this.foods) ? this.foods : [];
  this.totalCalories = validFoods.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  this.totalProtein = validFoods.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
  this.totalCarbs = validFoods.reduce((sum, item) => sum + (Number(item.carbohydrates) || 0), 0);
  this.totalFat = validFoods.reduce((sum, item) => sum + (Number(item.fat) || 0), 0);
});

module.exports = mongoose.model("Meal", mealSchema);
