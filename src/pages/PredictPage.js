import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const PageContainer = styled(motion.div)`
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    width: 100px;
    height: 3.2px;
    background-color: #000000;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 300px;
  }
`;

const Description = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2.0rem;
  margin-top: 2.0rem;
  line-height: 1.6;
`;

const PredictForm = styled.form`
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

const SearchResults = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  padding: 0;
  margin: 0.2rem 0 0;
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background: white;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const SearchResultItem = styled.li`
  padding: 0.8rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    padding-left: 1rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SubmitButtonWrapper = styled.div`
  flex: 1 1 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

const SubmitButton = styled(motion.button)`
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

const ResultCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
`;

const ResultTitle = styled.h2`
  color: #000000;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background-color: #000000;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const ResultValue = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: default;

  .number {
    background: linear-gradient(135deg, #000000, #2d2d2d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeInUp 0.6s ease forwards, pulse 2s ease-in-out infinite;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    padding: 0 0.2rem;

    &:hover {
      transform: translateY(-5px) scale(1.1);
      background: linear-gradient(135deg, #000000, #4a4a4a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: bounce 0.5s ease infinite alternate;
    }
  }

  span {
    font-size: 1.8rem;
    opacity: 0.7;
    color: #000;
    transition: all 0.3s ease;
  }

  &:hover span {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      text-shadow: 0 0 0 rgba(0, 0, 0, 0);
    }
    50% {
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    100% {
      text-shadow: 0 0 0 rgba(0, 0, 0, 0);
    }
  }

  @keyframes bounce {
    from {
      transform: translateY(-5px) scale(1.1);
    }
    to {
      transform: translateY(2px) scale(1.1);
    }
  }
`;

const ResultLabel = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.2rem;
  margin: 0.5rem 0 2rem;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  line-height: 1;
  
  &:hover {
    color: #333;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #000;
  border-right: 3px solid #000;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 3px solid rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
`;

const LoadingMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const LoadingTitle = styled(motion.p)`
  color: #000;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  opacity: 0.8;
`;

const LoadingSubText = styled(motion.p)`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  margin: 0;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingBox = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
`;

const ActionButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
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
  const [formData, setFormData] = useState({
    disease: '',
    sex: '',
    surgery: '',
    age: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseList, setDiseaseList] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showToast.error('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        try {
          const userInfo = await userApi.getUserInfo();
          if (!userInfo) {
            showToast.error('사용자 정보를 가져올 수 없습니다.');
            navigate('/login');
            return;
          }

          if (userInfo.userType !== 'COMPANY') {
            showToast.error('기업 회원만 접근 가능한 서비스입니다.');
            navigate('/');
            return;
          }

          setUserInfo(userInfo);
        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            showToast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw error;
        }
      } catch (error) {
        console.error('접근 확인 중 오류:', error);
        showToast.error('접근 권한이 없습니다.');
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
      setDiseaseList(filtered);
    } else {
      setDiseaseList([]);
    }
  };

  const handleDiseaseSelect = (disease) => {
    setFormData(prev => ({ ...prev, disease }));
    setSearchTerm(disease);
    setDiseaseList([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    const requiredFields = ['disease', 'sex', 'surgery', 'age', 'region'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showToast.error('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.predict(formData);
      setPredictionResult(response);
      setShowModal(true);
      showToast.success('요양기간 예측이 완료되었습니다.');
    } catch (error) {
      let errorMessage = '예측 중 오류가 발생했습니다.';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = '서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToJobPost = () => {
    setShowRedirectModal(true);
  };

  const handleConfirmRedirect = () => {
    navigate('/jobpost/new', { 
      state: { 
        predictedPeriod: `${predictionResult.predicted_value}일` 
      } 
    });
  };

  const handleRedirectToSubstitute = () => {
    navigate('/substitute');
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingBox
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <LoadingSpinner
              animate={{ 
                rotate: 360,
                transition: {
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity
                }
              }}
            />
            <LoadingMessage>
              <LoadingTitle
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                예측 분석 중
              </LoadingTitle>
              <LoadingSubText
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                정확한 예측을 위해 데이터를 분석하고 있습니다.
                <br />잠시만 기다려주세요.
              </LoadingSubText>
            </LoadingMessage>
          </LoadingBox>
        </LoadingOverlay>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Toast />
      <Title>요양기간 예측 서비스</Title>
      <Description>
        급구당이 산재 피해 직원의 요양기간을 예측해드립니다!<br />
        병명을 입력하면 자동완성으로 관련 질병을 찾을 수 있어요.<br />
        산재 피해 직원의 요양기간을 예측하고 대체인력 매칭까지 한 번에 해결하세요!
      </Description>
      <PredictForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>병명</Label>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="병명을 입력하세요"
          />
          {diseaseList.length > 0 && (
            <SearchResults>
              {diseaseList.map((disease, index) => (
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
          <Label>지역</Label>
          <Select
            value={formData.region}
            onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
          >
            <option value="">선택하세요</option>
            <option value="부산지역">부산지역</option>
            <option value="대구지역">대구지역</option>
            <option value="광주지역">광주지역</option>
            <option value="서울지역">서울지역</option>
            <option value="경인지역">경인지역</option>
            <option value="대전지역">대전지역</option>
          </Select>
        </FormGroup>

        <SubmitButtonWrapper>
          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? '예측 중...' : '예측하기'}
          </SubmitButton>
        </SubmitButtonWrapper>
      </PredictForm>

      {showModal && predictionResult && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            <ResultTitle>예상 요양 기간</ResultTitle>
            <ResultValue>
              <motion.div 
                className="number"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.2,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.1,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                {predictionResult.predicted_value}
              </motion.div>
              <span>일</span>
            </ResultValue>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <ActionButton
                onClick={handleRedirectToJobPost}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                채용공고 작성하기
              </ActionButton>
              <ActionButton
                onClick={handleRedirectToSubstitute}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                대체인력 매칭하기
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showRedirectModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowRedirectModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={() => setShowRedirectModal(false)}>×</CloseButton>
            <ResultTitle>채용공고 작성</ResultTitle>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
              예측된 요양기간을 채용공고에 적용하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <ActionButton
                onClick={handleConfirmRedirect}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                네
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setShowRedirectModal(false);
                  navigate('/jobpost/new');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                아니오
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default PredictPage; 