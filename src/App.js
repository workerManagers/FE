import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ProfilePage from './pages/ProfilePage';
import Toast from './components/common/Toast';
import { userApi } from './services/api';
import BookmarkPage from './pages/BookmarkPage';
import ChatRoomList from './components/chat/ChatRoomList';
import ChatRoom from './components/chat/ChatRoom';
import MatchingPage from './pages/MatchingPage';
import JobMatchingPage from './pages/JobMatchingPage';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
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
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      setAuthLoading(false);
    };

    checkLoginStatus();
  }, [location]);

  const handleLoginStatusChange = (status, userData) => {
    setIsLoggedIn(status);
    setUserInfo(userData);
  };

  // 인증 체크가 완료될 때까지 아무것도 렌더링하지 않음
  if (authLoading) {
    return null;
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Header 
        isLoggedIn={isLoggedIn} 
        userInfo={userInfo} 
        onLoginStatusChange={handleLoginStatusChange}
      />
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookmarks" element={<BookmarkPage />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/chat" element={<ChatRoomList />} />
        <Route path="/chat/recruiter" element={<ChatRoomList />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/job-matching" element={<JobMatchingPage />} />
      </Routes>
      <Toast />
    </AppContainer>
  );
}

export default App;
