import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { showToast } from '../components/common/Toast';
import { tokenService, userApi } from '../services/api';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background-color: #f8f9fa;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
  }
`;

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === 'error') {
        showToast.error(location.state.message);
      } else {
        showToast.success(location.state.message);
      }
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.login({
        userEmail,
        password
      });

      const { accessToken, refreshToken, accessTokenExpiresIn } = response;
      
      // 토큰 저장
      tokenService.saveTokens(accessToken, refreshToken, accessTokenExpiresIn);
      
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm />
    </PageContainer>
  );
};

export default LoginPage; 