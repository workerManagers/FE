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
  padding: 1rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
`;

const LogoutButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const WelcomeMessage = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  text-align: center;
`;

const MainPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      navigate('/login');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await userApi.logout(token);
        // 로컬 스토리지에서 토큰과 사용자 정보 제거
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        showToast.success(`${userName}님 안녕히 가세요!`);
        
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      let errorMessage = '로그아웃 중 오류가 발생했습니다.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toast />
      <Header>
        <Title>Worker Managers</Title>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '로그아웃'}
        </LogoutButton>
      </Header>
      <Content>
        <WelcomeMessage>
          {userName ? `${userName}님, 환영합니다!` : '환영합니다!'}
        </WelcomeMessage>
      </Content>
    </PageContainer>
  );
};

export default MainPage; 