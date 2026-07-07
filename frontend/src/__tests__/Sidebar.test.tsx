import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../layout/Sidebar';

describe('Sidebar', () => {
  const defaultProps = {
    selectedSection: 'home',
    onSectionChange: vi.fn(),
    onLogout: vi.fn(),
    userName: 'Juan Pérez',
    userInitials: 'JP',
    role: 'professor' as const,
  };

  it('should render user info', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
    expect(screen.getByText('Portal Educativo')).toBeInTheDocument();
  });

  it('should show Cursos item for professor role', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Cursos')).toBeInTheDocument();
  });

  it('should show Clases item for student role', () => {
    render(<Sidebar {...defaultProps} role="student" />);
    expect(screen.getByText('Clases')).toBeInTheDocument();
  });

  it('should highlight active section', () => {
    render(<Sidebar {...defaultProps} selectedSection="notifications" />);
    const btn = screen.getByText('Notificaciones').closest('button')!;
    expect(btn).toHaveClass('border-emerald-400');
  });

  it('should call onSectionChange on nav click', async () => {
    const onSectionChange = vi.fn();
    const user = userEvent.setup();

    render(<Sidebar {...defaultProps} onSectionChange={onSectionChange} />);
    await user.click(screen.getByText('Inicio'));

    expect(onSectionChange).toHaveBeenCalledWith('home');
  });

  it('should call onLogout on logout click', async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();

    render(<Sidebar {...defaultProps} onLogout={onLogout} />);
    await user.click(screen.getByText('Cerrar Sesión'));

    expect(onLogout).toHaveBeenCalled();
  });

  it('should use fallback values when props are empty', () => {
    render(<Sidebar selectedSection="" onSectionChange={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
