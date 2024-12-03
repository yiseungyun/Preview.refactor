import axios from "axios";

export const refreshAccessToken = async () => {
  return await axios.post("/api/auth/refresh");
};
