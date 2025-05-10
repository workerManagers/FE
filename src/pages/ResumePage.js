import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi, userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 7.5rem 2rem 2rem;
`;

const ResumeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 2rem;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem 3rem;
  position: relative;
  z-index: 2;
`;

const LeftSection = styled(Section)`
  flex: 1;
  padding-right: 2rem;
`;

const RightSection = styled(Section)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  color: rgb(74, 80, 86);
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom, rgb(183, 209, 241), rgb(142, 197, 194));
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
  min-width: 120px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  height: 150px;
  resize: none;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const ContentBox = styled.div`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  height: 150px;
  overflow-y: auto;
  background-color: #f8f9fa;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SaveButton = styled(Button)`
  background-color: #e5e7eb;
  color: #222;
`;

const CancelButton = styled(Button)`
  background-color: #e5e7eb;
  color: #222;
`;

const DeleteButton = styled(Button)`
  background-color: #2E7D32;
  color: white;
`;

const DisabledInput = styled(Input)`
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
`;

const DisabledSelect = styled(Select)`
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
`;

const ResumePage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState({
    gender: '',
    age: '',
    desiredRegion: '',
    introduction: '',
    workExperience: '',
    selectedTraits: []
  });
  const personalityTraits = [
  { id: 1, text: '꼼꼼한', category: '작업 스타일' },
  { id: 2, text: '성실한', category: '작업 스타일' },
  { id: 3, text: '책임감이 강한', category: '작업 태도' },
  { id: 4, text: '시간을 잘 지키는', category: '작업 태도' },
  { id: 5, text: '안전 수칙을 준수하는', category: '안전' },
  { id: 6, text: '체계적인', category: '작업 스타일' },
  { id: 7, text: '문제 해결 능력이 뛰어난', category: '기술' },
  { id: 8, text: '팀워크를 중시하는', category: '대인관계' },
  { id: 9, text: '신속 정확한', category: '작업 스타일' },
  { id: 10, text: '품질 관리에 강한', category: '품질' },
  { id: 11, text: '기계 조작에 능숙한', category: '기술' },
  { id: 12, text: '공정 개선에 관심이 많은', category: '개선' },
  { id: 13, text: '설비 유지보수 능력이 있는', category: '기술' },
  { id: 14, text: '생산성 향상에 관심이 많은', category: '개선' },
  { id: 15, text: '작업 매뉴얼 준수를 잘하는', category: '작업 태도' },
  { id: 16, text: '불량률 감소에 기여하는', category: '품질' },
  { id: 17, text: '현장 문제 대응력이 좋은', category: '문제해결' },
  { id: 18, text: '공정 흐름을 잘 이해하는', category: '이해력' },
  { id: 19, text: '자재 관리를 잘하는', category: '관리능력' },
  { id: 20, text: '작업 환경 개선에 적극적인', category: '개선' },
  { id: 21, text: '품질 검사를 꼼꼼히 하는', category: '품질' },
  { id: 22, text: '생산 계획 준수를 잘하는', category: '작업 태도' },
  { id: 23, text: '장비 점검을 철저히 하는', category: '안전' },
  { id: 24, text: '작업 효율을 중시하는', category: '생산성' }
  ];
  
  const REGIONS = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도'
  ];

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = await userApi.getUserInfo();
        if (userInfo.userType !== 'INDIVIDUAL') {
          showToast.error('개인 회원만 접근할 수 있습니다.');
          navigate('/');
          return;
        }

        // 사용자 정보에서 성별과 나이 가져오기
        const userGender = userInfo.userSex;
        const userAge = userInfo.userAge;

        try {
          const data = await resumeApi.getResume();
          if (data) {
            setResume(data);
            parseResumeText(data.resumeText);
          } else {
            // 이력서가 없는 경우 기본 정보 설정
            setSections(prev => ({
              ...prev,
              gender: userGender === '여' ? '여성' : '남성',
              age: userAge?.toString() || ''
            }));
          }
          setLoading(false);
        } catch (error) {
          console.error('이력서 조회 중 에러:', error);
          // 이력서 조회 실패 시에도 기본 정보 설정
          setSections(prev => ({
            ...prev,
            gender: userGender === '여' ? '여성' : '남성',
            age: userAge?.toString() || ''
          }));
          setLoading(false);
        }
      } catch (error) {
        console.error('API 호출 중 에러:', error);
        setError('이력서를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    checkAccess();
  }, [navigate]);

  const parseResumeText = (text) => {
    if (!text) return;
    
    const newSections = {
      gender: '',
      age: '',
      desiredRegion: '',
      introduction: '',
      workExperience: '',
      selectedTraits: []
    };

    try {
      // 각 섹션별로 데이터 추출
      const genderMatch = text.match(/성별:([^\n]*)/);
      const ageMatch = text.match(/나이:([^\n]*)/);
      const regionMatch = text.match(/원하는 근무지역:([^\n]*)/);
      
      // 자기소개는 '자기소개:' 부터 '직무 경험 및 관련 활동:' 전까지
      const introMatch = text.match(/자기소개:([\s\S]*?)(?=직무 경험 및 관련 활동:)/);
      
      // 직무 경험은 '직무 경험 및 관련 활동:' 부터 '나의 성향:' 전까지
      const expMatch = text.match(/직무 경험 및 관련 활동:([\s\S]*?)(?=나의 성향:)/);
      
      // 성향은 '나의 성향:' 부터 끝까지
      const traitsMatch = text.match(/나의 성향:([^\n]*?)$/);

      if (genderMatch) newSections.gender = genderMatch[1].trim();
      if (ageMatch) newSections.age = ageMatch[1].trim();
      if (regionMatch) newSections.desiredRegion = regionMatch[1].trim();
      if (introMatch) newSections.introduction = introMatch[1].trim();
      if (expMatch) newSections.workExperience = expMatch[1].trim();
      if (traitsMatch) {
        newSections.selectedTraits = traitsMatch[1].split(',').map(trait => trait.trim());
      }

      setSections(newSections);
    } catch (error) {
      console.error('이력서 파싱 중 오류:', error);
    }
  };

  const combineSections = () => {
    const traits = sections.selectedTraits.join(', ');
    return `성별:${sections.gender}
나이:${sections.age}
원하는 근무지역:${sections.desiredRegion}
자기소개:${sections.introduction}
직무 경험 및 관련 활동:${sections.workExperience}
나의 성향:${traits}`;
  };

  const handleTraitSelection = (trait) => {
    if (sections.selectedTraits.includes(trait)) {
      setSections({
        ...sections,
        selectedTraits: sections.selectedTraits.filter(t => t !== trait)
      });
    } else if (sections.selectedTraits.length < 3) {
      setSections({
        ...sections,
        selectedTraits: [...sections.selectedTraits, trait]
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const combinedText = combineSections();
      if (resume) {
        await resumeApi.updateResume(combinedText);
      } else {
        await resumeApi.createResume(combinedText);
      }
      const updatedResume = await resumeApi.getResume();
      setResume(updatedResume);
      parseResumeText(updatedResume.resumeText);
      setIsEditing(false);
      showToast.success('이력서가 저장되었습니다.', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
      showToast.error('이력서 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await resumeApi.deleteResume();
      setResume(null);
      setSections({
        gender: '',
        age: '',
        desiredRegion: '',
        introduction: '',
        workExperience: '',
        selectedTraits: []
      });
      showToast.success('이력서가 삭제되었습니다.');
    } catch (error) {
      setError(error.message);
      showToast.error('이력서 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Title>로딩 중...</Title>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Title>오류 발생</Title>
        <div>{error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ResumeContainer>
        <LeftSection>
          <Title>기본 정보</Title>
          {isEditing ? (
            <>
              <FormGroup>
                <Label>성별</Label>
                <Input
                  type="text"
                  value={sections.gender}
                  onChange={(e) => setSections({...sections, gender: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>나이</Label>
                <Input
                  type="text"
                  value={sections.age}
                  onChange={(e) => setSections({...sections, age: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>원하는 근무지역</Label>
                <Select
                  value={sections.desiredRegion}
                  onChange={(e) => setSections({...sections, desiredRegion: e.target.value})}
                >
                  <option value="">선택하세요</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>자기소개</Label>
                <TextArea
                  value={sections.introduction}
                  onChange={(e) => setSections({...sections, introduction: e.target.value})}
                  placeholder="자기소개를 입력하세요"
                  style={{ height: '300px' }}
                />
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>성별</Label>
                <div>{sections.gender || '미입력'}</div>
              </FormGroup>
              <FormGroup>
                <Label>나이</Label>
                <div>{sections.age || '미입력'}</div>
              </FormGroup>
              <FormGroup>
                <Label>원하는 근무지역</Label>
                <div>{sections.desiredRegion || '미입력'}</div>
              </FormGroup>
              <FormGroup>
                <Label>자기소개</Label>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  minHeight: '300px',
                  width: '100%'
                }}>
                  {sections.introduction || '미입력'}
                </div>
              </FormGroup>
            </>
          )}
        </LeftSection>

        <RightSection>
          <Title>직무 경험 및 관련 활동</Title>
          {isEditing ? (
            <FormGroup>
              <TextArea
                value={sections.workExperience}
                onChange={(e) => setSections({...sections, workExperience: e.target.value})}
                placeholder="직무 경험 및 관련 활동을 입력하세요"
                style={{ height: '300px' }}
              />
            </FormGroup>
          ) : (
            <FormGroup>
              <div style={{
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                minHeight: '300px',
                width: '100%'
              }}>
                {sections.workExperience || '미입력'}
              </div>
            </FormGroup>
          )}
        </RightSection>
      </ResumeContainer>

      <div style={{
        maxWidth: '1200px',
        margin: '2.5rem auto 0',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem 3rem',
      }}>
        <Title>나의 성향 (최대 3개 선택)</Title>
        <div style={{
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          gridAutoFlow: 'column',
          gap: '0.5rem',
          width: '100%'
        }}>
          {personalityTraits.map(trait => (
            <Button
              key={trait.id}
              onClick={() => handleTraitSelection(trait.text)}
              style={{
                backgroundColor: sections.selectedTraits.includes(trait.text) ? '#6366f1' : '#f8f9fa',
                color: sections.selectedTraits.includes(trait.text) ? 'white' : '#333',
                opacity: !isEditing || (sections.selectedTraits.length >= 3 && !sections.selectedTraits.includes(trait.text)) ? 0.5 : 1,
                cursor: !isEditing ? 'not-allowed' : 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '0.9rem',
                minWidth: '100px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              disabled={!isEditing || (sections.selectedTraits.length >= 3 && !sections.selectedTraits.includes(trait.text))}
            >
              {trait.text}
            </Button>
          ))}
        </div>
        <ButtonContainer>
          {isEditing ? (
            <>
              <SaveButton onClick={handleSave}>저장</SaveButton>
              <CancelButton onClick={() => setIsEditing(false)}>취소</CancelButton>
            </>
          ) : (
            <>
              <SaveButton onClick={handleEdit}>수정</SaveButton>
              <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
            </>
          )}
        </ButtonContainer>
      </div>
    </PageContainer>
  );
};

export default ResumePage;