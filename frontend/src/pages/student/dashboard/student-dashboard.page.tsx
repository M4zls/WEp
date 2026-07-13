import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/store';
import coursesService from '../../courses/courses.service';
import type { CourseInfo, UserData } from '../student.types';
import DashboardLayout from '../../../layout/DashboardLayout';

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

const StudentDashboard: FC = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { section?: string } | null;
  const logout = useAuthStore((s) => s.logout);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [curso, setCurso] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (!stored) {
      setLoading(false);
      return;
    }

    let user: any;
    try { user = JSON.parse(stored); } catch { setLoading(false); return; }
    setUserData(user as UserData);

    const loadCurso = async () => {
      try {
        const courseName = user.courses;
        if (!courseName) {
          setLoading(false);
          return;
        }

        const lista = await coursesService.getCourses();
        const miCurso = lista.find((c: any) => c.name === courseName);
        if (!miCurso) {
          setLoading(false);
          return;
        }

        const subjectsData = await coursesService.getSubjectsByCourse(miCurso.id);
        setCurso({
          id: miCurso.id,
          name: miCurso.name,
          level: miCurso.level || '',
          letter: miCurso.letter || '',
          subjects: subjectsData.map((m: any) => ({
            id: m.id,
            subjectName: m.subjectName,
            subjectCode: m.subjectCode,
            professorFirstName: m.professorFirstName || '',
            professorLastName: m.professorLastName || '',
          })),
        });
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    loadCurso();
  }, []);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  const allSubjects = curso?.subjects || [];

  return (
    <DashboardLayout userData={userData} role="student" onLogout={handleLogout} defaultSection={locationState?.section}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Mis Asignaturas</h3>
          <p className="text-sm text-slate-500 mt-1">
            {curso ? `Curso: ${curso.name}` : 'Curso no asignado'}
          </p>
        </div>

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
      ) : allSubjects.length > 0 ? (
        <div className="space-y-4">
          {allSubjects.map((mat, idx) => {
            const color = cardColors[idx % cardColors.length];
            return (
              <div
                key={mat.id}
                onClick={() => navigate(`/dashboard/subject/${mat.id}`, {
                  state: {
                    subjectName: mat.subjectName,
                    subjectCode: mat.subjectCode,
                    courseName: curso?.name,
                    colorIdx: idx,
                  },
                })}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex cursor-pointer"
              >
                <div className={`w-1.5 flex-shrink-0 ${color.bar}`} />
                <div className="flex-1 p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${color.light} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {getSubjectIcon(mat.subjectName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-lg font-semibold text-slate-800">{mat.subjectName}</h4>
                      {mat.subjectCode && (
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${color.badge}`}>
                          {mat.subjectCode}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {mat.professorFirstName && mat.professorLastName
                        ? `${mat.professorFirstName} ${mat.professorLastName}`
                        : mat.professorFirstName || 'Sin profesor'}
                      {curso && <span className="mx-2">·</span>}
                      {curso && <span className="text-slate-400">{curso.name}</span>}
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
          <p className="text-slate-400 text-sm mt-1">Espera a que te asignen un curso</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
