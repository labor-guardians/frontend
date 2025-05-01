import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://lawbot/",
  headers: {
    "Content-Type": "application/json",
  },
});
