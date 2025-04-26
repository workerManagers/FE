import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi, userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import styles from '../styles/ResumePage.module.css';

const ResumePage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState({
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

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('토큰이 없습니다.');
          navigate('/login');
          return;
        }

        try {
          const userInfo = await userApi.getUserInfo();
          if (!userInfo || userInfo.userType !== 'INDIVIDUAL') {
            showToast.error('개인 회원만 접근할 수 있습니다.');
            navigate('/');
            return;
          }

          // 이력서 데이터 가져오기
          try {
            const data = await resumeApi.getResume();
            if (data) {
              setResume(data);
              parseResumeText(data.resumeText);
            }
            setLoading(false);
          } catch (error) {
            console.error('이력서 조회 중 에러:', error);
            if (error.response?.status === 403 || error.response?.status === 404) {
              // 이력서가 없는 경우 - 생성 폼 표시
              setResume(null);
              setLoading(false);
              return;
            }
            throw error;
          }
        } catch (error) {
          console.error('API 호출 중 에러:', error);
          
          if (error.response) {
            if (error.response.status === 401) {
              localStorage.removeItem('token');
              showToast.error('로그인이 필요합니다.');
              navigate('/login');
              return;
            }
            
            if (error.response.status === 403 && error.response.data?.message?.includes('권한')) {
              showToast.error('접근 권한이 없습니다.');
              navigate('/');
              return;
            }
          }

          setError('이력서를 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      } catch (error) {
        console.error('접근 확인 중 오류:', error);
        setError('서버 연결 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    checkAccess();
  }, [navigate]);

  const parseResumeText = (text) => {
    if (!text) return;
    
    const newSections = {
      introduction: '',
      workExperience: '',
      selectedTraits: []
    };

    // 섹션 구분자로 분리
    const sections = text.split(/자기소개:|직무 경험 및 관련 활동:|나의 성향:/);
    if (sections.length >= 4) {
      newSections.introduction = sections[1].trim();
      newSections.workExperience = sections[2].trim();
      const traits = sections[3].trim();
      newSections.selectedTraits = traits.split(',').map(trait => trait.trim()).filter(Boolean);
    }
    
    setSections(newSections);
  };

  const combineSections = () => {
    const traits = sections.selectedTraits.join(', ');
    return `자기소개:${sections.introduction.trim()}\n\n직무 경험 및 관련 활동:${sections.workExperience.trim()}\n\n나의 성향:${traits}`;
  };

  const handleTraitSelection = (traitText) => {
    setSections(prev => {
      const newTraits = prev.selectedTraits.includes(traitText)
        ? prev.selectedTraits.filter(t => t !== traitText)
        : [...prev.selectedTraits, traitText];
      return { ...prev, selectedTraits: newTraits };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log('저장할 이력서 내용:', combineSections()); // 디버깅용 로그 추가
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
      showToast.success('이력서가 저장되었습니다.');
    } catch (error) {
      setError(error.message);
      showToast.error('이력서 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이력서를 삭제하시겠습니까?')) {
      try {
        await resumeApi.deleteResume();
        setResume(null);
        setSections({
          introduction: '',
          workExperience: '',
          selectedTraits: []
        });
        showToast.success('이력서가 삭제되었습니다.');
      } catch (error) {
        setError(error.message);
        showToast.error('이력서 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>내 이력서</h1>
      {resume ? (
        <div className={styles.resumeContainer}>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.section}>
                <h3>자기소개</h3>
                <textarea
                  value={sections.introduction}
                  onChange={(e) => setSections({...sections, introduction: e.target.value})}
                  className={styles.textarea}
                  placeholder="자기소개를 입력하세요..."
                />
              </div>
              <div className={styles.section}>
                <h3>직무 경험 및 관련 활동</h3>
                <textarea
                  value={sections.workExperience}
                  onChange={(e) => setSections({...sections, workExperience: e.target.value})}
                  className={styles.textarea}
                  placeholder="직무 경험 및 관련 활동을 입력하세요..."
                />
              </div>
              <div className={styles.section}>
                <h3>나의 성향 (최대 3개 선택)</h3>
                <div className={styles.traitsContainer}>
                  {personalityTraits.map(trait => (
                    <button
                      key={trait.id}
                      onClick={() => handleTraitSelection(trait.text)}
                      className={`${styles.traitButton} ${sections.selectedTraits.includes(trait.text) ? styles.selected : ''}`}
                      disabled={sections.selectedTraits.length >= 3 && !sections.selectedTraits.includes(trait.text)}
                    >
                      {trait.text}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={handleSave} className={styles.saveButton}>저장</button>
                <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>취소</button>
              </div>
            </div>
          ) : (
            <div className={styles.resumeContent}>
              <div className={styles.section}>
                <h3>자기소개</h3>
                <div className={styles.resumeText}>{sections.introduction}</div>
              </div>
              <div className={styles.section}>
                <h3>직무 경험 및 관련 활동</h3>
                <div className={styles.resumeText}>{sections.workExperience}</div>
              </div>
              <div className={styles.section}>
                <h3>나의 성향</h3>
                <div className={styles.selectedTraits}>
                  {sections.selectedTraits.map((trait, index) => (
                    <span key={index} className={styles.traitTag}>{trait}</span>
                  ))}
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={handleEdit} className={styles.editButton}>수정</button>
                <button onClick={handleDelete} className={styles.deleteButton}>삭제</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.createForm}>
          <h2>새 이력서 작성</h2>
          <div className={styles.section}>
            <h3>자기소개</h3>
            <textarea
              value={sections.introduction}
              onChange={(e) => setSections({...sections, introduction: e.target.value})}
              className={styles.textarea}
              placeholder="자기소개를 입력하세요..."
            />
          </div>
          <div className={styles.section}>
            <h3>직무 경험 및 관련 활동</h3>
            <textarea
              value={sections.workExperience}
              onChange={(e) => setSections({...sections, workExperience: e.target.value})}
              className={styles.textarea}
              placeholder="직무 경험 및 관련 활동을 입력하세요..."
            />
          </div>
          <div className={styles.section}>
            <h3>나의 성향 (최대 3개 선택)</h3>
            <div className={styles.traitsContainer}>
              {personalityTraits.map(trait => (
                <button
                  key={trait.id}
                  onClick={() => handleTraitSelection(trait.text)}
                  className={`${styles.traitButton} ${sections.selectedTraits.includes(trait.text) ? styles.selected : ''}`}
                  disabled={sections.selectedTraits.length >= 3 && !sections.selectedTraits.includes(trait.text)}
                >
                  {trait.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} className={styles.createButton}>저장</button>
        </div>
      )}
    </div>
  );
};

export default ResumePage;