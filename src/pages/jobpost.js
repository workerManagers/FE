import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import jobPostApi from '../api/jobPostApi';
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

function JobPost() {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobCategories, setJobCategories] = useState({});
  const [filters, setFilters] = useState({
    careerType: 'ALL',
    industryCategory: 'ALL',
    industrySubcategory: 'ALL'
  });

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
    const fetchJobPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('JobPost - Initial token:', token);

        if (!token) {
          setError('로그인이 필요합니다.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        const data = await jobPostApi.getJobPosts();
        setJobPosts(data);
        
        // 카테고리 정보를 병렬로 가져오기
        const categoryPromises = data.map(async (post) => {
          try {
            const jobCode = await jobPostApi.getJobCodeByJobName(post.jobName);
            return { jobName: post.jobName, jobCode };
          } catch (error) {
            console.error(`Error fetching category for ${post.jobName}:`, error);
            return { jobName: post.jobName, jobCode: null };
          }
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categories = {};
        categoryResults.forEach(({ jobName, jobCode }) => {
          if (jobCode) {
            categories[jobName] = jobCode;
          }
        });
        
        setJobCategories(categories);
        setError(null);
      } catch (error) {
        console.error('Error fetching job posts:', error);
        const token = localStorage.getItem('token');
        console.log('JobPost - Token after error:', token);

        if (error.message.includes('세션이 만료되었습니다') || !token) {
          setError('세션이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('token');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredJobPosts = jobPosts.filter(post => {
    if (filters.careerType !== 'ALL' && post.careerType !== filters.careerType) {
      return false;
    }
    if (filters.industryCategory !== 'ALL' && post.industryCategory !== filters.industryCategory) {
      return false;
    }
    if (filters.industrySubcategory !== 'ALL' && post.industrySubcategory !== filters.industrySubcategory) {
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
    if (filters.industryCategory === 'ALL') {
      return Object.entries(industrySubcategories);
    }
    // 선택된 카테고리에 해당하는 서브 카테고리만 필터링
    return Object.entries(industrySubcategories).filter(([key, value]) => {
      if (filters.industryCategory === 'PRODUCTION_CONSTRUCTION_LABOR') {
        return key === 'FOOD_BEVERAGE' || key === 'TEXTILE_APPAREL' || 
               key === 'ASSEMBLY_PRODUCTION' || key === 'MACHINERY_EQUIPMENT' ||
               key === 'CONSTRUCTION_CIVIL' || key === 'MANUFACTURING_PRODUCTION' ||
               key === 'PRINTING_PUBLISHING' || key === 'WAREHOUSE_MATERIALS' ||
               key === 'ELECTRICAL_FACILITY' || key === 'SEMICONDUCTOR_DISPLAY' ||
               key === 'QUALITY_AS' || key === 'ELECTRICAL_CONTROL' ||
               key === 'PUBLIC_CONSTRUCTION' || key === 'AUTOMOBILE' ||
               key === 'SHIPBUILDING_CONSTRUCTION' || key === 'PRODUCTION_OTHER';
      } else if (filters.industryCategory === 'DRIVING_DELIVERY') {
        return key === 'DELIVERY_TOTAL' || key === 'DELIVERY_DRIVER' ||
               key === 'SUBSTITUTE_DRIVER' || key === 'FOOD_DELIVERY' ||
               key === 'HEAVY_EQUIPMENT' || key === 'BUS_TAXI' ||
               key === 'WALKING_DELIVERY' || key === 'QUICK_SERVICE' ||
               key === 'LOCATION_BASED' || key === 'DRIVING_OTHER';
      } else if (filters.industryCategory === 'HOSPITAL_NURSING_RESEARCH') {
        return key === 'HOSPITAL_NURSE_RESEARCH' || key === 'NURSE_CARE' ||
               key === 'CLINICAL_RESEARCH' || key === 'MEDICAL_TECHNICIAN' ||
               key === 'COORDINATOR' || key === 'HOSPITAL_COORDINATOR' ||
               key === 'LIFE_HEALTH' || key === 'HOSPITAL_OTHER';
      }
      return false;
    });
  };

  if (loading) {
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
          <FilterLabel>경력 유형</FilterLabel>
          <FilterSelect
            name="careerType"
            value={filters.careerType}
            onChange={handleFilterChange}
          >
            <option value="ALL">전체</option>
            <option value="NEWCOMER">신입</option>
            <option value="EXPERIENCED">경력</option>
            <option value="ANY">신입/경력</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>산업 카테고리</FilterLabel>
          <FilterSelect
            name="industryCategory"
            value={filters.industryCategory}
            onChange={(e) => {
              handleFilterChange(e);
              // 카테고리 변경 시 서브 카테고리 초기화
              setFilters(prev => ({
                ...prev,
                industrySubcategory: 'ALL'
              }));
            }}
          >
            <option value="ALL">전체</option>
            {Object.entries(industryCategories).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>산업 서브 카테고리</FilterLabel>
          <FilterSelect
            name="industrySubcategory"
            value={filters.industrySubcategory}
            onChange={handleFilterChange}
          >
            <option value="ALL">전체</option>
            {getFilteredSubcategories().map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
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
                <InfoTag>{getCareerTypeLabel(post.careerType)}</InfoTag>
                {jobCategory && (
                  <>
                    <InfoTag>{industryCategories[jobCategory.industryCategory]}</InfoTag>
                    <InfoTag>{industrySubcategories[jobCategory.industrySubcategory]}</InfoTag>
                  </>
                )}
                <InfoTag>{post.jobRegion}</InfoTag>
                <InfoTag>{post.jobPeriod}</InfoTag>
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