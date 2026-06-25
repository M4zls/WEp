/**
 * Tests for useProfile hook.
 *
 * @module useProfile.test
 */

vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useProfile } from '../pages/profile/use-profile';
import apiClient from '../api/apiClient';

describe('useProfile', () => {
  const mockUserData = {
    nombre: 'Juan',
    apellido: 'Perez',
    email: 'j@test.com',
    rut: '123-4',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  /**
   * Should load the perfil data on mount for an estudiante role.
   */
  it('should load perfil on mount for estudiante', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    const mockPerfil = {
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
      telefono: null,
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockPerfil);

    const { result } = renderHook(() => useProfile(mockUserData, 'estudiante'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toEqual(mockPerfil);
    expect(apiClient.get).toHaveBeenCalledWith('/students/123-4');
  });

  /**
   * Should return null perfil when no rut is available.
   */
  it('should error when no rut', async () => {
    const { result } = renderHook(() => useProfile(null, 'estudiante'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
  });

  /**
   * Should update a field in perfil via handleChange.
   */
  it('should handleChange', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'estudiante'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleChange('nombre', 'Pedro');
    });
    expect(result.current.profile?.nombre).toBe('Pedro');
  });

  /**
   * Should reset edit state and password fields via handleCancel.
   */
  it('should handleCancel reset state', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      nombre: 'Juan',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'estudiante'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setEditing(true);
      result.current.setNewPassword('newpass');
    });
    act(() => {
      result.current.handleCancel();
    });
    expect(result.current.editing).toBe(false);
    expect(result.current.newPassword).toBe('');
  });

  /**
   * Should save the profile and show a success message.
   */
  it('should handleSave and show success message', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
      telefono: null,
    });
    vi.mocked(apiClient.put).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile(mockUserData, 'estudiante'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setEditing(true);
    });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.message?.tipo).toBe('ok');
    expect(result.current.editing).toBe(false);
  });

  /**
   * Should show an error when the new password and confirmation do not match.
   */
  it('should show error on password mismatch', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      nombre: 'Juan',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'estudiante'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewPassword('abc');
      result.current.setConfirmPassword('xyz');
    });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.message?.tipo).toBe('error');
    expect(result.current.message?.texto).toContain('no coinciden');
  });
});
