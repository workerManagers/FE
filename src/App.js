import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PredictPage from './pages/PredictPage';
import './App.css';

const PageContainer = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <PageContainer>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
    </>
  );
}

export default App;
