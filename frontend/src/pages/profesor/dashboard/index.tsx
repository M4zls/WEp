import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/store';
import courseService from '../../cursos/service';
import type { CursoInfo, UserData } from '../types';
import DashboardLayout from '../../../layout/DashboardLayout';

interface FlatMateria {
  id: number;
  asignatura_nombre: string;
  asignatura_codigo?: string;
  estudiantes: number;
  curso_nombre: string;
  curso_id: number;
}

const cardColors = [
  { bar: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  { bar: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-700', badge: 'bg-sky-100 text-sky-700' },
  { bar: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' },
  { bar: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700' },
  { bar: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  { bar: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700' },
];

const subjectIcons: Record<string, string> = {
  'matemáticas': '📐',
  'lenguaje': '📖',
  'inglés': '🌐',
  'historia': '🏛️',
  'ciencias': '🔬',
  'educación física': '⚽',
  'arte': '🎨',
  'música': '🎵',
};

const getSubjectIcon = (name: string): string => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(subjectIcons)) {
    if (key.includes(k)) return v;
  }
  return '📄';
};

const ProfessorDashboard: FC = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const locationState = location.state as { section?: string } | null;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [materias, setMaterias] = useState<FlatMateria[]>([]);
  const [cursos, setCursos] = useState<CursoInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');

    const storedUser = stored ? JSON.parse(stored) as UserData : null;
    setUserData(storedUser);
    const profesorId = storedUser?.id;

    courseService.obtenerCursos().then(async (lista) => {
      const cursosConMaterias: CursoInfo[] = [];
      const todasMaterias: FlatMateria[] = [];

      for (const c of lista) {
        try {
          const materiasData = await courseService.obtenerMaterias(c.id);
          const materiasFiltradas = profesorId
            ? materiasData.filter((m: any) => m.profesorId === profesorId)
            : [];

          if (materiasFiltradas.length > 0) {
            let estudiantesCount = 0;
            try {
              const estudiantesData = await courseService.obtenerEstudiantesPorCurso(c.nombre);
              estudiantesCount = Array.isArray(estudiantesData) ? estudiantesData.length : 0;
            } catch {
              estudiantesCount = 0;
            }

            cursosConMaterias.push({
              id: c.id,
              nombre: c.nombre,
              nivel: c.nivel || '',
              letra: c.letra || '',
              materias: materiasFiltradas.map((m: any) => ({
                id: m.id,
                asignatura_nombre: m.asignaturaNombre,
                asignatura_codigo: m.asignaturaCodigo,
                estudiantes: estudiantesCount,
              })),
            });

            for (const raw of materiasFiltradas) {
              const m = raw as any;
              todasMaterias.push({
                id: m.id,
                asignatura_nombre: m.asignaturaNombre,
                asignatura_codigo: m.asignaturaCodigo,
                estudiantes: estudiantesCount,
                curso_nombre: c.nombre,
                curso_id: c.id,
              });
            }
          }
        } catch {
          // skip curso if materias fetch fails
        }
      }

      setCursos(cursosConMaterias);
      setMaterias(todasMaterias);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout userData={userData} role="profesor" onLogout={handleLogout} defaultSection={locationState?.section}>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Mis Asignaturas</h3>
        <p className="text-sm text-slate-500 mt-1">Vista general de tus asignaturas por curso</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse flex gap-4">
              <div className="w-1.5 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : materias.length > 0 ? (
        <div className="space-y-4">
          {materias.map((mat, idx) => {
            const color = cardColors[idx % cardColors.length];
            return (
              <div
                key={mat.id}
                onClick={() => navigate(`/dashboard/materia/${mat.id}`, {
                  state: {
                    subjectName: mat.asignatura_nombre,
                    subjectCode: mat.asignatura_codigo,
                    courseName: mat.curso_nombre,
                    colorIdx: idx,
                  },
                })}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex cursor-pointer"
              >
                <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                <div className="flex-1 p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${color.light} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {getSubjectIcon(mat.asignatura_nombre)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-lg font-semibold text-slate-800">{mat.asignatura_nombre}</h4>
                      {mat.asignatura_codigo && (
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${color.badge}`}>
                          {mat.asignatura_codigo}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Curso: <span className="font-medium text-slate-600">{mat.curso_nombre}</span>
                      <span className="mx-2">·</span>
                      {mat.estudiantes} estudiante(s)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No tienes asignaturas asignadas</p>
          <p className="text-slate-400 text-sm mt-1">Espera a que te asignen cursos</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfessorDashboard;
