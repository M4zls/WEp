vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useProfile } from '../pages/profile/use-profile';
import apiClient from '../api/apiClient';

describe('useProfile', () => {
  const mockUserData = {
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'j@test.com',
    rut: '123-4',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should load profile on mount for student', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    const mockProfile = {
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
      phone: null,
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfile(mockUserData, 'student'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toEqual(mockProfile);
    expect(apiClient.get).toHaveBeenCalledWith('/students/123-4');
  });

  it('should return null profile when no rut', async () => {
    const { result } = renderHook(() => useProfile(null, 'student'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
  });

  it('should handleChange', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'student'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleChange('firstName', 'Pedro');
    });
    expect(result.current.profile?.firstName).toBe('Pedro');
  });

  it('should handleCancel reset state', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      firstName: 'Juan',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'student'));
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

  it('should handleSave and show success message', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'j@test.com',
      rut: '123-4',
      phone: null,
    });
    vi.mocked(apiClient.put).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile(mockUserData, 'student'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setEditing(true);
    });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.message?.type).toBe('ok');
    expect(result.current.editing).toBe(false);
  });

  it('should show error on password mismatch', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(apiClient.get).mockResolvedValue({
      firstName: 'Juan',
      email: 'j@test.com',
      rut: '123-4',
    });

    const { result } = renderHook(() => useProfile(mockUserData, 'student'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewPassword('abc');
      result.current.setConfirmPassword('xyz');
    });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.message?.type).toBe('error');
    expect(result.current.message?.text).toContain('do not match');
  });
});
