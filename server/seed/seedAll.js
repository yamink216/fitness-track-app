require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

const Exercise = require("../models/Exercise");
const WorkoutPlan = require("../models/WorkoutPlan");
const Challenge = require("../models/Challenge");

const exercisesData = require("./exercisesData");
const workoutPlansData = require("./workoutPlansData");
const challengesData = require("./challengesData");

async function seedAll() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is missing in server/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("Connected to database successfully.");

    // 1. Seed Exercises (upsert by name)
    console.log(`Seeding ${exercisesData.length} exercises...`);
    const exerciseMap = {};
    for (const item of exercisesData) {
      const doc = await Exercise.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );
      exerciseMap[doc.name] = doc._id;
    }
    console.log(`✅ ${exercisesData.length} exercises seeded/verified.`);

    // 2. Seed System Workout Plans (upsert by name, attach exerciseIds)
    console.log(`Seeding ${workoutPlansData.length} system workout plans...`);
    for (const plan of workoutPlansData) {
      // Attach exerciseId references to matching exercise names
      const daysWithIds = plan.days.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ({
          ...ex,
          exerciseId: exerciseMap[ex.name] || null,
        })),
      }));

      await WorkoutPlan.findOneAndUpdate(
        { name: plan.name, isSystem: true },
        {
          $set: {
            ...plan,
            days: daysWithIds,
            user: null,
            isSystem: true,
          },
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${workoutPlansData.length} system workout plans seeded/verified.`);

    // 3. Seed Challenges (upsert by name)
    console.log(`Seeding ${challengesData.length} community challenges...`);
    for (const chal of challengesData) {
      await Challenge.findOneAndUpdate(
        { name: chal.name },
        { $set: chal },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${challengesData.length} challenges seeded/verified.`);

    console.log("\n=========================================");
    console.log("🎉 All seed operations completed cleanly!");
    console.log("=========================================\n");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed with error:", err);
    process.exit(1);
  }
}

seedAll();
