import React, { useEffect } from 'react';
import { BookOpen, RefreshCw, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthCallbackPage: React.FC = () => {
  const { isAuthLoading, oauthError, isAuthenticated, setCurrentPage, loginWithGoogle } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setCurrentPage('dashboard');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, setCurrentPage]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-950/20 mb-4">
          <BookOpen className="w-7 h-7 text-white" />
        </div>

        {/* Loading State */}
        {isAuthLoading && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex justify-center">
              <RefreshCw className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Authenticating with Google...
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please wait while we verify your Google credentials and connect your student/educator workspace.
            </p>
          </div>
        )}

        {/* Error State */}
        {!isAuthLoading && oauthError && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-5 text-left animate-in fade-in">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm mb-1">Google Authentication Problem</p>
                <p className="leading-relaxed">{oauthError}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Try Google Sign-In Again</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="w-full py-3 rounded-2xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Sign In with Email & Password
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isAuthLoading && !oauthError && isAuthenticated && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Welcome to The Book Exchange!
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Google authentication confirmed. Opening your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
