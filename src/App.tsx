import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseChatPage from './pages/CourseChatPage';
import CertificationPage from './pages/CertificationPage';
import CertificationTestPage from './pages/CertificationTestPage';
import TestResultsPage from './pages/TestResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import TeacherValidationPage from './pages/TeacherValidationPage';
import TeacherCredentialsPage from './pages/TeacherCredentialsPage';
import MyCoursesPage from './pages/MyCoursesPage';
import MyTeachingsPage from './pages/MyTeachingsPage';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route 
              path="/courses/:courseId/chat" 
              element={
                <ProtectedRoute>
                  <CourseChatPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/certification" element={<CertificationPage />} />
            <Route 
              path="/certification/tests/:testId" 
              element={
                <ProtectedRoute>
                  <CertificationTestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certification/results/:resultId" 
              element={
                <ProtectedRoute>
                  <TestResultsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
            <Route 
              path="/teacher-validation" 
              element={
                <ProtectedRoute requiresTeacher>
                  <TeacherValidationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-credentials" 
              element={
                <ProtectedRoute>
                  <TeacherCredentialsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-courses" 
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-teachings" 
              element={
                <ProtectedRoute requiresTeacher>
                  <MyTeachingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;