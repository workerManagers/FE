import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { jobPostApi } from '../services/api';
import JobPostCard from '../components/JobPostCard';

const JobPost = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { 
          replace: true,
          state: { message: '로그인이 필요합니다.', type: 'error' }
        });
        return;
      }

      const data = await jobPostApi.getAllJobPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { 
          replace: true,
          state: { message: '세션이 만료되었습니다. 다시 로그인해주세요.', type: 'error' }
        });
      } else {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, [navigate]);

  const handleNewPost = () => {
    navigate('/jobpost/new');
  };

  const handleViewDetail = (id) => {
    navigate(`/jobpost/${id}`);
  };

  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>구인구직 게시판</h1>

      <div className={styles.postList}>
        {posts && posts.length > 0 ? (
          posts.map((post, index) => {
            const postId = post.jobPostId || `post-${index}`;
            
            return (
              <JobPostCard
                key={postId}
                post={{
                  jobPostId: post.jobPostId,
                  jobName: post.jobName,
                  companyName: post.companyName,
                  jobRegion: post.jobRegion,
                  jobPeriod: post.jobPeriod,
                  deadline: post.deadline
                }}
                onViewDetail={handleViewDetail}
              />
            );
          })
        ) : (
          <div className={styles.noPosts}>등록된 공고가 없습니다.</div>
        )}
      </div>

      <button className={styles.writeButton} onClick={handleNewPost}>
        새 공고 작성
      </button>
    </div>
  );
};

export default JobPost; 