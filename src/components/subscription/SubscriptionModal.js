import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaCrown, FaRocket, FaSeedling } from 'react-icons/fa';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2.5rem;
  border-radius: 24px;
  max-width: 1000px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10000;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 122, 255, 0.5);
    border-radius: 4px;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
  font-weight: 800;
  background: linear-gradient(135deg, #007AFF 0%, #00C6FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const PlanCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateY(0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 122, 255, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PlanIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.background || '#007AFF'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.3rem;
  font-weight: 700;
  white-space: nowrap;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #007AFF;
  margin: 1.5rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  span {
    font-size: 1rem;
    color: #666;
    font-weight: normal;
  }
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const Feature = styled.li`
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.4;

  &::before {
    content: "✓";
    color: #007AFF;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const Purpose = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: auto;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 1.4;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const DontShowAgain = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }
`;

const subscriptionPlans = [
  {
    name: "스탠다드 요금제",
    type: "구독형 유료 서비스",
    price: "180,000",
    period: "월",
    icon: <FaCrown />,
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFB88C 100%)",
    background: "#FF6B6B",
    features: [
      "모든 기능 무제한 이용 가능",
      "요양일 예측 기반 공고 등록",
      "AI 기반 구직자 추천",
      "매칭된 모든 구직자 이력서 열람"
    ],
    purpose: "지속적인 채용이 필요하고 AI 기반 인재 추천 서비스를 활용하고 싶은 기업"
  },
  {
    name: "프리미엄 광고권",
    type: "광고형 유료 서비스",
    price: "150,000",
    period: "주",
    icon: <FaRocket />,
    gradient: "linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)",
    background: "#007AFF",
    features: [
      "채용 공고를 홈페이지 상단에 7일간 고정"
    ],
    purpose: "빠른 채용이 필요하고 많은 구직자에게 노출되고 싶은 기업"
  },
  {
    name: "무료 이용권",
    type: "체험형 무료 상품",
    price: "0",
    period: "원",
    icon: <FaSeedling />,
    gradient: "linear-gradient(135deg, #00B09B 0%, #96C93D 100%)",
    background: "#00B09B",
    features: [
      "공고 등록 무료 (1건 한정)",
      "나의 공고 지원자의 이력서만 열람 가능"
    ],
    purpose: "서비스를 먼저 체험해보고 싶은 기업"
  }
];

const SubscriptionModal = ({ isOpen, onClose, userInfo }) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      // 현재 날짜를 저장 (YYYY-MM-DD 형식)
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('hideSubscriptionModalUntil', today);
    }
    onClose();
  };

  // 로그인하지 않았거나 기업 사용자가 아닌 경우 모달을 표시하지 않음
  if (!userInfo || userInfo.userType !== 'COMPANY') {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose}>
              <IoClose />
            </CloseButton>
            <Title>구독 플랜</Title>
            <PlansContainer>
              {subscriptionPlans.map((plan, index) => (
                <PlanCard
                  key={index}
                  gradient={plan.gradient}
                >
                  <PlanHeader>
                    <PlanIcon background={plan.background}>
                      {plan.icon}
                    </PlanIcon>
                    <div>
                      <PlanName>{plan.name}</PlanName>
                      <small style={{ color: '#666' }}>{plan.type}</small>
                    </div>
                  </PlanHeader>
                  <Price>
                    {plan.price}<span>원/{plan.period}</span>
                  </Price>
                  <Features>
                    {plan.features.map((feature, idx) => (
                      <Feature key={idx}>{feature}</Feature>
                    ))}
                  </Features>
                  <Purpose>{plan.purpose}</Purpose>
                </PlanCard>
              ))}
            </PlansContainer>
            <DontShowAgain>
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <label htmlFor="dontShowAgain">오늘 다시 보지 않기</label>
            </DontShowAgain>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SubscriptionModal; 