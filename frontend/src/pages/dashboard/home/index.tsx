import React, { FC, ReactElement, useEffect, useState, useCallback } from 'react';
import classesService from '../../classes/classes.service';
import type { SchoolClass } from '../../classes/class.types';
import courseService from '../../courses/courses.service';

interface HomeViewProps {
  userData: { firstName?: string; lastName?: string; email?: string; rut?: string; courses?: string } | null;
  role: 'student' | 'professor';
  onGoToSubjects: () => void;
}

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const HomeView: FC<HomeViewProps> = ({ userData, role, onGoToSubjects }): ReactElement => {
  const [greeting, setGreeting] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState<SchoolClass[]>([]);
  const [stats, setStats] = useState({ subjects: 0, courses: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const stored = sessionStorage.getItem('user');
      if (!stored) return;
      const user = JSON.parse(stored);

      if (role === 'student') {
        const courseName = user.courses;
        if (courseName) {
          const lista = await courseService.getCourses();
          const myCourse: any = lista.find((c: any) => c.name === courseName);
          if (myCourse) {
            const subjects = await courseService.getSubjectsByCourse(myCourse.id);
            setStats({ subjects: subjects.length, courses: 1 });

            const ids = subjects.map((m: any) => m.id);
            if (ids.length > 0) {
              const todas: SchoolClass[] = [];
              for (const id of ids) {
                try {
                  const cs = await classesService.list(id);
                  todas.push(...cs);
                } catch { /* skip */ }
              }
              const hoy = new Date();
              const dentroDe7 = new Date();
              dentroDe7.setDate(hoy.getDate() + 7);
              const proximas = todas
                .filter(c => c.status === 'pending' && c.date >= hoy.toISOString().slice(0, 10))
                .filter(c => c.date <= dentroDe7.toISOString().slice(0, 10))
                .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                .slice(0, 5);
              setUpcomingClasses(proximas);
            }
          }
        }
      } else {
        const professorId = user.id;
        const lista = await courseService.getCourses();
        let totalSubjects = 0;
        const ids: number[] = [];
        for (const c of lista) {
          try {
            const subjects = await courseService.getSubjectsByCourse(c.id);
            const filtered = subjects.filter((m: any) => m.professorId === professorId);
            totalSubjects += filtered.length;
            ids.push(...filtered.map((m: any) => m.id));
          } catch { /* skip */ }
        }
        setStats({ subjects: totalSubjects, courses: lista.length });

        if (ids.length > 0) {
          const todas: SchoolClass[] = [];
          for (const id of ids) {
            try {
              const cs = await classesService.list(id);
              todas.push(...cs);
            } catch { /* skip */ }
          }
          const hoy = new Date();
          const dentroDe7 = new Date();
          dentroDe7.setDate(hoy.getDate() + 7);
          const proximas = todas
            .filter(c => c.status === 'pending' && c.date >= hoy.toISOString().slice(0, 10))
            .filter(c => c.date <= dentroDe7.toISOString().slice(0, 10))
            .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
            .slice(0, 5);
          setUpcomingClasses(proximas);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');

    loadData();
  }, [loadData]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <>
      {userData && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userData.firstName?.charAt(0) || '?'}{userData.lastName?.charAt(0) || ''}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">
                {greeting}, {userData.firstName} {userData.lastName}
              </h2>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">
                  {role === 'student' ? 'Estudiante' : 'Profesor'}
                </span>
                <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {userData.rut}
                </span>
                {role === 'student' && userData.courses && (
                  <span className="inline-flex items-center gap-1 text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">
                    {userData.courses}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Asignaturas</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '—' : stats.subjects}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        {role === 'professor' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Cursos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {loading ? '—' : stats.courses}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Próximas Clases</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '—' : upcomingClasses.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Próximas Clases</h3>
          <button
            onClick={onGoToSubjects}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
          >
            Ver todo →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="space-y-2">
            {upcomingClasses.map(clase => (
              <div key={clase.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                  {new Date(clase.date + 'T12:00:00').getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{clase.title}</p>
                  <p className="text-xs text-slate-400 capitalize">{formatDate(clase.date)} · {clase.startTime} - {clase.endTime}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadge[clase.status] || 'bg-slate-100 text-slate-600'}`}>
                  {statusLabel[clase.status] || clase.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-6">No hay clases programadas para los próximos días</p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onGoToSubjects}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Ir a Mis Asignaturas
        </button>
      </div>
    </>
  );
};

export default HomeView;
