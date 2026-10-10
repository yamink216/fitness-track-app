import API from "./api";

export const getWaterLogs = async (params = {}) => {
  const response = await API.get("/water", { params });
  return response.data;
};

export const getTodayWaterProgress = async () => {
  const response = await API.get("/water/today");
  return response.data;
};

export const addWater = async (waterData) => {
  const response = await API.post("/water", waterData);
  return response.data;
};
