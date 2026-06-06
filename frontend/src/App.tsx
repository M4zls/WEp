import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './features/welcome/WelcomePage';
import LoginForm from './features/auth/LoginForm';
import ProtectedRoute from './features/auth/ProtectedRoute';
import StudentDashboard from './features/student/StudentDashboard';
import ProfessorDashboard from './features/professor/ProfessorDashboard';
import { useAuthStore } from './features/auth/auth.store';

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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
