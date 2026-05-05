import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './authentication/context/AuthContext';
import RoleSelection from './authentication/components/RoleSelection';
import LoginForm from './authentication/components/LoginForm';
import ProtectedRoute from './authentication/ProtectedRoute';
import StudentDashboard from './courses/pages/StudentDashboard';
import ProfessorDashboard from './courses/pages/ProfessorDashboard';

function Dashboard() {
  const role = sessionStorage.getItem('role');

  if (role === 'profesor') {
    return <ProfessorDashboard />;
  }

  return <StudentDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
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
    </AuthProvider>
  );
}

export default App;
