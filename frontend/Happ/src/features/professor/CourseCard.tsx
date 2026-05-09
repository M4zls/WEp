import React, { FC, ReactElement } from 'react';

interface CourseCardProps {
  nombre: string;
  nivel: string;
  letra: string;
}

const CourseCard: FC<CourseCardProps> = ({ nombre, nivel, letra }): ReactElement => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-800">{nombre}</h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
          {nivel}° {letra}
        </span>
      </div>
      <div className="flex gap-4 text-sm text-slate-500">
        <span>Curso: {nombre}</span>
      </div>
    </div>
  );
};

export default CourseCard;
