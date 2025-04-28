import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';
import JobPost from './pages/jobpost';
import NewJobPost from './pages/NewJobPost';
import JobPostDetail from './pages/JobPostDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PredictPage from './pages/PredictPage';
import EditJobPost from './pages/EditJobPost';
import AddJobPage from './pages/AddJobPage';
import ResumePage from './pages/ResumePage';
import Toast from './components/common/Toast';
import { userApi } from './services/api';
import BookmarkPage from './pages/BookmarkPage';
import ChatRoomList from './components/chat/ChatRoomList';
import ChatRoom from './components/chat/ChatRoom';
import MatchingPage from './pages/MatchingPage';
import JobMatchingPage from './pages/JobMatchingPage';
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
    console.log('App - 토큰:', token);
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const userData = await userApi.getUserInfo();
          console.log('App - getUserInfo 응답:', userData);
          const userType = localStorage.getItem('userType');
          console.log('App - 로컬 스토리지 userType:', userType);
          
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
          console.error('App - 사용자 정보 조회 실패:', error);
          if (error.response) {
            console.log('App - 에러 응답:', error.response);
          }
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
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          <Route path="/chat" element={<ChatRoomList />} />
          <Route path="/chat/recruiter" element={<ChatRoomList />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/job-matching" element={<JobMatchingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
      <Toast />
    </>
  );
}

export default App;
