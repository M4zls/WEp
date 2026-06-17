import React, { FC, ReactElement, useEffect, useState } from 'react';
import calificacionesService from './services/calificacionesService';
import type { CalificacionesAlumno } from './services/calificacionesService';

const CalificacionesView: FC = (): ReactElement => {
  const [calificaciones, setCalificaciones] = useState<CalificacionesAlumno | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCalificaciones = async () => {
      try {
        const stored = sessionStorage.getItem('user');
        if (!stored) {
          setError('No hay sesión activa');
          setCargando(false);
          return;
        }
        const userData = JSON.parse(stored);
        const rut = userData.rut;
        if (!rut) {
          setError('RUT de estudiante no encontrado');
          setCargando(false);
          return;
        }
        const data = await calificacionesService.obtenerCalificacionesAlumno(rut);
        setCalificaciones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar calificaciones');
      } finally {
        setCargando(false);
      }
    };
    cargarCalificaciones();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Mis Calificaciones</h3>
        <p className="text-sm text-slate-500 mt-1">
          {calificaciones ? `Curso: ${calificaciones.curso}` : 'Cargando...'}
        </p>
      </div>

      {cargando ? (
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
      ) : calificaciones ? (
        <div className="space-y-6">
          {calificaciones.asignaturas.map((asig, idx) => {
            const colores = ['bg-emerald-50 border-emerald-200', 'bg-sky-50 border-sky-200', 'bg-violet-50 border-violet-200', 'bg-rose-50 border-rose-200', 'bg-amber-50 border-amber-200'];
            const color = colores[idx % colores.length];
            return (
              <div key={asig.asignatura} className={`rounded-2xl border p-5 ${color}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-slate-800">{asig.asignatura}</h4>
                  <span className="text-sm font-bold text-slate-600">
                    Promedio: <span className="text-lg">{asig.promedio}</span>
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
                      {asig.notas.map((nota) => (
                        <tr key={nota.id} className="border-b border-slate-100">
                          <td className="py-2 font-semibold text-slate-800">{nota.nota}</td>
                          <td className="py-2 text-slate-600 capitalize">{nota.tipoEvaluacion}</td>
                          <td className="py-2 text-slate-600">{nota.fecha}</td>
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
          <p className="text-slate-500 font-medium">No tienes calificaciones registradas</p>
        </div>
      )}
    </>
  );
};

export default CalificacionesView;
