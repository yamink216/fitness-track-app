import API from "./api";

export const getWorkoutPlans = async () => {
  const response = await API.get("/workout-plans");
  return response.data;
};

export const createWorkoutPlan = async (planData) => {
  const response = await API.post("/workout-plans", planData);
  return response.data;
};

export const updateWorkoutPlan = async (id, planData) => {
  const response = await API.put(`/workout-plans/${id}`, planData);
  return response.data;
};

export const deleteWorkoutPlan = async (id) => {
  const response = await API.delete(`/workout-plans/${id}`);
  return response.data;
};

export const activateWorkoutPlan = async (id) => {
  const response = await API.patch(`/workout-plans/${id}/activate`);
  return response.data;
};
