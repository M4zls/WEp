import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import claseService from '../clases/clase.service';
import horarioService from '../clases/horario.service';
import type { Clase } from '../clases/clase.types';
import type { Horario } from '../clases/horario.types';
import { ESTADOS_CLASE } from '../clases/clase.types';
import { DIAS_SEMANA } from '../clases/horario.types';
import ClaseFormModal from './ClaseFormModal';
import HorarioFormModal from './HorarioFormModal';

interface LocationState {
  subjectName?: string;
  subjectCode?: string;
  courseName?: string;
  colorIdx?: number;
}

type Tab = 'horario' | 'clases';

const cardColors = [
  { bar: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  { bar: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-700', badge: 'bg-sky-100 text-sky-700' },
  { bar: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' },
  { bar: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700' },
  { bar: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  { bar: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700' },
];

const estadoBadge: Record<string, string> = {
  [ESTADOS_CLASE.PENDIENTE]: 'bg-amber-100 text-amber-700',
  [ESTADOS_CLASE.REALIZADA]: 'bg-emerald-100 text-emerald-700',
  [ESTADOS_CLASE.CANCELADA]: 'bg-red-100 text-red-700',
};

const estadoLabel: Record<string, string> = {
  [ESTADOS_CLASE.PENDIENTE]: 'Pendiente',
  [ESTADOS_CLASE.REALIZADA]: 'Realizada',
  [ESTADOS_CLASE.CANCELADA]: 'Cancelada',
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const SubjectDetail: FC = (): ReactElement | null => {
  const { cursoAsignaturaId } = useParams<{ cursoAsignaturaId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<'estudiante' | 'profesor'>('estudiante');
  const [tab, setTab] = useState<Tab>('horario');

  const [clases, setClases] = useState<Clase[]>([]);
  const [clasesLoading, setClasesLoading] = useState(true);
  const [showClaseModal, setShowClaseModal] = useState(false);
  const [editingClase, setEditingClase] = useState<Clase | null>(null);

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [horariosLoading, setHorariosLoading] = useState(true);
  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);

  const isProfessor = role === 'profesor';
  const id = Number(cursoAsignaturaId);

  const loadClases = useCallback(async () => {
    if (!id) return;
    setClasesLoading(true);
    try {
      const data = await claseService.listar(id);
      setClases(data);
    } catch {
      setClases([]);
    } finally {
      setClasesLoading(false);
    }
  }, [id]);

  const loadHorarios = useCallback(async () => {
    if (!id) return;
    setHorariosLoading(true);
    try {
      const data = await horarioService.listar(id);
      setHorarios(data);
    } catch {
      setHorarios([]);
    } finally {
      setHorariosLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(stored);
    setUserData(user);

    const storedRole = sessionStorage.getItem('role') || 'estudiante';
    setRole(storedRole as 'estudiante' | 'profesor');

    loadClases();
    loadHorarios();
  }, [loadClases, loadHorarios, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const grouped = clases.reduce<Record<string, Clase[]>>((acc, c) => {
    const key = c.fecha;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const colorIdx = state?.colorIdx ?? 0;
  const color = cardColors[colorIdx % cardColors.length];

  const handleDeleteClase = async (id: number) => {
    if (!window.confirm('¿Eliminar esta clase?')) return;
    await claseService.eliminar(id);
    await loadClases();
  };

  const horariosByDay = ([] as number[]).concat(1, 2, 3, 4, 5).map(dia => ({
    dia,
    label: DIAS_SEMANA[dia],
    bloques: horarios.filter(h => h.diaSemana === dia).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
  }));

  return (
    <DashboardLayout userData={userData} role={role} onLogout={handleLogout}>
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al panel
        </button>

        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${color.light} flex items-center justify-center text-3xl flex-shrink-0`}>
            {getSubjectIcon(state?.subjectName || '')}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">
              {state?.subjectName || 'Asignatura'}
            </h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {state?.subjectCode && (
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full ${color.badge}`}>
                  {state.subjectCode}
                </span>
              )}
              {state?.courseName && (
                <span className="text-sm text-slate-500">
                  Curso: {state.courseName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('horario')}
          className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
            tab === 'horario'
              ? 'bg-white text-emerald-600 border border-b-0 border-slate-200 -mb-px shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Horario
        </button>
        <button
          onClick={() => setTab('clases')}
          className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
            tab === 'clases'
              ? 'bg-white text-emerald-600 border border-b-0 border-slate-200 -mb-px shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Clases
        </button>
      </div>

      {tab === 'horario' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Horario Semanal</h3>
            {isProfessor && (
              <button
                onClick={() => { setEditingHorario(null); setShowHorarioModal(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Bloque
              </button>
            )}
          </div>

          {horariosLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : horarios.length > 0 ? (
            <div className="space-y-6">
              {horariosByDay.map(({ dia, label, bloques }) => (
                <div key={dia}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                    <h4 className="text-base font-semibold text-slate-700">{label}</h4>
                    {bloques.length === 0 && <span className="text-xs text-slate-400">Sin bloques</span>}
                  </div>
                  {bloques.length > 0 && (
                    <div className="space-y-2">
                      {bloques.map(h => (
                        <div key={h.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow flex">
                          <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                          <div className="flex-1 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                                {h.horaInicio.slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {h.horaInicio} - {h.horaTermino}
                                </p>
                                <p className="text-xs text-slate-400">{label} · {h.horaInicio} a {h.horaTermino}</p>
                              </div>
                            </div>
                            {isProfessor && (
                              <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingHorario(h); setShowHorarioModal(true); }}
                                  className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                                  title="Editar"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!window.confirm('¿Eliminar este bloque horario?')) return;
                                    await horarioService.eliminar(h.id);
                                    await loadHorarios();
                                  }}
                                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                  title="Eliminar"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Sin horario definido</p>
              <p className="text-slate-400 text-sm mt-1">
                {isProfessor ? 'Agrega bloques horarios usando el botón "Agregar Bloque"' : 'El profesor aún no ha definido el horario'}
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'clases' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Clases</h3>
            {isProfessor && (
              <button
                onClick={() => { setEditingClase(null); setShowClaseModal(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Clase
              </button>
            )}
          </div>

          {clasesLoading ? (
            <div className="space-y-6">
              {[1, 2].map((g) => (
                <div key={g}>
                  <div className="h-5 bg-slate-200 rounded w-1/4 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2].map((c) => (
                      <div key={c} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse">
                        <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : clases.length > 0 ? (
            <div className="space-y-8">
              {sortedDates.map((fecha) => (
                <div key={fecha}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                    <h4 className="text-base font-semibold text-slate-700 capitalize">
                      {formatDate(fecha)}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">{fecha}</span>
                  </div>

                  <div className="space-y-3">
                    {grouped[fecha].map((clase) => (
                      <div
                        key={clase.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow flex"
                      >
                        <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h5 className="text-base font-semibold text-slate-800">{clase.titulo}</h5>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${estadoBadge[clase.estado] || estadoBadge['pendiente']}`}>
                                  {estadoLabel[clase.estado] || clase.estado}
                                </span>
                              </div>
                              {clase.descripcion && (
                                <p className="text-sm text-slate-500 mt-1.5">{clase.descripcion}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2.5 text-sm text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{clase.horaInicio} - {clase.horaTermino}</span>
                              </div>
                            </div>
                            {isProfessor && (
                              <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingClase(clase); setShowClaseModal(true); }}
                                  className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                                  title="Editar"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteClase(clase.id)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                  title="Eliminar"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No hay clases registradas</p>
              <p className="text-slate-400 text-sm mt-1">
                {isProfessor ? 'Crea la primera clase usando el botón "Nueva Clase"' : 'El profesor aún no ha registrado clases'}
              </p>
            </div>
          )}
        </>
      )}

      <ClaseFormModal
        isOpen={showClaseModal}
        onClose={() => { setShowClaseModal(false); setEditingClase(null); }}
        onSave={async (data) => {
          if (editingClase) {
            await claseService.actualizar(editingClase.id, data);
          } else {
            await claseService.crear({ ...data, cursoAsignaturaId: id });
          }
          await loadClases();
        }}
        editingClase={editingClase}
      />

      <HorarioFormModal
        isOpen={showHorarioModal}
        onClose={() => { setShowHorarioModal(false); setEditingHorario(null); }}
        onSave={async (data) => {
          if (editingHorario) {
            await horarioService.actualizar(editingHorario.id, data);
          } else {
            await horarioService.crear({ ...data, cursoAsignaturaId: id });
          }
          await loadHorarios();
        }}
        editingHorario={editingHorario}
      />
    </DashboardLayout>
  );
};

const subjectIcons: Record<string, string> = {
  matemáticas: '📐',
  lenguaje: '📖',
  inglés: '🌐',
  historia: '🏛️',
  ciencias: '🔬',
  'educación física': '⚽',
  arte: '🎨',
  música: '🎵',
};

const getSubjectIcon = (name: string): string => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(subjectIcons)) {
    if (key.includes(k)) return v;
  }
  return '📄';
};

export default SubjectDetail;
