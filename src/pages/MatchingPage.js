import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jobPostApi, matchingApi, userApi, chatApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loading from '../components/common/Loading';

const Container = styled.div`
  padding: 11rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.h1`
  color: #000000;
  font-size: 2.2rem;
  text-align: center;
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 90px;
    height: 3px;
    background-color: #000000;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 220px;
  }
`;

const Description = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.0rem;
  margin-top: 2.0rem;
  line-height: 1.6;
`;

const JobPostList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.8rem;
  margin-bottom: 2.5rem;
`;

const JobPostCard = styled.div`
  background: #f4f7fb;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.13);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 0.1px solid #b3c6e0;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.18);
    background: #eaf3fb;
  }

  ${props => props.selected && `
    box-shadow: 0 0 0 4px #3b82f6, 0 16px 48px rgba(0,0,0,0.22);
    background: #eaf3fb;
    border-color: #3b82f6;
    z-index: 2;
  `}
`;

const JobTitle = styled.h3`
  font-size: 1.3rem;
  color: #1e293b;
  margin-bottom: 0.8rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  position: relative;
  padding-bottom: 0.5rem;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background: #e2e8f0;
    transition: width 0.3s ease;
  }

  ${JobPostCard}:hover & {
    &:after {
      width: 100px;
    }
  }
`;

const JobInfo = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "•";
    color: #94a3b8;
  }
`;

const MatchingLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3.5rem;
  justify-content: ${props => props.showMatching ? 'flex-start' : 'center'};
  align-items: flex-start;
  width: 100%;
  margin: 0 auto 2.5rem auto;
  @media (max-width: 1000px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

const LeftContainer = styled.div`
  flex: 0 0 ${props => props.showMatching ? '400px' : '700px'};
  max-width: ${props => props.showMatching ? '420px' : '700px'};
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-left: ${props => props.showMatching ? '1rem' : '0'};
  @media (max-width: 1000px) {
    width: 100%;
    max-width: 100%;
    padding-left: 0;
  }
`;

const RightContainer = styled.div`
  flex: 1 1 auto;
  min-width: ${props => props.showMatching ? '600px' : '0'};
  background: rgba(255,255,255,0.97);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  border: 2.5px solid #2563eb22;
  padding: 2.2rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 1000px) {
    min-width: 100%;
    width: 100%;
  }
`;

const JobPostListContainer = styled.div`
  flex: 1 1 340px;
  min-width: 320px;
  max-width: 420px;
  @media (max-width: 1000px) {
    max-width: 100%;
    width: 100%;
  }
`;

const MatchingResultsContainer = styled.div`
  flex: 1 1 340px;
  min-width: 320px;
  max-width: 420px;
  background: rgba(255,255,255,0.97);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  border: 2.5px solid #2563eb22;
  padding: 2.2rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 1000px) {
    max-width: 100%;
    width: 100%;
  }
`;

const JobDetailCard = styled.div`
  flex: 1 1 340px;
  min-width: 320px;
  max-width: 420px;
  background: rgba(255,255,255,0.97);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  border: 2.5px solid #2563eb22;
  padding: 2.2rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 1000px) {
    max-width: 100%;
    width: 100%;
  }
`;

const JobDetailTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #22223b;
  margin-bottom: 0.7rem;
`;

const JobDetailList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: #444;
  font-size: 1.08rem;
  line-height: 1.7;
  li {
    margin-bottom: 0.5rem;
    &:last-child { margin-bottom: 0; }
  }
`;

const MatchingList = styled.div`
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem 2rem 2rem 2rem;
  box-shadow: 0 12px 40px 0 rgba(0,0,0,0.18), inset 0 0 32px 0 rgba(0,0,0,0.08);
  border: 3px solid rgba(0,0,0,0.13);
  max-width: 900px;
  margin: 0 auto 2.5rem auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    border: 3px solid rgba(0,0,0,0.18);
    box-shadow: 0 16px 56px 0 rgba(0,0,0,0.22), inset 0 0 32px 0 rgba(0,0,0,0.13);
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 24px 24px 0 0;
  }
`;

const MatchingItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 2fr 2.5fr auto;
  gap: 1.2rem;
  align-items: center;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ResumeMeta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2.0rem;
  font-size: 1.02rem;
  color: #23272f;
  margin-bottom: 0.2rem;
`;

const ResumeMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  min-width: 210px;
  max-width: 400px;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
`;

const ResumeText = styled.p`
  color: #64748b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  width: 100%;
`;

const ApplicantName = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 1.1rem;
  position: relative;
  padding-left: 1.2rem;
  display: inline-block;
  white-space: nowrap;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
  }
`;

const MatchingScore = styled.span`
  font-weight: 800;
  color: #3b3b3b;
  font-size: 1.2rem;
  padding: 0.5rem 1.1rem;
  background: #e6eaf3;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-right: 0.7rem;
  border: none;
`;

const UnauthorizedMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin: 2rem auto;
  max-width: 600px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #f87171);
  }

  h2 {
    color: #ef4444;
    margin-bottom: 1.2rem;
    font-size: 1.8rem;
    font-weight: 700;
  }

  p {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  button {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }
`;

const NoJobPosts = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  color: #64748b;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #e6eaf3 0%, #cfd8dc 100%);
  color: #23272f;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    background: #cfd8dc;
    color: #23272f;
  }
  &:disabled {
    background: #e5e7eb;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ChatButton = styled.button`
  background: linear-gradient(135deg, #e6eaf3 0%, #cfd8dc 100%);
  color: #23272f;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-right: 0.7rem;
  &:hover {
    background: #cfd8dc;
    color: #23272f;
  }
  &:disabled {
    background: #e5e7eb;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const MatchingItemButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  min-width: 120px;
  flex-wrap: nowrap;
`;

const ResumeModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30,41,59,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
`;

const ResumeModalContent = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  border-radius: 22px;
  box-shadow: 0 8px 40px rgba(30,41,59,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 600px;
  width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ResumeModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
`;

const ResumeModalApplicant = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #3b82f6;
  background: #e0e7ef;
  border-radius: 8px;
  padding: 0.3rem 1rem;
  margin-right: 0.7rem;
  box-shadow: 0 1px 6px rgba(59,130,246,0.07);
`;

const ResumeModalScore = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #2563eb;
  background: #e0e7ef;
  border-radius: 8px;
  padding: 0.3rem 0.9rem;
  margin-right: 0.7rem;
  box-shadow: 0 1px 6px rgba(59,130,246,0.07);
`;

const ResumeModalClose = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.18s;
  &:hover { color: #222; }
`;

const ResumeModalBody = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(30,41,59,0.07);
  padding: 1.5rem 1.2rem;
  font-size: 1.08rem;
  color: #22223b;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 55vh;
  overflow-y: auto;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  transition: box-shadow 0.2s;
  &::-webkit-scrollbar {
    width: 8px;
    background: #f1f5f9;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
`;

const ResumeSectionDivider = styled.div`
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, #e0e7ef 0%, #cbd5e1 100%);
  margin: 1.1rem 0 1.1rem 0;
  border-radius: 2px;
`;

const JobSelectContainer = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 24px;
  max-width: 500px;
  margin: 0 auto 2.5rem auto;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
  border: 2px solid rgba(0,0,0,0.08);
  padding: 2.2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px 0 rgba(0,0,0,0.15);
  }
`;

const JobSelectTitle = styled.h2`
  font-size: 1.18rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 1.2rem;
`;

const JobNameList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const JobNameItem = styled.li`
  background: #f4f7fb;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  margin-bottom: 0.7rem;
  font-size: 1.08rem;
  color: #23272f;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 2px solid transparent;
  transition: all 0.2s;
  &:hover {
    background: #eaf3fb;
    border-color: #3b82f6;
    color: #2563eb;
  }
  &.selected {
    background: #eaf3fb;
    border-color: #3b82f6;
    color: #2563eb;
  }
`;

const MatchingForm = styled.form`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border: 3px solid rgba(0, 0, 0, 0.13);
  border-radius: 24px;
  max-width: 500px;
  margin: 0 auto 2.5rem auto;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 0 32px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const MatchingFormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const MatchingLabel = styled.label`
  font-weight: 600;
  color: #23272f;
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
`;

const MatchingSelect = styled.select`
  width: 100%;
  padding: 0.9rem;
  border: 2px solid rgba(0, 0, 0, 0.13);
  border-radius: 12px;
  font-size: 1.08rem;
  background: #f8fafc;
  transition: all 0.2s ease;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
  }
`;

const MatchingButton = styled(motion.button)`
  width: 200px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  margin: 0 auto;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.8);
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #e6eaf3 0%, #cfd8dc 100%);
  color: #23272f;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    background: #cfd8dc;
    color: #23272f;
  }
`;

const MatchingPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [resumeModal, setResumeModal] = useState({ open: false, resumeText: '', applicantName: '', matchingScore: null });
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [pendingMatch, setPendingMatch] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
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
      const results = await matchingApi.getMatchingScores(jobPost.jobPostId);
      
      if (!results || !Array.isArray(results)) {
        throw new Error('매칭 결과가 올바르지 않습니다.');
      }

      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      
      setMatchingResults(sortedResults);
      setShowMatching(true);
    } catch (error) {
      console.error('매칭 점수 조회 실패:', error);
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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      const results = await matchingApi.getMatchingScores(selectedJobPost.jobPostId);
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      
      const cacheKey = `matchingResults_${selectedJobPost.jobPostId}_${userId}`;
      const timestampKey = `matchingResultsTimestamp_${selectedJobPost.jobPostId}_${userId}`;
      
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

  function parseResumeSections(resumeText) {
    if (!resumeText) return [];
    // 각 섹션별로 정규식으로 추출
    const gender = resumeText.match(/성별:([^\n]*)/);
    const age = resumeText.match(/나이:([^\n]*)/);
    const region = resumeText.match(/원하는 근무지역:([^\n]*)/);
    const intro = resumeText.match(/자기소개:([\s\S]*?)(?=직무 경험 및 관련 활동:|나의 성향:|$)/);
    const exp = resumeText.match(/직무 경험 및 관련 활동:([\s\S]*?)(?=나의 성향:|$)/);
    const traits = resumeText.match(/나의 성향:([\s\S]*)/);
    return [
      gender ? { label: '성별', value: gender[1].trim() } : null,
      age ? { label: '나이', value: age[1].trim() } : null,
      region ? { label: '원하는 근무지역', value: region[1].trim() } : null,
      intro ? { label: '자기소개', value: intro[1].trim() } : null,
      exp ? { label: '직무 경험 및 관련 활동', value: exp[1].trim() } : null,
      traits ? { label: '나의 성향', value: traits[1].trim() } : null,
    ].filter(Boolean);
  }

  // 로딩 중일 때는 중앙에 로딩 메시지 표시
  if (loading) {
    return (
      <Container>
        <Loading message="데이터를 불러오는 중입니다." />
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
      {jobPosts.length === 0 ? (
        <NoJobPosts>
          등록된 채용공고가 없습니다. 채용공고를 먼저 등록해주세요.
        </NoJobPosts>
      ) : (
        <MatchingLayout showMatching={showMatching}>
          <LeftContainer showMatching={showMatching}>
            <Title>대체인력 매칭</Title>
            <Description>
              산재로 인해 발생한 인력 공백, 급구당이 빠르게 해결해드립니다!<br />
              채용공고를 선택하면, 우리 회사에 꼭 맞는 대체인력을 자동으로 추천해드려요.<br />
              지원자 이력서를 한눈에 비교하고, 1:1 채팅으로 바로 소통해보세요.
            </Description>
            <MatchingForm
              onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedJobId) {
                  return;
                }
                setPendingMatch(true);
                const job = jobPosts.find(j => {
                  return j.jobPostId === parseInt(selectedJobId);
                });
                if (job) {
                  await handleJobPostClick(job);
                  setSelectedJob(job);
                  setShowMatching(true);
                } else {
                  showToast.error('선택한 공고를 찾을 수 없습니다.');
                }
                setPendingMatch(false);
              }}
            >
              <MatchingFormGroup>
                <MatchingLabel htmlFor="jobSelect">공고를 선택하세요</MatchingLabel>
                <MatchingSelect
                  id="jobSelect"
                  value={selectedJobId}
                  onChange={e => { setSelectedJobId(e.target.value); setShowMatching(false); }}
                  required
                >
                  <option value="">공고 선택</option>
                  {jobPosts.map(jobPost => (
                    <option key={jobPost.jobPostId} value={jobPost.jobPostId}>
                      {jobPost.jobName}
                    </option>
                  ))}
                </MatchingSelect>
              </MatchingFormGroup>
              <MatchingButton
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                매칭하기
              </MatchingButton>
            </MatchingForm>
          </LeftContainer>

          {showMatching && selectedJob && (
            <RightContainer showMatching={showMatching}>
              <RefreshButton 
                onClick={async () => {
                  setPendingMatch(true);
                  await handleJobPostClick(selectedJob);
                  setPendingMatch(false);
                }}
                disabled={pendingMatch}
              >
                다시 매칭
              </RefreshButton>
              <h2 style={{ marginBottom: '1.5rem' }}>매칭된 지원자 목록</h2>
              <div style={{marginBottom:'1.2rem', color:'#23272f', fontWeight:600, fontSize:'1.08rem'}}>
                {selectedJob.jobName} | {selectedJob.companyName} | {selectedJob.jobRegion} | {selectedJob.jobPeriod}
              </div>
              {pendingMatch || loading ? (
                <Loading message="매칭 결과를 불러오는 중입니다." />
              ) : matchingResults.length === 0 ? (
                <p>매칭된 지원자가 없습니다.</p>
              ) : (
                matchingResults.map((result, index) => {
                  const gender = result.resumeText.match(/성별:([^\n]*)/);
                  const age = result.resumeText.match(/나이:([^\n]*)/);
                  const region = result.resumeText.match(/원하는 근무지역:([^\n]*)/);
                  const regionValue = region ? region[1].trim() : '';
                  return (
                    <MatchingItem
                      key={index}
                      onClick={() => setResumeModal({ open: true, resumeText: result.resumeText, applicantName: result.applicantName, matchingScore: result.matchingScore })}
                    >
                      <ResumeMeta>
                        <ApplicantName
                          style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: 0 }}
                        >
                          {result.applicantName}
                        </ApplicantName>
                        <ResumeMetaItem>
                          <span>성별: {gender ? gender[1].trim() : '-'}</span>
                          <span>나이: {age ? age[1].trim() : '-'}</span>
                          <span>원하는 근무지역: {regionValue === '' ? '상관 없음' : regionValue}</span>
                        </ResumeMetaItem>
                      </ResumeMeta>
                      <div />
                      <MatchingItemButtonGroup>
                        <MatchingScore>{result.matchingScore}점</MatchingScore>
                        <ChatButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatClick(result.applicantName);
                          }}
                        >
                          채팅
                        </ChatButton>
                      </MatchingItemButtonGroup>
                    </MatchingItem>
                  );
                })
              )}
            </RightContainer>
          )}
        </MatchingLayout>
      )}
      {resumeModal.open && (
        <ResumeModalOverlay onClick={() => setResumeModal({ open: false, resumeText: '', applicantName: '', matchingScore: null })}>
          <ResumeModalContent onClick={e => e.stopPropagation()}>
            <ResumeModalHeader>
              <ResumeModalApplicant>{resumeModal.applicantName}님의 이력서</ResumeModalApplicant>
              <ResumeModalClose onClick={() => setResumeModal({ open: false, resumeText: '', applicantName: '', matchingScore: null })}>&times;</ResumeModalClose>
            </ResumeModalHeader>
            <ResumeModalBody>
              {parseResumeSections(resumeModal.resumeText).map((section, idx, arr) => (
                <React.Fragment key={section.label}>
                  {(section.label === '나이' || section.label === '원하는 근무지역' || section.label === '자기소개' || section.label === '나의 성향' || (section.label === '직무 경험 및 관련 활동' && arr[idx+1] && arr[idx+1].label === '나의 성향')) && <ResumeSectionDivider />}
                  <div style={{marginBottom:'0.7rem'}}>
                    <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginRight:'0.5rem'}}>{section.label}:</span>
                    <span style={{color:'#222', fontSize:'1.04rem'}}>{section.value}</span>
                  </div>
                </React.Fragment>
              ))}
            </ResumeModalBody>
          </ResumeModalContent>
        </ResumeModalOverlay>
      )}
    </Container>
  );
};

export default MatchingPage; 