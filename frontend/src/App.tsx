import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/home/index';
import LoginForm from './pages/login/index';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import StudentDashboard from './pages/student/dashboard/index';
import ProfessorDashboard from './pages/professor/dashboard/index';
import SubjectDetail from './shared/courses/SubjectDetail';
import { useAuthStore } from './pages/auth/auth.store';

const Dashboard: FC = (): ReactElement => {
  const role = useAuthStore((s) => s.role);

  if (role === 'profesor') {
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
          path="/dashboard/materia/:cursoAsignaturaId"
          element={
            <ProtectedRoute>
              <SubjectDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
