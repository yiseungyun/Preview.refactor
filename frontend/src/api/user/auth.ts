import axios from "axios";

export const refreshAccessToken = async () => {
  return await axios.get("/api/auth/refresh");
};
