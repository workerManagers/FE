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
  font-size: 2.1rem;
  font-weight: 800;
  color: #181818;
  text-align: center;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
  margin: -0.5rem auto 2.0rem auto;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -12px;
    width: 60px;
    height: 3px;
    background: #2E7D32;
    border-radius: 2px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 190px;
  }
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
  margin-top: -1.2rem;
  transition: all 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const MatchingList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 1rem 0;
  width: 100%;
`;

const MatchingCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(46,125,50,0.04);
  border: 1.2px solid #e5e7eb;
  min-width: 400px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: box-shadow 0.13s cubic-bezier(.4,0,.2,1), transform 0.13s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  border-top: 4px solid #C6EBC5;
  &:hover {
    box-shadow: 0 6px 24px rgba(46,125,50,0.09);
    transform: translateY(-4px) scale(1.01);
    border-color: #b7e4c7;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  padding: 1.1rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid #f5f5f5;
`;

const CompanyName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #7bb661;
  margin-bottom: 0.2rem;
`;

const JobTitle = styled.h3`
  font-size: 1.22rem;
  font-weight: 800;
  color: #23272f;
  margin: 0 0 0.2rem 0;
  letter-spacing: -0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.1rem 1.5rem 1.1rem 1.5rem;
  gap: 0.5rem;
`;

const Score = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0.2rem 0 0.2rem 0;
`;

const ActionButton = styled.button`
  padding: 0.55rem 1.3rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.01rem;
  transition: all 0.15s;
  cursor: pointer;
  background: #fff;
  color: #2E7D32;
  border: 1.5px solid #C6EBC5;
  margin-top: 0.7rem;
  align-self: flex-end;
  box-shadow: none;
  &:hover {
    background: #e9fbe5;
    color: #1B5E20;
    border-color: #7bb661;
    transform: translateY(-2px) scale(1.03);
  }
  &:active {
    background: #e0f2e9;
    color: #388e3c;
    transform: scale(0.98);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const RefreshButton = styled.button`
  background: #2E7D32;
  color: white;
  border: none;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1.0rem;
  margin-bottom: 1.0rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(46,125,50,0.08);

  &:hover {
    background: #388e3c;
    transform: translateY(-2px) scale(1.03);
  }
  &:disabled {
    background: #c8e6c9;
    color: #fff;
    cursor: not-allowed;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const itemsPerPage = 4; // 2x2 그리드

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(46,125,50,0.08);
  z-index: 10;
  transition: all 0.2s ease;
  &:hover {
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(46,125,50,0.12);
    transform: translateY(-50%) scale(1.02);
  }
  &:active {
    transform: translateY(-50%) scale(0.98);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.prev { left: 10px; }
  &.next { right: 10px; }
  svg { width: 24px; height: 24px; color: #2E7D32; }
`;

const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.active ? '#2E7D32' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${props => props.active ? '#1B5E20' : '#cbd5e1'};
  }
`;

const CenteredContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GuideMessageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  width: 100%;
`;

const GuideMessage = styled.div`
  font-size: 1.13rem;
  color: #388e3c;
  font-weight: 600;
  text-align: center;
`;

const ResumePreviewContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  border-radius: 22px;
  box-shadow: 0 8px 40px rgba(30,41,59,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 900px;
  width: 95vw;
  margin: 0 auto 2.5rem auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ResumePreviewBody = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(30,41,59,0.07);
  padding: 1.5rem 1.2rem;
  font-size: 1.08rem;
  color: #22223b;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  max-width: 900px;
`;

const ResumeSectionDivider = styled.div`
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, #e0e7ef 0%, #cbd5e1 100%);
  margin: 1.1rem 0 1.1rem 0;
  border-radius: 2px;
`;

const JobMatchingPage = () => {
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [step, setStep] = useState('resume'); // 'resume' | 'matching'
  const navigate = useNavigate();
  const totalPages = Math.ceil(matchingResults.length / itemsPerPage);

  // 이력서 불러오기
  useEffect(() => {
    const fetchResume = async () => {
      setResumeLoading(true);
      try {
        const data = await resumeApi.getResume();
        setResume(data);
        setHasResume(!!data && !!data.resumeId);
      } catch (e) {
        setResume(null);
        setHasResume(false);
      }
      setResumeLoading(false);
    };
    fetchResume();
  }, []);

  // 매칭 결과 불러오기 (매칭하기 버튼 클릭 시만)
  const fetchMatchingResults = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }
      // 이력서 확인
      const resumeData = resume;
      if (!resumeData || !resumeData.resumeId) {
        setHasResume(false);
        setLoading(false);
        return;
      }
      setHasResume(true);
      // 새로운 매칭 결과 조회
      const results = await matchingApi.getJobMatchingScores(resumeData.resumeId);
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      setMatchingResults(sortedResults);
    } catch (error) {
      showToast.error('매칭 결과를 불러오는데 실패했습니다.');
      setMatchingResults([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 이력서 프리뷰 렌더 함수
  const renderResumePreview = () => {
    if (resumeLoading) {
      return <Loading message="이력서를 불러오는 중입니다..." />;
    }
    if (!resume) {
      return (
        <NoResumeMessage>
          <p>이력서를 먼저 등록해주세요.</p>
          <CreateResumeButton onClick={() => navigate('/resume')}>이력서 작성하기</CreateResumeButton>
        </NoResumeMessage>
      );
    }
    // 이력서 텍스트 파싱 (ResumePage.js 참고)
    const text = resume.resumeText || '';
    const gender = text.match(/성별:([^\n]*)/);
    const age = text.match(/나이:([^\n]*)/);
    const region = text.match(/원하는 근무지역:([^\n]*)/);
    const intro = text.match(/자기소개:([\s\S]*?)(?=직무 경험 및 관련 활동:|나의 성향:|$)/);
    const exp = text.match(/직무 경험 및 관련 활동:([\s\S]*?)(?=나의 성향:|$)/);
    const traits = text.match(/나의 성향:([\s\S]*)/);
    const sections = [
      { label: '성별', value: gender ? gender[1].trim() : '미입력' },
      { label: '나이', value: age ? age[1].trim() : '미입력' },
      { label: '원하는 근무지역', value: region ? region[1].trim() : '미입력' },
      { label: '자기소개', value: intro ? intro[1].trim() : '미입력' },
      { label: '직무 경험 및 관련 활동', value: exp ? exp[1].trim() : '미입력' },
      { label: '나의 성향', value: traits ? traits[1].trim() : '미입력' },
    ];
    return (
      <ResumePreviewContainer>
        <h2 style={{fontSize:'1.18rem', fontWeight:700, color:'#2563eb', marginBottom:'0.7rem'}}>내 이력서</h2>
        <ResumePreviewBody>
          <div style={{display:'flex', gap:'2.5rem', marginBottom:'1.1rem'}}>
            <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginRight:'0.5rem'}}>성별:</span>
            <span style={{color:'#222', fontSize:'1.04rem', marginRight:'1.5rem'}}>{sections[0].value}</span>
            <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginRight:'0.5rem'}}>나이:</span>
            <span style={{color:'#222', fontSize:'1.04rem', marginRight:'1.5rem'}}>{sections[1].value}</span>
            <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginRight:'0.5rem'}}>원하는 근무지역:</span>
            <span style={{color:'#222', fontSize:'1.04rem'}}>{sections[2].value}</span>
          </div>
          {[3,4,5].map((idx, i, arr) => (
            <React.Fragment key={sections[idx].label}>
              {(sections[idx].label === '자기소개' || sections[idx].label === '나의 성향' || (sections[idx].label === '직무 경험 및 관련 활동' && arr[i+1] && sections[arr[i+1]].label === '나의 성향')) && <ResumeSectionDivider />}
              <div style={{marginBottom:'0.7rem'}}>
                <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginRight:'0.5rem'}}>{sections[idx].label}:</span>
                <span style={{color:'#222', fontSize:'1.04rem'}}>{sections[idx].value}</span>
              </div>
            </React.Fragment>
          ))}
        </ResumePreviewBody>
        <div style={{display:'flex', gap:'1rem', marginTop:'2rem', justifyContent:'flex-end'}}>
          <CreateResumeButton style={{background:'#e5e7eb', color:'#222', fontWeight:600}} onClick={() => navigate('/resume')}>수정</CreateResumeButton>
          <CreateResumeButton style={{background:'#2E7D32', color:'#fff', fontWeight:700}} onClick={async () => { setStep('matching'); setCurrentPage(0); setLoading(true); await fetchMatchingResults(); }}>이 이력서로 매칭하기</CreateResumeButton>
        </div>
      </ResumePreviewContainer>
    );
  };

  // step === 'resume'이면 이력서 프리뷰만, 'matching'이면 매칭 결과
  if (step === 'resume') {
    return (
      <Container>
        {renderResumePreview()}
      </Container>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatchingResults(true);
    showToast.success('매칭 결과가 갱신되었습니다.');
  };

  const handleCardClick = (jobPostId) => {
    navigate(`/jobpost/${jobPostId}`);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const getCurrentPageResults = () => {
    const startIndex = currentPage * itemsPerPage;
    return matchingResults.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) {
    return (
      <Container>
        {hasResume && !loading && (
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <RefreshButton 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '매칭 중입니다.' : '매칭 다시하기'}
            </RefreshButton>
          </div>
        )}
        <Loading message="매칭 결과를 불러오는 중..." />
      </Container>
    );
  }

  return (
    <Container>
      <CenteredContent>
        <Title>채용공고 매칭</Title>
        <GuideMessageRow>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem'}}>
            <GuideMessage style={{textAlign: 'center'}}>
              {localStorage.getItem('userName')}님이 쓰신 이력서와 유사도가 높은 공고부터 보여드릴게요!
            </GuideMessage>
            {hasResume && !loading && (
              <RefreshButton 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? '매칭 중...' : '다시 매칭하기'}
              </RefreshButton>
            )}
          </div>
        </GuideMessageRow>
        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', padding: '0 70px' }}>
          <NavigationButton 
            className="prev" 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </NavigationButton>
          <MatchingList>
            {getCurrentPageResults().map((result) => (
              <MatchingCard
                key={result.jobPostId}
                onClick={() => handleCardClick(result.jobPostId)}
              >
                <CardHeader>
                  <CompanyName>{result.companyName}</CompanyName>
                  <JobTitle>{result.jobName}</JobTitle>
                </CardHeader>
                <CardBody>
                  <Score>매칭 점수 {result.matchingScore}점</Score>
                  <ActionButton onClick={e => { e.stopPropagation(); handleCardClick(result.jobPostId); }}>
                    상세보기
                  </ActionButton>
                </CardBody>
              </MatchingCard>
            ))}
          </MatchingList>
          <NavigationButton 
            className="next" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavigationButton>
        </div>
        <PageIndicator>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PageDot
              key={index}
              active={currentPage === index}
              onClick={() => handlePageClick(index)}
            />
          ))}
        </PageIndicator>
      </CenteredContent>
    </Container>
  );
};

export default JobMatchingPage; 