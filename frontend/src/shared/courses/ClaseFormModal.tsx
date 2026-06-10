import React, { FC, ReactElement, useEffect, useState } from 'react';
import type { Clase } from '../clases/clase.types';
import { ESTADOS_CLASE } from '../clases/clase.types';

interface ClaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { titulo: string; descripcion?: string; fecha: string; horaInicio: string; horaTermino: string; estado?: string }) => Promise<void>;
  editingClase?: Clase | null;
}

const ClaseFormModal: FC<ClaseFormModalProps> = ({ isOpen, onClose, onSave, editingClase }): ReactElement | null => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaTermino, setHoraTermino] = useState('');
  const [estado, setEstado] = useState(ESTADOS_CLASE.PENDIENTE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingClase) {
      setTitulo(editingClase.titulo);
      setDescripcion(editingClase.descripcion || '');
      setFecha(editingClase.fecha);
      setHoraInicio(editingClase.horaInicio);
      setHoraTermino(editingClase.horaTermino);
      setEstado(editingClase.estado || ESTADOS_CLASE.PENDIENTE);
    } else {
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setHoraInicio('');
      setHoraTermino('');
      setEstado(ESTADOS_CLASE.PENDIENTE);
    }
    setError('');
  }, [editingClase, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !fecha || !horaInicio || !horaTermino) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fecha,
        horaInicio,
        horaTermino,
        estado,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la clase');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {editingClase ? 'Editar Clase' : 'Nueva Clase'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              placeholder="Ej: Clase 1: Introducción"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition resize-none"
              placeholder="Descripción opcional de la clase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio *</label>
              <input
                type="time"
                value={horaInicio}
                onChange={e => setHoraInicio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora Término *</label>
              <input
                type="time"
                value={horaTermino}
                onChange={e => setHoraTermino(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              />
            </div>
          </div>

          {editingClase && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                value={estado}
                onChange={e => setEstado(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-white"
              >
                <option value={ESTADOS_CLASE.PENDIENTE}>Pendiente</option>
                <option value={ESTADOS_CLASE.REALIZADA}>Realizada</option>
                <option value={ESTADOS_CLASE.CANCELADA}>Cancelada</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : editingClase ? 'Guardar Cambios' : 'Crear Clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaseFormModal;
