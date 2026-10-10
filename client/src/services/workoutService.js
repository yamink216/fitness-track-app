import API from "./api";

// Get all workouts with optional filters (type, search, startDate, endDate, sort)
export const getWorkouts = async (params = {}) => {
  const response = await API.get("/workouts", { params });
  return response.data;
};

// Get single workout by id
export const getWorkout = async (id) => {
  const response = await API.get(`/workouts/${id}`);
  return response.data;
};

// Create workout
export const createWorkout = async (workoutData) => {
  const response = await API.post("/workouts", workoutData);
  return response.data;
};

// Update workout
export const updateWorkout = async (id, workoutData) => {
  const response = await API.put(`/workouts/${id}`, workoutData);
  return response.data;
};

// Delete workout
export const deleteWorkout = async (id) => {
  const response = await API.delete(`/workouts/${id}`);
  return response.data;
};

// Get aggregated workout stats and analytics
export const getWorkoutStats = async () => {
  const response = await API.get("/workouts/stats");
  return response.data;
};