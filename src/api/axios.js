import axios from 'axios';
import { API_CONFIG } from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업 (예: 토큰 추가)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 인증 에러 처리
          break;
        case 403:
          // 권한 에러 처리
          break;
        case 404:
          // 리소스 없음
          break;
        default:
          // 기타 에러
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 