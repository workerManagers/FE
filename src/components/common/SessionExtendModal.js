import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { userApi } from '../../services/api';
import { showToast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 32, 38, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  padding: 2.2rem 2rem 1.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  max-width: 370px;
  width: 92%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Title = styled.h3`
  margin: 0 0 1.1rem;
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
`;

const Message = styled.p`
  margin: 0 0 1.7rem;
  color: #f1f1f1;
  font-size: 1.05rem;
  text-align: center;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
`;

const Button = styled(motion.button)`
  padding: 0.55rem 1.3rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  outline: none;
`;

const ExtendButton = styled(Button)`
  background: linear-gradient(90deg, #1a1a1a 0%, #485563 100%);
  color: #fff;
  &:hover {
    background: linear-gradient(90deg, #1a1a1a 0%, #485563 100%);
    color: #ffd700;
  }
`;

const CloseButton = styled(Button)`
  background: #232526;
  color: #fff;
  border: 1px solid #444;
  &:hover {
    background: #333;
    color: #ffd700;
  }
`;

const SessionExtendModal = ({ onClose }) => {
  const [isExtending, setIsExtending] = useState(false);

  const handleExtend = async () => {
    try {
      setIsExtending(true);
      const response = await userApi.extendSession();
      const { accessToken, accessTokenExpiresIn } = response.data;
      // 새로운 토큰 저장
      const refreshToken = localStorage.getItem('refreshToken');
      localStorage.setItem('token', accessToken);
      localStorage.setItem('tokenExpiry', accessTokenExpiresIn.toString());
      showToast.success('세션이 연장되었습니다.');
      onClose();
    } catch (error) {
      console.error('세션 연장 실패:', error);
      showToast.error('세션 연장에 실패했습니다.');
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <Title>세션 만료 예정</Title>
          <Message>
            세션이 곧 만료됩니다.<br />
            계속 사용하려면 세션을 연장하세요.
          </Message>
          <ButtonGroup>
            <CloseButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
            >
              닫기
            </CloseButton>
            <ExtendButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExtend}
              disabled={isExtending}
            >
              {isExtending ? '연장 중...' : '세션 연장'}
            </ExtendButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default SessionExtendModal; 