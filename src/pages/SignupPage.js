import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SignupForm from '../components/SignupForm';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 2rem 2rem;
  background-color: #f8f9fa;
  
  @media (max-width: 480px) {
    padding-top: -2rem;
  }
`;

const SignupPage = () => {
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SignupForm />
    </PageContainer>
  );
};

export default SignupPage; 