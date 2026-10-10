import API from "./api";

export const getChallenges = async () => {
  const response = await API.get("/challenges");
  return response.data;
};

export const joinChallenge = async (id) => {
  const response = await API.post(`/challenges/${id}/join`);
  return response.data;
};

export const leaveChallenge = async (id) => {
  const response = await API.post(`/challenges/${id}/leave`);
  return response.data;
};
