import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background: transparent;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 0px 0px #7c3aed, 0 0 0px 0px #fff;
    border-top-color: #7c3aed;
  }
  40% {
    box-shadow: 0 0 16px 6px #7c3aed, 0 0 0px 0px #fff;
    border-top-color: #a78bfa;
  }
  60% {
    box-shadow: 0 0 24px 12px #a78bfa, 0 0 0px 0px #fff;
    border-top-color: #7c3aed;
  }
  100% {
    box-shadow: 0 0 0px 0px #7c3aed, 0 0 0px 0px #fff;
    border-top-color: #7c3aed;
  }
`;

const bounce = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 2.2rem;
`;

const Spinner = styled.div`
  width: 96px;
  height: 96px;
  border-width: 10px;
  border-style: solid;
  border-color: #ece9f7 #ece9f7 #ece9f7 #7c3aed;
  border-radius: 50%;
  background: transparent;
  animation: ${bounce} 1.5s linear infinite, ${glow} 1.5s linear infinite;
  box-shadow: 0 0 0px 0px #7c3aed;
`;

const Message = styled.div`
  text-align: center;
  color: #7c3aed;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-top: 0.5rem;
`;

const Loading = ({ message = '로딩 중입니다.' }) => (
  <Container>
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
    <Message>{message}</Message>
  </Container>
);

export default Loading; 