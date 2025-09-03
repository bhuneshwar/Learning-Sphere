import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/design-system.css';
import { ToastProvider } from './components/Toast/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoleBasedDashboard from './pages/RoleBasedDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import CreateCoursePage from './pages/CreateCoursePage';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import CourseListPage from './pages/CourseListPage';
import MyCoursesPage from './pages/MyCoursesPage';
import MyLearningPage from './pages/MyLearningPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import CourseAnalytics from './pages/CourseAnalytics';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetailPage from './pages/CourseDetailPage';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute role="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="Admin">
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute role="Admin">
            <ManageCourses />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute role="Instructor">
              <CreateCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
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
          path="/my-learning"
          element={
            <ProtectedRoute>
              <MyLearningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/analytics"
          element={
            <ProtectedRoute role="Instructor">
              <CourseAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:courseId/:sectionIndex/:lessonIndex"
          element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />
      </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
