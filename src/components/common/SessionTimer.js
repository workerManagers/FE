import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { tokenService } from '../../services/api';
import { motion } from 'framer-motion';

const TimerContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.1rem;
  background: ${props => props.$isExpiring ? 'rgba(220, 220, 220, 0.45)' : 'rgba(245,246,248,0.85)'};
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  color: #6B7280;
  margin-right: 1rem;
  backdrop-filter: blur(0px);
  border: 1.5px solid ${props => props.$isExpiring ? 'rgba(163,170,184,0.5)' : 'rgba(245,246,248,0.18)'};
  box-shadow: 0 2px 8px rgba(163,170,184,0.07);
`;

const TimerText = styled.span`
  font-size: 0.97rem;
  color: ${props => props.$isExpiring ? '#A3AAB8' : '#6B7280'};
  font-weight: 600;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⏳';
    font-size: 1.1rem;
  }
`;

const ToggleButton = styled(motion.button)`
  background: none;
  border: none;
  color: #A3AAB8;
  cursor: pointer;
  font-size: 0.88rem;
  padding: 0.22rem 0.7rem;
  border-radius: 6px;
  transition: color 0.18s;
  font-weight: 600;
  &:hover {
    color: #23272f;
    text-decoration: underline;
    background: none;
  }
`;

const TimeDisplay = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 700;
  background: ${props => props.$isExpiring ? 'rgba(220,220,220,0.18)' : 'rgba(245,246,248,0.7)'};
  padding: 0.22rem 0.7rem;
  border-radius: 6px;
  color: ${props => props.$isExpiring ? '#A3AAB8' : '#6B7280'};
  font-size: 1.08rem;
`;

const SessionTimer = ({ onToggle }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    // 초기값 설정
    const updateTime = () => {
      const time = tokenService.getRemainingTime();
      setRemainingTime(time);
      setIsExpiring(time <= 5 * 60 * 1000);
    };

    // 즉시 실행
    updateTime();

    // 1초마다 업데이트
    const timerInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (ms) => {
    if (ms <= 0) return '00:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer 
      $isExpiring={isExpiring}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <TimerText $isExpiring={isExpiring}>
        세션 만료
        <TimeDisplay $isExpiring={isExpiring}>
          {formatTime(remainingTime)}
        </TimeDisplay>
      </TimerText>
      <ToggleButton 
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        숨기기
      </ToggleButton>
    </TimerContainer>
  );
};

export default SessionTimer; 