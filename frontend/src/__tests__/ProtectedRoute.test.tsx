import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../pages/auth/components/ProtectedRoute';
import { useAuthStore } from '../pages/auth/store';

const renderProtectedRoute = (initialEntries = ['/dashboard']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProtectedRoute>
        <div data-testid="protected-content">Dashboard Content</div>
      </ProtectedRoute>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should render children when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com', role: 'profesor' }, role: 'profesor' });

    renderProtectedRoute();

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('should redirect to / when not authenticated', () => {
    renderProtectedRoute();

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
