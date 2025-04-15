import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { jobPostApi } from '../services/api';
import { IoArrowBack } from 'react-icons/io5';

const JobPostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await jobPostApi.getJobPostById(id);
        setPost(data);
        setLoading(false);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!post) {
    return <div className={styles.container}>공고를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <IoArrowBack size={20} />
          <span>뒤로가기</span>
        </button>
        <h1 className={styles.title}>{post.jobName}</h1>
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{post.companyName}</span>
          <span className={styles.region}>{post.companyRegion}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>마감일</span>
            <span className={styles.infoValue}>{formatDate(post.deadline)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>근무기간</span>
            <span className={styles.infoValue}>{post.jobPeriod}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>산업재해 유형</span>
            <span className={styles.infoValue}>{post.industrialAccidentName}</span>
          </div>
        </div>

        <div className={styles.descriptionCard}>
          <h2 className={styles.sectionTitle}>상세 설명</h2>
          <p className={styles.description}>{post.jobPostDescription}</p>
        </div>

        <button className={styles.applyButton}>지원하기</button>
      </div>
    </div>
  );
};

export default JobPostDetail; 