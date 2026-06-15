import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/welcome/index';
import LoginForm from './pages/auth/components/LoginForm';
import ProtectedRoute from './pages/auth/components/ProtectedRoute';
import StudentDashboard from './pages/estudiante/dashboard/index';
import ProfessorDashboard from './pages/profesor/dashboard/index';
import SubjectDetail from './pages/cursos/components/SubjectDetail';
import { useAuthStore } from './pages/auth/store';

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
