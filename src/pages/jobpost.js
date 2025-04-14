import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { getJobPosts, searchJobPosts } from '../api/jobPostApi';
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

  // 초기 데이터 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getJobPosts();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    const searchPosts = async () => {
      try {
        const searchParams = {
          keyword: searchTerm,
          location: locationFilter,
          type: typeFilter
        };
        const data = await searchJobPosts(searchParams);
        setPosts(data);
      } catch (error) {
        setError('검색 중 오류가 발생했습니다.');
      }
    };

    if (searchTerm || locationFilter || typeFilter) {
      searchPosts();
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
        {posts.map((post) => (
          <JobPostCard 
            key={post.id}
            post={post}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      <button className={styles.writeButton} onClick={handleNewPost}>
        새 공고 작성
      </button>
    </div>
  );
};

export default JobPost; 