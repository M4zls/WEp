import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../pages/login/index';
import { useAuthStore } from '../pages/auth/auth.store';

vi.mock('../pages/student/student.service', () => ({
  default: {
    login: vi.fn(),
  },
}));

vi.mock('../shared/api/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

const renderLoginForm = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
    </MemoryRouter>,
  );

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    sessionStorage.clear();
  });

  it('should render the form', () => {
    renderLoginForm();
    expect(screen.getByText('Portal Educativo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('correo@alumnoCBO.cl')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('should show error for invalid email domain', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByPlaceholderText('correo@alumnoCBO.cl'), 'test@gmail.com');
    await user.type(screen.getByPlaceholderText('Contraseña'), '123456');
    await user.click(screen.getByText('Iniciar sesión'));

    expect(screen.getByText(/El correo debe ser/)).toBeInTheDocument();
  });

  it('should show error when error is set in store', () => {
    useAuthStore.setState({ error: 'Custom error message' });
    renderLoginForm();

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should navigate back on Volver click', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByText('Volver'));
  });
});
