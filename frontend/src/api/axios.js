import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// TEMP user (will be replaced by Clerk)
api.interceptors.request.use((config) => {
  config.headers["x-user-id"] = "test_user_1";
  return config;
});
