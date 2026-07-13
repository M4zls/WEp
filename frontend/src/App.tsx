import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/welcome/index';
import LoginForm from './pages/auth/components/LoginForm';
import ProtectedRoute from './pages/auth/components/ProtectedRoute';
import StudentDashboard from './pages/student/dashboard/student-dashboard.page';
import ProfessorDashboard from './pages/teacher/dashboard/teacher-dashboard.page';
import SubjectDetail from './pages/courses/components/subject.detail';
import GradesPage from './pages/grades/index';
import ManageGradesPage from './pages/grades/manage/index';
import { useAuthStore } from './pages/auth/store';

const Dashboard: FC = (): ReactElement => {
  const storeRole = useAuthStore((s) => s.role);
  const sessionRole = sessionStorage.getItem('role');
  const sessionUser = sessionStorage.getItem('user');
  const role = sessionUser ? sessionRole : storeRole;

  if (role === 'professor') {
    return <ProfessorDashboard />;
  }

  return <StudentDashboard />;
};

const App: FC = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subject/:courseSubjectId"
          element={
            <ProtectedRoute>
              <SubjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/grades"
          element={
            <ProtectedRoute>
              <GradesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-grades"
          element={
            <ProtectedRoute>
              <ManageGradesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
