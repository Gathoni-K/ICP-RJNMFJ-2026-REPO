import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SignupForm } from '../components/signUpForm';
import { authService } from '../features/authServices';
import { GraduationCap } from 'lucide-react';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (name: string, email: string, pass: string) => {
    setLoading(true);
    setServerError(null);
    try {
      await authService.signup(name, email, pass);
      // Optional: Auto-login after signup or redirect to login
      navigate('/login');
    } catch (err : any) {
      setServerError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Get Started</h1>
          <p className="text-slate-500 text-lg">Create your educator account</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {serverError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
              {serverError}
            </div>
          )}

          <SignupForm onSubmit={handleSignup} isLoading={loading} />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;