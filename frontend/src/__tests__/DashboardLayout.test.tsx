import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../layout/DashboardLayout';

vi.mock('../layout/Sidebar', () => ({
  default: ({ onLogout, userName, userInitials, onSectionChange }: any) => (
    <div data-testid="mock-sidebar">
      <span>{userName}</span>
      <span>{userInitials}</span>
      <button onClick={onLogout}>Cerrar Sesión</button>
      <button onClick={() => onSectionChange('courses')}>Cursos</button>
      <button onClick={() => onSectionChange('notifications')}>Notificaciones</button>
      <button onClick={() => onSectionChange('unknown')}>Unknown</button>
    </div>
  ),
}));

vi.mock('../pages/dashboard/home/index', () => ({
  default: ({ role, onGoToSubjects }: any) => (
    <div data-testid="mock-homeview">
      <span>Role: {role}</span>
      <button onClick={onGoToSubjects}>Go to Subjects</button>
    </div>
  ),
}));

vi.mock('../pages/notifications/index', () => ({
  default: () => (
    <div data-testid="mock-notificaciones">
      <h3>Notificaciones</h3>
      <p>No tienes notificaciones</p>
    </div>
  ),
}));

const defaultProps = {
  userData: { firstName: 'Juan', lastName: 'Pérez', email: 'juan@test.com' },
  role: 'professor' as const,
  onLogout: vi.fn(),
};

describe('DashboardLayout', () => {
  it('should render HomeView by default', () => {
    render(<DashboardLayout {...defaultProps}><div>Content</div></DashboardLayout>);
    expect(screen.getByTestId('mock-homeview')).toBeInTheDocument();
  });

  it('should render children for cursos section', async () => {
    const user = (await import('@testing-library/user-event')).default;
    render(<DashboardLayout {...defaultProps}><div data-testid="child-content">Child</div></DashboardLayout>);

    await user.click(screen.getByText('Cursos'));

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render NotificacionesPage for notificaciones section', async () => {
    const user = (await import('@testing-library/user-event')).default;
    render(<DashboardLayout {...defaultProps}><div>Child</div></DashboardLayout>);

    await user.click(screen.getByText('Notificaciones'));

    expect(screen.getByTestId('mock-notificaciones')).toBeInTheDocument();
  });

  it('should render WorkInProgress for unknown sections', async () => {
    const user = (await import('@testing-library/user-event')).default;
    render(<DashboardLayout {...defaultProps}><div>Child</div></DashboardLayout>);

    await user.click(screen.getByText('Unknown'));

    expect(screen.getByText('Work in progress')).toBeInTheDocument();
  });
});
