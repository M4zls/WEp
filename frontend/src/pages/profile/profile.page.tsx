import React, { FC, ReactElement } from 'react';
import { useProfile } from './use-profile';
import type { ProfilePageProps, ProfileData } from './profile.types';

interface FieldProps {
  label: string;
  value: string;
  editable: boolean;
  editing?: boolean;
  field?: keyof ProfileData;
  onChange?: (field: keyof ProfileData, value: string) => void;
}

const Field: FC<FieldProps> = ({ label, value, editable, editing, field, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    {editing && editable && field && onChange ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all bg-white"
      />
    ) : (
      <p className="px-4 py-2.5 text-slate-800 bg-slate-50 rounded-xl border border-slate-200">
        {value || <span className="text-slate-400 italic">No registrado</span>}
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
          message.type === 'ok'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          {(profile.firstName?.charAt(0) || '?') + (profile.lastName?.charAt(0) || '')}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
            role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {role === 'student' ? 'Estudiante' : 'Profesor'}
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
          <Field label="RUT" value={profile.rut} editable={false} />
          <Field label="Email" value={profile.email} editable editing={editing} field="email" onChange={handleChange} />
          <Field label="Nombre" value={profile.firstName} editable editing={editing} field="firstName" onChange={handleChange} />
          <Field label="Apellido" value={profile.lastName} editable editing={editing} field="lastName" onChange={handleChange} />
          <Field label="Teléfono" value={profile.phone || ''} editable editing={editing} field="phone" onChange={handleChange} />

          {role === 'student' ? (
            <>
              <Field label="Curso(s)" value={profile.courses || ''} editable={false} />
              <Field label="Apoderado" value={profile.guardian || ''} editable editing={editing} field="guardian" onChange={handleChange} />
            </>
          ) : (
            <Field label="Asignatura" value={profile.subject || ''} editable={false} />
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            {role === 'student'
              ? `Registrado: ${profile.registrationDate ? new Date(profile.registrationDate).toLocaleDateString('es-CL') : '—'}`
              : `Inicio: ${profile.admissionDate ? new Date(profile.admissionDate).toLocaleDateString('es-CL') : '—'}`
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
                  placeholder="Vacío para mantener actual"
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
