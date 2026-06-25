import React, { FC, ReactElement, useEffect, useState, useCallback } from 'react';
import coursesService from '../courses/courses.service';
import gradesService from './services/grades.service';
import type { Grade, GradeInput } from './services/grades.service';

interface FlatMateria {
  id: number;
  asignatura_nombre: string;
  asignatura_codigo?: string;
  estudiantes: number;
  curso_nombre: string;
  curso_id: number;
}

interface EstudianteInfo {
  rut: string;
  nombre: string;
  apellido: string;
}

interface ColumnaEval {
  key: string;
  tipoEvaluacion: string;
  fecha: string;
  coeficiente: number;
}

type GridCelda = { valor: string; id?: number };
type GridData = Record<string, Record<string, GridCelda>>;

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

const EVAL_OPTIONS = [
  { value: 'prueba', label: 'Prueba' },
  { value: 'prueba_sintesis', label: 'Prueba de Síntesis' },
  { value: 'presentacion', label: 'Presentación' },
  { value: 'trabajo', label: 'Trabajo' },
];

const EVAL_LABELS: Record<string, string> = {};
for (const opt of EVAL_OPTIONS) {
  EVAL_LABELS[opt.value] = opt.label;
}

const formatearFecha = (f: string): string => {
  const partes = f.split('-');
  if (partes.length !== 3) return f;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const calcularPromedioPonderado = (rut: string, columnas: ColumnaEval[], grid: GridData): string => {
  let sumaPonderada = 0;
  let sumaCoefs = 0;
  for (const col of columnas) {
    const cell = grid[rut]?.[col.key];
    if (cell && cell.valor.trim()) {
      const n = parseFloat(cell.valor);
      if (!isNaN(n) && n >= 1.0 && n <= 7.0) {
        sumaPonderada += n * col.coeficiente;
        sumaCoefs += col.coeficiente;
      }
    }
  }
  if (sumaCoefs === 0) return '-';
  return (sumaPonderada / sumaCoefs).toFixed(1);
};

const getSituacionFinal = (prom: string): { label: string; color: string } => {
  if (prom === '-') return { label: '—', color: 'text-slate-400' };
  const num = parseFloat(prom);
  if (num >= 4.0) return { label: 'Aprobado', color: 'text-emerald-600' };
  return { label: 'Reprobado', color: 'text-red-600' };
};

const ManageGradesView: FC = (): ReactElement => {
  const [materias, setMaterias] = useState<FlatMateria[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);

  const [selectedMateria, setSelectedMateria] = useState<FlatMateria | null>(null);
  const [estudiantes, setEstudiantes] = useState<EstudianteInfo[]>([]);
  const [notasExistentes, setNotasExistentes] = useState<Grade[]>([]);
  const [columnas, setColumnas] = useState<ColumnaEval[]>([]);
  const [grid, setGrid] = useState<GridData>({});
  const [loadingTable, setLoadingTable] = useState(false);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [newEvalTipo, setNewEvalTipo] = useState('prueba');
  const [newEvalFecha, setNewEvalFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const userData = stored ? JSON.parse(stored) : null;
    const profesorId = userData?.id;

    coursesService.getCourses().then(async (lista) => {
      const todasMaterias: FlatMateria[] = [];

      for (const c of lista) {
        try {
          const materiasData = await coursesService.getSubjectsByCourse(c.id);
          const materiasFiltradas = profesorId
            ? materiasData.filter((m: any) => m.profesorId === profesorId)
            : [];

          for (const raw of materiasFiltradas) {
            const m = raw as any;
            let estudiantesCount = 0;
            try {
              const estudiantesData = await coursesService.getStudentsByCourse(c.nombre);
              estudiantesCount = Array.isArray(estudiantesData) ? estudiantesData.length : 0;
            } catch {
              estudiantesCount = 0;
            }
            todasMaterias.push({
              id: m.id,
              asignatura_nombre: m.asignaturaNombre,
              asignatura_codigo: m.asignaturaCodigo,
              estudiantes: estudiantesCount,
              curso_nombre: c.nombre,
              curso_id: c.id,
            });
          }
        } catch {
          // skip
        }
      }

      setMaterias(todasMaterias);
      setLoadingMaterias(false);
    }).catch(() => setLoadingMaterias(false));
  }, []);

  const construirGrid = useCallback((estudiantesLista: EstudianteInfo[], notas: Grade[], cols: ColumnaEval[]): GridData => {
    const nuevoGrid: GridData = {};
    for (const est of estudiantesLista) {
      nuevoGrid[est.rut] = {};
      for (const col of cols) {
        const match = notas.find(
          (n) => n.estudianteRut === est.rut && n.tipoEvaluacion === col.tipoEvaluacion && n.fecha === col.fecha,
        );
        nuevoGrid[est.rut][col.key] = match ? { valor: match.nota, id: match.id } : { valor: '' };
      }
    }
    return nuevoGrid;
  }, []);

  const handleSeleccionarMateria = useCallback(async (mat: FlatMateria) => {
    setSelectedMateria(mat);
    setLoadingTable(true);
    setMensaje(null);

    try {
      const stored = sessionStorage.getItem('user');
      const userData = stored ? JSON.parse(stored) : null;
      const profesorRut = userData?.rut || '';

      const [estudiantesData, notasData] = await Promise.all([
        coursesService.getStudentsByCourse(mat.curso_nombre),
        gradesService.getCourseGrades(mat.curso_nombre, profesorRut),
      ]);

      const lista = Array.isArray(estudiantesData) ? estudiantesData as EstudianteInfo[] : [];
      setEstudiantes(lista);

      const notasFiltradas = (Array.isArray(notasData) ? notasData : []).filter(
        (n: Grade) => n.asignatura === mat.asignatura_nombre,
      );
      setNotasExistentes(notasFiltradas);

      const colsMap = new Map<string, ColumnaEval>();
      for (const n of notasFiltradas) {
        const key = `${n.tipoEvaluacion}_${n.fecha}`;
        if (!colsMap.has(key)) {
          colsMap.set(key, { key, tipoEvaluacion: n.tipoEvaluacion, fecha: n.fecha, coeficiente: n.coeficiente ?? 1 });
        }
      }
      const cols = Array.from(colsMap.values());
      setColumnas(cols);
      setGrid(construirGrid(lista, notasFiltradas, cols));
    } catch (err) {
      setMensaje('Error al cargar estudiantes');
    } finally {
      setLoadingTable(false);
    }
  }, [construirGrid]);

  const handleVolver = () => {
    setSelectedMateria(null);
    setEstudiantes([]);
    setNotasExistentes([]);
    setColumnas([]);
    setGrid({});
    setMensaje(null);
  };

  const handleCellChange = (rut: string, colKey: string, valor: string) => {
    if (valor === '' || (parseFloat(valor) >= 0 && parseFloat(valor) <= 7)) {
      setGrid((prev) => ({
        ...prev,
        [rut]: {
          ...prev[rut],
          [colKey]: { ...prev[rut]?.[colKey], valor },
        },
      }));
    }
  };

  const handleAgregarColumna = () => {
    if (!newEvalFecha) return;
    const key = `${newEvalTipo}_${newEvalFecha}`;
    const existe = columnas.some((c) => c.key === key);
    if (existe) {
      setMensaje('Ya existe una evaluación con ese tipo y fecha');
      return;
    }
    const coef = newEvalTipo === 'prueba_sintesis' ? 2 : 1;
    const nuevaCol: ColumnaEval = { key, tipoEvaluacion: newEvalTipo, fecha: newEvalFecha, coeficiente: coef };
    const colsActualizadas = [...columnas, nuevaCol];
    setColumnas(colsActualizadas);
    setGrid((prev) => {
      const nuevo = { ...prev };
      for (const est of estudiantes) {
        nuevo[est.rut] = { ...nuevo[est.rut], [key]: { valor: '' } };
      }
      return nuevo;
    });
    setMensaje(null);
  };

  const handleEliminarColumna = (colKey: string) => {
    setColumnas((prev) => prev.filter((c) => c.key !== colKey));
    setGrid((prev) => {
      const nuevo = { ...prev };
      for (const est of estudiantes) {
        if (nuevo[est.rut]) {
          const { [colKey]: _, ...resto } = nuevo[est.rut];
          nuevo[est.rut] = resto;
        }
      }
      return nuevo;
    });
  };

  const handleGuardarTodo = async () => {
    const stored = sessionStorage.getItem('user');
    const userData = stored ? JSON.parse(stored) : null;
    const profesorRut = userData?.rut || '';
    if (!selectedMateria) return;

    const aCrear: GradeInput[] = [];
    const aActualizar: { id: number; datos: Partial<Grade> }[] = [];

    for (const est of estudiantes) {
      for (const col of columnas) {
        const cell = grid[est.rut]?.[col.key];
        if (!cell || !cell.valor.trim()) continue;
        const notaNum = parseFloat(cell.valor);
        if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) continue;

        const payload = {
          estudianteRut: est.rut,
          asignatura: selectedMateria.asignatura_nombre,
          curso: selectedMateria.curso_nombre,
          nota: cell.valor,
          tipoEvaluacion: col.tipoEvaluacion,
          fecha: col.fecha,
          profesorRut,
          coeficiente: col.coeficiente,
        };

        if (cell.id) {
          aActualizar.push({ id: cell.id, datos: payload });
        } else {
          aCrear.push(payload);
        }
      }
    }

    if (aCrear.length === 0 && aActualizar.length === 0) {
      setMensaje('Ingresa al menos una nota válida (1.0 - 7.0)');
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      if (aCrear.length > 0) {
        await gradesService.createGradesBatch(aCrear);
      }
      for (const item of aActualizar) {
        await gradesService.updateGrade(item.id, item.datos);
      }
      setMensaje(`Guardadas ${aCrear.length + aActualizar.length} nota(s) correctamente`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar notas';
      setMensaje(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (selectedMateria) {
    const promedioRut = (rut: string) => calcularPromedioPonderado(rut, columnas, grid);

    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {selectedMateria.asignatura_nombre}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Curso: {selectedMateria.curso_nombre} — {estudiantes.length} estudiante(s)
            </p>
          </div>
          <button onClick={handleVolver} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
            Volver
          </button>
        </div>

        {mensaje && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${mensaje.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {mensaje}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-end gap-3 mb-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Evaluación</label>
              <select
                value={newEvalTipo}
                onChange={(e) => setNewEvalTipo(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {EVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 ml-1">
                coef {newEvalTipo === 'prueba_sintesis' ? 2 : 1}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={newEvalFecha}
                onChange={(e) => setNewEvalFecha(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleAgregarColumna}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              Agregar
            </button>
          </div>

          {loadingTable ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : estudiantes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap w-10">N°</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap">RUT</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap">Nombre</th>
                    {columnas.map((col) => (
                      <th key={col.key} className={`px-3 py-2 text-center whitespace-nowrap min-w-[110px] ${col.coeficiente >= 2 ? 'bg-amber-50' : ''}`}>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-bold text-slate-700">{EVAL_LABELS[col.tipoEvaluacion] || col.tipoEvaluacion}</span>
                          <button
                            onClick={() => handleEliminarColumna(col.key)}
                            className="text-red-400 hover:text-red-600 text-xs ml-1"
                            title="Eliminar columna"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400">{formatearFecha(col.fecha)}</div>
                        <div className={`text-[10px] font-semibold ${col.coeficiente >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                          coef {col.coeficiente}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center text-slate-500 font-medium whitespace-nowrap min-w-[80px]">Promedio</th>
                    <th className="px-3 py-2 text-center text-slate-500 font-medium whitespace-nowrap min-w-[100px]">Situación Final</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est, idx) => {
                    const prom = promedioRut(est.rut);
                    const sit = getSituacionFinal(prom);
                    return (
                      <tr key={est.rut} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-3 py-2 text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs font-mono">{est.rut}</td>
                        <td className="px-3 py-2 text-slate-800 font-medium whitespace-nowrap">{est.nombre} {est.apellido}</td>
                        {columnas.map((col) => {
                          const cell = grid[est.rut]?.[col.key];
                          return (
                            <td key={col.key} className={`px-2 py-1 ${col.coeficiente >= 2 ? 'bg-amber-50/50' : ''}`}>
                              <input
                                type="number"
                                step="0.1"
                                min="1.0"
                                max="7.0"
                                placeholder="—"
                                value={cell?.valor || ''}
                                onChange={(e) => handleCellChange(est.rut, col.key, e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                              />
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-center">
                          <span className="font-bold text-slate-700">{prom}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-semibold text-sm ${sit.color}`}>{sit.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No se encontraron estudiantes para este curso
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGuardarTodo}
            disabled={guardando}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar Todas'}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Gestión de Notas</h3>
        <p className="text-sm text-slate-500 mt-1">Selecciona una asignatura para ingresar notas</p>
      </div>

      {loadingMaterias ? (
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
                onClick={() => handleSeleccionarMateria(mat)}
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
          <p className="text-slate-500 font-medium">No tienes asignaturas asignadas</p>
          <p className="text-slate-400 text-sm mt-1">Espera a que te asignen cursos</p>
        </div>
      )}
    </>
  );
};

export default ManageGradesView;
