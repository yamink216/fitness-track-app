const Exercise = require("../models/Exercise");

const getExercises = async (req, res) => {
  try {
    const { category, muscleGroup, difficulty, search } = req.query;

    const query = {};

    if (category && category !== "All") query.category = category;
    if (muscleGroup && muscleGroup !== "All") query.muscleGroup = muscleGroup;
    if (difficulty && difficulty !== "All") query.difficulty = difficulty;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { muscleGroup: { $regex: search, $options: "i" } },
      ];
    }

    const exercises = await Exercise.find(query).sort({ createdAt: -1 });

    res.status(200).json({ count: exercises.length, exercises });
  } catch (error) {
    console.error("Get exercises error:", error);
    res.status(500).json({ message: "Server error fetching exercises" });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json({ exercise });
  } catch (error) {
    console.error("Get exercise by id error:", error);
    res.status(500).json({ message: "Server error fetching exercise" });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
};
