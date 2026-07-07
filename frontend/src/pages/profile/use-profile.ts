import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import type { ProfileData, StatusMessage } from './profile.types';

export function useProfile(
  userData: { firstName?: string; lastName?: string; email?: string; rut?: string } | null,
  role: 'student' | 'professor'
) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : null;
    const rut = userData?.rut || parsed?.rut;

    if (!rut) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const endpoint = role === 'student' ? `/students/${rut}` : `/teachers/${rut}`;
        const data = await apiClient.get(endpoint);
        setProfile(data);
      } catch {
        setMessage({ type: 'error', text: 'Error loading profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData, role]);

  const handleChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) return;

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const data: Record<string, unknown> = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || null,
      };

      if (role === 'student') {
        data.guardian = profile.guardian || null;
      }

      if (newPassword) {
        data.password = newPassword;
      }

      const endpoint = role === 'student' ? `/students/${profile.rut}` : `/teachers/${profile.rut}`;
      await apiClient.put(endpoint, data);

      sessionStorage.setItem('user', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('user') || '{}'),
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      }));

      setEditing(false);
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'ok', text: 'Profile updated successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Error saving changes' });
    } finally {
      setSaving(false);
    }
  }, [profile, role, newPassword, confirmPassword]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
  }, []);

  return {
    profile,
    loading,
    saving,
    editing,
    message,
    newPassword,
    confirmPassword,
    setEditing,
    setNewPassword,
    setConfirmPassword,
    handleChange,
    handleSave,
    handleCancel,
  };
}
