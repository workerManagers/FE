import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jobPostApi, matchingApi, userApi, chatApi, applicationApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 7rem 1.5rem 2.5rem 1.5rem;
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
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#007bff' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#dee2e6'};
  }
`;

const ListTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchingItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 150px 2fr 100px 100px 100px;
  gap: 1rem;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ApplicantName = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 100px;
`;

const ResumeText = styled.p`
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MatchingScore = styled.span`
  font-weight: 700;
  color: #007bff;
  font-size: 1.1rem;
  text-align: center;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => props.isApplied ? '#28a745' : '#6c757d'};
  color: white;
  text-align: center;
  width: fit-content;
  justify-self: center;
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

const DetailButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  width: fit-content;
  justify-self: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #007bff;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ApplicantInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2.5rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
`;

const InfoTitle = styled.h3`
  font-size: 1.3rem;
  color: #007bff;
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1em;
    background-color: #007bff;
    margin-right: 0.5rem;
    border-radius: 2px;
  }
`;

const InfoContent = styled.div`
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;

  strong {
    color: #007bff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.primary ? `
    background-color: #007bff;
    color: white;
    
    &:hover {
      background-color: #0056b3;
    }
  ` : `
    background-color: #e9ecef;
    color: #495057;
    
    &:hover {
      background-color: #dee2e6;
    }
  `}
`;

const MatchingPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('matching'); // 'matching' or 'applicants'
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // 매칭 결과 가져오기
      const cacheKey = `matchingResults_${jobPost.jobPostId}`;
      const timestampKey = `matchingResultsTimestamp_${jobPost.jobPostId}`;
      
      const cachedResults = sessionStorage.getItem(cacheKey);
      const cachedTimestamp = sessionStorage.getItem(timestampKey);
      
      if (cachedResults && cachedTimestamp) {
        const now = new Date().getTime();
        const timestamp = parseInt(cachedTimestamp);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (now - timestamp < thirtyMinutes) {
          const results = JSON.parse(cachedResults);
          console.log('캐시된 AI 매칭 결과:', results);
          setMatchingResults(results);
        } else {
          // 매칭 허용된 이력서들에 대해서만 매칭 수행
          const results = await matchingApi.getMatchingScores(jobPost.jobPostId);
          console.log('새로운 AI 매칭 결과:', results);
          sessionStorage.setItem(cacheKey, JSON.stringify(results));
          sessionStorage.setItem(timestampKey, new Date().getTime().toString());
          setMatchingResults(results);
        }
      } else {
        // 매칭 허용된 이력서들에 대해서만 매칭 수행
        const results = await matchingApi.getMatchingScores(jobPost.jobPostId);
        console.log('새로운 AI 매칭 결과:', results);
        sessionStorage.setItem(cacheKey, JSON.stringify(results));
        sessionStorage.setItem(timestampKey, new Date().getTime().toString());
        setMatchingResults(results);
      }

      // 지원자 목록 가져오기
      const applicantsData = await applicationApi.getJobPostApplications(jobPost.jobPostId);
      console.log('지원자 목록:', applicantsData);
      setApplicants(applicantsData);
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      showToast.error('데이터를 불러오는데 실패했습니다.');
      setMatchingResults([]);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshMatching = async () => {
    if (!selectedJobPost) return;
    
    setLoading(true);
    try {
      // 회사 매칭 수행
      const results = await matchingApi.getMatchingScores(selectedJobPost.jobPostId);
      console.log('새로고침된 AI 매칭 결과:', results);
      
      const cacheKey = `matchingResults_${selectedJobPost.jobPostId}`;
      const timestampKey = `matchingResultsTimestamp_${selectedJobPost.jobPostId}`;
      
      sessionStorage.setItem(cacheKey, JSON.stringify(results));
      sessionStorage.setItem(timestampKey, new Date().getTime().toString());
      
      setMatchingResults(results);
      showToast.success('매칭 결과가 갱신되었습니다.');
    } catch (error) {
      console.error('매칭 점수 조회 실패:', error);
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

  const parseResumeText = (text) => {
    const sections = {};
    const matches = {
      gender: text.match(/성별:([^\n]*)/),
      age: text.match(/나이:([^\n]*)/),
      desiredRegion: text.match(/원하는 근무지역:([^\n]*)/),
      introduction: text.match(/자기소개:([^\n]*)/),
      workExperience: text.match(/직무 경험 및 관련 활동:([^\n]*)/),
      traits: text.match(/나의 성향:([^\n]*)/)
    };

    for (const [key, match] of Object.entries(matches)) {
      sections[key] = match ? match[1].trim() : '';
    }

    return sections;
  };

  const handleDetailView = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  // 로딩 중일 때는 중앙에 로딩 메시지 표시
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>
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

              <TabContainer>
                <Tab 
                  active={activeTab === 'matching'} 
                  onClick={() => setActiveTab('matching')}
                >
                  AI 매칭 결과
                </Tab>
                <Tab 
                  active={activeTab === 'applicants'} 
                  onClick={() => setActiveTab('applicants')}
                >
                  지원자 목록
                </Tab>
              </TabContainer>

              <MatchingList>
                <ListTitle>
                  {activeTab === 'matching' ? 'AI 매칭된 인재 목록' : '지원자 목록'}
                  <span style={{ fontSize: '1rem', color: '#666' }}>
                    {activeTab === 'matching' 
                      ? `총 ${matchingResults.length}명의 매칭된 인재`
                      : `총 ${applicants.length}명의 지원자`}
                  </span>
                </ListTitle>
                
                {loading ? (
                  <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
                ) : activeTab === 'matching' ? (
                  matchingResults.length === 0 ? (
                    <p>매칭된 인재가 없습니다.</p>
                  ) : (
                    matchingResults.map((result, index) => {
                      const isApplied = applicants.some(
                        applicant => applicant.userName === result.applicantName
                      );
                      const resumeSections = parseResumeText(result.resumeText);
                      return (
                        <MatchingItem key={result.resumeId}>
                          <ApplicantName>{result.applicantName}</ApplicantName>
                          <ResumeText>
                            성별: {resumeSections.gender} | 
                            나이: {resumeSections.age} | 
                            희망지역: {resumeSections.desiredRegion || '미지정'}
                          </ResumeText>
                          <MatchingScore>{(result.matchingScore || 0).toFixed(1)}점</MatchingScore>
                          <DetailButton onClick={() => handleDetailView(result)}>
                            자세히보기
                          </DetailButton>
                          <StatusBadge isApplied={isApplied}>
                            {isApplied ? '지원완료' : '미지원'}
                          </StatusBadge>
                        </MatchingItem>
                      );
                    })
                  )
                ) : (
                  applicants.length === 0 ? (
                    <p>아직 지원자가 없습니다.</p>
                  ) : (
                    applicants.map((applicant, index) => (
                      <MatchingItem key={index}>
                        <ApplicantName>{applicant.userName}</ApplicantName>
                        <ResumeText>{applicant.resumeText}</ResumeText>
                        <div style={{ color: '#28a745', fontWeight: 'bold' }}>지원완료</div>
                        <ChatButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatClick(applicant.userName);
                          }}
                        >
                          1:1 채팅
                        </ChatButton>
                      </MatchingItem>
                    ))
                  )
                )}
              </MatchingList>
            </>
          )}
        </>
      )}

      {isModalOpen && selectedApplicant && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>이력서 상세보기</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ApplicantInfo>
              <InfoSection>
                <InfoTitle>기본 정보</InfoTitle>
                <InfoContent>
                  <p><strong>이름:</strong> {selectedApplicant.applicantName}</p>
                  <p><strong>성별:</strong> {parseResumeText(selectedApplicant.resumeText).gender}</p>
                  <p><strong>나이:</strong> {parseResumeText(selectedApplicant.resumeText).age}</p>
                  <p><strong>희망지역:</strong> {parseResumeText(selectedApplicant.resumeText).desiredRegion || '미지정'}</p>
                </InfoContent>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>자기소개</InfoTitle>
                <InfoContent>
                  {parseResumeText(selectedApplicant.resumeText).introduction}
                </InfoContent>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>직무 경험 및 관련 활동</InfoTitle>
                <InfoContent>
                  {parseResumeText(selectedApplicant.resumeText).workExperience}
                </InfoContent>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>성향</InfoTitle>
                <InfoContent>
                  {parseResumeText(selectedApplicant.resumeText).traits}
                </InfoContent>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>매칭 점수</InfoTitle>
                <InfoContent>
                  <strong style={{ fontSize: '1.4rem' }}>
                    {(selectedApplicant.matchingScore || 0).toFixed(1)}점
                  </strong>
                </InfoContent>
              </InfoSection>
              
              <ButtonGroup>
                <ActionButton 
                  primary
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChatClick(selectedApplicant.applicantName);
                  }}
                >
                  1:1 채팅하기
                </ActionButton>
                <ActionButton onClick={closeModal}>
                  닫기
                </ActionButton>
              </ButtonGroup>
            </ApplicantInfo>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default MatchingPage; 