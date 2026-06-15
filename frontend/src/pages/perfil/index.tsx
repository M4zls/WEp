import React, { FC, ReactElement } from 'react';
import { usePerfil } from './usePerfil';
import type { PerfilPageProps, PerfilData } from './types';

interface CampoProps {
  label: string;
  valor: string;
  editable: boolean;
  editando?: boolean;
  campo?: keyof PerfilData;
  onChange?: (campo: keyof PerfilData, valor: string) => void;
}

const Campo: FC<CampoProps> = ({ label, valor, editable, editando, campo, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    {editando && editable && campo && onChange ? (
      <input
        type="text"
        value={valor || ''}
        onChange={(e) => onChange(campo, e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all bg-white"
      />
    ) : (
      <p className="px-4 py-2.5 text-slate-800 bg-slate-50 rounded-xl border border-slate-200">
        {valor || <span className="text-slate-400 italic">No registrado</span>}
      </p>
    )}
  </div>
);

const PerfilPage: FC<PerfilPageProps> = ({ userData, role }): ReactElement => {
  const {
    perfil, loading, saving, editando, mensaje,
    nuevaPassword, confirmarPassword,
    setEditando, setNuevaPassword, setConfirmarPassword,
    handleChange, handleGuardar, handleCancelar,
  } = usePerfil(userData, role);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="text-center py-20 text-slate-500">
        No se pudo cargar la información del perfil.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {mensaje && (
        <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${
          mensaje.tipo === 'ok'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          {(perfil.nombre?.charAt(0) || '?') + (perfil.apellido?.charAt(0) || '')}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {perfil.nombre} {perfil.apellido}
          </h2>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
            role === 'estudiante' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {role === 'estudiante' ? 'Estudiante' : 'Profesor'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Información Personal</h3>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelar}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="RUT" valor={perfil.rut} editable={false} />
          <Campo label="Email" valor={perfil.email} editable editando={editando} campo="email" onChange={handleChange} />
          <Campo label="Nombre" valor={perfil.nombre} editable editando={editando} campo="nombre" onChange={handleChange} />
          <Campo label="Apellido" valor={perfil.apellido} editable editando={editando} campo="apellido" onChange={handleChange} />
          <Campo label="Teléfono" valor={perfil.telefono || ''} editable editando={editando} campo="telefono" onChange={handleChange} />

          {role === 'estudiante' ? (
            <>
              <Campo label="Curso(s)" valor={perfil.cursos || ''} editable={false} />
              <Campo label="Apoderado" valor={perfil.apoderado || ''} editable editando={editando} campo="apoderado" onChange={handleChange} />
            </>
          ) : (
            <Campo label="Materia" valor={perfil.materia || ''} editable={false} />
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            {role === 'estudiante'
              ? `Registrado el ${perfil.fechaRegistro ? new Date(perfil.fechaRegistro).toLocaleDateString('es-CL') : '—'}`
              : `Ingresó el ${perfil.fechaIngreso ? new Date(perfil.fechaIngreso).toLocaleDateString('es-CL') : '—'}`
            }
          </p>
        </div>

        {editando && (
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-700">Cambiar Contraseña</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Dejar vacío para mantener"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilPage;
