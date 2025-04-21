import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const PredictForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SearchResults = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const SearchResultItem = styled.li`
  padding: 0.8rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const DISEASES = [
  'S724(넙다리뼈 하단의 골절)',
  'S832(현재 반달연골의 열상)',
  'S819(상세불명의 아래다리 부분의 열린 상처)',
  'S621(기타 손목뼈의 골절)',
  'T311(신체표면의 10~19%를 포함한 화상)',
  'S681(기타 단일 손가락의 외상성 절단(완전, 부분적))',
  'T300(상세불명 정도의 상세불명 신체부위의 화상)',
  'S644(기타 손가락의 손발가락신경의 손상)',
  'M502(기타 목뼈원판 전위)',
  'S626(기타 손가락의 골절)',
  'S678(기타 및 상세불명 손목 및 손 부분의 압착손상)',
  'S662(손목 및 손부위에서의 엄지의 폄근힘줄 및 폄근육의 손상)',
  'S981(단일 발가락의 외상성 절단)',
  'M513(기타 명시된 추간판 퇴화)',
  'S541(아래팔 부위에서의 정중신경의 손상)',
  'S431(봉우리빗장관절의 탈구)',
  'S860(아킬레스 힘줄의 손상)',
  'S721(넙다리 전자부 골절)',
  'S058(기타 눈 및 안와의 손상)',
  'S835(무릎의 (전, 후) 십자인대를 침범하는 염좌 및 긴장)',
  'S821(정강뼈 상단의 골절)',
  'S063(소상성 뇌손상)',
  'T240(발목 및 발을 제외한 엉덩이 및 다리의 상세불명 정도의 화상)',
  'S923(발허리뼈의 골절)',
  'S562(아래팔 부위에서의 기타 굽힘근힘줄 및 굽힘근육의 손상)',
  'S373(요도의 손상)',
  'S913(기타 발 부분의 열린 상처)',
  'S025(치아의 파절)',
  'T039(상세불명의 다발성 탈구, 염좌 및 긴장)',
  'T202(머리 및 목의 2도 화상)',
  'T233(손목 및 손의 3도 화상)',
  'S421(어깨뼈의 골절)',
  'S220(등뼈의 골절)',
  'S330(허리척추원반의 외상성 파열)',
  'S932(발목 및 발부위에서의 인대의 파열)',
  'T250(외산성 근허혈)',
  'T200(머리 및 목의 상세불명 정도의 화상)',
  'S581(팔꿈치 및 손목사이 부위에서의 외상성 절단)',
  'S028(기타 머리뼈 및 얼굴뼈의 골절)',
  'S565(아래팔 부위에서의 기타 펌근힘줄 및 펌근육의 손상)',
  'S618(기타 손목 및 손 부분의 열린 상처)',
  'S461(상완 이두근의 장두의 근육 및 힘줄의 손상)',
  'S018(기타 머리 부분의 열린 상처)',
  'T313(신체표면의 30~39%를 포함한 화상)',
  'S064(경막위 출혈)',
  'S015(입술 및 구강의 열린 상처)',
  'S022(코뼈의 골절)',
  'T250(발목 및 발의 상세불명 정도의 화상)',
  'S820(무릎뼈의 골절)',
  'M200(손가락의 변형)',
  'S122(기타 명시된 목척추뼈의 골절)',
  'S067(지속적 혼수를 동반한 머리내 손상)',
  'M771(외측 상과염)',
  'S320(허리뼈의 골절)',
  'I639(상세불명의 뇌경색증)',
  'S723(넙다리뼈 몸통의 골절)',
  'S026(아래턱뼈의 골절)',
  'S422(위팔뼈의 상단의 골절)',
  'S870(무릎의 압착손상)',
  'S468(기타 어깨 팔죽지 부위에서의 근육 및 힘줄의 손상)',
  'S524(자뼈몸통과 노뼈몸통 모두의 골절)',
  'S680(엄지의 외상성 절단(완전, 부분적))',
  'S542(아래팔 부위에서의 노신경의 손상)',
  'I609(상세불명의 거미막밑 출혈)',
  'S826(바깥쪽복사(가쪽복사)의 골절)',
  'S643(엄지의 손발가락신경의 손상)',
  'S430(어깨관절의 탈구)',
  'S657(손목 및 손부위에서의 다발성 혈관손상)',
  'S000(머리덮개의 얕은 손상)',
  'S929(상세불명의 발의 골절)',
  'S328(기타 및 상세불명 허리뼈 및 골반 부분의 골절)',
  'S008(기타 머리 부분의 얕은 손상)',
  'S764(기타 및 상세불명의 넓적다리 부위에서의 근육 및 힘줄 손상)',
  'S510(팔꿈치의 열린 상처)',
  'S011(눈꺼풀 및 눈주위 영역의 열린 상처)',
  'M512(기타 명시된 추간판 전위)',
  'I219(상세불명의 급성 심근경색증)',
  'L024(사지의 피부 고름집(농양) 종기 및 큰 종기)',
  'T232(손목 및 손의 2도 화상)',
  'S761(네갈래근의 근육 및 힘줄의 손상)',
  'S825(안쪽복사의 골절)',
  'S921(목발뼈의 골절)',
  'S540(아래팔 부위에서의 자신경 손상)',
  'S930(발목관절의 탈구)',
  'S523(노뼈몸통의 골절)',
  'S822(정강뼈 몸통의 골절)',
  'M250(혈관절증)',
  'S868(기타 아래다리 부위에서의 근육 및 힘출의 손상)',
  'M179(상세불명의 무릎관절증)',
  'S423(위팔뼈 몸통의 골절)',
  'S630(손목의 탈구)',
  'S47(어깨 및 팔죽지의 압착손상)',
  'S321(엉치뼈의 골절)',
  'S971(발가락의 압착손상)',
  'S634(손허리가락관절 및 가락사이관절에서 손가락 인대의 외상성 파열)',
  'S531(상세불명의 팔꿈치의 탈구)',
  'S127(목뼈의 다발성 골절)',
  'S325(두덩뼈(치골)의 골절)',
  'S221(등뼈의 다발성 골절)',
  'S522(자뼈몸통의 골절)',
  'S578(기타 아래팔 부분의 압착손상)',
  'T009(상세불명의 다발성 얕은 손상)',
  'S322(꼬리뼈의 골절)',
  'S519(상세불명의 아래팔 부분의 열린 상처)',
  'S528(기타 아래팔 부분의 골절)',
  'M199(상세불명의 관절증)',
  'S655(기타 손가락의 혈관의 손상)',
  'H210(전방출혈)',
  'M469(상세불명의 염증성 척추병증)',
  'S661(손목 및 손부위에서의 기타 손가락의 굽힘근힘줄 및 굽힘근육의 손상)',
  'S711(넓적다리의 열린 상처)',
  'S722(전자하골절)',
  'T252(발목 및 발의 2도 화상)',
  'S032(치아의 탈구)',
  'S925(기타 발가락의 골절)',
  'S222(복장뼈의 골절)',
  'S663(손목 및 손부위에서의 기타 손가락의 폄근힘줄 및 폄근육의 손상)',
  'S729(상세불명의 넙다리뼈 부분의 골절)',
  'M173(기타 의상후 무릎관절증)',
  'S836(기타 및 상세불명의 무릎 부분의 염좌 및 긴장)',
  'S141(목척수의 기타 및 상세불명의 손상)',
  'S829(상세불명 부분의 아래다리의 골절)',
  'S670(엄지 및 다른 손가락의 압착손상)',
  'S827(아래다리의 다발성 골절)',
  'S029(상세불명의 머리뼈 및 얼굴뼈의 골절)',
  'S824(종아리뼈만의 골절)',
  'S570(팔꿈치의 암착손상)',
  'S623(기타 손허리뼈의 골절)',
  'S521(노뼈상단의 골절)',
  'S927(발의 다발성 골절)',
  'T312(신체표면의 20~29%를 포함한 화상)',
  'T261(각막 및 결막주머니의 화상)',
  'S024(광대뼈 및 위턱뼈의 골절)',
  'S922(기타 발목뼈의 골절)',
  'S327(허리뼈 및 골반의 다발성 골절)',
  'S688(기타 손목 및 손 부분의 외상성 절단)',
  'S799(상세불명의 엉덩이 및 넓적다리의 손상)',
  'S689(상세불명 손목 및 손 부위의 외상성 절단)',
  'S627(손가락의 다발성 골절)',
  'I619(상세불명의 뇌내출혈)',
  'S924(얼지 발가락의 골절)',
  'I615(뇌실내 뇌내출혈)',
  'S520(자뼈상단의 골절)',
  'S631(손가락의 탈구)',
  'S323(엉덩뼈의 골절)',
  'T242(발목 및 발을 제외한 엉덩이 및 다리의 2도 화상)',
  'S424(위팔뼈 하단의 골절)',
  'S460(어깨의 회전근개의 힘줄의 손상)',
  'T222(손목 및 손을 제외한 어깨팔의 2도 화상)',
  'S660(손목 및 손부위에서의 엄지의 긴굽힘근힘줄 및 긴굽힘근육의 손상)',
  'S987(기타 발목 및 발의 부분의 압착 손상)',
  'S920(발꿈치뼈의 골절)',
  'S610(손톱의 손상이 없는 손가락의 열린 상처)',
  'M869(상세불명의 골수염)',
  'S527(아래팔의 다발성 골절)',
  'S525(노뼈하단의 골절)',
  'S053(안와 내조직의 탈출 또는 손실이 없는 눈의 일상)',
  'T230(손목 및 손의 상세불명 정도 화상)',
  'S682(둘 이상의 손가락만의 외상성 절단(완전, 부분적))',
  'S368(기타 복부내 기관의 속상)',
  'S607(손목 및 손의 다발성 얕은 손상)',
  'S617(손목 및 손의 다발성 열린 상처)',
  'T151(결막주머니의 이물)',
  'S062(미만성 뇌 손상)',
  'S633(손목 및 손목뼈 인대의 외상성 파열)',
  'G560(팔목 터널 증후군)',
  'H179(상세불명의 각막 흉터 및 혼탁)',
  'S611(손톱의 손상이 있는 손가락의 열린 상처)',
  'S720(넙다리뼈 경부의 골절)',
  'S620(손의 발배뼈의 골절)',
  'S625(엄지의 골절)'
];

const PredictPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [formData, setFormData] = useState({
    disease: '',
    sex: '',
    surgery: '',
    age: '',
    region: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        
        if (!token) {
          showToast.error('로그인이 필요한 서비스입니다.');
          navigate('/login');
          return;
        }
        
        if (userType !== 'COMPANY') {
          showToast.error('기업 회원만 접근 가능한 서비스입니다.');
          navigate('/');
          return;
        }

        // 사용자 정보 확인 - 이 부분을 제거하고 바로 페이지를 표시
        setIsLoading(false);
      } catch (error) {
        showToast.error('접근 권한을 확인할 수 없습니다.');
        navigate('/login');
      }
    };

    checkAccess();
  }, [navigate]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      const filtered = DISEASES.filter(disease =>
        disease.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDiseases(filtered);
    } else {
      setFilteredDiseases([]);
    }
  };

  const handleDiseaseSelect = (disease) => {
    setFormData(prev => ({ ...prev, disease }));
    setSearchTerm(disease);
    setFilteredDiseases([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userApi.predict(formData);
      setResult(response);
      showToast.success('휴식기간 예측이 완료되었습니다.');
    } catch (error) {
      showToast.error(error.message || '예측 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Toast />
      {isLoading ? (
        <LoadingContainer>
          <LoadingText>페이지를 불러오는 중입니다...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          <Title>요양기간 예측 서비스</Title>
          <PredictForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>병명</Label>
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="병명을 입력하세요"
              />
              {filteredDiseases.length > 0 && (
                <SearchResults>
                  {filteredDiseases.map((disease, index) => (
                    <SearchResultItem
                      key={index}
                      onClick={() => handleDiseaseSelect(disease)}
                    >
                      {disease}
                    </SearchResultItem>
                  ))}
                </SearchResults>
              )}
            </FormGroup>

            <FormGroup>
              <Label>성별</Label>
              <Select
                value={formData.sex}
                onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>수술여부</Label>
              <Select
                value={formData.surgery}
                onChange={(e) => setFormData(prev => ({ ...prev, surgery: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="예">예</option>
                <option value="아니오">아니오</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>연령대</Label>
              <Select
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="30세미만">30세미만</option>
                <option value="30-39세">30-39세</option>
                <option value="40-49세">40-49세</option>
                <option value="50-59세">50-59세</option>
                <option value="60세이상">60세이상</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>지역본부</Label>
              <Select
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              >
                <option value="">선택하세요</option>
                <option value="서울지역">서울지역</option>
                <option value="부산지역">부산지역</option>
                <option value="대구지역">대구지역</option>
                <option value="광주지역">광주지역</option>
                <option value="경인지역">경인지역</option>
                <option value="대전지역">대전지역</option>
              </Select>
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '예측 중...' : '예측하기'}
            </SubmitButton>
          </PredictForm>

          {result && (
            <ResultContainer>
              <h2>예측 결과</h2>
              <p>예상 휴식기간: {result.predicted_value}일</p>
            </ResultContainer>
          )}
        </>
      )}
    </PageContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

export default PredictPage; 