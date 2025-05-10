import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/common/Toast';
import { userApi } from '../services/api';
import api from '../services/api';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

// 카테고리 상수 정의
const INDUSTRY_CATEGORIES = {
  PRODUCTION_CONSTRUCTION_LABOR: '생산·건설·노무',
  DRIVING_DELIVERY: '운전·배달',
  HOSPITAL_NURSING_RESEARCH: '병원·간호·연구'
};

const INDUSTRY_SUBCATEGORIES = {
  // 생산·건설·노무 하위 카테고리
  FOOD_BEVERAGE: { name: '식품·음수식품', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  TEXTILE_APPAREL: { name: '섬유·의류', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  ASSEMBLY_PRODUCTION: { name: '조립·생산직', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  MACHINERY_EQUIPMENT: { name: '기계·장비', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  CONSTRUCTION_CIVIL: { name: '토목·플랜트·건설', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  MANUFACTURING_PRODUCTION: { name: '제조·가공', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  PRINTING_PUBLISHING: { name: '인쇄·출판', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  WAREHOUSE_MATERIALS: { name: '입출고·창고관리', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  ELECTRICAL_FACILITY: { name: '전기·시설관리', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  SEMICONDUCTOR_DISPLAY: { name: '반도체·전자부품생산', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  QUALITY_AS: { name: '정비·수리·설치·A/S', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  ELECTRICAL_CONTROL: { name: '전기·제어·배관공사', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  PUBLIC_CONSTRUCTION: { name: '공사·건설현장', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  AUTOMOBILE: { name: '자동차', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  SHIPBUILDING_CONSTRUCTION: { name: '조선·선원', category: 'PRODUCTION_CONSTRUCTION_LABOR' },
  PRODUCTION_OTHER: { name: '생산·건설·노무 기타', category: 'PRODUCTION_CONSTRUCTION_LABOR' },

  // 운전·배달 하위 카테고리
  DELIVERY_TOTAL: { name: '운전·배달 전체', category: 'DRIVING_DELIVERY' },
  DELIVERY_DRIVER: { name: '납품기사', category: 'DRIVING_DELIVERY' },
  SUBSTITUTE_DRIVER: { name: '대리·수행기사', category: 'DRIVING_DELIVERY' },
  FOOD_DELIVERY: { name: '배달대행·음식배달', category: 'DRIVING_DELIVERY' },
  HEAVY_EQUIPMENT: { name: '중장비·특수차', category: 'DRIVING_DELIVERY' },
  BUS_TAXI: { name: '버스·택시·승합차', category: 'DRIVING_DELIVERY' },
  WALKING_DELIVERY: { name: '도보배달', category: 'DRIVING_DELIVERY' },
  QUICK_SERVICE: { name: '퀵서비스', category: 'DRIVING_DELIVERY' },
  LOCATION_BASED: { name: '지입·차량용역', category: 'DRIVING_DELIVERY' },
  DRIVING_OTHER: { name: '운전·배달 기타', category: 'DRIVING_DELIVERY' },

  // 병원·간호·연구 하위 카테고리
  HOSPITAL_NURSE_RESEARCH: { name: '병원·간호·연구 전체', category: 'HOSPITAL_NURSING_RESEARCH' },
  NURSE_CARE: { name: '간호·요양보호사', category: 'HOSPITAL_NURSING_RESEARCH' },
  CLINICAL_RESEARCH: { name: '실험·연구보조', category: 'HOSPITAL_NURSING_RESEARCH' },
  MEDICAL_TECHNICIAN: { name: '의료기사', category: 'HOSPITAL_NURSING_RESEARCH' },
  COORDINATOR: { name: '간호조무사·간호사', category: 'HOSPITAL_NURSING_RESEARCH' },
  HOSPITAL_COORDINATOR: { name: '원무·코디네이터', category: 'HOSPITAL_NURSING_RESEARCH' },
  LIFE_HEALTH: { name: '생동성·임상시험', category: 'HOSPITAL_NURSING_RESEARCH' },
  HOSPITAL_OTHER: { name: '병원·간호·연구 기타', category: 'HOSPITAL_NURSING_RESEARCH' }
};

const PageContainer = styled(motion.div)`
  padding: 11rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.h1`
  color: #000000;
  font-size: 2.2rem;
  text-align: center;
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 90px;
    height: 3px;
    background-color: #000000;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 240px;
  }
`;

const Description = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2.5rem;
  margin-top: 2.5rem;
  line-height: 1.6;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15),
              inset 0 0 32px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  &:hover {
    transform: translateY(-5px);
    border: 3px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.2),
                inset 0 0 32px 0 rgba(0, 0, 0, 0.1);
  }
`;

const FormGroup = styled.div`
  flex: 1 1 calc(50% - 1rem);
  min-width: 250px;
  position: relative;

  &:first-child {
    flex: 1 1 100%;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  color: #000000;
  font-weight: 500;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  option {
    color: #000000;
    background: white;
    padding: 0.5rem;
  }
`;

const Button = styled(motion.button)`
  width: 200px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  margin: 0 auto;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobCode: '',
    jobName: '',
    industryCategory: '',
    industrySubcategory: ''
  });

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userApi.getUserInfo();
        const userType = localStorage.getItem('userType');
        
        if (userType) {
          const userInfoWithType = {
            ...userData,
            userType: userType
          };
        } else {
          console.error('사용자 타입이 없습니다.');
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      industryCategory: category,
      industrySubcategory: '' // 카테고리 변경 시 서브카테고리 초기화
    }));

    // 선택된 카테고리에 해당하는 서브카테고리 필터링
    const subcategories = Object.entries(INDUSTRY_SUBCATEGORIES)
      .filter(([_, value]) => value.category === category)
      .map(([key, value]) => ({ key, name: value.name }));
    
    setFilteredSubcategories(subcategories);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 불필요한 jobCode 필드 제거
      const { jobName, industryCategory, industrySubcategory } = formData;
      const data = { jobName, industryCategory, industrySubcategory };

      // 토큰 포함
      const response = await api.post('/job-codes', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // 토스트 메시지 표시 및 id 저장
      const toastId = showToast.success('직무 추가가 완료되었습니다.');
      
      // 2초 후 토스트 닫고 메인페이지 이동
      setTimeout(() => {
        toast.dismiss(toastId);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('직무 등록 중 오류:', error);
      showToast.error('직무 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Title>직무 추가 서비스</Title>
      <Description>
        공고에 올리고 싶은 직무가 없으세요?<br />
        원하시는 직무를 만들어 드릴게요!
      </Description>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>산업 카테고리</Label>
          <Select
            name="industryCategory"
            value={formData.industryCategory}
            onChange={handleCategoryChange}
            required
          >
           <option value="">카테고리 선택</option>
            {Object.entries(INDUSTRY_CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>산업 서브카테고리</Label>
          <Select
            name="industrySubcategory"
            value={formData.industrySubcategory}
            onChange={handleChange}
            required
            disabled={!formData.industryCategory}
          >
            <option value="">서브카테고리 선택</option>
            {filteredSubcategories.map(({ key, name }) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>직무 이름</Label>
          <Input
            type="text"
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            placeholder="예: 식품생산직"
            required
          />
        </FormGroup>

        <Button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          직무 등록
        </Button>
      </Form>
    </PageContainer>
  );
};

export default AddJobPage; 