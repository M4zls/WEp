import React, { FC, ReactElement } from 'react';
import { useProfile } from './use-profile';
import type { ProfilePageProps, ProfileData } from './profile.types';

interface FieldProps {
  label: string;
  valor: string;
  editable: boolean;
  editing?: boolean;
  campo?: keyof ProfileData;
  onChange?: (campo: keyof ProfileData, valor: string) => void;
}

const Field: FC<FieldProps> = ({ label, valor, editable, editing, campo, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    {editing && editable && campo && onChange ? (
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

const ProfilePage: FC<ProfilePageProps> = ({ userData, role }): ReactElement => {
  const {
    profile, loading, saving, editing, message,
    newPassword, confirmPassword,
    setEditing, setNewPassword, setConfirmPassword,
    handleChange, handleSave, handleCancel,
  } = useProfile(userData, role);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-slate-500">
        No se pudo cargar la información del perfil.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {message && (
        <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${
          message.tipo === 'ok'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.texto}
        </div>
      )}

      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          {(profile.nombre?.charAt(0) || '?') + (profile.apellido?.charAt(0) || '')}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {profile.nombre} {profile.apellido}
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
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="RUT" valor={profile.rut} editable={false} />
          <Field label="Email" valor={profile.email} editable editing={editing} campo="email" onChange={handleChange} />
          <Field label="Nombre" valor={profile.nombre} editable editing={editing} campo="nombre" onChange={handleChange} />
          <Field label="Apellido" valor={profile.apellido} editable editing={editing} campo="apellido" onChange={handleChange} />
          <Field label="Teléfono" valor={profile.telefono || ''} editable editing={editing} campo="telefono" onChange={handleChange} />

          {role === 'estudiante' ? (
            <>
              <Field label="Curso(s)" valor={profile.cursos || ''} editable={false} />
              <Field label="Apoderado" valor={profile.apoderado || ''} editable editing={editing} campo="apoderado" onChange={handleChange} />
            </>
          ) : (
            <Field label="Materia" valor={profile.materia || ''} editable={false} />
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            {role === 'estudiante'
              ? `Registrado el ${profile.fechaRegistro ? new Date(profile.fechaRegistro).toLocaleDateString('es-CL') : '—'}`
              : `Ingresó el ${profile.fechaIngreso ? new Date(profile.fechaIngreso).toLocaleDateString('es-CL') : '—'}`
            }
          </p>
        </div>

        {editing && (
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-700">Cambiar Contraseña</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Dejar vacío para mantener"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ProfilePage;
