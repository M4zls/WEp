import React, { FC, ReactElement, useEffect, useState } from 'react';
import type { Horario } from '../clases/horario.types';
import { DIAS_SEMANA } from '../clases/horario.types';

interface HorarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { diaSemana: number; horaInicio: string; horaTermino: string }) => Promise<void>;
  editingHorario?: Horario | null;
}

const HorarioFormModal: FC<HorarioFormModalProps> = ({ isOpen, onClose, onSave, editingHorario }): ReactElement | null => {
  const [diaSemana, setDiaSemana] = useState(1);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaTermino, setHoraTermino] = useState('09:30');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHorario) {
      setDiaSemana(editingHorario.diaSemana);
      setHoraInicio(editingHorario.horaInicio);
      setHoraTermino(editingHorario.horaTermino);
    } else {
      setDiaSemana(1);
      setHoraInicio('08:00');
      setHoraTermino('09:30');
    }
    setError('');
  }, [editingHorario, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horaInicio || !horaTermino) {
      setError('Completa todos los campos');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ diaSemana, horaInicio, horaTermino });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el horario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {editingHorario ? 'Editar Bloque Horario' : 'Agregar Bloque Horario'}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Día *</label>
            <select
              value={diaSemana}
              onChange={e => setDiaSemana(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-white"
            >
              {Object.entries(DIAS_SEMANA).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
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
              {saving ? 'Guardando...' : editingHorario ? 'Guardar Cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioFormModal;
