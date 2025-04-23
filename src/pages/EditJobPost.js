import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import jobPostApi from '../api/jobPostApi';
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
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
`;

function EditJobPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobName: '',
    jobCodeId: '',
    jobPostDescription: '',
    mainTasks: '',
    qualifications: '',
    preferredQualifications: '',
    idealCandidate: '',
    jobPeriod: '',
    jobRegion: '',
    deadline: ''
  });

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const data = await jobPostApi.getJobPost(id);
        setFormData({
          companyName: data.companyName,
          jobName: data.jobName,
          jobCodeId: data.jobCodeId || 1,
          jobPostDescription: data.jobPostDescription,
          mainTasks: data.mainTasks,
          qualifications: data.qualifications,
          preferredQualifications: data.preferredQualifications,
          idealCandidate: data.idealCandidate,
          jobPeriod: data.jobPeriod,
          jobRegion: data.jobRegion,
          deadline: data.deadline
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching job post:', error);
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        if (error.response?.status === 404) {
          setError('존재하지 않는 채용공고입니다.');
        } else if (error.response?.status === 403) {
          setError('권한이 없습니다. 다시 로그인해주세요.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deadline') {
      // 날짜를 ISO 형식으로 변환 (YYYY-MM-DD)
      const date = new Date(value);
      const isoDate = date.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        [name]: isoDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const updateData = {
        companyName: formData.companyName,
        jobName: formData.jobName,
        jobCodeId: formData.jobCodeId || 1,
        jobPostDescription: formData.jobPostDescription,
        mainTasks: formData.mainTasks,
        qualifications: formData.qualifications,
        preferredQualifications: formData.preferredQualifications,
        idealCandidate: formData.idealCandidate,
        jobPeriod: formData.jobPeriod,
        jobRegion: formData.jobRegion,
        deadline: formData.deadline
      };

      await jobPostApi.updateJobPost(id, updateData);
      showToast.success('채용공고가 수정되었습니다.');
      setTimeout(() => {
        navigate(`/jobpost/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating job post:', error);
      if (error.response?.status === 403) {
        showToast.error('권한이 없습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showToast.error('채용공고 수정 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <Toast />
        <div>{error}</div>
        <CancelButton onClick={() => navigate(`/job-posts/${id}`)}>돌아가기</CancelButton>
      </Container>
    );
  }

  return (
    <Container>
      <Toast />
      <Title>채용공고 수정</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>회사명</Label>
          <Input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>채용공고명</Label>
          <Input
            type="text"
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>모집공고 설명</Label>
          <TextArea
            name="jobPostDescription"
            value={formData.jobPostDescription}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>주요 업무</Label>
          <TextArea
            name="mainTasks"
            value={formData.mainTasks}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>자격요건</Label>
          <TextArea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>우대사항</Label>
          <TextArea
            name="preferredQualifications"
            value={formData.preferredQualifications}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>인재상</Label>
          <TextArea
            name="idealCandidate"
            value={formData.idealCandidate}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>고용 기간</Label>
          <Input
            type="text"
            name="jobPeriod"
            value={formData.jobPeriod}
            onChange={handleChange}
            required
            placeholder="예: 2년"
          />
        </FormGroup>

        <FormGroup>
          <Label>근무지역</Label>
          <Input
            type="text"
            name="jobRegion"
            value={formData.jobRegion}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>마감일</Label>
          <Input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit">수정하기</SubmitButton>
          <CancelButton type="button" onClick={() => navigate(`/job-posts/${id}`)}>취소</CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default EditJobPost; 