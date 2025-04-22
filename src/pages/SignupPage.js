import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SignupForm from '../components/SignupForm';

const PageContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 60px);
  background-color: white;
  padding-top: -4rem;
  
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