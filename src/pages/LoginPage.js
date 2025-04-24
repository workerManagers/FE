import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { showToast } from '../components/common/Toast';

const PageContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: white;
  padding: 1rem;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
  }
`;

const LoginPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === 'error') {
        showToast.error(location.state.message);
      } else {
        showToast.success(location.state.message);
      }
    }
  }, [location]);

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