import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import UploadResumePage from './pages/UploadResumePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/templates" element={<TemplateSelectionPage />} />
        <Route path="/editor" element={<ResumeEditorPage />} />
        <Route path="/upload" element={<UploadResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;
