import React, { FormEvent, useState, FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import studentService from '../student/student.service';
import apiClient from '../../shared/api/apiClient';

type Role = 'estudiante' | 'profesor';

const LoginForm: FC = (): ReactElement => {
  const navigate = useNavigate();
  const setLoginSuccess = useAuthStore((s) => s.setLoginSuccess);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const setError = useAuthStore((s) => s.setError);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const detectRole = (email: string): Role | null => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain?.includes('alumnocbo')) return 'estudiante';
    if (domain?.includes('profesorcbo')) return 'profesor';
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    const role = detectRole(email);
    if (!role) {
      setError('El correo debe ser @alumnoCBO (estudiante) o @profesorCBO (docente)');
      return;
    }

    try {
      if (role === 'estudiante') {
        const response = await studentService.login(email, password);
        if (response && response.rut) {
          setLoginSuccess({ email, role: 'estudiante' }, '', 'estudiante');
          sessionStorage.setItem('user', JSON.stringify(response));
          sessionStorage.setItem('role', 'estudiante');
          navigate('/dashboard');
        }
      } else {
        const authResponse = await apiClient.post('/auth/login', {
          identifier: email,
          password,
        });
        if (authResponse && authResponse.token) {
          setLoginSuccess({ email, role: 'profesor' }, authResponse.token, 'profesor');
          sessionStorage.setItem('user', JSON.stringify(authResponse.usuario));
          sessionStorage.setItem('role', 'profesor');
          sessionStorage.setItem('token', authResponse.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-800 to-blue-950 flex flex-col justify-center py-6 sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg shadow-xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-2xl sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Portal Educativo</h1>
              <p className="text-gray-500 text-sm mt-1">Ingresa con tu correo institucional</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-500"
                    placeholder="correo@alumnoCBO.cl"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Correo electrónico
                  </label>
                </div>

                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-500"
                    placeholder="Contraseña"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Contraseña
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl px-4 py-2.5 font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
