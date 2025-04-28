import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { bookmarkApi, jobPostApi } from '../services/api';
import JobCard from '../components/common/JobCard';
import Toast, { showToast } from '../components/common/Toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
  padding-top: 5rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  color: #181818;
  margin-bottom: 1.8rem;
  margin-top: -1.5rem;
  letter-spacing: -1px;
`;

const BookmarkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.2rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 5rem;
`;

// MainPage와 동일하게 카테고리, 한글 변환 함수 정의
const industryCategories = {
  'PRODUCTION_CONSTRUCTION_LABOR': '생산·건설·노무',
  'DRIVING_DELIVERY': '운전·배달',
  'HOSPITAL_NURSING_RESEARCH': '병원·간호·연구'
};

const industrySubcategories = {
  'FOOD_BEVERAGE': '식품·음수식품',
  'TEXTILE_APPAREL': '섬유·의류',
  'ASSEMBLY_PRODUCTION': '조립·생산직',
  'MACHINERY_EQUIPMENT': '기계·장비',
  'CONSTRUCTION_CIVIL': '토목·플랜트·건설',
  'MANUFACTURING_PRODUCTION': '제조·가공',
  'PRINTING_PUBLISHING': '인쇄·출판',
  'WAREHOUSE_MATERIALS': '입출고·창고관리',
  'ELECTRICAL_FACILITY': '전기·시설관리',
  'SEMICONDUCTOR_DISPLAY': '반도체·전자부품생산',
  'QUALITY_AS': '정비·수리·설치·A/S',
  'ELECTRICAL_CONTROL': '전기·제어·배관공사',
  'PUBLIC_CONSTRUCTION': '공사·건설현장',
  'AUTOMOBILE': '자동차',
  'SHIPBUILDING_CONSTRUCTION': '조선·선원',
  'PRODUCTION_OTHER': '생산·건설·노무 기타',
  'DELIVERY_TOTAL': '운전·배달 전체',
  'DELIVERY_DRIVER': '납품기사',
  'SUBSTITUTE_DRIVER': '대리·수행기사',
  'FOOD_DELIVERY': '배달대행·음식배달',
  'HEAVY_EQUIPMENT': '중장비·특수차',
  'BUS_TAXI': '버스·택시·승합차',
  'WALKING_DELIVERY': '도보배달',
  'QUICK_SERVICE': '퀵서비스',
  'LOCATION_BASED': '지입·차량용역',
  'DRIVING_OTHER': '운전·배달 기타',
  'HOSPITAL_NURSE_RESEARCH': '병원·간호·연구 전체',
  'NURSE_CARE': '간호·요양보호사',
  'CLINICAL_RESEARCH': '실험·연구보조',
  'MEDICAL_TECHNICIAN': '의료기사',
  'COORDINATOR': '간호조무사·간호사',
  'HOSPITAL_COORDINATOR': '원무·코디네이터',
  'LIFE_HEALTH': '생동성·임상시험',
  'HOSPITAL_OTHER': '병원·간호·연구 기타'
};

const getCareerTypeLabel = (type) => {
  switch (type) {
    case 'NEWCOMER':
      return '신입';
    case 'EXPERIENCED':
      return '경력';
    case 'ANY':
      return '신입/경력';
    default:
      return type;
  }
};

const BookmarkPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [jobCategories, setJobCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 전체 채용공고 불러오기
    const fetchJobPosts = async () => {
      try {
        const data = await jobPostApi.getJobPosts();
        setJobPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setJobPosts([]);
      }
    };
    fetchJobPosts();
  }, []);

  // jobCategories 매핑 (jobName별로 jobCode 정보 저장)
  useEffect(() => {
    const fetchJobCategories = async () => {
      const categories = {};
      for (const post of jobPosts) {
        try {
          const jobCode = await jobPostApi.getJobCodeByJobName(post.jobName);
          if (jobCode) {
            categories[post.jobName] = jobCode;
          }
        } catch (error) {
          // 무시
        }
      }
      setJobCategories(categories);
    };
    if (jobPosts.length > 0) {
      fetchJobCategories();
    }
  }, [jobPosts]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const data = await bookmarkApi.getMyBookmarks();
        setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
      } catch (e) {
        showToast.error('북마크 목록을 불러오지 못했습니다.');
        setBookmarks([]);
      }
      setLoading(false);
    };
    fetchBookmarks();
  }, []);

  // 북마크 해제 시 목록 갱신
  const handleBookmarkChange = async () => {
    setLoading(true);
    try {
      const data = await bookmarkApi.getMyBookmarks();
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
    } catch (e) {
      setBookmarks([]);
    }
    setLoading(false);
  };

  // 카드 클릭 시 상세로 이동
  const handleCardClick = (jobPostId) => {
    navigate(`/jobpost/${jobPostId}`, { state: { from: '/bookmarks' } });
  };

  return (
    <PageContainer>
      <Toast />
      <Content>
        <Title>찜한 공고</Title>
        {loading ? (
          <EmptyMessage>로딩 중...</EmptyMessage>
        ) : bookmarks.length === 0 ? (
          <EmptyMessage>찜한 공고가 없습니다.</EmptyMessage>
        ) : (
          <BookmarkList>
            {bookmarks.map((bookmark) => {
              const job = jobPosts.find(j => Number(j.jobPostId) === Number(bookmark.jobPostId));
              if (!job) return null;
              const jobCategory = jobCategories[job.jobName];
              return (
                <JobCard
                  key={bookmark.bookmarkId}
                  job={job}
                  jobCategory={jobCategory}
                  industryCategories={industryCategories}
                  industrySubcategories={industrySubcategories}
                  getCareerTypeLabel={getCareerTypeLabel}
                  onClick={handleCardClick}
                  isBookmarked={true}
                  bookmarkId={bookmark.bookmarkId}
                  onBookmarkChange={handleBookmarkChange}
                />
              );
            })}
          </BookmarkList>
        )}
      </Content>
    </PageContainer>
  );
};

export default BookmarkPage; 