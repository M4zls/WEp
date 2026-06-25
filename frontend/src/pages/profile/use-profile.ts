import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import type { PerfilData, MensajeEstado } from './types';

export function useProfile(
  userData: { nombre?: string; apellido?: string; email?: string; rut?: string } | null,
  role: 'estudiante' | 'profesor'
) {
  const [profile, setProfile] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<MensajeEstado | null>(null);
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

    const fetchPerfil = async () => {
      try {
        const endpoint = role === 'estudiante' ? `/students/${rut}` : `/teachers/${rut}`;
        const data = await apiClient.get(endpoint);
        setProfile(data);
      } catch {
        setMessage({ tipo: 'error', texto: 'Error al cargar el perfil' });
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [userData, role]);

  const handleChange = useCallback((campo: keyof PerfilData, valor: string) => {
    setProfile((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) return;

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const datos: Record<string, unknown> = {
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.email,
        telefono: profile.telefono || null,
      };

      if (role === 'estudiante') {
        datos.apoderado = profile.apoderado || null;
      }

      if (newPassword) {
        datos.password = newPassword;
      }

      const endpoint = role === 'estudiante' ? `/students/${profile.rut}` : `/teachers/${profile.rut}`;
      await apiClient.put(endpoint, datos);

      sessionStorage.setItem('user', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('user') || '{}'),
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.email,
      }));

      setEditing(false);
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ tipo: 'ok', texto: 'Perfil actualizado correctamente' });
    } catch {
      setMessage({ tipo: 'error', texto: 'Error al guardar los cambios' });
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
