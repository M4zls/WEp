/**
 * Tests for NotificationsPage component.
 *
 * @module NotificationsPage.test.tsx
 */

vi.mock('../pages/notifications/use-notifications', () => ({
  useNotifications: vi.fn(),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { useNotifications } from '../pages/notifications/use-notifications';
import NotificationsPage from '../pages/notifications/index';

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should display a loading spinner when data is being fetched.
   */
  it('should show loading state', () => {
    (useNotifications as any).mockReturnValue({
      notifications: [], loading: true, error: null, markAsRead: vi.fn(),
    });
    render(<NotificationsPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  /**
   * Should display an error message when the fetch fails.
   */
  it('should show error state', () => {
    (useNotifications as any).mockReturnValue({
      notifications: [], loading: false, error: 'Error al cargar', markAsRead: vi.fn(),
    });
    render(<NotificationsPage />);
    expect(screen.getByText('Error al cargar')).toBeInTheDocument();
  });

  /**
   * Should display an empty state message when there are no notifications.
   */
  it('should show empty state', () => {
    (useNotifications as any).mockReturnValue({
      notifications: [], loading: false, error: null, markAsRead: vi.fn(),
    });
    render(<NotificationsPage />);
    expect(screen.getByText('No tienes notificaciones')).toBeInTheDocument();
  });

  /**
   * Should render the list of notifications and show unread count.
   */
  it('should render notifications list', () => {
    const mockMarcarLeida = vi.fn();
    (useNotifications as any).mockReturnValue({
      notifications: [
        { id: 1, title: 'Nota 1', message: 'Mensaje 1', type: 'nota', read: false, usuarioId: 1, url: null, createdAt: new Date().toISOString(), readAt: null },
        { id: 2, title: 'Asist 1', message: 'Mensaje 2', type: 'asistencia', read: true, usuarioId: 1, url: null, createdAt: new Date().toISOString(), readAt: null },
      ], loading: false, error: null, markAsRead: mockMarcarLeida,
    });
    render(<NotificationsPage />);
    expect(screen.getByText('Nota 1')).toBeInTheDocument();
    expect(screen.getByText('Asist 1')).toBeInTheDocument();
    expect(screen.getByText('1 sin leer')).toBeInTheDocument();
  });

  /**
   * Should call markAsRead with the notification id when the button is clicked.
   */
  it('should call markAsRead when button clicked', () => {
    const mockMarcarLeida = vi.fn();
    (useNotifications as any).mockReturnValue({
      notifications: [
        { id: 1, title: 'Test', message: 'Msg', type: 'info', read: false, usuarioId: 1, url: null, createdAt: new Date().toISOString(), readAt: null },
      ], loading: false, error: null, markAsRead: mockMarcarLeida,
    });
    render(<NotificationsPage />);
    fireEvent.click(screen.getByText('Marcar como leída'));
    expect(mockMarcarLeida).toHaveBeenCalledWith(1);
  });
});
