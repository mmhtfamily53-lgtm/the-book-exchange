import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    setCurrentPage,
    isAuthenticated,
    currentUser,
    logout
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        closeAuthModal();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold font-editorial text-stone-900 dark:text-slate-100">
              The Book Exchange
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAuthenticated ? (
            <div className="space-y-4 text-center py-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 font-mono">
                  {currentUser.email}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    closeAuthModal();
                    setCurrentPage('account');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Open Account Portal
                </button>
                <button
                  onClick={() => {
                    closeAuthModal();
                    logout();
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 font-editorial">
                  Account Sign In
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Sign in with your verified email and password
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@institution.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      setCurrentPage('forgot-password');
                    }}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="pt-2 text-center text-xs text-stone-500 dark:text-slate-400 border-t border-stone-100 dark:border-slate-800">
                New to The Book Exchange?{' '}
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    setCurrentPage('register');
                  }}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Create Free Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
