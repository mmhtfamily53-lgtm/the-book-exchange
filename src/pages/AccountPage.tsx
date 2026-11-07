import React from 'react';
import {
  User,
  ShoppingBag,
  Store,
  Tv,
  Feather,
  GraduationCap,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  Settings,
  Heart,
  BookOpen,
  RefreshCw,
  Package,
  KeyRound,
  Mail,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountPage: React.FC = () => {
  const {
    isAuthenticated,
    isAuthLoading,
    loginWithGoogle,
    currentUser,
    setCurrentPage,
    logout,
    resendVerification,
    verifyEmail,
    activeRoleView,
    setActiveRoleView,
    cartItems,
    wishlist,
    exchangeProposals,
    conversations
  } = useApp();

  const [verifyTokenInput, setVerifyTokenInput] = React.useState('');
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [verifyMessage, setVerifyMessage] = React.useState<string | null>(null);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [resendLoading, setResendLoading] = React.useState(false);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) return;
    setVerifyLoading(true);
    setVerifyError(null);
    setVerifyMessage(null);
    try {
      const res = await verifyEmail(verifyTokenInput.trim());
      if (res.success) {
        setVerifyMessage(res.message || 'Email verified successfully!');
        setVerifyTokenInput('');
      } else {
        setVerifyError(res.error || 'Verification failed. Please check the token.');
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendToken = async () => {
    setResendLoading(true);
    setVerifyError(null);
    setVerifyMessage(null);
    try {
      const res = await resendVerification(currentUser?.email);
      if (res.success) {
        setVerifyMessage(res.message || 'A new verification token has been generated.');
        if (res.verificationToken) {
          setVerifyTokenInput(res.verificationToken);
        }
      } else {
        setVerifyError(res.error || 'Failed to resend verification token.');
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Could not resend verification.');
    } finally {
      setResendLoading(false);
    }
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeExchangesCount = exchangeProposals.filter(p => p.status === 'pending').length;

  // If authentication handshake is actively running
  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-4 text-center animate-in fade-in">
          <RefreshCw className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin mx-auto" />
          <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            Connecting Your Account...
          </h2>
          <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
            Please wait while we verify your credentials and prepare your personal dashboard.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW A: GUEST / NOT LOGGED IN (Amazon/Google Style Landing)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 shadow-2xl mb-10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE BOOK EXCHANGE ACCOUNT PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold tracking-tight text-white mb-3">
              Your books. Your learning. Your community.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
              Welcome to India&apos;s all-in-one educational and literary book marketplace.
              Sign in to manage your textbook orders, request swaps, upload second-hand listings,
              and access teacher-verified notes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guest Alternative Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 1. Continue with Google */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-stone-700 dark:text-slate-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 mb-1">
                Single Sign-On (SSO)
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed mb-4">
                Use your standard institutional or personal email credentials to sign in seamlessly across devices.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Login Form</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Browse as Guest */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 mb-1">
                Browse as Guest
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed mb-4">
                No account required to discover books! Browse second-hand CBSE/NCERT curriculum guides, free study notes, and original comics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('browse')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Browse Books
              </button>
              <button
                onClick={() => setCurrentPage('study')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Free Notes
              </button>
            </div>
          </div>

          {/* 3. Account Help & Recovery */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 mb-1">
                Help with Account Access
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed mb-4">
                Forgot your password or need student email assistance? Request a secure password reset link anytime.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('forgot-password')}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Recover Password</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guest Security Notice */}
        <div className="p-5 rounded-2xl bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 text-xs text-stone-600 dark:text-slate-300 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Secure Student Marketplace:</strong> Every transaction on The Book Exchange is escrow-protected. We never share your contact details publicly without your consent.
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: AUTHENTICATED USER (Amazon/YouTube Style Dashboard)
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. User Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
                {currentUser.name}
              </h1>
              {currentUser.isOwner ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold inline-flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Founder & Owner
                </span>
              ) : currentUser.isAdmin ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                  Administrator
                </span>
              ) : null}
            </div>

            <p className="text-xs text-stone-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-stone-700 dark:text-slate-300">{currentUser.email}</span>
              {currentUser.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Clock className="w-3 h-3" /> Verification Pending
                </span>
              )}
              <span>•</span>
              <span>{currentUser.location}</span>
            </p>

            {/* Active Roles Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-medium">
                Buyer
              </span>
              {currentUser.isSeller && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                  Verified Seller
                </span>
              )}
              {currentUser.isCreator && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-medium">
                  Video Creator
                </span>
              )}
              {currentUser.isAuthor && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-medium">
                  Author
                </span>
              )}
              {currentUser.isTeacher && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium">
                  Educator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2.5 sm:self-center">
          <button
            onClick={() => setCurrentPage('profile')}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Public Profile</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Verification Action Banner */}
      {!currentUser.emailVerified && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  Verify Your Email Address
                </h2>
                <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                  Confirm your email to unlock textbook listing, book exchanges, and original author publications.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={resendLoading}
              onClick={handleResendToken}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-xs font-semibold text-amber-800 dark:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
              <span>{resendLoading ? 'Sending...' : 'Resend Verification Token'}</span>
            </button>
          </div>

          {verifyMessage && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{verifyMessage}</span>
            </div>
          )}

          {verifyError && (
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          {/* Form to submit token */}
          <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Paste 64-character verification token or code"
              value={verifyTokenInput}
              onChange={e => setVerifyTokenInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
            />
            <button
              type="submit"
              disabled={verifyLoading || !verifyTokenInput.trim()}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {verifyLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>
      )}

      {/* 2. Switch Role Workspace (YouTube Studio / Amazon Seller Central Style) */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Role Workspaces
            </h2>
            <p className="text-xs text-stone-400">
              Switch between your active dashboards without changing your account identity:
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('settings')}
            className="text-xs text-amber-400 hover:underline font-semibold"
          >
            + Activate More Roles
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Buyer Hub */}
          <button
            onClick={() => {
              setActiveRoleView('buyer');
              setCurrentPage('dashboard');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRoleView === 'buyer'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : 'bg-slate-800/60 border-slate-700 text-stone-300 hover:border-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400 mb-1.5" />
            <div className="text-xs font-bold block">Buyer Hub</div>
            <div className="text-[10px] text-stone-400 truncate">Orders & Swaps</div>
          </button>

          {/* Seller Studio */}
          <button
            onClick={() => {
              if (currentUser.isSeller) {
                setActiveRoleView('seller');
                setCurrentPage('seller-dashboard');
              } else {
                setCurrentPage('settings');
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRoleView === 'seller'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : currentUser.isSeller
                ? 'bg-slate-800/60 border-slate-700 text-stone-300 hover:border-slate-500'
                : 'bg-slate-800/20 border-slate-800 text-stone-500 hover:border-slate-700'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400 mb-1.5" />
            <div className="text-xs font-bold block">Seller Studio</div>
            <div className="text-[10px] text-stone-400 truncate">
              {currentUser.isSeller ? 'Listings & Sales' : 'Click to Activate'}
            </div>
          </button>

          {/* Creator Studio */}
          <button
            onClick={() => {
              if (currentUser.isCreator) {
                setActiveRoleView('creator');
                setCurrentPage('creator-dashboard');
              } else {
                setCurrentPage('settings');
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRoleView === 'creator'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : currentUser.isCreator
                ? 'bg-slate-800/60 border-slate-700 text-stone-300 hover:border-slate-500'
                : 'bg-slate-800/20 border-slate-800 text-stone-500 hover:border-slate-700'
            }`}
          >
            <Tv className="w-4 h-4 text-rose-400 mb-1.5" />
            <div className="text-xs font-bold block">Creator Studio</div>
            <div className="text-[10px] text-stone-400 truncate">
              {currentUser.isCreator ? 'Channel & Videos' : 'Click to Activate'}
            </div>
          </button>

          {/* Author Studio */}
          <button
            onClick={() => {
              if (currentUser.isAuthor) {
                setActiveRoleView('author');
                setCurrentPage('author-dashboard');
              } else {
                setCurrentPage('settings');
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRoleView === 'author'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : currentUser.isAuthor
                ? 'bg-slate-800/60 border-slate-700 text-stone-300 hover:border-slate-500'
                : 'bg-slate-800/20 border-slate-800 text-stone-500 hover:border-slate-700'
            }`}
          >
            <Feather className="w-4 h-4 text-purple-400 mb-1.5" />
            <div className="text-xs font-bold block">Author Studio</div>
            <div className="text-[10px] text-stone-400 truncate">
              {currentUser.isAuthor ? 'Manuscripts' : 'Click to Activate'}
            </div>
          </button>

          {/* Educator Portal */}
          <button
            onClick={() => {
              if (currentUser.isTeacher) {
                setActiveRoleView('teacher');
                setCurrentPage('study');
              } else {
                setCurrentPage('settings');
              }
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRoleView === 'teacher'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : currentUser.isTeacher
                ? 'bg-slate-800/60 border-slate-700 text-stone-300 hover:border-slate-500'
                : 'bg-slate-800/20 border-slate-800 text-stone-500 hover:border-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-400 mb-1.5" />
            <div className="text-xs font-bold block">Educator Desk</div>
            <div className="text-[10px] text-stone-400 truncate">
              {currentUser.isTeacher ? 'Study Notes' : 'Apply for Badge'}
            </div>
          </button>

          {/* Owner Center (Restricted to mmhtfamily53@gmail.com) */}
          {currentUser.isOwner && (
            <button
              onClick={() => {
                setActiveRoleView('owner');
                setCurrentPage('admin');
              }}
              className="p-3 rounded-2xl border border-amber-500 bg-amber-500/10 text-left transition-all cursor-pointer hover:bg-amber-500/20"
            >
              <Crown className="w-4 h-4 text-amber-400 mb-1.5" />
              <div className="text-xs font-bold text-amber-300 block">Owner Hub</div>
              <div className="text-[10px] text-amber-400 truncate">Revenue & Logs</div>
            </button>
          )}
        </div>
      </div>

      {/* 3. Account Activity & Features Grid (Amazon Style) */}
      <div>
        <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100 mb-4">
          Account Features & Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card: My Orders */}
          <div
            onClick={() => setCurrentPage('dashboard')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                My Orders & Purchases
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Track textbook deliveries, inspection periods, and escrow safe-release status.
              </p>
            </div>
          </div>

          {/* Card: My Library */}
          <div
            onClick={() => setCurrentPage('library')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                My Library & Downloads
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Access your saved e-books, formula cheats, and downloaded revision guides.
              </p>
            </div>
          </div>

          {/* Card: My Exchanges */}
          <div
            onClick={() => setCurrentPage('exchange')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                  My Book Swaps
                </h3>
                {activeExchangesCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-500 text-white font-bold">
                    {activeExchangesCount} active
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Manage your proposed book exchanges, counter-offers, and meeting points.
              </p>
            </div>
          </div>

          {/* Card: Seller Dashboard */}
          <div
            onClick={() => {
              if (currentUser.isSeller) {
                setCurrentPage('seller-dashboard');
              } else {
                setCurrentPage('settings');
              }
            }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                {currentUser.isSeller ? 'Seller Hub & Listings' : 'Become a Book Seller'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {currentUser.isSeller
                  ? 'List new second-hand books, view sales payouts & commission records.'
                  : 'Start selling second-hand books and revision guides to students.'}
              </p>
            </div>
          </div>

          {/* Card: Messages */}
          <div
            onClick={() => setCurrentPage('messages')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                  Direct Messages
                </h3>
                {unreadMessagesCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    {unreadMessagesCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Communicate directly with campus book sellers and exchange partners.
              </p>
            </div>
          </div>

          {/* Card: Security & Settings */}
          <div
            onClick={() => setCurrentPage('settings')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer group shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-stone-700 dark:text-slate-300 flex-shrink-0 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                Account & Security Centre
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Change password, update contact phone, manage roles, and review session privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
