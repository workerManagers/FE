import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi, userApi, applicationApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import { IoArrowBack } from 'react-icons/io5';

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

const DetailSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DetailTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const DetailContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

const InfoValue = styled.span`
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const BackButton = styled(Button)`
  background-color: #6c757d;
  color: white;
`;

const ApplyButton = styled(Button)`
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Error = styled.div`
  text-align: center;
  padding: 2rem;
  color: red;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CompanyName = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const Content = styled.div`
  // Add any necessary styles for the content section
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const userType = localStorage.getItem('userType');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userApi.getUserInfo();
        console.log('현재 사용자 정보:', userData);
        setUserInfo(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const data = await jobPostApi.getJobPost(id);
        console.log('채용공고 정보:', data);
        setJobPost(data);
        setError(null);
        if (userType === 'INDIVIDUAL') {
          checkApplicationStatus();
        }
      } catch (error) {
        console.error('Error fetching job post:', error);
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        if (error.response?.status === 404) {
          setError('존재하지 않는 채용공고입니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [id]);

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationApi.getMyApplications();
      setHasApplied(applications.some(app => app.jobPostId === parseInt(id)));
    } catch (error) {
      console.error('지원 상태 확인 실패:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/jobpost/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await jobPostApi.deleteJobPost(id);
      showToast.success('채용공고가 삭제되었습니다.');
      setTimeout(() => {
        navigate('/jobpost');
      }, 2000);
    } catch (error) {
      console.error('Error deleting job post:', error);
      if (error.response?.status === 403) {
        showToast.error('권한이 없습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showToast.error('채용공고 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleApply = async () => {
    try {
      const response = await applicationApi.applyToJob(parseInt(id));
      setHasApplied(true);
      showToast.success(response.message || '채용공고 지원이 완료되었습니다.');
    } catch (error) {
      showToast.error(error.response?.data?.message || '지원에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <div>{error}</div>
        <BackButton onClick={() => navigate('/jobpost')}>목록으로 돌아가기</BackButton>
      </Container>
    );
  }

  if (!jobPost) {
    return null;
  }

  const isAuthor = userInfo && 
                   userInfo.userType === 'COMPANY' && 
                   userInfo.companyInfo && 
                   userInfo.companyInfo.companyName === jobPost.companyName;

  return (
    <Container>
      <Toast />
      <Header>
        <Title>{jobPost.jobName}</Title>
        <CompanyName>{jobPost.companyName}</CompanyName>
      </Header>

      <Content>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>근무지역</InfoLabel>
              <InfoValue>{jobPost.jobRegion}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>고용기간</InfoLabel>
              <InfoValue>{jobPost.jobPeriod}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>경력 유형</InfoLabel>
              <InfoValue>
                {jobPost.careerType === 'NEWCOMER' ? '신입' :
                 jobPost.careerType === 'EXPERIENCED' ? '경력' :
                 jobPost.careerType === 'ANY' ? '신입/경력' : jobPost.careerType}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>마감일</InfoLabel>
              <InfoValue>{formatDate(jobPost.deadline)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        <DetailSection>
          <DetailTitle>모집공고 설명</DetailTitle>
          <DetailContent>{jobPost.jobPostDescription}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>주요 업무</DetailTitle>
          <DetailContent>{jobPost.mainTasks}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>자격요건</DetailTitle>
          <DetailContent>{jobPost.qualifications}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>우대사항</DetailTitle>
          <DetailContent>{jobPost.preferredQualifications}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>인재상</DetailTitle>
          <DetailContent>{jobPost.idealCandidate}</DetailContent>
        </DetailSection>
      </Content>

      <ButtonGroup>
        {isAuthor ? (
          <>
            <EditButton onClick={handleEdit}>수정</EditButton>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
          </>
        ) : userInfo?.userType !== 'COMPANY' ? (
          <ApplyButton 
            onClick={handleApply} 
            disabled={hasApplied}
          >
            {hasApplied ? '지원완료' : '지원하기'}
          </ApplyButton>
        ) : null}
        <BackButton onClick={() => navigate('/jobpost')}>목록으로 돌아가기</BackButton>
      </ButtonGroup>
    </Container>
  );
}

export default JobPostDetail; 