import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JobPost from './pages/jobpost';
import NewJobPost from './pages/NewJobPost';
import JobPostDetail from './pages/JobPostDetail';
import Test from './pages/test';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/jobpost" element={<JobPost />} />
        <Route path="/jobpost/new" element={<NewJobPost />} />
        <Route path="/jobpost/:id" element={<JobPostDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
