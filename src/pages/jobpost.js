import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi } from '../services/api';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import Loading from '../components/common/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 1.35rem;
  margin-bottom: 1.5rem;
  color: #23272f;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.5px;
  background: rgba(255,255,255,0.7);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(124,58,237,0.07);
  padding: 1.1rem 2.2rem 1rem 2.2rem;
  display: inline-block;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.2rem;
  width: 100%;
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.2rem;
  width: 100%;
  justify-items: center;
`;

const JobCard = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(124,58,237,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  border: 2.5px solid rgba(124,58,237,0.07);
  min-width: 270px;
  max-width: 370px;
  width: 100%;
  &:hover {
    background: #f5f6fa;
    box-shadow: 0 8px 32px 0 rgba(180,180,200,0.18), 0 0 16px #fff;
    border: 2.5px solid #e5e7eb;
    transform: translateY(-7px) scale(1.025);
  }
`;

const JobTitle = styled.h2`
  font-size: 1.08rem;
  margin-bottom: 0.4rem;
  color: #23272f;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-align: center;
`;

const CompanyName = styled.p`
  font-size: 0.98rem;
  color: #6b7280;
  margin-bottom: 0.7rem;
  text-align: center;
`;

const JobInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const InfoTag = styled.span`
  background: #f3f4f6;
  padding: 0.28rem 0.7rem;
  border-radius: 7px;
  font-size: 0.89rem;
  color: #6366f1;
  font-weight: 500;
  letter-spacing: -0.2px;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  cursor: default;
`;

const Deadline = styled.p`
  font-size: 0.93rem;
  color: #a1a1aa;
  margin-top: 1.1rem;
  text-align: center;
`;

const FloatingNewPostButton = styled.button`
  position: fixed;
  right: 3.2vw;
  bottom: 3.2vw;
  z-index: 200;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  border: 1.5px solid #d1d5db;
  border-radius: 50px;
  font-size: 1.13rem;
  font-weight: 700;
  padding: 1.1rem 2.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(180,180,200,0.13), 0 0 8px #fff;
  transition: background 0.18s, box-shadow 0.18s, color 0.13s, transform 0.13s;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #111;
    box-shadow: 0 8px 32px rgba(180,180,200,0.18), 0 0 16px #fff;
    transform: translateY(-2px) scale(1.04);
  }
`;

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
  // 생산·건설·노무 하위 카테고리
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
  // 운전·배달 하위 카테고리
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
  // 병원·간호·연구 하위 카테고리
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

function JobPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedCareerType, setSelectedCareerType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobCategories, setJobCategories] = useState({});

  const industryCategories = {
    'PRODUCTION_CONSTRUCTION_LABOR': '생산·건설·노무',
    'DRIVING_DELIVERY': '운전·배달',
    'HOSPITAL_NURSING_RESEARCH': '병원·간호·연구'
  };

  const industrySubcategories = {
    // 생산·건설·노무 하위 카테고리
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

    // 운전·배달 하위 카테고리
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

    // 병원·간호·연구 하위 카테고리
    'HOSPITAL_NURSE_RESEARCH': '병원·간호·연구 전체',
    'NURSE_CARE': '간호·요양보호사',
    'CLINICAL_RESEARCH': '실험·연구보조',
    'MEDICAL_TECHNICIAN': '의료기사',
    'COORDINATOR': '간호조무사·간호사',
    'HOSPITAL_COORDINATOR': '원무·코디네이터',
    'LIFE_HEALTH': '생동성·임상시험',
    'HOSPITAL_OTHER': '병원·간호·연구 기타'
  };

  // 사용자 정보와 채용공고를 함께 가져오는 함수
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // 토큰이 있는 경우에만 사용자 정보 가져오기
      if (token) {
        try {
          const userData = await userApi.getUserInfo();
          setUserInfo(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          // 사용자 정보 조회 실패 시 로그인 상태 초기화
          setUserInfo(null);
          setIsLoggedIn(false);
        }
      } else {
        setUserInfo(null);
        setIsLoggedIn(false);
      }

      // 채용공고 가져오기 (로그인 여부와 관계없이)
      const response = await jobPostApi.getJobPosts();
      
      // 기업 사용자인 경우 자신의 공고만 필터링
      if (userInfo?.userType === 'COMPANY') {
        const filteredPosts = response.filter(post => 
          post.companyName === userInfo.companyInfo.companyName
        );
        setJobPosts(filteredPosts);
      } else {
        // 일반 사용자이거나 비로그인 사용자인 경우 모든 공고 표시
        setJobPosts(response);
      }

      // 채용공고 카테고리 정보 가져오기
      const categories = {};
      for (const post of response) {
        try {
          const jobCode = await jobPostApi.getJobCodeByJobName(post.jobName);
          if (jobCode) {
            categories[post.jobName] = jobCode;
          }
        } catch (error) {
          console.error(`Error fetching job code for ${post.jobName}:`, error);
        }
      }
      setJobCategories(categories);
      
      setError(null);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchInitialData();
  }, [navigate]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all'); // 카테고리 변경 시 세부 카테고리 초기화
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleCareerTypeChange = (careerType) => {
    setSelectedCareerType(careerType);
  };

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
    if (selectedCareerType !== 'ALL' && post.careerType !== selectedCareerType) {
      return false;
    }

    return true;
  });

  const uniqueJobNames = [...new Set(jobPosts.map(post => post.jobName))];

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 서브 카테고리 필터링을 위한 함수
  const getFilteredSubcategories = () => {
    if (selectedCategory === 'industry' && selectedSubcategory !== 'all') {
      return Object.entries(industrySubcategories).filter(([key, value]) => {
        if (selectedSubcategory === 'PRODUCTION_CONSTRUCTION_LABOR') {
          return key === 'FOOD_BEVERAGE' || key === 'TEXTILE_APPAREL' || 
                 key === 'ASSEMBLY_PRODUCTION' || key === 'MACHINERY_EQUIPMENT' ||
                 key === 'CONSTRUCTION_CIVIL' || key === 'MANUFACTURING_PRODUCTION' ||
                 key === 'PRINTING_PUBLISHING' || key === 'WAREHOUSE_MATERIALS' ||
                 key === 'ELECTRICAL_FACILITY' || key === 'SEMICONDUCTOR_DISPLAY' ||
                 key === 'QUALITY_AS' || key === 'ELECTRICAL_CONTROL' ||
                 key === 'PUBLIC_CONSTRUCTION' || key === 'AUTOMOBILE' ||
                 key === 'SHIPBUILDING_CONSTRUCTION' || key === 'PRODUCTION_OTHER';
        } else if (selectedSubcategory === 'DRIVING_DELIVERY') {
          return key === 'DELIVERY_TOTAL' || key === 'DELIVERY_DRIVER' ||
                 key === 'SUBSTITUTE_DRIVER' || key === 'FOOD_DELIVERY' ||
                 key === 'HEAVY_EQUIPMENT' || key === 'BUS_TAXI' ||
                 key === 'WALKING_DELIVERY' || key === 'QUICK_SERVICE' ||
                 key === 'LOCATION_BASED' || key === 'DRIVING_OTHER';
        } else if (selectedSubcategory === 'HOSPITAL_NURSING_RESEARCH') {
          return key === 'HOSPITAL_NURSE_RESEARCH' || key === 'NURSE_CARE' ||
                 key === 'CLINICAL_RESEARCH' || key === 'MEDICAL_TECHNICIAN' ||
                 key === 'COORDINATOR' || key === 'HOSPITAL_COORDINATOR' ||
                 key === 'LIFE_HEALTH' || key === 'HOSPITAL_OTHER';
        }
        return false;
      });
    }
    return [];
  };

  if (isLoading) {
    return (
      <Container>
        <Loading message="채용공고를 불러오는 중입니다." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Toast />
        <div style={{textAlign:'center', color:'#a1a1aa', fontSize:'1.08rem', marginTop:'2.5rem'}}>{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Toast />
      <TitleRow>
        <Title>
          {userInfo?.userType === 'COMPANY' ? '내 모집공고 관리' : '채용공고 목록'}
        </Title>
      </TitleRow>
      {userInfo?.userType === 'COMPANY' && (
        <FloatingNewPostButton onClick={() => navigate('/jobpost/new')}>
          <span style={{fontSize: '1.2em', fontWeight: '900'}}>＋</span> 새 공고 등록
        </FloatingNewPostButton>
      )}

      {error ? (
        <div style={{textAlign:'center', color:'#a1a1aa', fontSize:'1.08rem', marginTop:'2.5rem'}}>{error}</div>
      ) : jobPosts.length === 0 ? (
        <div style={{textAlign:'center', color:'#a1a1aa', fontSize:'1.08rem', marginTop:'2.5rem'}}>
          {userInfo?.userType === 'COMPANY' 
            ? '등록된 모집공고가 없습니다.' 
            : '현재 등록된 채용공고가 없습니다.'}
        </div>
      ) : (
        <JobList>
          {filteredJobPosts.map(post => {
            const jobCategory = jobCategories[post.jobName];
            return (
              <JobCard key={post.jobPostId} onClick={() => navigate(`/jobpost/${post.jobPostId}`)}>
                <JobTitle>{post.jobName}</JobTitle>
                <CompanyName>{post.companyName}</CompanyName>
                <JobInfo>
                  {jobCategory && (
                    <>
                      <InfoTag>{industryCategories[jobCategory.industryCategory]}</InfoTag>
                      <InfoTag>{industrySubcategories[jobCategory.industrySubcategory]}</InfoTag>
                    </>
                  )}
                  <InfoTag>{getCareerTypeLabel(post.careerType)}</InfoTag>
                </JobInfo>
                <Deadline>마감일: {formatDate(post.deadline)}</Deadline>
              </JobCard>
            );
          })}
        </JobList>
      )}
    </Container>
  );
}

export default JobPost; 