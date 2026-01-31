import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import UploadResumePage from './pages/UploadResumePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/choose-template" element={
            <ProtectedRoute>
              <TemplateSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              <TemplateSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/editor" element={
            <ProtectedRoute>
              <ResumeEditorPage />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadResumePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
