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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
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

const LoginButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PredictButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
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
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await userApi.logout(token);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        showToast.success(`${userName}님 안녕히 가세요!`);
        
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

  const handleLogin = () => {
    navigate('/login');
  };

  const handlePredictClick = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token) {
      showToast.error('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    if (userType !== 'COMPANY') {
      showToast.error('기업 회원만 접근 가능한 서비스입니다.');
      return;
    }
    
    navigate('/predict');
  };

  const isLoggedIn = localStorage.getItem('token');

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
        <ButtonGroup>
          {!isLoggedIn ? (
            <LoginButton
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              로그인
            </LoginButton>
          ) : (
            <>
              {userType === 'COMPANY' && (
                <PredictButton
                  onClick={handlePredictClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  요양기간 예측
                </PredictButton>
              )}
              <LogoutButton
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '로그아웃'}
              </LogoutButton>
            </>
          )}
        </ButtonGroup>
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