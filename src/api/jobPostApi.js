import apiClient from './axios';

// 모든 채용 공고 가져오기
export const getJobPosts = async () => {
  const response = await apiClient.get('/job-posts');
  return response.data;
};

// 특정 채용 공고 가져오기
export const getJobPostById = async (id) => {
  const response = await apiClient.get(`/job-posts/${id}`);
  return response.data;
};

// 새 채용 공고 작성
export const createJobPost = async (postData) => {
  const response = await apiClient.post('/job-posts', {
    industrialAccidentId: postData.industrialAccidentId,
    companyId: postData.companyId,
    jobCodeId: postData.jobCodeId,
    jobPostDescription: postData.jobPostDescription,
    jobPeriod: postData.jobPeriod,
    deadline: postData.deadline
  });
  return response.data;
};

// 채용 공고 검색
export const searchJobPosts = async (params) => {
  const response = await apiClient.get('/job-posts/search', { params });
  return response.data;
}; 