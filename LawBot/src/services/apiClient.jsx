import axios from 'axios';
import { baseURL } from '../constants/baseURL';

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'access-control-expose-headers': 'access',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers['access'] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
