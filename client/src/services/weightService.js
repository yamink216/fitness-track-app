import API from "./api";

export const getWeightLogs = async () => {
  const response = await API.get("/weight");
  return response.data;
};

export const getWeightSummary = async () => {
  const response = await API.get("/weight/summary");
  return response.data;
};

export const addWeightLog = async (weightData) => {
  const response = await API.post("/weight", weightData);
  return response.data;
};
