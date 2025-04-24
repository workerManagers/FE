import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi } from '../services/api';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  color: #666;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const JobCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const JobTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CompanyName = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const JobInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoTag = styled.span`
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
`;

const Deadline = styled.p`
  font-size: 0.875rem;
  color: #999;
  margin-top: 1rem;
`;

const NewPostButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
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

  useEffect(() => {
    // 메인 페이지에서 전달받은 로그인 상태 확인
    if (location.state?.userInfo && location.state?.isLoggedIn) {
      setUserInfo(location.state.userInfo);
      setIsLoggedIn(location.state.isLoggedIn);
    } else {
      // 전달받은 상태가 없는 경우 localStorage에서 확인
      const token = localStorage.getItem('token');
      if (token) {
        const fetchUserInfo = async () => {
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
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            setIsLoggedIn(false);
            setUserInfo(null);
            navigate('/login');
          }
        };
        fetchUserInfo();
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
        navigate('/login');
      }
    }
  }, [navigate, location]);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const data = await jobPostApi.getJobPosts();
        setJobPosts(data);
        setError(null);
      } catch (error) {
        console.error('채용공고 조회 실패:', error);
        if (error.message.includes('세션이 만료되었습니다')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          setIsLoggedIn(false);
          setUserInfo(null);
          navigate('/login');
        } else {
          setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchJobPosts();
    }
  }, [navigate, isLoggedIn]);

  useEffect(() => {
    const fetchJobCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const categories = {};
      for (const post of jobPosts) {
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
    };

    if (jobPosts.length > 0 && isLoggedIn) {
      fetchJobCategories();
    }
  }, [jobPosts, isLoggedIn, navigate]);

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
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <Toast />
        <div>{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Toast />
      <Title>채용 공고</Title>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>카테고리</FilterLabel>
          <FilterSelect
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>세부 카테고리</FilterLabel>
          <FilterSelect
            value={selectedSubcategory}
            onChange={(e) => handleSubcategoryClick(e.target.value)}
          >
            <option value="all">전체</option>
            {selectedCategory !== 'all' &&
              INDUSTRY_SUBCATEGORIES[selectedCategory]?.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>경력 유형</FilterLabel>
          <FilterSelect
            value={selectedCareerType}
            onChange={(e) => handleCareerTypeChange(e.target.value)}
          >
            {CAREER_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

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

      <NewPostButton onClick={() => navigate('/jobpost/new')}>
        +
      </NewPostButton>
    </Container>
  );
}

export default JobPost; 