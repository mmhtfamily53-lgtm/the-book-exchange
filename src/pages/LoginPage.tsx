import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage, returnUrl } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password });
      if (!result.success) {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Back Link */}
        <button
          onClick={() => setCurrentPage('account')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Portal</span>
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-950/20 mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial tracking-tight text-stone-900 dark:text-slate-100">
            Sign In to The Book Exchange
          </h2>
          <p className="mt-1.5 text-xs text-stone-500 dark:text-slate-400">
            Enter your verified student, educator, or reader credentials
          </p>
        </div>

        {/* Protected Return Notice */}
        {returnUrl && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>Please sign in to access your requested page. You will be redirected automatically.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@institution.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentPage('forgot-password')}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-slate-300 absolute right-3 top-2.5 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 border-stone-300 dark:border-slate-700 focus:ring-amber-500"
              />
              <span className="text-xs text-stone-600 dark:text-slate-400">Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-stone-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('register')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </form>

        {/* Guest Browse Alternative */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setCurrentPage('browse')}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-slate-300 underline cursor-pointer"
          >
            Or continue exploring books as a Guest
          </button>
        </div>
      </div>
    </div>
  );
};
