import React, { FC, ReactElement, useEffect, useState, useCallback } from 'react';
import coursesService from '../courses/courses.service';
import gradesService from './services/grades.service';
import type { Grade, GradeInput } from './services/grades.service';

interface FlatSubject {
  id: number;
  subjectName: string;
  subjectCode?: string;
  students: number;
  courseName: string;
  courseId: number;
}

interface StudentInfo {
  rut: string;
  firstName: string;
  lastName: string;
}

interface EvalColumn {
  key: string;
  evaluationType: string;
  date: string;
  coefficient: number;
}

type GridCell = { value: string; id?: number };
type GridData = Record<string, Record<string, GridCell>>;

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
  { value: 'test', label: 'Prueba' },
  { value: 'synthesis_test', label: 'Prueba de Síntesis' },
  { value: 'presentation', label: 'Presentación' },
  { value: 'assignment', label: 'Trabajo' },
];

const EVAL_LABELS: Record<string, string> = {};
for (const opt of EVAL_OPTIONS) {
  EVAL_LABELS[opt.value] = opt.label;
}

const formatDate = (f: string): string => {
  const partes = f.split('-');
  if (partes.length !== 3) return f;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const calcWeightedAverage = (rut: string, columns: EvalColumn[], grid: GridData): string => {
  let sumaPonderada = 0;
  let sumaCoefs = 0;
  for (const col of columns) {
    const cell = grid[rut]?.[col.key];
    if (cell && cell.value.trim()) {
      const n = parseFloat(cell.value);
      if (!isNaN(n) && n >= 1.0 && n <= 7.0) {
        sumaPonderada += n * col.coefficient;
        sumaCoefs += col.coefficient;
      }
    }
  }
  if (sumaCoefs === 0) return '-';
  return (sumaPonderada / sumaCoefs).toFixed(1);
};

const getFinalStatus = (prom: string): { label: string; color: string } => {
  if (prom === '-') return { label: '—', color: 'text-slate-400' };
  const num = parseFloat(prom);
  if (num >= 4.0) return { label: 'Aprobado', color: 'text-emerald-600' };
  return { label: 'Reprobado', color: 'text-red-600' };
};

const ManageGradesView: FC = (): ReactElement => {
  const [subjects, setSubjects] = useState<FlatSubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState<FlatSubject | null>(null);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [existingGrades, setExistingGrades] = useState<Grade[]>([]);
  const [columns, setColumns] = useState<EvalColumn[]>([]);
  const [grid, setGrid] = useState<GridData>({});
  const [loadingTable, setLoadingTable] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newEvalType, setNewEvalType] = useState('test');
  const [newEvalDate, setNewEvalDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const userData = stored ? JSON.parse(stored) : null;
    const professorId = userData?.id;

    coursesService.getCourses().then(async (lista) => {
      const allSubjects: FlatSubject[] = [];

      for (const c of lista) {
        try {
          const subjectsData = await coursesService.getSubjectsByCourse(c.id);
          const filteredSubjects = professorId
            ? subjectsData.filter((m: any) => m.professorId === professorId)
            : [];

          for (const raw of filteredSubjects) {
            const m = raw as any;
            let studentsCount = 0;
            try {
              const studentsData = await coursesService.getStudentsByCourse(c.name);
              studentsCount = Array.isArray(studentsData) ? studentsData.length : 0;
            } catch {
              studentsCount = 0;
            }
            allSubjects.push({
              id: m.id,
              subjectName: m.subjectName,
              subjectCode: m.subjectCode,
              students: studentsCount,
              courseName: c.name,
              courseId: c.id,
            });
          }
        } catch {
          // skip
        }
      }

      setSubjects(allSubjects);
      setLoadingSubjects(false);
    }).catch(() => setLoadingSubjects(false));
  }, []);

  const buildGrid = useCallback((studentsList: StudentInfo[], grades: Grade[], cols: EvalColumn[]): GridData => {
    const newGrid: GridData = {};
    for (const est of studentsList) {
      newGrid[est.rut] = {};
      for (const col of cols) {
        const match = grades.find(
          (n) => n.studentRut === est.rut && n.evaluationType === col.evaluationType && n.date === col.date,
        );
        newGrid[est.rut][col.key] = match ? { value: match.grade, id: match.id } : { value: '' };
      }
    }
    return newGrid;
  }, []);

  const handleSelectSubject = useCallback(async (mat: FlatSubject) => {
    setSelectedSubject(mat);
    setLoadingTable(true);
    setMessage(null);

    try {
      const stored = sessionStorage.getItem('user');
      const userData = stored ? JSON.parse(stored) : null;
      const professorRut = userData?.rut || '';

      const [studentsData, gradesData] = await Promise.all([
        coursesService.getStudentsByCourse(mat.courseName),
        gradesService.getCourseGrades(mat.courseName, professorRut),
      ]);

      const list = Array.isArray(studentsData) ? studentsData as StudentInfo[] : [];
      setStudents(list);

      const filteredGrades = (Array.isArray(gradesData) ? gradesData : []).filter(
        (n: Grade) => n.subject === mat.subjectName,
      );
      setExistingGrades(filteredGrades);

      const colsMap = new Map<string, EvalColumn>();
      for (const n of filteredGrades) {
        const key = `${n.evaluationType}_${n.date}`;
        if (!colsMap.has(key)) {
          colsMap.set(key, { key, evaluationType: n.evaluationType, date: n.date, coefficient: n.coefficient ?? 1 });
        }
      }
      const cols = Array.from(colsMap.values());
      setColumns(cols);
      setGrid(buildGrid(list, filteredGrades, cols));
    } catch (err) {
      setMessage('Error al cargar estudiantes');
    } finally {
      setLoadingTable(false);
    }
  }, [buildGrid]);

  const handleBack = () => {
    setSelectedSubject(null);
    setStudents([]);
    setExistingGrades([]);
    setColumns([]);
    setGrid({});
    setMessage(null);
  };

  const handleCellChange = (rut: string, colKey: string, value: string) => {
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 7)) {
      setGrid((prev) => ({
        ...prev,
        [rut]: {
          ...prev[rut],
          [colKey]: { ...prev[rut]?.[colKey], value },
        },
      }));
    }
  };

  const handleAddColumn = () => {
    if (!newEvalDate) return;
    const key = `${newEvalType}_${newEvalDate}`;
    const existe = columns.some((c) => c.key === key);
    if (existe) {
      setMessage('Ya existe una evaluación con ese tipo y fecha');
      return;
    }
    const coef = newEvalType === 'synthesis_test' ? 2 : 1;
    const newCol: EvalColumn = { key, evaluationType: newEvalType, date: newEvalDate, coefficient: coef };
    const updatedColumns = [...columns, newCol];
    setColumns(updatedColumns);
    setGrid((prev) => {
      const newGrid = { ...prev };
      for (const est of students) {
        newGrid[est.rut] = { ...newGrid[est.rut], [key]: { value: '' } };
      }
      return newGrid;
    });
    setMessage(null);
  };

  const handleSaveAll = async () => {
    const stored = sessionStorage.getItem('user');
    const userData = stored ? JSON.parse(stored) : null;
    const professorRut = userData?.rut || '';
    if (!selectedSubject) return;

    const aCrear: GradeInput[] = [];
    const aActualizar: { id: number; datos: Partial<Grade> }[] = [];

    for (const est of students) {
      for (const col of columns) {
        const cell = grid[est.rut]?.[col.key];
        if (!cell || !cell.value.trim()) continue;
        const gradeNum = parseFloat(cell.value);
        if (isNaN(gradeNum) || gradeNum < 1.0 || gradeNum > 7.0) continue;

        const payload = {
          studentRut: est.rut,
          subject: selectedSubject.subjectName,
          course: selectedSubject.courseName,
          grade: cell.value,
          evaluationType: col.evaluationType,
          date: col.date,
          professorRut,
          coefficient: col.coefficient,
        };

        if (cell.id) {
          aActualizar.push({ id: cell.id, datos: payload });
        } else {
          aCrear.push(payload);
        }
      }
    }

    if (aCrear.length === 0 && aActualizar.length === 0) {
      setMessage('Ingresa al menos una nota válida (1.0 - 7.0)');
      return;
    }

      setSaving(true);
    setMessage(null);

    try {
      if (aCrear.length > 0) {
        await gradesService.createGradesBatch(aCrear);
      }
      for (const item of aActualizar) {
        await gradesService.updateGrade(item.id, item.datos);
      }

      await handleSelectSubject(selectedSubject);
      setMessage(`Guardadas ${aCrear.length + aActualizar.length} nota(s) correctamente`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar notas';
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  if (selectedSubject) {
    const averageRut = (rut: string) => calcWeightedAverage(rut, columns, grid);

    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {selectedSubject.subjectName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Curso: {selectedSubject.courseName} — {students.length} estudiante(s)
            </p>
          </div>
          <button onClick={handleBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
            Volver
          </button>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-end gap-3 mb-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Evaluación</label>
              <select
                value={newEvalType}
                onChange={(e) => setNewEvalType(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {EVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 ml-1">
                coef {newEvalType === 'synthesis_test' ? 2 : 1}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={newEvalDate}
                onChange={(e) => setNewEvalDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleAddColumn}
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
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap w-10">N°</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap">RUT</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap">Nombre</th>
                    {columns.map((col) => (
                        <th key={col.key} className={`px-3 py-2 text-center whitespace-nowrap min-w-[110px] ${col.coefficient >= 2 ? 'bg-amber-50' : ''}`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs font-bold text-slate-700">{EVAL_LABELS[col.evaluationType] || col.evaluationType}</span>
                          </div>
                        <div className="text-[10px] text-slate-400">{formatDate(col.date)}</div>
                        <div className={`text-[10px] font-semibold ${col.coefficient >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                          coef {col.coefficient}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center text-slate-500 font-medium whitespace-nowrap min-w-[80px]">Promedio</th>
                    <th className="px-3 py-2 text-center text-slate-500 font-medium whitespace-nowrap min-w-[100px]">Situación Final</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((est, idx) => {
                    const prom = averageRut(est.rut);
                    const sit = getFinalStatus(prom);
                    return (
                      <tr key={est.rut} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-3 py-2 text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs font-mono">{est.rut}</td>
                        <td className="px-3 py-2 text-slate-800 font-medium whitespace-nowrap">{est.firstName} {est.lastName}</td>
                        {columns.map((col) => {
                          const cell = grid[est.rut]?.[col.key];
                          return (
                            <td key={col.key} className={`px-2 py-1 ${col.coefficient >= 2 ? 'bg-amber-50/50' : ''}`}>
                              <input
                                type="number"
                                step="0.1"
                                min="1.0"
                                max="7.0"
                                placeholder="—"
                                value={cell?.value || ''}
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
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Todas'}
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

      {loadingSubjects ? (
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
      ) : subjects.length > 0 ? (
        <div className="space-y-4">
          {subjects.map((mat, idx) => {
            const color = cardColors[idx % cardColors.length];
            return (
              <div
                key={mat.id}
                onClick={() => handleSelectSubject(mat)}
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
                      Course: <span className="font-medium text-slate-600">{mat.courseName}</span>
                      <span className="mx-2">·</span>
                      {mat.students} student(s)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">You have no assigned subjects</p>
          <p className="text-slate-400 text-sm mt-1">Wait until you are assigned courses</p>
        </div>
      )}
    </>
  );
};

export default ManageGradesView;
