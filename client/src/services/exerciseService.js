import API from "./api";

export const getExercises = async (params = {}) => {
  const response = await API.get("/exercises", { params });
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await API.get(`/exercises/${id}`);
  return response.data;
};
