import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi, userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #666;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

function NewJobPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [jobCodes, setJobCodes] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyName: '',
    jobName: '',
    jobPostDescription: '',
    mainTasks: '',
    qualifications: '',
    preferredQualifications: '',
    idealCandidate: '',
    jobPeriod: '',
    jobRegion: '',
    deadline: '',
    careerType: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userApi.getUserInfo();
        console.log('사용자 정보:', userData);
        setUserInfo(userData);
        if (userData.companyName) {
          console.log('회사 정보:', {
            companyName: userData.companyName,
            companyAddress: userData.companyAddress
          });
          setFormData(prev => ({
            ...prev,
            companyName: userData.companyName,
            jobRegion: userData.companyAddress || ''
          }));
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        showToast.error('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    const fetchCompanies = async () => {
      try {
        const companiesData = await jobPostApi.getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('회사 목록 조회 실패:', error);
        showToast.error('회사 목록을 불러오는데 실패했습니다.');
      }
    };

    const fetchJobCodes = async () => {
      try {
        const jobCodesData = await jobPostApi.getJobCodes();
        setJobCodes(jobCodesData);
      } catch (error) {
        console.error('직종 코드 조회 실패:', error);
        showToast.error('직종 코드를 불러오는데 실패했습니다.');
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      showToast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetchUserInfo();
    fetchCompanies();
    fetchJobCodes();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.companyName || !formData.jobName || !formData.jobPostDescription || 
        !formData.mainTasks || !formData.qualifications || !formData.jobPeriod || 
        !formData.jobRegion || !formData.deadline || !formData.careerType) {
      showToast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // careerType이 선택되었는지 확인
      if (!formData.careerType) {
        showToast.error('경력 유형을 선택해주세요.');
        return;
      }

      const jobPostData = {
        ...formData,
        careerType: formData.careerType
      };

      console.log('Sending job post data:', jobPostData); // 디버깅을 위한 로그 추가

      const response = await jobPostApi.createJobPost(jobPostData, token);
      showToast.success('채용 공고가 등록되었습니다.');
      setTimeout(() => {
        navigate('/jobpost');
      }, 2000);
    } catch (error) {
      console.error('Error creating job post:', error);
      showToast.error('채용 공고 등록에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Toast />
      <Title>새 채용 공고 등록</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>회사명 *</Label>
          <Input
            type="text"
            name="companyName"
            value={formData.companyName}
            readOnly
          />
          {errors.companyName && <ErrorMessage>{errors.companyName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>근무지역</Label>
          <Input
            type="text"
            name="jobRegion"
            value={formData.jobRegion}
            readOnly
          />
          {errors.jobRegion && <ErrorMessage>{errors.jobRegion}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>직무명 *</Label>
          <Select
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            required
          >
            <option value="">직무 선택</option>
            {jobCodes.map(jobCode => (
              <option key={jobCode.jobCodeId} value={jobCode.jobName}>
                {jobCode.jobName}
              </option>
            ))}
          </Select>
          {errors.jobName && <ErrorMessage>{errors.jobName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>경력 유형 *</Label>
          <Select
            name="careerType"
            value={formData.careerType}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="NEWCOMER">신입</option>
            <option value="EXPERIENCED">경력</option>
            <option value="ANY">신입/경력</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>모집공고 설명</Label>
          <TextArea
            name="jobPostDescription"
            value={formData.jobPostDescription}
            onChange={handleChange}
          />
          {errors.jobPostDescription && <ErrorMessage>{errors.jobPostDescription}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>주요 업무</Label>
          <TextArea
            name="mainTasks"
            value={formData.mainTasks}
            onChange={handleChange}
          />
          {errors.mainTasks && <ErrorMessage>{errors.mainTasks}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>자격요건</Label>
          <TextArea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
          />
          {errors.qualifications && <ErrorMessage>{errors.qualifications}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>우대사항</Label>
          <TextArea
            name="preferredQualifications"
            value={formData.preferredQualifications}
            onChange={handleChange}
          />
          {errors.preferredQualifications && <ErrorMessage>{errors.preferredQualifications}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>인재상</Label>
          <TextArea
            name="idealCandidate"
            value={formData.idealCandidate}
            onChange={handleChange}
          />
          {errors.idealCandidate && <ErrorMessage>{errors.idealCandidate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>고용 기간</Label>
          <Input
            type="text"
            name="jobPeriod"
            value={formData.jobPeriod}
            onChange={handleChange}
            placeholder="예: 2년"
          />
          {errors.jobPeriod && <ErrorMessage>{errors.jobPeriod}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>마감일</Label>
          <Input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
          {errors.deadline && <ErrorMessage>{errors.deadline}</ErrorMessage>}
        </FormGroup>

        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '작성 완료'}
        </Button>
      </Form>
    </Container>
  );
}

export default NewJobPost; 