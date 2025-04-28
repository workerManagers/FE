import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AddJobPage from './pages/AddJobPage';
import Toast from './components/common/Toast';
import { userApi } from './services/api';
import ResumePage from './pages/ResumePage';
import './App.css';

const PageContainer = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const userData = await userApi.getUserInfo();
          const userType = localStorage.getItem('userType');
          
          if (userType) {
            const userInfoWithType = {
              ...userData,
              userType: userType
            };
            setUserInfo(userInfoWithType);
          } else {
            setUserInfo(userData);
          }
          setIsLoggedIn(true);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      };
      fetchUserInfo();
    }
  }, [location]);

  const handleLoginStatusChange = (status, userData) => {
    setIsLoggedIn(status);
    setUserInfo(userData);
  };

  return (
    <>
      <GlobalStyle />
      <Header 
        isLoggedIn={isLoggedIn} 
        userInfo={userInfo} 
        onLoginStatusChange={handleLoginStatusChange}
      />
      <PageContainer>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/jobpost" element={<JobPost />} />
          <Route path="/jobpost/new" element={<NewJobPost />} />
          <Route path="/jobpost/:id" element={<JobPostDetail />} />
          <Route path="/jobpost/:id/edit" element={<EditJobPost />} />
          <Route path="/add-job" element={<AddJobPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
      <Toast />
    </>
  );
}

export default App;
