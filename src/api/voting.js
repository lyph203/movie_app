import { apiClient } from "@/services/backend";

export const createBattle = (data) => apiClient.post("/voting/create", data);
export const getBattleResult = (id) => apiClient.get(`/voting/${id}`);
export const getListBattle = () => apiClient.get(`/voting/battles`);
export const voteBattle = (battleId, { movieId, userId }) =>
  apiClient.post(`/voting/${battleId}/vote`, { movieId, userId });
