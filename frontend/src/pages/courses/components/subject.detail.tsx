import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/store';
import DashboardLayout from '../../../layout/DashboardLayout';
import classesService from '../../classes/classes.service';
import scheduleService from '../../schedule/schedule.service';
import attendanceService from '../../attendance/attendance.service';
import coursesService from '../courses.service';
import type { SchoolClass } from '../../classes/class.types';
import type { Schedule } from '../../schedule/schedule.types';
import type { Attendance } from '../../attendance/attendance.types';
import { CLASS_STATUSES } from '../../classes/class.types';
import { WEEK_DAYS } from '../../schedule/schedule.types';
import ClassFormModal from './class-form.modal';
import ScheduleFormModal from './schedule-form.modal';

interface LocationState {
  subjectName?: string;
  subjectCode?: string;
  courseName?: string;
  colorIdx?: number;
}

type Tab = 'schedule' | 'classes' | 'attendance';

const cardColors = [
  { bar: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  { bar: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-700', badge: 'bg-sky-100 text-sky-700' },
  { bar: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' },
  { bar: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700' },
  { bar: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  { bar: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700' },
];

const statusBadge: Record<string, string> = {
  [CLASS_STATUSES.PENDING]: 'bg-amber-100 text-amber-700',
  [CLASS_STATUSES.COMPLETED]: 'bg-emerald-100 text-emerald-700',
  [CLASS_STATUSES.CANCELLED]: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  [CLASS_STATUSES.PENDING]: 'Pendiente',
  [CLASS_STATUSES.COMPLETED]: 'Completada',
  [CLASS_STATUSES.CANCELLED]: 'Cancelada',
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
  const { courseSubjectId } = useParams<{ courseSubjectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const authUser = useAuthStore((s) => s.user);
  const authRole = useAuthStore((s) => s.role);

  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<'student' | 'professor'>(authRole || 'student');
  const [tab, setTab] = useState<Tab>('schedule');

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [attendanceClassId, setAttendanceClassId] = useState<number | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [courseStudents, setCourseStudents] = useState<any[]>([]);
  const [attendanceSaving, setAttendanceSaving] = useState(false);

  const isProfessor = role === 'professor';
  const id = Number(courseSubjectId);

  const loadClasses = useCallback(async () => {
    if (!id) return;
    setClassesLoading(true);
    try {
      const data = await classesService.list(id);
      setClasses(data);
    } catch {
      setClasses([]);
    } finally {
      setClassesLoading(false);
    }
  }, [id]);

  const loadSchedules = useCallback(async () => {
    if (!id) return;
    setSchedulesLoading(true);
    try {
      const data = await scheduleService.list(id);
      setSchedules(data);
    } catch {
      setSchedules([]);
    } finally {
      setSchedulesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : authUser;
    const effectiveRole = (stored ? sessionStorage.getItem('role') : authRole) || 'student';
    setUserData(user);
    setRole(effectiveRole as 'student' | 'professor');

    loadClasses();
    loadSchedules();

    if (effectiveRole === 'professor' && state?.courseName) {
      coursesService.getStudentsByCourse(state.courseName)
        .then(data => setCourseStudents(Array.isArray(data) ? data : []))
        .catch(() => setCourseStudents([]));
    }
  }, [loadClasses, loadSchedules, navigate, state?.courseName, authUser, authRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const grouped = classes.reduce<Record<string, SchoolClass[]>>((acc, c) => {
    const key = c.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const colorIdx = state?.colorIdx ?? 0;
  const color = cardColors[colorIdx % cardColors.length];

  const handleDeleteClass = async (id: number) => {
    if (!window.confirm('¿Eliminar esta clase?')) return;
    await classesService.remove(id);
    await loadClasses();
  };

  const schedulesByDay = ([] as number[]).concat(1, 2, 3, 4, 5).map(day => ({
    day,
    label: WEEK_DAYS[day],
    blocks: schedules.filter(h => h.weekDay === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <DashboardLayout userData={userData} role={role} onLogout={handleLogout} defaultSection={role === 'professor' ? 'courses' : 'classes'}>
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard', { state: { section: role === 'professor' ? 'courses' : 'classes' } })}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
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
          onClick={() => setTab('schedule')}
          className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
            tab === 'schedule'
              ? 'bg-white text-emerald-600 border border-b-0 border-slate-200 -mb-px shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Horario
        </button>
        <button
          onClick={() => setTab('classes')}
          className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
            tab === 'classes'
              ? 'bg-white text-emerald-600 border border-b-0 border-slate-200 -mb-px shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Clases
        </button>
        {isProfessor && (
          <button
            onClick={() => setTab('attendance')}
            className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
              tab === 'attendance'
                ? 'bg-white text-emerald-600 border border-b-0 border-slate-200 -mb-px shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Asistencia
          </button>
        )}
      </div>

      {tab === 'schedule' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Horario Semanal</h3>
            {isProfessor && (
              <button
                onClick={() => { setEditingSchedule(null); setShowScheduleModal(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Bloque
              </button>
            )}
          </div>

          {schedulesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-6">
              {schedulesByDay.map(({ day, label, blocks }) => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                    <h4 className="text-base font-semibold text-slate-700">{label}</h4>
                    {blocks.length === 0 && <span className="text-xs text-slate-400">Sin bloques</span>}
                  </div>
                  {blocks.length > 0 && (
                    <div className="space-y-2">
                      {blocks.map(h => (
                        <div key={h.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow flex">
                          <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                          <div className="flex-1 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                                {h.startTime.slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {h.startTime} - {h.endTime}
                                </p>
                                <p className="text-xs text-slate-400">{label} · {h.startTime} - {h.endTime}</p>
                              </div>
                            </div>
                            {isProfessor && (
                              <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingSchedule(h); setShowScheduleModal(true); }}
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
                                    await scheduleService.remove(h.id);
                                    await loadSchedules();
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
              <p className="text-slate-500 font-medium">Horario no definido</p>
              <p className="text-slate-400 text-sm mt-1">
                {isProfessor ? 'Agrega bloques usando el botón "Agregar Bloque"' : 'El profesor aún no ha definido el horario'}
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'classes' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Clases</h3>
            {isProfessor && (
              <button
                onClick={() => { setEditingClass(null); setShowClassModal(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Clase
              </button>
            )}
          </div>

          {classesLoading ? (
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
          ) : classes.length > 0 ? (
            <div className="space-y-8">
              {sortedDates.map((date) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                    <h4 className="text-base font-semibold text-slate-700 capitalize">
                      {formatDate(date)}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">{date}</span>
                  </div>

                  <div className="space-y-3">
                    {grouped[date].map((clase) => (
                      <div
                        key={clase.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow flex"
                      >
                        <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h5 className="text-base font-semibold text-slate-800">{clase.title}</h5>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge[clase.status] || statusBadge['pending']}`}>
                                  {statusLabel[clase.status] || clase.status}
                                </span>
                              </div>
                              {clase.description && (
                                <p className="text-sm text-slate-500 mt-1.5">{clase.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2.5 text-sm text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{clase.startTime} - {clase.endTime}</span>
                              </div>
                            </div>
                            {isProfessor && (
                              <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingClass(clase); setShowClassModal(true); }}
                                  className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                                  title="Editar"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(clase.id)}
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
                {isProfessor ? 'Crea la primera clase con el botón "Nueva Clase"' : 'El profesor aún no ha registrado clases'}
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'attendance' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Asistencia</h3>
          </div>

          {classes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 font-medium">No hay clases registradas</p>
              <p className="text-slate-400 text-sm mt-1">Crea una clase primero para registrar asistencia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar una clase</label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {classes.sort((a, b) => b.date.localeCompare(a.date)).map(cl => (
                    <button
                      key={cl.id}
                      onClick={async () => {
                        setAttendanceClassId(cl.id);
                        setAttendanceLoading(true);
                        try {
                          const data = await attendanceService.listByClass(cl.id);
                          setAttendances(data);
                        } catch {
                          setAttendances([]);
                        } finally {
                          setAttendanceLoading(false);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        attendanceClassId === cl.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-700">{cl.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cl.date} · {cl.startTime} - {cl.endTime}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                {!attendanceClassId ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">Selecciona una clase para gestionar asistencia</p>
                  </div>
                ) : attendanceLoading ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-pulse">
                    <p className="text-slate-400">Cargando asistencia...</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-semibold text-slate-700">
                        {courseStudents.length} estudiante(s) en el curso
                      </h4>
                      <button
                        onClick={async () => {
                          if (!attendanceClassId) return;
                          setAttendanceSaving(true);
                          try {
                            const records = courseStudents.map((est: any) => {
                              const existing = attendances.find(a => a.studentRut === est.rut);
                              return {
                                studentRut: est.rut,
                                studentFirstName: `${est.firstName} ${est.lastName || ''}`.trim(),
                                present: existing ? existing.present : true,
                              };
                            });
                            await attendanceService.mark({
                              classId: attendanceClassId,
                              courseSubjectId: id,
                              records,
                            });
                            const updated = await attendanceService.listByClass(attendanceClassId);
                            setAttendances(updated);
                          } catch (err) {
                            console.error('Error saving attendance:', err);
                          } finally {
                            setAttendanceSaving(false);
                          }
                        }}
                        disabled={attendanceSaving}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {attendanceSaving ? 'Guardando...' : 'Guardar Todo'}
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 font-medium text-slate-600">RUT</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">Nombre</th>
                            <th className="text-center px-4 py-3 font-medium text-slate-600">Presente</th>
                            <th className="text-center px-4 py-3 font-medium text-slate-600">Ausente</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {courseStudents.map((est: any) => {
                            const asis = attendances.find(a => a.studentRut === est.rut);
                            const present = asis ? asis.present : true;
                            return (
                              <tr key={est.rut} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{est.rut}-{est.dv}</td>
                                <td className="px-4 py-3 text-slate-700 font-medium">{est.firstName} {est.lastName}</td>
                                <td className="text-center px-4 py-3">
                                  <button
                                    onClick={async () => {
                                      if (!attendanceClassId) return;
                                      try {
                                        await attendanceService.mark({
                                          classId: attendanceClassId,
                                          courseSubjectId: id,
                                          records: [{
                                            studentRut: est.rut,
                                            studentFirstName: `${est.firstName} ${est.lastName || ''}`.trim(),
                                            present: true,
                                          }],
                                        });
                                        const updated = await attendanceService.listByClass(attendanceClassId);
                                        setAttendances(updated);
                                      } catch (err) { console.error(err); }
                                    }}
                                    className={`w-8 h-8 rounded-full transition ${
                                      present
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                    }`}
                                  >
                                    ✓
                                  </button>
                                </td>
                                <td className="text-center px-4 py-3">
                                  <button
                                    onClick={async () => {
                                      if (!attendanceClassId) return;
                                      try {
                                        await attendanceService.mark({
                                          classId: attendanceClassId,
                                          courseSubjectId: id,
                                          records: [{
                                            studentRut: est.rut,
                                            studentFirstName: `${est.firstName} ${est.lastName || ''}`.trim(),
                                            present: false,
                                          }],
                                        });
                                        const updated = await attendanceService.listByClass(attendanceClassId);
                                        setAttendances(updated);
                                      } catch (err) { console.error(err); }
                                    }}
                                    className={`w-8 h-8 rounded-full transition ${
                                      !present
                                        ? 'bg-red-500 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                    }`}
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <ClassFormModal
        isOpen={showClassModal}
        onClose={() => { setShowClassModal(false); setEditingClass(null); }}
        onSave={async (data) => {
          if (editingClass) {
            await classesService.update(editingClass.id, data);
          } else {
            await classesService.create({ ...data, courseSubjectId: id });
          }
          await loadClasses();
        }}
        editingClass={editingClass}
      />

      <ScheduleFormModal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setEditingSchedule(null); }}
        onSave={async (data) => {
          if (editingSchedule) {
            await scheduleService.update(editingSchedule.id, data);
          } else {
            await scheduleService.create({ ...data, courseSubjectId: id });
          }
          await loadSchedules();
        }}
        editingSchedule={editingSchedule}
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
