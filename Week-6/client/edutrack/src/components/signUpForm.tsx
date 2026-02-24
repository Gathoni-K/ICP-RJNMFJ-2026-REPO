import { useState } from 'react';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (name: string, email: string, pass: string) => Promise<void>;
  isLoading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Basic frontend check for password matching
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-100 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            name="name"
            type="text"
            required
            placeholder="Dr. Jane Smith"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            name="email"
            type="email"
            required
            placeholder="jane@university.edu"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
      </button>
    </form>
  );
};