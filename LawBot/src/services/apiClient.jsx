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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401이고, 재시도한 요청이 아니면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 방지

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/reissue`, // ← 여기에 실제 리프레시 API URL
          {},
          {
            withCredentials: true, // 보통 쿠키 기반 리프레시를 위해 필요
          },
        );

        console.log(refreshResponse);

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('access', newAccessToken);

        // 새 토큰으로 Authorization 헤더 업데이트
        originalRequest.headers['access'] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        // 리프레시도 실패 → 로그아웃 처리 등 필요
        console.error('리프레시 토큰 실패', refreshError);
        if (refreshError.response?.status === 400) {
          window.localStorage.clear();
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
