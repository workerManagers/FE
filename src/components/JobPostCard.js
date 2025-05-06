import React from 'react';
import styles from '../styles/JobPost.module.css';

const JobPostCard = ({ post, onViewDetail }) => {
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

  return (
    <div className={styles.postCard}>
      <h2>{post.jobName}</h2>
      <div className={styles.postInfo}>
        <span className={styles.companyName}>회사: {post.companyName}</span>
        <span>근무지역: {post.jobRegion}</span>
        <span>근무기간: {post.jobPeriod}</span>
        <span>마감일: {formatDate(post.deadline)}</span>
      </div>
      <button 
        className={styles.detailButton}
        onClick={() => onViewDetail(post.jobPostId)}
      >
        상세보기
      </button>
    </div>
  );
};

export default JobPostCard; 