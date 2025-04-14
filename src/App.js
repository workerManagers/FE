import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobPost from './pages/jobpost';
import NewJobPost from './pages/NewJobPost';
import JobPostDetail from './pages/JobPostDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/jobpost" element={<JobPost />} />
        <Route path="/jobpost/new" element={<NewJobPost />} />
        <Route path="/jobpost/:id" element={<JobPostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
