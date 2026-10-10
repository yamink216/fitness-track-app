import API from "./api";

export const getMeals = async (params = {}) => {
  const response = await API.get("/meals", { params });
  return response.data;
};

export const getDailyNutritionSummary = async () => {
  const response = await API.get("/meals/summary");
  return response.data;
};

export const createMeal = async (mealData) => {
  const response = await API.post("/meals", mealData);
  return response.data;
};

export const updateMeal = async (id, mealData) => {
  const response = await API.put(`/meals/${id}`, mealData);
  return response.data;
};

export const deleteMeal = async (id) => {
  const response = await API.delete(`/meals/${id}`);
  return response.data;
};
