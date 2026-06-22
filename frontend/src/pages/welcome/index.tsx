import React, { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div data-testid="welcome-page" className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-800 to-blue-950 flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md mb-6">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Colegio Bernardo O'Higgins
          </h1>
          <p className="text-lg text-blue-200 max-w-lg mx-auto">
            Portal educativo institucional. Accede a tus cursos, calificaciones y más.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">Estudiantes</h3>
            <p className="text-blue-200 text-sm mt-1">Accede a tus cursos y calificaciones</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">Docentes</h3>
            <p className="text-blue-200 text-sm mt-1">Gestiona tus cursos y estudiantes</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-indigo-900 font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
          >
            Ingresar al Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
