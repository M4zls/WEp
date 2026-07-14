vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../pages/auth/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../layout/DashboardLayout', () => ({
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

vi.mock('../pages/grades/grades.view', () => ({
  default: () => <div data-testid="grades-view">GradesView</div>,
}));

vi.mock('../pages/grades/manage-grades.view', () => ({
  default: () => <div data-testid="manage-grades-view">ManageGradesView</div>,
}));

import { render, screen } from '@testing-library/react';
import GradesPage from '../pages/grades/index';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../pages/auth/store';

describe('GradesPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAuthStore as any).mockImplementation((selector?: any) => {
      const state = { logout: vi.fn(), user: null, role: 'student' };
      return selector ? selector(state) : state;
    });
  });

  it('should render ManageGradesView for professor role', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    sessionStorage.setItem('role', 'professor');
    (useAuthStore as any).mockReturnValue({ logout: vi.fn(), user: { id: 1 }, role: 'professor' });

    render(<GradesPage />);

    expect(screen.getByTestId('manage-grades-view')).toBeInTheDocument();
    expect(screen.queryByTestId('grades-view')).not.toBeInTheDocument();
  });

  it('should render GradesView for student role', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    sessionStorage.setItem('role', 'student');

    render(<GradesPage />);

    expect(screen.getByTestId('grades-view')).toBeInTheDocument();
    expect(screen.queryByTestId('manage-grades-view')).not.toBeInTheDocument();
  });

  it('should fall back to store role when no session', () => {
    (useAuthStore as any).mockReturnValue({ logout: vi.fn(), user: null, role: 'student' });

    render(<GradesPage />);

    expect(screen.getByTestId('grades-view')).toBeInTheDocument();
  });

  it('should render inside DashboardLayout', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    sessionStorage.setItem('role', 'student');

    render(<GradesPage />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });
});
