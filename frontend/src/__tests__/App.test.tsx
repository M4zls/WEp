import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { useAuthStore } from '../pages/auth/store';

vi.mock('../pages/dashboard/home/index', () => ({
  default: () => <div data-testid="welcome-page">Welcome</div>,
}));

vi.mock('../pages/auth/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login</div>,
}));

vi.mock('../pages/auth/components/ProtectedRoute', () => ({
  default: ({ children }: any) => <div data-testid="protected-route">{children}</div>,
}));

vi.mock('../pages/student/dashboard/student-dashboard.page', () => ({
  default: () => <div data-testid="student-dashboard">Student Dashboard</div>,
}));

vi.mock('../pages/teacher/dashboard/teacher-dashboard.page', () => ({
  default: () => <div data-testid="professor-dashboard">Professor Dashboard</div>,
}));

vi.mock('../pages/courses/components/subject.detail', () => ({
  default: () => <div data-testid="subject-detail">Subject Detail</div>,
}));

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    window.history.pushState({}, '', '/');
  });

  it('should render WelcomePage on /', () => {
    render(<App />);
    expect(screen.getByTestId('welcome-page')).toBeInTheDocument();
  });

  it('should render LoginForm on /login', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should redirect unknown routes to /', () => {
    window.history.pushState({}, '', '/unknown');
    render(<App />);
    expect(screen.getByTestId('welcome-page')).toBeInTheDocument();
  });

  it('should render StudentDashboard when role is student', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      role: 'student',
      user: { email: 'test@alumnocbo.cl', role: 'student' },
    });
    window.history.pushState({}, '', '/dashboard');
    render(<App />);
    expect(screen.getByTestId('student-dashboard')).toBeInTheDocument();
  });

  it('should render ProfessorDashboard when role is professor', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      role: 'professor',
      user: { email: 'test@profesorcbo.cl', role: 'professor' },
    });
    window.history.pushState({}, '', '/dashboard');
    render(<App />);
    expect(screen.getByTestId('professor-dashboard')).toBeInTheDocument();
  });

  it('should render SubjectDetail on subject route', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      role: 'professor',
      user: { email: 'test@test.com', role: 'professor' },
    });
    window.history.pushState({}, '', '/dashboard/subject/1');
    render(<App />);
    expect(screen.getByTestId('subject-detail')).toBeInTheDocument();
  });
});
