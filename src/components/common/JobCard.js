import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 2rem 1.7rem 1.5rem 1.7rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1.5px 6px rgba(0,0,0,0.04);
  border: 1.5px solid #f2f2f2;
  cursor: pointer;
  transition: box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
  min-width: 270px;
  max-width: 370px;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07);
    transform: translateY(-7px) scale(1.025);
    border-color: #e0e0e0;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.2rem;
`;

const JobTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #181818;
  letter-spacing: -0.5px;
`;

const CompanyName = styled.p`
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 1.1rem;
  font-weight: 500;
`;

const JobInfo = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
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

  &:not(:last-child) {
    margin-right: 0.1rem;
  }
`;

const Deadline = styled.p`
  font-size: 0.97rem;
  color: #888;
  margin-top: 1.1rem;
  font-weight: 400;
`;

const JobCard = ({ job, jobCategory, industryCategories, industrySubcategories, getCareerTypeLabel, onClick, isBookmarked, bookmarkId, onBookmarkChange }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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