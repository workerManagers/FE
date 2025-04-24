import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

const getJobCodes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job codes:', error);
    throw error;
  }
};

const createJobPost = async (jobPostData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // 요청 데이터 로깅
    console.log('Request data:', jobPostData);
    console.log('Request URL:', `${API_BASE_URL}/job-posts`);
    console.log('Token:', token);

    // 요청 데이터 형식 변환
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
      deadline: jobPostData.deadline + 'T23:59:59', // 마감일 시간 추가
      careerType: jobPostData.careerType // careerType 추가
    };

    const response = await axios.post(`${API_BASE_URL}/job-posts`, formattedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating job post:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
};

const getJobPost = async (jobPostId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Fetching job post with ID:', jobPostId);
    console.log('Request URL:', `${API_BASE_URL}/job-posts/${jobPostId}`);
    console.log('Token:', token);

    const response = await axios.get(`${API_BASE_URL}/job-posts/${jobPostId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 응답 데이터 상세 로깅
    console.log('Job Post Details:', {
      jobPostId: response.data.jobPostId,
      companyName: response.data.companyName,
      jobName: response.data.jobName,
      jobPostDescription: response.data.jobPostDescription,
      mainTasks: response.data.mainTasks,
      qualifications: response.data.qualifications,
      preferredQualifications: response.data.preferredQualifications,
      idealCandidate: response.data.idealCandidate,
      jobPeriod: response.data.jobPeriod,
      jobRegion: response.data.jobRegion,
      deadline: response.data.deadline
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching job post:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      // 404 에러인 경우 특별 처리
      if (error.response.status === 404) {
        console.error('Job post not found:', error.response.data.message);
      }
    }
    throw error;
  }
};

const updateJobPost = async (jobPostId, jobPostData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Updating job post with ID:', jobPostId);
    console.log('Request data:', jobPostData);
    console.log('Request URL:', `${API_BASE_URL}/job-posts/${jobPostId}`);
    console.log('Token:', token);

    const formattedData = {
      ...jobPostData,
      deadline: jobPostData.deadline + 'T23:59:59' // 마감일 시간 추가
    };

    const response = await axios.put(`${API_BASE_URL}/job-posts/${jobPostId}`, formattedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating job post:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      if (error.response.status === 403) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem('token');
        throw new Error('토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
      }
    }
    throw error;
  }
};

const deleteJobPost = async (jobPostId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Deleting job post with ID:', jobPostId);
    console.log('Request URL:', `${API_BASE_URL}/job-posts/${jobPostId}`);
    console.log('Token:', token);

    const response = await axios.delete(`${API_BASE_URL}/job-posts/${jobPostId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting job post:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
};

const getJobPosts = async () => {
  const token = localStorage.getItem('token');
  console.log('API - Current token:', token);

  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/job-posts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error('채용공고를 불러오는데 실패했습니다.');
  } catch (error) {
    console.error('API Error:', error);
    if (error.response?.status === 403) {
      const currentToken = localStorage.getItem('token');
      console.log('API - Token before removal:', currentToken);
      localStorage.removeItem('token');
      console.log('API - Token after removal:', localStorage.getItem('token'));
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw error;
  }
};

const getJobCodeByJobName = async (jobName) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_BASE_URL}/job-codes/name/${encodeURIComponent(jobName)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

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
    console.error('getJobCodeByJobName - Error:', error);
    if (error.response?.status === 403) {
      console.error('getJobCodeByJobName - Token expired or invalid');
    }
    throw error;
  }
};

export default {
  getCompanies,
  getJobCodes,
  createJobPost,
  getJobPost,
  updateJobPost,
  deleteJobPost,
  getJobPosts,
  getJobCodeByJobName
}; 