import { axiosInstance } from './axiosInstance';

export const jobPostApi = {
  // ... 기존 jobPostApi 코드 유지 ...
};

export const matchingApi = {
  // 매칭 허용된 이력서 목록 조회
  getMatchingEnabledResumes: async () => {
    try {
      const response = await axiosInstance.get('/resumes/matching-enabled');
      console.log('매칭 허용된 이력서 목록:', response.data);
      return response.data;
    } catch (error) {
      console.error('매칭 허용된 이력서 조회 실패:', error);
      throw error;
    }
  },

  // AI 매칭 점수 조회
  getMatchingScores: async (jobPostId) => {
    try {
      const response = await axiosInstance.post('/company-matchings/match', {
        jobPostId
      });
      return response.data;
    } catch (error) {
      console.error('매칭 점수 조회 실패:', error);
      throw error;
    }
  },

  // 회사 매칭 수행
  performCompanyMatching: async (jobPostId) => {
    try {
      const response = await axiosInstance.post('/company-matchings/match', {
        jobPostId
      });
      return response.data;
    } catch (error) {
      console.error('회사 매칭 수행 실패:', error);
      throw error;
    }
  }
};

export const userApi = {
  // ... 기존 userApi 코드 유지 ...
};

export const chatApi = {
  // ... 기존 chatApi 코드 유지 ...
};

export const applicationApi = {
  // ... 기존 applicationApi 코드 유지 ...
}; 