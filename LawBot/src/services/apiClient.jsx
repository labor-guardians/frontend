import axios from 'axios';
import { baseURL } from '../constants/baseURL';

export const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : baseURL, // 개발환경이면 api/ 아니면 baseURL
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

    const hasAccessHeader = originalRequest.headers?.access;

    if (!hasAccessHeader) {
      return Promise.reject(error);
    }

    // 401이고, 재시도한 요청이 아니면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 방지
      originalRequest.withCredentials = true;

      try {
        const refreshResponse = await axios.post(
          import.meta.env.MODE === 'development'
            ? `/api/api/reissue`
            : `${baseURL}/api/reissue`, // 개발환경이면 api/ 아니면 baseURL
          {},
          {
            withCredentials: true, // 보통 쿠키 기반 리프레시를 위해 필요
            headers: {
              'Content-Type': 'application/json',
              'access-control-expose-headers': 'access',
            },
          },
        );

        // 새 토큰 저장
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('access', refreshResponse.headers['access']);

        // 새 토큰으로 Authorization 헤더 업데이트
        originalRequest.headers['access'] = `${newAccessToken}`;

        return apiClient(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        // 리프레시도 실패 → 로그아웃 처리 등 필요
        console.error('리프레시 토큰 실패', refreshError);
        if (refreshError.response?.status === 500) {
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
