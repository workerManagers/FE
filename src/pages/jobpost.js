import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { jobPostApi } from '../services/api';
import JobPostCard from '../components/JobPostCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

const JobPost = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const data = await jobPostApi.getAllJobPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    try {
      const searchParams = {
        keyword: searchTerm,
        location: locationFilter,
        type: typeFilter
      };
      const data = await jobPostApi.searchJobPosts(searchParams);
      setPosts(data);
    } catch (error) {
      console.error('Error searching posts:', error);
      setError('검색 중 오류가 발생했습니다.');
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    if (searchTerm || locationFilter || typeFilter) {
      searchPosts();
    } else {
      fetchPosts();
    }
  }, [searchTerm, locationFilter, typeFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
  };

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
      
      <SearchBar 
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />

      <FilterBar 
        locationFilter={locationFilter}
        typeFilter={typeFilter}
        onLocationChange={handleLocationFilter}
        onTypeChange={handleTypeFilter}
      />

      <div className={styles.postList}>
        {posts && posts.length > 0 ? (
          posts.map((post, index) => {
            // jobPostId를 key로 사용
            const postId = post.jobPostId || `post-${index}`;
            
            // 날짜 포맷팅
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
            };
            
            return (
              <JobPostCard
                key={postId}
                post={{
                  id: post.jobPostId,
                  title: post.jobName,
                  company: post.companyName,
                  deadline: formatDate(post.deadline),
                  location: post.companyRegion,
                  type: post.industrialAccidentName,
                  description: post.jobPostDescription
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