import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../shared/layout/DashboardLayout';

vi.mock('../shared/layout/Sidebar', () => ({
  default: ({ onLogout, userName, userInitials, onSectionChange }: any) => (
    <div data-testid="mock-sidebar">
      <span>{userName}</span>
      <span>{userInitials}</span>
      <button onClick={onLogout}>Cerrar Sesión</button>
      <button onClick={() => onSectionChange('cursos')}>Cursos</button>
      <button onClick={() => onSectionChange('notificaciones')}>Notificaciones</button>
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

const defaultProps = {
  userData: { nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' },
  role: 'profesor' as const,
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

  it('should render WorkInProgress for unknown sections', async () => {
    const user = (await import('@testing-library/user-event')).default;
    render(<DashboardLayout {...defaultProps}><div>Child</div></DashboardLayout>);

    await user.click(screen.getByText('Notificaciones'));

    expect(screen.getAllByText('Notificaciones').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Aquí podrás ver tus notificaciones/)).toBeInTheDocument();
    expect(screen.getByText('Work in progress')).toBeInTheDocument();
  });
});
