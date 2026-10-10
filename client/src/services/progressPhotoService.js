import API from "./api";

export const getProgressPhotos = async () => {
  const response = await API.get("/progress-photos");
  return response.data;
};

export const addProgressPhoto = async (photoData) => {
  const response = await API.post("/progress-photos", photoData);
  return response.data;
};

export const deleteProgressPhoto = async (id) => {
  const response = await API.delete(`/progress-photos/${id}`);
  return response.data;
};
