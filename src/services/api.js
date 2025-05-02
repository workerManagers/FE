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
  withCredentials: false,
  timeout: 6000000, 
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
      if (error.response.status === 401) {
        // 401: 인증 실패 (토큰이 없거나 만료)
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        // 403: 권한 없음 (토큰은 유효하지만 접근 권한이 없음)
        // 토큰을 삭제하지 않고 에러만 전달
        console.error('접근 권한이 없습니다:', error.response.data);
      } else if (error.response.status === 404) {
        // 404: 리소스를 찾을 수 없음
        return Promise.reject(error);
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
      console.log('로그인 응답:', response.data); // 로그인 응답 확인
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('userId', response.data.userId);
        // 회사 정보 저장
        if (response.data.companyName) {
          localStorage.setItem('companyName', response.data.companyName);
          localStorage.setItem('jobRegion', response.data.jobRegion);
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
      // 로그아웃 시 모든 사용자 정보 제거
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
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

      const response = await api.get('/users/me');
      console.log('사용자 정보 응답:', response.data); // 응답 데이터 확인
      
      // 회사 정보가 있는 경우 localStorage에 저장
      if (response.data.companyInfo) {
        localStorage.setItem('companyName', response.data.companyInfo.companyName);
        localStorage.setItem('jobRegion', response.data.companyInfo.companyRegion || '');
      }
      
      return response.data;
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

  // 사용자 이름으로 정보 조회
  getUserByName: async (userName) => {
    try {
      const response = await api.get(`/users/name/${userName}`);
      return response.data;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
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

// 이력서 관련 API
export const resumeApi = {
  // 이력서 생성
  createResume: async (resumeText) => {
    try {
      const response = await api.post('/resumes', { resumeText });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // 이력서 조회
  getResume: async () => {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 이력서 수정
  updateResume: async (resumeText) => {
    try {
      const response = await api.put('/resumes', { resumeText });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // 이력서 삭제
  deleteResume: async () => {
    try {
      const response = await api.delete('/resumes');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

// 북마크 관련 API
export const bookmarkApi = {
  // 북마크 생성
  createBookmark: async (jobPostId) => {
    try {
      const response = await api.post('/bookmarks', { jobPostId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // 북마크 삭제
  deleteBookmark: async (bookmarkId) => {
    try {
      const response = await api.delete(`/bookmarks/${bookmarkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // 내 북마크 목록 조회
  getMyBookmarks: async () => {
    try {
      const response = await api.get('/bookmarks/my');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const applicationApi = {
  // 채용공고 지원하기
  applyToJob: async (jobPostId) => {
    try {
      const response = await api.post('/applications', { jobPostId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 내 지원 목록 조회
  getMyApplications: async () => {
    try {
      const response = await api.get('/applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 특정 공고의 지원자 목록 조회 (기업 회원용)
  getJobPostApplications: async (jobPostId) => {
    try {
      const response = await api.get(`/applications/job-posts/${jobPostId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const chatApi = {
  // 채팅방 생성
  createChatRoom: async (targetUserId) => {
    try {
      const response = await api.post('/chat/rooms', { targetUserId });
      return response.data;
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      throw error;
    }
  },

  // 채팅방 목록 조회
  getChatRooms: async () => {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
      throw error;
    }
  },

  // 채팅 메시지 조회
  getChatMessages: async (roomId) => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      return response.data;
    } catch (error) {
      console.error('채팅 메시지 조회 실패:', error);
      throw error;
    }
  },

  // 메시지 읽음 처리
  markAsRead: async (roomId) => {
    try {
      const response = await api.put(`/chat/rooms/${roomId}/read`);
      return response.data;
    } catch (error) {
      console.error('메시지 읽음 처리 실패:', error);
      throw error;
    }
  },

  // 채팅방 나가기
  leaveRoom: async (roomId) => {
    try {
      const response = await api.delete(`/chat/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('채팅방 나가기 실패:', error);
      throw error;
    }
  },

  // 메시지 삭제
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/chat/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('메시지 삭제 실패:', error);
      throw error;
    }
  }
};

export const matchingApi = {
  // 공고별 매칭 점수 조회 (기업회원용)
  getMatchingScores: async (jobPostId) => {
    try {
      const response = await api.post('/company-matchings/match', { jobPostId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 이력서 기반 직무 매칭 점수 조회 (일반회원용)
  getJobMatchingScores: async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', localStorage.getItem('token'));
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await api.post('/ai-matchings/match', 
        { resumeId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('직무 매칭 점수 조회 실패:', error);
      if (error.response?.status === 403) {
        throw new Error('접근 권한이 없습니다. 로그인 상태와 사용자 권한을 확인해주세요.');
      }
      throw error;
    }
  },
};

export default api; 