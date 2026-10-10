import API from "./api";

export const getDashboardAnalytics = async () => {
  const response = await API.get("/analytics/dashboard");
  return response.data;
};

export const getWorkoutAnalytics = async () => {
  const response = await API.get("/analytics/workouts");
  return response.data;
};

export const getNutritionAnalytics = async () => {
  const response = await API.get("/analytics/nutrition");
  return response.data;
};

export const getProgressAnalytics = async () => {
  const response = await API.get("/analytics/progress");
  return response.data;
};
