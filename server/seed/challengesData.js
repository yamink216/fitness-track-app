module.exports = [
  {
    name: "3 Workouts This Week",
    description: "Build momentum by finishing at least 3 high-energy workout sessions this week.",
    type: "Workout",
    target: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: "Beginner",
    status: "Active"
  },
  {
    name: "5 Workouts This Week",
    description: "Step up your game and complete 5 dedicated workout sessions in seven days.",
    type: "Workout",
    target: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: "Intermediate",
    status: "Active"
  },
  {
    name: "10,000 Calorie Burn Challenge",
    description: "Torch a total of 10,000 active calories through consistent training this month.",
    type: "Calories",
    target: 10000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: "Advanced",
    status: "Active"
  },
  {
    name: "7-Day Hydration Champion",
    description: "Hit your daily water target of 2,500ml for 7 consecutive days.",
    type: "Hydration",
    target: 7,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: "Beginner",
    status: "Active"
  },
  {
    name: "30-Day Fitness Consistency",
    description: "Log at least 20 active days within a 30-day window to build lifelong discipline.",
    type: "Streak",
    target: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: "Advanced",
    status: "Active"
  }
];
