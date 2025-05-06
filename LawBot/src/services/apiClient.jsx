import axios from "axios";
import { baseURL } from "../constants/baseURL";

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
