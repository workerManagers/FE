import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { getJobPostById } from '../api/jobPostApi';

const JobPostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getJobPostById(id);
        setPost(data);
        setLoading(false);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        뒤로가기
      </button>
      
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.postInfo}>
        <span>{post.company}</span>
        <span>마감일: {post.deadline}</span>
        <span>지역: {post.location}</span>
        <span>고용형태: {post.type}</span>
      </div>

      <div className={styles.detailSection}>
        <h2>상세 내용</h2>
        <p>{post.description}</p>
      </div>

      <div className={styles.detailSection}>
        <h2>지원 자격</h2>
        <ul>
          {post.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <button className={styles.applyButton}>
        지원하기
      </button>
    </div>
  );
};

export default JobPostDetail; 