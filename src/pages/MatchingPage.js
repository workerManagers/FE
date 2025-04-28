import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jobPostApi, matchingApi } from '../services/api';
import { showToast } from '../components/common/Toast';

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
  grid-template-columns: 1fr 2fr auto;
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

const MatchingPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await jobPostApi.getJobPosts();
        setJobPosts(response);
      } catch (error) {
        showToast.error('채용공고 목록을 불러오는데 실패했습니다.');
      }
    };

    fetchJobPosts();
  }, []);

  const handleJobPostClick = async (jobPost) => {
    setSelectedJobPost(jobPost);
    setLoading(true);
    try {
      const results = await matchingApi.getMatchingScores(jobPost.jobPostId);
      // 매칭 점수 높은 순으로 정렬
      const sortedResults = results.sort((a, b) => b.matchingScore - a.matchingScore);
      setMatchingResults(sortedResults);
    } catch (error) {
      showToast.error('매칭 점수를 불러오는데 실패했습니다.');
      setMatchingResults([]);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Title>대체인력 매칭</Title>
      
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
        <MatchingList>
          <h2 style={{ marginBottom: '1.5rem' }}>매칭된 지원자 목록</h2>
          {loading ? (
            <p>매칭 결과를 불러오는 중...</p>
          ) : matchingResults.length === 0 ? (
            <p>매칭된 지원자가 없습니다.</p>
          ) : (
            matchingResults.map((result, index) => (
              <MatchingItem key={index}>
                <ApplicantName>{result.applicantName}</ApplicantName>
                <ResumeText>{result.resumeText}</ResumeText>
                <MatchingScore>{result.matchingScore}점</MatchingScore>
              </MatchingItem>
            ))
          )}
        </MatchingList>
      )}
    </Container>
  );
};

export default MatchingPage; 