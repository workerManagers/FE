import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { userApi, jobPostApi, bookmarkApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import JobCard from '../components/common/JobCard';
import BookmarkButton from '../components/common/BookmarkButton';
import Toast from '../components/common/Toast';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 4rem);
`;

const SearchSection = styled.section`
  width: 100%;
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  color: #212529;
  margin-bottom: 1.5rem;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 auto;
  max-width: 600px;

  &:focus-within {
    border-color: #ff6b6b;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  outline: none;
  background: none;

  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #adb5bd;
  font-size: 1.2rem;
`;

const JobSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled(motion.button)`
  background: ${props => props.active ? '#111' : '#fff'};
  color: ${props => props.active ? '#fff' : '#111'};
  border: 1.5px solid #111;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: all 0.18s cubic-bezier(.4,0,.2,1);

  &:hover {
    background: ${props => props.active ? '#111' : '#f5f5f5'};
    color: #111;
    border-color: #111;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #fff;
    color: #bbb;
    border-color: #eee;
  }
`;

const FilterSection = styled.section`
  width: 100%;
  max-width: 800px;
  margin: -4.5rem auto 0 auto;
  padding: 0 2rem;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  color: #212529;
  margin-right: 0.2rem;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  width: 140px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

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

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'PRODUCTION_CONSTRUCTION_LABOR', name: '생산·건설·노무' },
  { id: 'DRIVING_DELIVERY', name: '운전·배달' },
  { id: 'HOSPITAL_NURSING_RESEARCH', name: '병원·간호·연구' }
];

const CAREER_TYPES = [
  { id: 'ALL', name: '전체' },
  { id: 'NEWCOMER', name: '신입' },
  { id: 'EXPERIENCED', name: '경력' },
  { id: 'ANY', name: '신입/경력' }
];

const INDUSTRY_SUBCATEGORIES = {
  'PRODUCTION_CONSTRUCTION_LABOR': [
    { id: 'FOOD_BEVERAGE', name: '식품·음수식품' },
    { id: 'TEXTILE_APPAREL', name: '섬유·의류' },
    { id: 'ASSEMBLY_PRODUCTION', name: '조립·생산직' },
    { id: 'MACHINERY_EQUIPMENT', name: '기계·장비' },
    { id: 'CONSTRUCTION_CIVIL', name: '토목·플랜트·건설' },
    { id: 'MANUFACTURING_PRODUCTION', name: '제조·가공' },
    { id: 'PRINTING_PUBLISHING', name: '인쇄·출판' },
    { id: 'WAREHOUSE_MATERIALS', name: '입출고·창고관리' },
    { id: 'ELECTRICAL_FACILITY', name: '전기·시설관리' },
    { id: 'SEMICONDUCTOR_DISPLAY', name: '반도체·전자부품생산' },
    { id: 'QUALITY_AS', name: '정비·수리·설치·A/S' },
    { id: 'ELECTRICAL_CONTROL', name: '전기·제어·배관공사' },
    { id: 'PUBLIC_CONSTRUCTION', name: '공사·건설현장' },
    { id: 'AUTOMOBILE', name: '자동차' },
    { id: 'SHIPBUILDING_CONSTRUCTION', name: '조선·선원' },
    { id: 'PRODUCTION_OTHER', name: '생산·건설·노무 기타' }
  ],
  'DRIVING_DELIVERY': [
    { id: 'DELIVERY_TOTAL', name: '운전·배달 전체' },
    { id: 'DELIVERY_DRIVER', name: '납품기사' },
    { id: 'SUBSTITUTE_DRIVER', name: '대리·수행기사' },
    { id: 'FOOD_DELIVERY', name: '배달대행·음식배달' },
    { id: 'HEAVY_EQUIPMENT', name: '중장비·특수차' },
    { id: 'BUS_TAXI', name: '버스·택시·승합차' },
    { id: 'WALKING_DELIVERY', name: '도보배달' },
    { id: 'QUICK_SERVICE', name: '퀵서비스' },
    { id: 'LOCATION_BASED', name: '지입·차량용역' },
    { id: 'DRIVING_OTHER', name: '운전·배달 기타' }
  ],
  'HOSPITAL_NURSING_RESEARCH': [
    { id: 'HOSPITAL_NURSE_RESEARCH', name: '병원·간호·연구 전체' },
    { id: 'NURSE_CARE', name: '간호·요양보호사' },
    { id: 'CLINICAL_RESEARCH', name: '실험·연구보조' },
    { id: 'MEDICAL_TECHNICIAN', name: '의료기사' },
    { id: 'COORDINATOR', name: '간호조무사·간호사' },
    { id: 'HOSPITAL_COORDINATOR', name: '원무·코디네이터' },
    { id: 'LIFE_HEALTH', name: '생동성·임상시험' },
    { id: 'HOSPITAL_OTHER', name: '병원·간호·연구 기타' }
  ]
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

const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobCategories, setJobCategories] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedCareerType, setSelectedCareerType] = useState('ALL');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await userApi.getUserInfo();
          const userType = localStorage.getItem('userType');
          
          if (userType) {
            const userInfoWithType = {
              ...userData,
              userType: userType
            };
            setUserInfo(userInfoWithType);
          } else {
            setUserInfo(userData);
          }
          setIsLoggedIn(true);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        setLoading(true);
        const response = await jobPostApi.getJobPosts();
        setJobPosts(response);
        setTotalPages(Math.ceil(response.length / 6));
      } catch (error) {
        console.error('채용공고 조회 실패:', error);
        showToast.error('채용공고를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

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
    if (!isLoggedIn) {
      setBookmarks([]);
      setBookmarkLoading(false);
      return;
    }
    const fetchBookmarks = async () => {
      setBookmarkLoading(true);
      try {
        const data = await bookmarkApi.getMyBookmarks();
        console.log('북마크 API 응답:', data);
        setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
      } catch (e) {
        setBookmarks([]);
        console.log('북마크 API 에러:', e);
      }
      setBookmarkLoading(false);
    };
    fetchBookmarks();
  }, [isLoggedIn, jobPosts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobpost/${jobId}`, { state: { from: '/' } });
  };

  // 필터링 함수
  const filteredJobPosts = jobPosts.filter(post => {
    const jobCategory = jobCategories[post.jobName];
    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      if (!jobCategory || jobCategory.industryCategory !== selectedCategory) {
        return false;
      }
    }
    // 세부 카테고리 필터링
    if (selectedSubcategory !== 'all') {
      if (!jobCategory || jobCategory.industrySubcategory !== selectedSubcategory) {
        return false;
      }
    }
    // 경력 유형 필터링
    if (selectedCareerType !== 'ALL') {
      if (selectedCareerType === 'ANY') {
        // 신입/경력 모두 포함
        if (!(post.careerType === 'NEWCOMER' || post.careerType === 'EXPERIENCED' || post.careerType === 'ANY')) {
          return false;
        }
      } else if (post.careerType !== selectedCareerType) {
        return false;
      }
    }
    return true;
  });

  // 현재 페이지에 표시할 채용공고 계산
  const displayedJobs = filteredJobPosts.slice(currentPage * 6, (currentPage + 1) * 6);

  // 진단용 로그
  console.log('bookmarks(렌더 직전):', bookmarks);
  console.log('jobPosts:', jobPosts);
  console.log('displayedJobs:', displayedJobs);

  // 상세 비교 로그
  if (Array.isArray(displayedJobs) && Array.isArray(bookmarks)) {
    displayedJobs.forEach(job => {
      bookmarks.forEach(b => {
        const isMatch = Number(b.jobPostId) === Number(job.jobPostId);
        console.log(
          `[비교] job.jobPostId=${job.jobPostId} (type:${typeof job.jobPostId}), ` +
          `bookmark.jobPostId=${b.jobPostId} (type:${typeof b.jobPostId}), isMatch=${isMatch}`
        );
      });
    });
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Toast />
      <MainContent>
        <SearchSection>
          <SearchTitle>대체인력 찾기</SearchTitle>
          <SearchBox>
            <SearchInput placeholder="직무, 지역, 회사명으로 검색하세요" />
            <SearchIcon />
          </SearchBox>
        </SearchSection>

        <FilterSection>
          <FilterGroup>
            <FilterLabel>카테고리</FilterLabel>
            <FilterSelect
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>세부 카테고리</FilterLabel>
            <FilterSelect
              value={selectedSubcategory}
              onChange={e => setSelectedSubcategory(e.target.value)}
            >
              <option value="all">전체</option>
              {selectedCategory !== 'all' &&
                INDUSTRY_SUBCATEGORIES[selectedCategory]?.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>경력 유형</FilterLabel>
            <FilterSelect
              value={selectedCareerType}
              onChange={e => setSelectedCareerType(e.target.value)}
            >
              {CAREER_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterSection>

        <JobSection>
          {loading ? (
            <div>로딩 중...</div>
          ) : (
            <>
              <JobList>
                {(Array.isArray(displayedJobs) ? displayedJobs : []).map((job) => {
                  const jobCategory = jobCategories[job.jobName];
                  const bookmarkList = Array.isArray(bookmarks) ? bookmarks : [];
                  const bookmark = bookmarkList.find(b => {
                    const isMatch = Number(b.jobPostId) === Number(job.jobPostId);
                    console.log(`비교: bookmarkId=${b.bookmarkId}, bookmark.jobPostId=${b.jobPostId}, job.jobPostId=${job.jobPostId}, isMatch=${isMatch}`);
                    return isMatch;
                  });
                  return (
                    <JobCard
                      key={job.jobPostId}
                      job={job}
                      jobCategory={jobCategory}
                      industryCategories={industryCategories}
                      industrySubcategories={industrySubcategories}
                      getCareerTypeLabel={getCareerTypeLabel}
                      onClick={handleJobClick}
                      isBookmarked={!!bookmark}
                      bookmarkId={bookmark?.bookmarkId}
                      onBookmarkChange={() => {
                        setBookmarkLoading(true);
                        (async () => {
                          try {
                            const data = await bookmarkApi.getMyBookmarks();
                            const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
                            setBookmarks(bookmarks);
                          } catch (e) { setBookmarks([]); }
                          setBookmarkLoading(false);
                        })();
                      }}
                      disabled={bookmarkLoading}
                    />
                  );
                })}
              </JobList>

              <PaginationContainer>
                <PageButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <FaChevronLeft />
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PageButton
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </PageButton>
                ))}
                <PageButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <FaChevronRight />
                </PageButton>
              </PaginationContainer>
            </>
          )}
        </JobSection>
      </MainContent>
    </PageContainer>
  );
};

export default MainPage; 