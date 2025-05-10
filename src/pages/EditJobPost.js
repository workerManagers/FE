import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi, userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 6.5rem 1.5rem 2.5rem 1.5rem;
  background: #f8f9fa;
  min-height: 80vh;
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.10);
  border: 2.5px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CompanyName = styled.span`
  font-size: 1.08rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 1.2rem;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.4rem 1.1rem;
  box-shadow: 0 1px 6px rgba(124,58,237,0.07);
  border: 1.2px solid #e5e7eb;
  display: inline-block;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
  margin-bottom: 2.2rem;
  width: 100%;
  background: #f4f5f7;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(180,180,200,0.09);
`;

const InfoItem = styled.div`
  background: #fff;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  padding: 1.2rem 1rem 1.1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
  min-width: 0;
  &:last-child {
    border-right: none;
    border-bottom: none;
  }
`;

const InfoLabel = styled.label`
  font-weight: 700;
  color: #222;
  font-size: 1.01rem;
  margin-bottom: 0.2rem;
`;

const InfoInput = styled.input`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.7rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 1.01rem;
  background: #f8fafc;
`;

const InfoSelect = styled.select`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.7rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 1.01rem;
  background: #f8fafc;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0px;
  width: 100%;
  margin-bottom: 2.2rem;
  background: #f4f5f7;
  border-radius: 0 0 14px 14px;
  overflow: hidden;
  border-left: 1.5px solid #e5e7eb;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(180,180,200,0.09);
`;

const DetailSection = styled.div`
  background-color: #fff;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  padding: 1.5rem 1.2rem 1.3rem 1.2rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  &:nth-child(2n) {
    border-right: none;
  }
  &:last-child {
    border-right: none;
    border-bottom: none;
    height: 100%;
    justify-content: flex-end;
  }
`;

const DetailLabel = styled.label`
  font-size: 1.01rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 0.4rem;
`;

const DetailTextarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.7rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 1.01rem;
  background: #f8fafc;
  min-height: 90px;
  resize: none;
`;

const FloatingButtonGroup = styled.div`
  display: flex;
  gap: 0.7rem;
  justify-content: flex-end;
  width: 100%;
  margin-top: 2.5rem;
`;

const FloatingButton = styled.button`
  padding: 0.8rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.97rem;
  font-weight: 700;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  box-shadow: 0 2px 12px rgba(180,180,200,0.13), 0 0 8px #fff;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, color 0.13s, transform 0.13s;
  letter-spacing: -0.2px;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #111;
    box-shadow: 0 4px 20px rgba(180,180,200,0.18), 0 0 12px #fff;
    transform: translateY(-2px) scale(1.03);
  }
  &:disabled {
    background: #e5e7eb;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
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
    deadline: '',
    careerType: 'ANY'
  });

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('현재 토큰:', token);
        if (!token) {
          setError('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        // 사용자 정보 먼저 확인
        const userData = await userApi.getUserInfo();
        if (userData.userType !== 'COMPANY') {
          setError('기업 회원만 접근할 수 있습니다.');
          navigate('/');
          return;
        }

        const data = await jobPostApi.getJobPost(id);
        
        // 본인 회사의 공고인지 확인
        if (userData.companyInfo?.companyName !== data.companyName) {
          setError('자신의 회사 공고만 수정할 수 있습니다.');
          navigate('/');
          return;
        }

        // 마감일 날짜 형식 변환 (YYYY-MM-DD)
        let deadlineDate = '';
        if (Array.isArray(data.deadline)) {
          const [year, month, day] = data.deadline;
          deadlineDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        } else if (data.deadline) {
          deadlineDate = data.deadline.split('T')[0];
        }

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
          deadline: deadlineDate,
          careerType: data.careerType || 'ANY'
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
        ...formData,
        careerType: formData.careerType
      };

      await jobPostApi.updateJobPost(id, updateData);
      showToast.success('채용공고가 수정되었습니다.');
      setTimeout(() => {
        navigate(`/jobpost/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating job post:', error);
      if (error.message === '토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.') {
        showToast.error(error.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showToast.error('채용공고 수정 중 오류가 발생했습니다.');
      }
    }
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 내일 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <Toast />
        <div>{error}</div>
        <FloatingButton type="button" onClick={() => navigate(`/job-posts/${id}`)}>돌아가기</FloatingButton>
      </Container>
    );
  }

  return (
    <Container>
      <Toast />
      <CompanyName>{formData.companyName}</CompanyName>
      <form onSubmit={handleSubmit} style={{width:'100%'}}>
        <InfoGrid>
          <InfoItem>
            <InfoLabel htmlFor="jobName">직무</InfoLabel>
            <InfoInput
              type="text"
              name="jobName"
              id="jobName"
              value={formData.jobName}
              onChange={handleChange}
              required
            />
          </InfoItem>
          <InfoItem>
            <InfoLabel htmlFor="jobRegion">근무지역</InfoLabel>
            <InfoInput
              type="text"
              name="jobRegion"
              id="jobRegion"
              value={formData.jobRegion}
              readOnly
            />
          </InfoItem>
          <InfoItem>
            <InfoLabel htmlFor="jobPeriod">고용기간</InfoLabel>
            <InfoInput
              type="text"
              name="jobPeriod"
              id="jobPeriod"
              value={formData.jobPeriod}
              onChange={handleChange}
              required
            />
          </InfoItem>
          <InfoItem>
            <InfoLabel htmlFor="careerType">경력 유형</InfoLabel>
            <InfoSelect
              name="careerType"
              id="careerType"
              value={formData.careerType}
              onChange={handleChange}
              required
            >
              <option value="NEWCOMER">신입</option>
              <option value="EXPERIENCED">경력</option>
              <option value="ANY">신입/경력</option>
            </InfoSelect>
          </InfoItem>
          <InfoItem>
            <InfoLabel htmlFor="deadline">마감일</InfoLabel>
            <InfoInput
              type="date"
              name="deadline"
              id="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={getTodayDate()}
              required
            />
          </InfoItem>
        </InfoGrid>
        <DetailGrid>
          <DetailSection>
            <DetailLabel htmlFor="jobPostDescription">모집공고 설명</DetailLabel>
            <DetailTextarea
              name="jobPostDescription"
              id="jobPostDescription"
              value={formData.jobPostDescription}
              onChange={handleChange}
              required
            />
          </DetailSection>
          <DetailSection>
            <DetailLabel htmlFor="mainTasks">주요 업무</DetailLabel>
            <DetailTextarea
              name="mainTasks"
              id="mainTasks"
              value={formData.mainTasks}
              onChange={handleChange}
              required
            />
          </DetailSection>
          <DetailSection>
            <DetailLabel htmlFor="qualifications">자격요건</DetailLabel>
            <DetailTextarea
              name="qualifications"
              id="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
            />
          </DetailSection>
          <DetailSection>
            <DetailLabel htmlFor="preferredQualifications">우대사항</DetailLabel>
            <DetailTextarea
              name="preferredQualifications"
              id="preferredQualifications"
              value={formData.preferredQualifications}
              onChange={handleChange}
            />
          </DetailSection>
          <DetailSection>
            <DetailLabel htmlFor="idealCandidate">인재상</DetailLabel>
            <DetailTextarea
              name="idealCandidate"
              id="idealCandidate"
              value={formData.idealCandidate}
              onChange={handleChange}
            />
          </DetailSection>
          <DetailSection>
            <FloatingButtonGroup>
              <FloatingButton type="submit">저장</FloatingButton>
              <FloatingButton type="button" onClick={() => navigate(`/jobpost/${id}`)}>취소</FloatingButton>
            </FloatingButtonGroup>
          </DetailSection>
        </DetailGrid>
      </form>
    </Container>
  );
}

export default EditJobPost; 