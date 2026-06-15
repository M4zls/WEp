import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import type { PerfilData, MensajeEstado } from './types';

export function usePerfil(
  userData: { nombre?: string; apellido?: string; email?: string; rut?: string } | null,
  role: 'estudiante' | 'profesor'
) {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState<MensajeEstado | null>(null);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

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
        const endpoint = role === 'estudiante' ? `/estudiantes/${rut}` : `/profesores/${rut}`;
        const data = await apiClient.get(endpoint);
        setPerfil(data);
      } catch {
        setMensaje({ tipo: 'error', texto: 'Error al cargar el perfil' });
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [userData, role]);

  const handleChange = useCallback((campo: keyof PerfilData, valor: string) => {
    setPerfil((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }, []);

  const handleGuardar = useCallback(async () => {
    if (!perfil) return;

    if (nuevaPassword && nuevaPassword !== confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }

    setSaving(true);
    setMensaje(null);

    try {
      const datos: Record<string, unknown> = {
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
        telefono: perfil.telefono || null,
      };

      if (role === 'estudiante') {
        datos.apoderado = perfil.apoderado || null;
      }

      if (nuevaPassword) {
        datos.password = nuevaPassword;
      }

      const endpoint = role === 'estudiante' ? `/estudiantes/${perfil.rut}` : `/profesores/${perfil.rut}`;
      await apiClient.put(endpoint, datos);

      sessionStorage.setItem('user', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('user') || '{}'),
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
      }));

      setEditando(false);
      setNuevaPassword('');
      setConfirmarPassword('');
      setMensaje({ tipo: 'ok', texto: 'Perfil actualizado correctamente' });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al guardar los cambios' });
    } finally {
      setSaving(false);
    }
  }, [perfil, role, nuevaPassword, confirmarPassword]);

  const handleCancelar = useCallback(() => {
    setEditando(false);
    setNuevaPassword('');
    setConfirmarPassword('');
    setMensaje(null);
  }, []);

  return {
    perfil,
    loading,
    saving,
    editando,
    mensaje,
    nuevaPassword,
    confirmarPassword,
    setEditando,
    setNuevaPassword,
    setConfirmarPassword,
    handleChange,
    handleGuardar,
    handleCancelar,
  };
}
