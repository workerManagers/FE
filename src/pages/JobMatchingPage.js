import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { matchingApi, resumeApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Loading from '../components/common/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1.5rem 2.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #181818;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const NoResumeMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CreateResumeButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const MatchingList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MatchingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CompanyName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const JobName = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0.3rem 0;
`;

const Score = styled.div`
  font-weight: 700;
  color: #007bff;
  font-size: 1.2rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const RefreshButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const JobMatchingPage = () => {
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchMatchingResults = async (forceRefresh = false) => {
    try {
      setLoading(true);
      // 세션 스토리지에서 캐시된 결과 확인
      const cachedResults = sessionStorage.getItem('matchingResults');
      const cachedTimestamp = sessionStorage.getItem('matchingResultsTimestamp');
      
      // 강제 새로고침이 아니고, 캐시가 있고 30분이 지나지 않았다면 캐시된 결과 사용
      if (!forceRefresh && cachedResults && cachedTimestamp) {
        const now = new Date().getTime();
        const timestamp = parseInt(cachedTimestamp);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (now - timestamp < thirtyMinutes) {
          setMatchingResults(JSON.parse(cachedResults));
          setHasResume(true);
          setLoading(false);
          return;
        }
      }

      // 이력서 확인
      const resumeData = await resumeApi.getResume();
      if (!resumeData || !resumeData.resumeId) {
        setHasResume(false);
        setLoading(false);
        return;
      }
      
      setHasResume(true);
      
      // 새로운 매칭 결과 조회
      const results = await matchingApi.getJobMatchingScores(resumeData.resumeId);
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      
      // 결과를 세션 스토리지에 캐시
      sessionStorage.setItem('matchingResults', JSON.stringify(sortedResults));
      sessionStorage.setItem('matchingResultsTimestamp', new Date().getTime().toString());
      
      setMatchingResults(sortedResults);
    } catch (error) {
      console.error('매칭 결과 조회 실패:', error);
      showToast.error('매칭 결과를 불러오는데 실패했습니다.');
      setMatchingResults([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatchingResults();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatchingResults(true);
    showToast.success('매칭 결과가 갱신되었습니다.');
  };

  const handleCardClick = (jobPostId) => {
    navigate(`/jobpost/${jobPostId}`);
  };

  const handleCreateResume = () => {
    navigate('/resume');
  };

  if (loading) {
    return (
      <Container>
        <TitleContainer>
          <Title>직무 매칭</Title>
          {hasResume && !loading && (
            <RefreshButton 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '매칭 중입니다.' : '매칭 다시하기'}
            </RefreshButton>
          )}
        </TitleContainer>
        <Loading message="매칭 결과를 불러오는 중..." />
      </Container>
    );
  }

  if (!hasResume) {
    return (
      <Container>
        <TitleContainer>
          <Title>직무 매칭</Title>
          {hasResume && !loading && (
            <RefreshButton 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '매칭 중...' : '매칭 다시하기'}
            </RefreshButton>
          )}
        </TitleContainer>
        <NoResumeMessage>
          <p>이력서를 먼저 등록해주세요.</p>
          <CreateResumeButton onClick={handleCreateResume}>
            이력서 작성하기
          </CreateResumeButton>
        </NoResumeMessage>
      </Container>
    );
  }

  return (
    <Container>
      <TitleContainer>
        <Title>직무 매칭</Title>
        {hasResume && !loading && (
          <RefreshButton 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '매칭 중...' : '매칭 다시하기'}
          </RefreshButton>
        )}
      </TitleContainer>
      <MatchingList>
        {matchingResults.map((result) => (
          <MatchingCard
            key={result.jobPostId}
            onClick={() => handleCardClick(result.jobPostId)}
          >
            <CompanyName>{result.companyName}</CompanyName>
            <JobName>{result.jobName}</JobName>
            <Score>
              <span>매칭 점수</span>
              <span>{result.matchingScore}점</span>
            </Score>
          </MatchingCard>
        ))}
      </MatchingList>
    </Container>
  );
};

export default JobMatchingPage; 