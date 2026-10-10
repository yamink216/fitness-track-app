const Meal = require("../models/Meal");

const createMeal = async (req, res) => {
  try {
    const { date, mealType, foods, notes } = req.body;

    if (!mealType) {
      return res.status(400).json({ message: "Meal type is required" });
    }

    const cleanFoods = Array.isArray(foods)
      ? foods
          .filter((f) => f && typeof f.name === "string" && f.name.trim().length > 0)
          .map((f) => ({
            name: f.name.trim(),
            quantity: f.quantity ? String(f.quantity).trim() : "",
            calories: Math.max(0, Number(f.calories) || 0),
            protein: Math.max(0, Number(f.protein) || 0),
            carbohydrates: Math.max(0, Number(f.carbohydrates || f.carbs) || 0),
            fat: Math.max(0, Number(f.fat) || 0),
          }))
      : [];

    const meal = await Meal.create({
      user: req.userId,
      date: date || new Date(),
      mealType,
      foods: cleanFoods,
      notes: notes ? notes.trim() : "",
    });

    res.status(201).json({ message: "Meal logged successfully", meal });
  } catch (error) {
    console.error("Create meal error:", error);
    res.status(500).json({ message: "Server error creating meal" });
  }
};

const getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.userId };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.status(200).json({ count: meals.length, meals });
  } catch (error) {
    console.error("Get meals error:", error);
    res.status(500).json({ message: "Server error fetching meals" });
  }
};

const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.userId });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ meal });
  } catch (error) {
    console.error("Get meal by id error:", error);
    res.status(500).json({ message: "Server error fetching meal" });
  }
};

const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.userId });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const { date, mealType, foods, notes } = req.body;

    if (date !== undefined) meal.date = date;
    if (mealType !== undefined) meal.mealType = mealType;
    if (foods !== undefined) meal.foods = foods;
    if (notes !== undefined) meal.notes = notes;

    await meal.save();
    res.status(200).json({ message: "Meal updated successfully", meal });
  } catch (error) {
    console.error("Update meal error:", error);
    res.status(500).json({ message: "Server error updating meal" });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete meal error:", error);
    res.status(500).json({ message: "Server error deleting meal" });
  }
};

const getDailyNutritionSummary = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.userId,
      date: { $gte: start, $lte: end },
    });

    const summary = meals.reduce(
      (acc, meal) => {
        acc.calories += Number(meal.totalCalories || 0);
        acc.protein += Number(meal.totalProtein || 0);
        acc.carbs += Number(meal.totalCarbs || 0);
        acc.fat += Number(meal.totalFat || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.status(200).json({ summary, meals });
  } catch (error) {
    console.error("Get daily nutrition summary error:", error);
    res.status(500).json({ message: "Server error generating nutrition summary" });
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getDailyNutritionSummary,
};
