import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';
import JobPost from './pages/jobpost';
import NewJobPost from './pages/NewJobPost';
import JobPostDetail from './pages/JobPostDetail';
import Test from './pages/test';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PredictPage from './pages/PredictPage';
import EditJobPost from './pages/EditJobPost';
import Toast from './components/common/Toast';
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
          <Route path="/jobpost" element={<JobPost />} />
          <Route path="/jobpost/new" element={<NewJobPost />} />
          <Route path="/jobpost/:id" element={<JobPostDetail />} />
          <Route path="/jobpost/:id/edit" element={<EditJobPost />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
      <Toast />
    </>
  );
}

export default App;
