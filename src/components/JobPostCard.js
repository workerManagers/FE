import React from 'react';
import styles from '../styles/JobPost.module.css';

const JobPostCard = ({ post, onViewDetail }) => {
  return (
    <div className={styles.postCard}>
      <h2>{post.title}</h2>
      <div className={styles.postInfo}>
        <span>{post.company}</span>
        <span>마감일: {post.deadline}</span>
        <span>지역: {post.location}</span>
        <span>고용형태: {post.type}</span>
      </div>
      <button 
        className={styles.detailButton}
        onClick={() => onViewDetail(post.id)}
      >
        상세보기
      </button>
    </div>
  );
};

export default JobPostCard; 