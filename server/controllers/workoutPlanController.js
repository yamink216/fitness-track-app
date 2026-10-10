const WorkoutPlan = require("../models/WorkoutPlan");

const createWorkoutPlan = async (req, res) => {
  try {
    const { name, description, goal, difficulty, days, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Plan name is required" });
    }

    const plan = await WorkoutPlan.create({
      user: req.userId,
      name,
      description: description || "",
      goal: goal || "Improve Fitness",
      difficulty: difficulty || "Beginner",
      days: Array.isArray(days) ? days : [],
      active: active || false,
    });

    res.status(201).json({ message: "Workout plan created successfully", plan });
  } catch (error) {
    console.error("Create workout plan error:", error);
    res.status(500).json({ message: "Server error creating workout plan" });
  }
};

const getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({
      $or: [{ user: req.userId }, { isSystem: true }],
    }).sort({ isSystem: -1, createdAt: -1 });
    const copiedSystemPlanIds = new Set(
      plans
        .filter((plan) => plan.sourceSystemPlan)
        .map((plan) => plan.sourceSystemPlan.toString())
    );
    const visiblePlans = plans.filter(
      (plan) => !plan.isSystem || !copiedSystemPlanIds.has(plan._id.toString())
    );

    res.status(200).json({ count: visiblePlans.length, plans: visiblePlans });
  } catch (error) {
    console.error("Get workout plans error:", error);
    res.status(500).json({ message: "Server error fetching workout plans" });
  }
};

const getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      $or: [{ user: req.userId }, { isSystem: true }],
    });

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error("Get workout plan by id error:", error);
    res.status(500).json({ message: "Server error fetching workout plan" });
  }
};

const updateWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, user: req.userId });

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    const { name, description, goal, difficulty, days, active } = req.body;

    if (name !== undefined) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (goal !== undefined) plan.goal = goal;
    if (difficulty !== undefined) plan.difficulty = difficulty;
    if (days !== undefined) plan.days = days;
    if (active !== undefined) plan.active = active;

    await plan.save();
    res.status(200).json({ message: "Workout plan updated successfully", plan });
  } catch (error) {
    console.error("Update workout plan error:", error);
    res.status(500).json({ message: "Server error updating workout plan" });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    res.status(200).json({ message: "Workout plan deleted successfully" });
  } catch (error) {
    console.error("Delete workout plan error:", error);
    res.status(500).json({ message: "Server error deleting workout plan" });
  }
};

const setActiveWorkoutPlan = async (req, res) => {
  try {
    let plan = await WorkoutPlan.findOne({ _id: req.params.id, user: req.userId });
    const systemPlan = plan
      ? null
      : await WorkoutPlan.findOne({ _id: req.params.id, isSystem: true });

    if (!plan && !systemPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    await WorkoutPlan.updateMany({ user: req.userId }, { $set: { active: false } });

    if (systemPlan) {
      plan = await WorkoutPlan.findOne({
        user: req.userId,
        sourceSystemPlan: systemPlan._id,
      });

      if (!plan) {
        plan = new WorkoutPlan({
          user: req.userId,
          isSystem: false,
          sourceSystemPlan: systemPlan._id,
          name: systemPlan.name,
          description: systemPlan.description,
          goal: systemPlan.goal,
          difficulty: systemPlan.difficulty,
          days: systemPlan.days.map((day) => ({
            dayName: day.dayName,
            exercises: day.exercises.map((exercise) => ({
              exerciseId: exercise.exerciseId,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              duration: exercise.duration,
              restTime: exercise.restTime,
              notes: exercise.notes,
            })),
          })),
        });
      }
    }

    plan.active = true;
    await plan.save();

    res.status(200).json({ message: "Active workout plan updated", plan });
  } catch (error) {
    console.error("Set active workout plan error:", error);
    res.status(500).json({ message: "Server error updating active workout plan" });
  }
};

module.exports = {
  createWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  setActiveWorkoutPlan,
};
