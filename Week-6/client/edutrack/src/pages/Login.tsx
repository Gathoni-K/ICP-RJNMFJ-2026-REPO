import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/loginForm';
import { authService } from '../features/authServices';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, pass);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Grade Processor</h1>
          <p className="text-slate-500">Welcome back, Professor</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <LoginForm onSubmit={handleLogin} isLoading={loading} />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;