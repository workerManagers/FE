import React from 'react';
import styles from '../styles/JobPost.module.css';

const JobPostCard = ({ post, onViewDetail }) => {
  return (
    <div className={styles.postCard}>
      <h2>{post.jobName}</h2>
      <div className={styles.postInfo}>
        <span className={styles.companyName}>회사: {post.companyName}</span>
        <span>근무지역: {post.jobRegion}</span>
        <span>근무기간: {post.jobPeriod}</span>
        <span>마감일: {new Date(post.deadline).toLocaleDateString('ko-KR')}</span>
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