import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import courseService from '../../shared/courses/course.service';

interface UserData {
  id?: number;
  rut?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface CursoInfo {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
  materias: { id: number; asignatura_nombre: string; estudiantes: number }[];
}

const ProfessorDashboard: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [cursos, setCursos] = useState<CursoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored) as UserData;
      setUserData(user);

      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Buenos días');
      else if (hour < 18) setGreeting('Buenas tardes');
      else setGreeting('Buenas noches');
    }

    const storedUser = stored ? JSON.parse(stored) as UserData : null;
    const profesorId = storedUser?.id;

    courseService.obtenerCursos().then(async (lista) => {
      const cursosConMaterias: CursoInfo[] = [];

      for (const c of lista) {
        try {
          const materias = await courseService.obtenerMaterias(c.id);
          const materiasFiltradas = profesorId
            ? materias.filter((m: any) => m.profesorId === profesorId)
            : [];
          if (materiasFiltradas.length > 0) {
            cursosConMaterias.push({
              id: c.id,
              nombre: c.nombre,
              nivel: c.nivel || '',
              letra: c.letra || '',
              materias: materiasFiltradas.map((m: any) => ({
                id: m.id,
                asignatura_nombre: m.asignaturaNombre,
                estudiantes: 0,
              })),
            });
          }
        } catch {
          // skip curso if materias fetch fails
        }
      }

      setCursos(cursosConMaterias);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  const getInitials = (): string => {
    if (!userData) return '?';
    const first = userData.nombre?.charAt(0) || '';
    const last = userData.apellido?.charAt(0) || '';
    return `${first}${last}`;
  };

  const colors = [
    { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
    { bg: 'from-sky-500 to-blue-600', light: 'bg-sky-50', text: 'text-sky-600' },
    { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600' },
    { bg: 'from-rose-500 to-pink-600', light: 'bg-rose-50', text: 'text-rose-600' },
    { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50', text: 'text-amber-600' },
    { bg: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-600' },
  ];

  const totalCursos = cursos.length;
  const totalMaterias = cursos.reduce((acc, c) => acc + c.materias.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">Portal Profesor</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">
                {userData?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {userData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">
                  {greeting}, {userData.nombre} {userData.apellido}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profesor
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    {userData.rut}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Cursos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalCursos}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Asignaturas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalMaterias}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Estudiantes</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">10</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Mis Cursos y Asignaturas</h3>
          <p className="text-sm text-slate-500 mt-1">Vista general de tus cursos asignados</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cursos.map((curso, idx) => {
              const color = colors[idx % colors.length];
              return (
                <div
                  key={curso.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${color.bg} px-6 py-4`}>
                    <h4 className="text-white font-bold text-lg">{curso.nombre}</h4>
                    <p className="text-white/80 text-sm mt-0.5">{curso.materias.length} asignatura(s)</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {curso.materias.length > 0 ? (
                      curso.materias.map((mat) => (
                        <div key={mat.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${color.light} flex items-center justify-center`}>
                              <svg className={`w-4 h-4 ${color.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="font-medium text-slate-700">{mat.asignatura_nombre}</span>
                          </div>
                          <span className="text-sm text-slate-500">{mat.estudiantes} est.</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-4">Sin asignaturas asignadas</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && cursos.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No tienes cursos asignados</p>
            <p className="text-slate-400 text-sm mt-1">Espera a que te asignen cursos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
