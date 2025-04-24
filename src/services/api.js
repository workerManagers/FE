import axios from 'axios';

// API 기본 URL 설정
// const API_BASE_URL = 'https://port-0-workermangers-be-m9ax68es6a756190.sel4.cloudtype.app';
const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업 (예: 토큰 추가)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    } else {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    // 응답 헤더에서 새로운 토큰이 있는지 확인
    const newToken = response.headers['x-access-token'] || response.headers['authorization'];
    if (newToken) {
      const token = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken;
      localStorage.setItem('token', token);
    }
    return response;
  },
  (error) => {
    // 응답 오류 처리
    if (error.response) {
      // 401 또는 403 에러인 경우 로그인 페이지로 리다이렉트
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
      }
      console.error('API 오류:', error.response.data);
    } else if (error.request) {
      console.error('서버 연결 오류:', error.request);
    } else {
      console.error('요청 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

// 사용자 관련 API
export const userApi = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await api.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 로그인
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.userName) {
          localStorage.setItem('userName', response.data.userName);
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 로그아웃
  logout: async () => {
    try {
      const response = await api.post('/users/logout');
      // 로그아웃 시 모든 로컬 스토리지 데이터 제거
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      return response.data;
    } catch (error) {
      // 로그아웃 실패 시에도 로컬 스토리지 데이터 제거
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      throw error;
    }
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 토큰에서 사용자 정보 추출
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userInfo = {
        userId: tokenPayload.sub,
        userName: localStorage.getItem('userName')
      };

      return userInfo;
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error);
      throw error;
    }
  },

  // 예측 API
  predict: async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await api.post('/predict', data, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('예측 API 오류:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }
      throw error;
    }
  },
};

// 모집 공고 관련 API
export const jobPostApi = {
  // 모든 모집 공고 조회
  getAllJobPosts: async () => {
    try {
      const response = await api.get('/job-posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching job posts:', error);
      throw error;
    }
  },

  // 특정 모집 공고 조회
  getJobPostById: async (id) => {
    try {
      const response = await api.get(`/job-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job post:', error);
      throw error;
    }
  },

  // 모집 공고 생성
  createJobPost: async (data) => {
    try {
      const response = await api.post('/job-posts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating job post:', error.response?.data || error.message);
      throw error;
    }
  },

  // 모집 공고 검색
  searchJobPosts: async (params) => {
    try {
      const response = await api.get('/job-posts/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching job posts:', error);
      throw error;
    }
  },

  getJobCodes: async () => {
    try {
      const response = await api.get('/job-codes');
      return response.data;
    } catch (error) {
      console.error('Error fetching job codes:', error.response?.data || error.message);
      throw error;
    }
  },

  getCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default api; 