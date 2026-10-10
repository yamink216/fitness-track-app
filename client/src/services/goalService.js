import API from "./api";

// Get user fitness goal
export const getGoal = async () => {
  const response = await API.get("/goals");
  return response.data;
};

// Create new fitness goal
export const createGoal = async (goalData) => {
  const response = await API.post("/goals", goalData);
  return response.data;
};

// Update existing fitness goal
export const updateGoal = async (goalData) => {
  const response = await API.put("/goals", goalData);
  return response.data;
};

// Delete fitness goal
export const deleteGoal = async () => {
  const response = await API.delete("/goals");
  return response.data;
};
