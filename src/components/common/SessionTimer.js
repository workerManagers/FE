import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { tokenService } from '../../services/api';
import { motion } from 'framer-motion';

const TimerContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.$isExpiring ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 8px;
  transition: all 0.3s ease;
  color: white;
  margin-right: 1rem;
  backdrop-filter: blur(4px);
  border: 1px solid ${props => props.$isExpiring ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TimerText = styled.span`
  font-size: 0.85rem;
  color: ${props => props.$isExpiring ? '#ffd700' : 'rgba(255, 255, 255, 0.9)'};
  font-weight: 500;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⏳';
    font-size: 1rem;
  }
`;

const ToggleButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TimeDisplay = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: ${props => props.$isExpiring ? '#ffd700' : 'white'};
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