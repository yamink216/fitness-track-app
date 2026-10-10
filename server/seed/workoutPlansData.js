module.exports = [
  {
    name: "Beginner Full Body Foundation",
    description: "Ideal 3-day full body training program designed to build core strength, perfect compound exercise mechanics, and enhance baseline conditioning.",
    goal: "Improve Fitness",
    difficulty: "Beginner",
    isSystem: true,
    active: true,
    days: [
      {
        dayName: "Monday",
        exercises: [
          { name: "Barbell Back Squat", sets: 3, reps: 10, weight: 40, restTime: 90, duration: 15, notes: "Focus on knee alignment and chest up" },
          { name: "Push Up", sets: 3, reps: 12, weight: 0, restTime: 60, duration: 10, notes: "Full range of motion" },
          { name: "Bent Over Barbell Row", sets: 3, reps: 10, weight: 35, restTime: 90, duration: 12, notes: "Squeeze shoulder blades" },
          { name: "Plank", sets: 3, reps: 1, weight: 0, restTime: 60, duration: 5, notes: "Hold for 45 seconds each set" }
        ]
      },
      {
        dayName: "Wednesday",
        exercises: [
          { name: "Deadlift", sets: 3, reps: 8, weight: 50, restTime: 120, duration: 15, notes: "Drive with the legs, flat back" },
          { name: "Overhead Barbell Press", sets: 3, reps: 10, weight: 25, restTime: 90, duration: 12, notes: "Brace abs and glutes" },
          { name: "Lat Pulldown", sets: 3, reps: 12, weight: 40, restTime: 60, duration: 10, notes: "Controlled eccentric lowering" },
          { name: "Barbell Bicep Curl", sets: 3, reps: 12, weight: 15, restTime: 60, duration: 8, notes: "Keep elbows pinned" }
        ]
      },
      {
        dayName: "Friday",
        exercises: [
          { name: "Leg Press", sets: 3, reps: 12, weight: 80, restTime: 90, duration: 15, notes: "Smooth tempo, no knee lockout" },
          { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 16, restTime: 90, duration: 12, notes: "Feel the upper chest contraction" },
          { name: "Seated Cable Row", sets: 3, reps: 12, weight: 45, restTime: 60, duration: 10, notes: "Pull to lower ribcage" },
          { name: "Tricep Rope Pushdown", sets: 3, reps: 15, weight: 20, restTime: 60, duration: 8, notes: "Flare the rope at bottom" }
        ]
      }
    ]
  },
  {
    name: "Push Pull Legs (PPL) Hypertrophy",
    description: "Classic 3-day split separating pushing muscles, pulling muscles, and lower body for maximum muscle stimulus and recovery.",
    goal: "Muscle Gain",
    difficulty: "Intermediate",
    isSystem: true,
    active: false,
    days: [
      {
        dayName: "Monday",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: 8, weight: 60, restTime: 120, duration: 18, notes: "Heavy compound working sets" },
          { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 22, restTime: 90, duration: 12, notes: "Controlled stretch" },
          { name: "Overhead Barbell Press", sets: 3, reps: 8, weight: 35, restTime: 90, duration: 12, notes: "Full overhead extension" },
          { name: "Dumbbell Lateral Raise", sets: 4, reps: 15, weight: 10, restTime: 60, duration: 10, notes: "Strict form, lead with elbows" },
          { name: "Tricep Rope Pushdown", sets: 3, reps: 12, weight: 25, restTime: 60, duration: 8, notes: "Lock out triceps" }
        ]
      },
      {
        dayName: "Wednesday",
        exercises: [
          { name: "Deadlift", sets: 4, reps: 6, weight: 80, restTime: 150, duration: 20, notes: "Brace hard on every rep" },
          { name: "Pull Up", sets: 4, reps: 8, weight: 0, restTime: 90, duration: 12, notes: "Dead hang to chin over bar" },
          { name: "Bent Over Barbell Row", sets: 3, reps: 10, weight: 50, restTime: 90, duration: 12, notes: "Chest proud" },
          { name: "Face Pull", sets: 4, reps: 15, weight: 20, restTime: 60, duration: 10, notes: "Rear delt squeeze" },
          { name: "Barbell Bicep Curl", sets: 3, reps: 10, weight: 25, restTime: 60, duration: 8, notes: "No momentum" }
        ]
      },
      {
        dayName: "Friday",
        exercises: [
          { name: "Barbell Back Squat", sets: 4, reps: 8, weight: 70, restTime: 120, duration: 20, notes: "Break parallel smoothly" },
          { name: "Romanian Deadlift", sets: 3, reps: 10, weight: 60, restTime: 90, duration: 15, notes: "Deep hamstring stretch" },
          { name: "Bulgarian Split Squat", sets: 3, reps: 10, weight: 14, restTime: 90, duration: 12, notes: "Per leg, stay stable" },
          { name: "Standing Calf Raise", sets: 4, reps: 15, weight: 50, restTime: 60, duration: 8, notes: "Full stretch at bottom" },
          { name: "Hanging Leg Raise", sets: 3, reps: 12, weight: 0, restTime: 60, duration: 8, notes: "No swinging" }
        ]
      }
    ]
  },
  {
    name: "HIIT Calorie Torcher & Fat Burn",
    description: "High-intensity functional conditioning protocol designed to maximize calorie burn, boost metabolic rate, and elevate cardiovascular stamina.",
    goal: "Weight Loss",
    difficulty: "Intermediate",
    isSystem: true,
    active: false,
    days: [
      {
        dayName: "Tuesday",
        exercises: [
          { name: "Burpees", sets: 4, reps: 15, weight: 0, restTime: 60, duration: 10, notes: "Explosive jump at the top" },
          { name: "Kettlebell Swing", sets: 4, reps: 20, weight: 16, restTime: 60, duration: 10, notes: "Hip drive power" },
          { name: "Treadmill High Intensity Interval Run", sets: 1, reps: 10, weight: 0, restTime: 60, duration: 15, notes: "10 sprint intervals" },
          { name: "Plank", sets: 3, reps: 1, weight: 0, restTime: 45, duration: 5, notes: "Hold 60 seconds" }
        ]
      },
      {
        dayName: "Thursday",
        exercises: [
          { name: "Rowing Machine Sprints", sets: 5, reps: 1, weight: 0, restTime: 60, duration: 15, notes: "500m sprint per round" },
          { name: "Push Up", sets: 4, reps: 15, weight: 0, restTime: 45, duration: 8, notes: "Continuous rhythmic pace" },
          { name: "Cable Woodchopper", sets: 3, reps: 12, weight: 15, restTime: 45, duration: 8, notes: "Per side" },
          { name: "Burpees", sets: 3, reps: 12, weight: 0, restTime: 60, duration: 8, notes: "High heart rate finish" }
        ]
      },
      {
        dayName: "Saturday",
        exercises: [
          { name: "Jump Rope Double Unders", sets: 5, reps: 30, weight: 0, restTime: 45, duration: 10, notes: "Light on feet" },
          { name: "Kettlebell Swing", sets: 4, reps: 20, weight: 16, restTime: 60, duration: 10, notes: "Snap the hips" },
          { name: "Hanging Leg Raise", sets: 3, reps: 15, weight: 0, restTime: 45, duration: 8, notes: "Tuck knees if fatigued" },
          { name: "Treadmill High Intensity Interval Run", sets: 1, reps: 8, weight: 0, restTime: 60, duration: 12, notes: "Cool down walk afterwards" }
        ]
      }
    ]
  },
  {
    name: "Home Bodyweight Athlete",
    description: "No gym or barbell required. Minimalist yet rigorous calisthenics routine engineered for functional agility, endurance, and muscular control.",
    goal: "Maintain Weight",
    difficulty: "Beginner",
    isSystem: true,
    active: false,
    days: [
      {
        dayName: "Monday",
        exercises: [
          { name: "Push Up", sets: 4, reps: 15, weight: 0, restTime: 60, duration: 12, notes: "Strict form" },
          { name: "Plank", sets: 3, reps: 1, weight: 0, restTime: 45, duration: 6, notes: "60 seconds hold" },
          { name: "Burpees", sets: 3, reps: 10, weight: 0, restTime: 60, duration: 8, notes: "Cardio booster" },
          { name: "World's Greatest Stretch", sets: 2, reps: 5, weight: 0, restTime: 30, duration: 6, notes: "Per side mobility" }
        ]
      },
      {
        dayName: "Wednesday",
        exercises: [
          { name: "Pull Up", sets: 4, reps: 6, weight: 0, restTime: 90, duration: 12, notes: "Use door frame or local park bar" },
          { name: "Push Up", sets: 3, reps: 12, weight: 0, restTime: 60, duration: 10, notes: "Diamond or close grip" },
          { name: "Ab Wheel Rollout", sets: 3, reps: 10, weight: 0, restTime: 60, duration: 8, notes: "Knees on floor" },
          { name: "Downward Dog to Cobra", sets: 3, reps: 8, weight: 0, restTime: 30, duration: 6, notes: "Spinal mobility" }
        ]
      },
      {
        dayName: "Friday",
        exercises: [
          { name: "Burpees", sets: 4, reps: 12, weight: 0, restTime: 60, duration: 10, notes: "Paced cadence" },
          { name: "Plank", sets: 4, reps: 1, weight: 0, restTime: 45, duration: 8, notes: "Forearms grounded" },
          { name: "Push Up", sets: 4, reps: 12, weight: 0, restTime: 60, duration: 10, notes: "Slow 3-second descent" },
          { name: "World's Greatest Stretch", sets: 2, reps: 6, weight: 0, restTime: 30, duration: 6, notes: "Full recovery" }
        ]
      }
    ]
  }
];
