import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem 1.7rem 1.5rem 1.7rem;  /* Adjusted padding for better positioning */
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
  justify-content: flex-end;  /* 북마크 버튼을 오른쪽 끝에 위치시킴 */
  align-items: center;
  margin-bottom: 0.2rem;
  width: 100%;
`;

const JobTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 370;
  margin-bottom: 0.6rem;
  color: #181818;
  letter-spacing: -0.5px;
  text-align: center; 
  width: 100%;
`;

const CompanyName = styled.p`
  font-size: 1.5rem;
  color: #181818;
  font-weight: 600;
  text-align: center;
  margin-top: 0;  /* Ensure no margin above */
  margin-bottom: 0.5rem;  /* Adjust this to your liking */
`;

const JobInfo = styled.div`
  display: flex;
  justify-content: center;  /* 가운데 정렬 */
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
  text-align: center; /* 가운데 정렬 */
`;

const Deadline = styled.p`
  font-size: 0.97rem;
  color: #888;
  margin-top: 1.1rem;
  font-weight: 400;
  text-align: center; /* 가운데 정렬 */
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
        <BookmarkButton
          jobPostId={job.jobPostId}
          isBookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          onBookmarkChange={onBookmarkChange}
        />
      </TopRow>
      <CompanyName>{job.companyName}</CompanyName>
      <JobTitle>{job.jobName}</JobTitle>
      <JobInfo>
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
