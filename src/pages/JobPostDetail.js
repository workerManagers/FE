import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import jobPostApi from '../api/jobPostApi';
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
  background-color: #28a745;
  color: white;
`;

function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchJobPost = async () => {
      try {
        const data = await jobPostApi.getJobPost(id);
        setJobPost(data);
        setError(null);
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

  const handleApply = () => {
    navigate(`/jobpost/${id}/apply`);
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

  return (
    <Container>
      <Toast />
      <Title>채용공고 상세</Title>
      
      <DetailSection>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>회사명</InfoLabel>
            <InfoValue>{jobPost.companyName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>직무명</InfoLabel>
            <InfoValue>{jobPost.jobName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>근무지역</InfoLabel>
            <InfoValue>{jobPost.jobRegion}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>고용 기간</InfoLabel>
            <InfoValue>{jobPost.jobPeriod}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>마감일</InfoLabel>
            <InfoValue>{formatDate(jobPost.deadline)}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </DetailSection>

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

      <ButtonGroup>
        <EditButton onClick={handleEdit}>수정</EditButton>
        <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
        <ApplyButton onClick={handleApply}>지원하기</ApplyButton>
        <BackButton onClick={() => navigate('/jobpost')}>목록으로 돌아가기</BackButton>
      </ButtonGroup>
    </Container>
  );
}

export default JobPostDetail; 