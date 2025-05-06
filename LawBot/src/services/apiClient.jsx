import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://18.219.49.169:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
