import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem 1.1rem 2.5rem 1.0rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1.5px 6px rgba(0,0,0,0.04);
  border: 1.5px solid #f2f2f2;
  cursor: pointer;
  transition: box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
  min-width: 0;
  min-width: 420px;
  width: 100%;
  height: 280px;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07);
    transform: translateY(-7px) scale(1.025);
    border-color: #e0e0e0;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.1rem;
  width: 100%;
  position: relative;
`;

const JobTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 370;
  margin: 1.2rem 0 0.8rem 0;
  color: #181818;
  letter-spacing: -0.5px;
  text-align: center;
  width: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const CompanyName = styled.p`
  font-size: 1.5rem;
  color: #181818;
  font-weight: 600;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const JobInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InfoTag = styled.span`
  background: #f7f7f7;
  padding: 0.32rem 0.85rem;
  border-radius: 16px;
  font-size: 0.93rem;
  color: #222;
  font-weight: 500;
  letter-spacing: -0.2px;
  border: 1px solid #ececec;
  transition: background 0.18s;
  text-align: center;
`;

const Deadline = styled.p`
  font-size: 0.97rem;
  color: #888;
  margin-top: 0.7rem;
  margin-bottom: -0.5rem;
  font-weight: 400;
  text-align: center;
`;

const JobCard = ({ job, jobCategory, industryCategories, industrySubcategories, getCareerTypeLabel, onClick, isBookmarked, bookmarkId, onBookmarkChange }) => {
  const navigate = useNavigate();

  const formatDate = (dateValue) => {
    if (!dateValue) return '마감일 없음';
    try {
      // 배열 형태로 들어오는 경우 처리
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // 문자열로 들어오는 경우 처리
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '날짜 형식 오류';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '날짜 형식 오류';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(job.jobPostId);
    } else {
      navigate(`/jobpost/${job.jobPostId}`);
    }
  };

  return (
    <Card onClick={handleClick}>
      <TopRow>
        <div style={{ width: '24px', marginTop: '3.2rem' }}></div>
        <JobTitle>{job.jobName}</JobTitle>
        <BookmarkButton
          jobPostId={job.jobPostId}
          isBookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          onBookmarkChange={onBookmarkChange}
        />
      </TopRow>
      <CompanyName>{job.companyName}</CompanyName>
      <JobInfo>
        {/* 카테고리, 세부카테고리, 경력 한글 변환 */}
        {jobCategory && industryCategories && industrySubcategories && (
          <>
            <InfoTag>{industryCategories[jobCategory.industryCategory]}</InfoTag>
            <InfoTag>{industrySubcategories[jobCategory.industrySubcategory]}</InfoTag>
          </>
        )}
        <InfoTag>{getCareerTypeLabel ? getCareerTypeLabel(job.careerType) : job.careerType}</InfoTag>
      </JobInfo>
      <Deadline>마감일: {formatDate(job.deadline)}</Deadline>
    </Card>
  );
};

export default JobCard; 