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
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  color: #181818;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -12px;
    width: 60px;
    height: 3px;
    background: #2E7D32;
    border-radius: 2px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 140px;
  }
`;

const BookmarkList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 1rem 0;
  transition: transform 0.3s ease;
  width: 100%;
`;

const BookmarkContainer = styled.div`
  overflow: hidden;
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 70px;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-50%) scale(1.02);
  }

  &:active {
    transform: translateY(-50%) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #2E7D32;
  }
`;

const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.active ? '#2E7D32' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#1B5E20' : '#cbd5e1'};
  }
`;

const BookmarkCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(150, 201, 61, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(135deg, #96C93D 0%, #B8E986 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const BookmarkHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
`;

const BookmarkTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
`;

const CategoryTag = styled.span`
  background: #2E7D32;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(46, 125, 50, 0.15);
  transition: all 0.2s ease;
  letter-spacing: -0.3px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(46, 125, 50, 0.2);
  }
`;

const BookmarkContent = styled.div`
  padding: 1.5rem;
`;

const BookmarkInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #444;
  font-size: 0.95rem;

  svg {
    width: 20px;
    height: 20px;
    color: #96C93D;
    flex-shrink: 0;
  }
`;

const InfoText = styled.span`
  color: ${props => props.empty ? '#94a3b8' : '#444'};
  font-style: ${props => props.empty ? 'italic' : 'normal'};
`;

const BookmarkActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: -0.3px;
  
  &.primary {
    background: #2E7D32;
    color: white;
    border: none;
    position: relative;
    overflow: hidden;
    
    &:hover {
      background: #1B5E20;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(46, 125, 50, 0.2);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #666;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f8fafc;
      color: #333;
      border-color: #d1d5db;
    }

    &:active {
      background: #f1f5f9;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin: 2rem auto;
  max-width: 600px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }

  h2 {
    color: #1e293b;
    margin-bottom: 1.2rem;
    font-size: 1.8rem;
    font-weight: 700;
  }

  p {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  button {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // 2x2 그리드이므로 4개씩

  useEffect(() => {
    // 전체 채용공고 불러오기
    const fetchJobPosts = async () => {
      try {
        const data = await jobPostApi.getJobPosts();
        console.log('받아온 채용공고 데이터:', data); // 데이터 확인용 로그
        setJobPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('채용공고 데이터 로딩 에러:', e);
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

  // 북마크 해제 핸들러 수정
  const handleBookmarkChange = async (bookmarkId) => {
    try {
      await bookmarkApi.deleteBookmark(bookmarkId);
      showToast.success('찜한 공고에서 해제되었습니다.');
      
      // 북마크 목록 갱신
      const data = await bookmarkApi.getMyBookmarks();
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
    } catch (e) {
      showToast.error('북마크 해제 중 오류가 발생했습니다.');
      console.error('북마크 해제 에러:', e);
    }
  };

  // 카드 클릭 시 상세로 이동
  const handleCardClick = (jobPostId) => {
    navigate(`/jobpost/${jobPostId}`, { state: { from: '/bookmarks' } });
  };

  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // 현재 페이지의 북마크만 표시하도록 수정
  const getCurrentPageBookmarks = () => {
    const startIndex = currentPage * itemsPerPage;
    return bookmarks.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <PageContainer>
      <Toast />
      <Content>
        <Title>찜한 공고</Title>
        {loading ? (
          <LoadingContainer>
            <EmptyMessage>
              <h2>로딩 중...</h2>
              <p>북마크 목록을 불러오는 중입니다.</p>
            </EmptyMessage>
          </LoadingContainer>
        ) : bookmarks.length === 0 ? (
          <EmptyMessage>
            <h2>찜한 공고가 없습니다</h2>
            <p>관심 있는 채용공고를 북마크하여 나중에 쉽게 찾아보세요.</p>
            <button onClick={() => navigate('/')}>채용공고 둘러보기</button>
          </EmptyMessage>
        ) : (
          <>
            <BookmarkContainer>
              <NavigationButton 
                className="prev" 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </NavigationButton>
              <BookmarkList>
                {getCurrentPageBookmarks().map((bookmark) => {
                  const job = jobPosts.find(j => Number(j.jobPostId) === Number(bookmark.jobPostId));
                  if (!job) return null;
                  const jobCategory = jobCategories[job.jobName];
                  const displayRegion = job.jobRegion || '상관 없음';

                  return (
                    <BookmarkCard key={bookmark.bookmarkId}>
                      <BookmarkHeader>
                        <BookmarkTitle>{job.jobName}</BookmarkTitle>
                        <CategoryTag>
                          {industryCategories[jobCategory?.industryCategory] || '기타'}
                        </CategoryTag>
                      </BookmarkHeader>
                      <BookmarkContent>
                        <BookmarkInfo>
                          <InfoItem>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <InfoText empty={!job.careerType}>
                              {getCareerTypeLabel(job.careerType) || '미지정'}
                            </InfoText>
                          </InfoItem>
                          <InfoItem>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <InfoText empty={!displayRegion}>
                              {displayRegion}
                            </InfoText>
                          </InfoItem>
                        </BookmarkInfo>
                      </BookmarkContent>
                      <BookmarkActions>
                        <ActionButton 
                          className="secondary"
                          onClick={() => handleBookmarkChange(bookmark.bookmarkId)}
                        >
                          북마크 해제
                        </ActionButton>
                        <ActionButton 
                          className="primary"
                          onClick={() => handleCardClick(job.jobPostId)}
                        >
                          상세보기
                        </ActionButton>
                      </BookmarkActions>
                    </BookmarkCard>
                  );
                })}
              </BookmarkList>
              <NavigationButton 
                className="next" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </NavigationButton>
            </BookmarkContainer>
            <PageIndicator>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PageDot
                  key={index}
                  active={currentPage === index}
                  onClick={() => handlePageClick(index)}
                />
              ))}
            </PageIndicator>
          </>
        )}
      </Content>
    </PageContainer>
  );
};

export default BookmarkPage; 