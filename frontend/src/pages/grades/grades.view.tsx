import React, { FC, ReactElement, useEffect, useState } from 'react';
import gradesService from './services/grades.service';
import type { StudentGrades } from './services/grades.service';

const GradesView: FC = (): ReactElement => {
  const [grades, setGrades] = useState<StudentGrades | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const stored = sessionStorage.getItem('user');
        if (!stored) {
          setError('Sin sesión activa');
          setLoading(false);
          return;
        }
        const userData = JSON.parse(stored);
        const rut = userData.rut;
        if (!rut) {
          setError('RUT de estudiante no encontrado');
          setLoading(false);
          return;
        }
        const data = await gradesService.getStudentGrades(rut);
        setGrades(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar notas');
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Mis Notas</h3>
        <p className="text-sm text-slate-500 mt-1">
          {grades ? `Curso: ${grades.course}` : 'Cargando...'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : grades ? (
        <div className="space-y-6">
          {grades.subjects.map((subj, idx) => {
            const colores = ['bg-emerald-50 border-emerald-200', 'bg-sky-50 border-sky-200', 'bg-violet-50 border-violet-200', 'bg-rose-50 border-rose-200', 'bg-amber-50 border-amber-200'];
            const color = colores[idx % colores.length];
            return (
              <div key={subj.subject} className={`rounded-2xl border p-5 ${color}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-slate-800">{subj.subject}</h4>
                  <span className="text-sm font-bold text-slate-600">
                    Promedio: <span className="text-lg">{subj.average}</span>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="pb-2 font-medium">Nota</th>
                        <th className="pb-2 font-medium">Tipo</th>
                        <th className="pb-2 font-medium">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subj.grades.map((grade) => (
                        <tr key={grade.id} className="border-b border-slate-100">
                          <td className="py-2 font-semibold text-slate-800">{grade.grade}</td>
                          <td className="py-2 text-slate-600 capitalize">{grade.evaluationType}</td>
                          <td className="py-2 text-slate-600">{grade.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">No hay notas registradas</p>
        </div>
      )}
    </>
  );
};

export default GradesView;
