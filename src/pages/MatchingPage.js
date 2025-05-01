import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jobPostApi, matchingApi, userApi, chatApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #181818;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const JobPostList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const JobPostCard = styled.div`
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

const JobTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const JobInfo = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0.3rem 0;
`;

const MatchingList = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const MatchingItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr 2fr auto auto;
  gap: 1rem;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ApplicantName = styled.span`
  font-weight: 600;
  color: #333;
`;

const ResumeText = styled.p`
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MatchingScore = styled.span`
  font-weight: 700;
  color: #007bff;
  font-size: 1.1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px); // 헤더 높이 등을 고려한 높이
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
`;

const UnauthorizedMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 2rem auto;
  max-width: 600px;

  h2 {
    color: #dc3545;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const NoJobPosts = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #666;
`;

const MatchingControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const SelectedJobInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0.5rem 0 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const RefreshButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ChatButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MatchingPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  
  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userApi.getUserInfo();
        setUserInfo(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        showToast.error('사용자 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 채용공고 목록 가져오기
  useEffect(() => {
    const fetchJobPosts = async () => {
      if (!userInfo) return;
      
      if (userInfo.userType !== 'COMPANY') {
        setLoading(false);
        return;
      }

      try {
        const response = await jobPostApi.getJobPosts();
        // 기업 사용자의 공고만 필터링
        const filteredPosts = response.filter(post => 
          post.companyName === userInfo.companyInfo.companyName
        );
        setJobPosts(filteredPosts);
      } catch (error) {
        console.error('채용공고 목록 조회 실패:', error);
        showToast.error('채용공고를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, [userInfo]);

  const handleJobPostClick = async (jobPost) => {
    setSelectedJobPost(jobPost);
    setLoading(true);

    try {
      const cacheKey = `matchingResults_${jobPost.jobPostId}`;
      const timestampKey = `matchingResultsTimestamp_${jobPost.jobPostId}`;
      
      const cachedResults = sessionStorage.getItem(cacheKey);
      const cachedTimestamp = sessionStorage.getItem(timestampKey);
      
      if (cachedResults && cachedTimestamp) {
        const now = new Date().getTime();
        const timestamp = parseInt(cachedTimestamp);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (now - timestamp < thirtyMinutes) {
          setMatchingResults(JSON.parse(cachedResults));
          setLoading(false);
          return;
        }
      }

      const results = await matchingApi.getMatchingScores(jobPost.jobPostId);
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      
      sessionStorage.setItem(cacheKey, JSON.stringify(sortedResults));
      sessionStorage.setItem(timestampKey, new Date().getTime().toString());
      
      setMatchingResults(sortedResults);
    } catch (error) {
      showToast.error('매칭 점수를 불러오는데 실패했습니다.');
      setMatchingResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshMatching = async () => {
    if (!selectedJobPost) return;
    
    setLoading(true);
    try {
      const results = await matchingApi.getMatchingScores(selectedJobPost.jobPostId);
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      
      const cacheKey = `matchingResults_${selectedJobPost.jobPostId}`;
      const timestampKey = `matchingResultsTimestamp_${selectedJobPost.jobPostId}`;
      
      sessionStorage.setItem(cacheKey, JSON.stringify(sortedResults));
      sessionStorage.setItem(timestampKey, new Date().getTime().toString());
      
      setMatchingResults(sortedResults);
      showToast.success('매칭 결과가 갱신되었습니다.');
    } catch (error) {
      showToast.error('매칭 점수를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = async (applicantName) => {
    try {
      // 사용자 이름으로 정보 조회
      const userData = await userApi.getUserByName(applicantName);
      if (!userData || !userData.userId) {
        showToast.error('사용자 정보를 찾을 수 없습니다.');
        return;
      }
      
      // 채팅방 생성
      const response = await chatApi.createChatRoom(userData.userId);
      navigate(`/chat/${response.id}`);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      showToast.error('채팅방 생성에 실패했습니다.');
    }
  };

  // 로딩 중일 때는 중앙에 로딩 메시지 표시
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
        </LoadingContainer>
      </Container>
    );
  }

  // 권한이 없는 경우 표시할 컴포넌트
  if (userInfo?.userType !== 'COMPANY') {
    return (
      <Container>
        <UnauthorizedMessage>
          <h2>접근 권한이 없습니다</h2>
          <p>이 페이지는 기업 회원만 접근할 수 있습니다.</p>
          <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </UnauthorizedMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>대체인력 매칭</Title>
      
      {jobPosts.length === 0 ? (
        <NoJobPosts>
          등록된 채용공고가 없습니다. 채용공고를 먼저 등록해주세요.
        </NoJobPosts>
      ) : (
        <>
          <JobPostList>
            {jobPosts.map((jobPost) => (
              <JobPostCard 
                key={jobPost.jobPostId} 
                onClick={() => handleJobPostClick(jobPost)}
                style={selectedJobPost?.jobPostId === jobPost.jobPostId ? 
                  { border: '2px solid #007bff' } : {}}
              >
                <JobTitle>{jobPost.jobName}</JobTitle>
                <JobInfo>{jobPost.companyName}</JobInfo>
                <JobInfo>지역: {jobPost.jobRegion}</JobInfo>
                <JobInfo>고용기간: {jobPost.jobPeriod}</JobInfo>
              </JobPostCard>
            ))}
          </JobPostList>

          {selectedJobPost && (
            <>
              <MatchingControls>
                <SelectedJobInfo>
                  <h3>{selectedJobPost.jobName}</h3>
                  <p>{selectedJobPost.companyName} | {selectedJobPost.jobRegion}</p>
                </SelectedJobInfo>
                <RefreshButton 
                  onClick={handleRefreshMatching}
                  disabled={loading}
                >
                  매칭 다시하기
                </RefreshButton>
              </MatchingControls>

              <MatchingList>
                <h2 style={{ marginBottom: '1.5rem' }}>매칭된 지원자 목록</h2>
                {loading ? (
                  <LoadingMessage>매칭 결과를 불러오는 중...</LoadingMessage>
                ) : matchingResults.length === 0 ? (
                  <p>매칭된 지원자가 없습니다.</p>
                ) : (
                  matchingResults.map((result, index) => (
                    <MatchingItem key={index}>
                      <ApplicantName>{result.applicantName}</ApplicantName>
                      <ResumeText>{result.resumeText}</ResumeText>
                      <MatchingScore>{result.matchingScore}점</MatchingScore>
                      <ChatButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatClick(result.applicantName);
                        }}
                      >
                        1:1 채팅
                      </ChatButton>
                    </MatchingItem>
                  ))
                )}
              </MatchingList>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default MatchingPage; 