import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'https://port-0-workermangers-be-m9ax68es6a756190.sel4.cloudtype.app';
// const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 15000,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
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
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token');
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

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }
  return token;
};

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
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userName', response.data.userName);
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
      // 로그아웃 시 모든 사용자 정보 제거
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
      return response.data;
    } catch (error) {
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
        userType: tokenPayload.userType,
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

// 채용공고 관련 API
export const jobPostApi = {
  // 회사 목록 조회
  getCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      console.error('회사 목록 조회 실패:', error);
      throw error;
    }
  },

  // 직종 코드 목록 조회
  getJobCodes: async () => {
    try {
      const response = await api.get('/job-codes');
      return response.data;
    } catch (error) {
      console.error('직종 코드 조회 실패:', error);
      throw error;
    }
  },

  // 채용공고 생성
  createJobPost: async (jobPostData) => {
    try {
      const formattedData = {
        companyName: jobPostData.companyName,
        jobName: jobPostData.jobName,
        jobPostDescription: jobPostData.jobPostDescription,
        mainTasks: jobPostData.mainTasks,
        qualifications: jobPostData.qualifications,
        preferredQualifications: jobPostData.preferredQualifications,
        idealCandidate: jobPostData.idealCandidate,
        jobPeriod: jobPostData.jobPeriod,
        jobRegion: jobPostData.jobRegion,
        deadline: jobPostData.deadline + 'T23:59:59',
        careerType: jobPostData.careerType
      };

      const response = await api.post('/job-posts', formattedData);
      return response.data;
    } catch (error) {
      console.error('채용공고 생성 실패:', error);
      if (error.response) {
        console.error('응답 데이터:', error.response.data);
        console.error('응답 상태:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
      }
      throw error;
    }
  },

  // 채용공고 조회
  getJobPost: async (jobPostId) => {
    try {
      const response = await api.get(`/job-posts/${jobPostId}`);
      return response.data;
    } catch (error) {
      console.error('채용공고 조회 실패:', error);
      if (error.response?.status === 404) {
        console.error('채용공고를 찾을 수 없음:', error.response.data.message);
      }
      throw error;
    }
  },

  // 채용공고 수정
  updateJobPost: async (jobPostId, jobPostData) => {
    try {
      const formattedData = {
        ...jobPostData,
        deadline: jobPostData.deadline + 'T23:59:59'
      };

      const response = await api.put(`/job-posts/${jobPostId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('채용공고 수정 실패:', error);
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        throw new Error('토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
      }
      throw error;
    }
  },

  // 채용공고 삭제
  deleteJobPost: async (jobPostId) => {
    try {
      const response = await api.delete(`/job-posts/${jobPostId}`);
      return response.data;
    } catch (error) {
      console.error('채용공고 삭제 실패:', error);
      throw error;
    }
  },

  // 채용공고 목록 조회
  getJobPosts: async () => {
    try {
      const response = await api.get('/job-posts');
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('채용공고를 불러오는데 실패했습니다.');
    } catch (error) {
      console.error('API 오류:', error);
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
      }
      throw error;
    }
  },

  // 직종 코드 조회
  getJobCodeByJobName: async (jobName) => {
    try {
      const response = await api.get(`/job-codes/name/${encodeURIComponent(jobName)}`);
      if (response.data && response.data.jobCodeId) {
        return {
          jobCodeId: response.data.jobCodeId,
          jobCode: response.data.jobCode,
          jobName: response.data.jobName,
          industryCategory: response.data.industryCategory,
          industrySubcategory: response.data.industrySubcategory
        };
      }
      return null;
    } catch (error) {
      console.error('직종 코드 조회 실패:', error);
      if (error.response?.status === 403) {
        console.error('토큰이 만료되었거나 유효하지 않음');
      }
      throw error;
    }
  }
};

export default api; 