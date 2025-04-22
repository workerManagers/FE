import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';

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