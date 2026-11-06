import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const { register, setCurrentPage, returnUrl } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [campus, setCampus] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoles, setSelectedRoles] = useState<string[]>(['buyer']);
  const [successInfo, setSuccessInfo] = useState<{ message: string; token?: string } | null>(null);

  const toggleRoleSelection = (role: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        if (prev.length === 1 && prev[0] === 'buyer') return prev; // Keep at least one
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-stone-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-teal-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'None', color: 'bg-stone-200' };
    }
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to The Book Exchange Terms of Service and Privacy Policy to create your account.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        confirmPassword,
        phone,
        location,
        boardOrUniversity: campus,
        roles: selectedRoles.length > 0 ? selectedRoles : ['buyer']
      });

      if (!result.success) {
        setError(result.error || 'Registration failed. Please verify your details.');
      } else if (result.verificationToken) {
        setSuccessInfo({
          message: 'Account registered successfully! A verification code has been issued for your email.',
          token: result.verificationToken
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => setCurrentPage('account')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Options</span>
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-950/20 mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial tracking-tight text-stone-900 dark:text-slate-100">
            Create Your Free Account
          </h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-slate-400">
            Join thousands of students and readers across India
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success / Verification Alert */}
        {successInfo && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{successInfo.message}</span>
            </div>
            {successInfo.token && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-300 dark:border-emerald-800">
                Verification Token: <span className="font-bold select-all">{successInfo.token}</span>
              </p>
            )}
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              You can confirm this token anytime in your Account Portal to unlock unrestricted book listings and author publications.
            </p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@institution.ac.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300">
                  Password *
                </label>
                {password && (
                  <span className="text-[10px] font-semibold text-stone-500 dark:text-slate-400">
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-slate-300 absolute right-3 top-2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-1.5 h-1 w-full bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Optional Campus / Location / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Board / University (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CBSE / Delhi Univ"
                value={campus}
                onChange={e => setCampus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                City / Campus Area (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. New Delhi"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Account Type Selection (Multi-Role Support) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300">
                Account Type & Roles (Select all that apply)
              </label>
              <span className="text-[10px] text-stone-400 dark:text-slate-500">
                Single account, multiple dashboards
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Buyer */}
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedRoles.includes('buyer')
                    ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('buyer')}
                  onChange={() => toggleRoleSelection('buyer')}
                  className="w-3.5 h-3.5 rounded text-amber-600 border-stone-300 dark:border-slate-600 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold">Buyer / Reader</span>
              </label>

              {/* Seller */}
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedRoles.includes('seller')
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('seller')}
                  onChange={() => toggleRoleSelection('seller')}
                  className="w-3.5 h-3.5 rounded text-emerald-600 border-stone-300 dark:border-slate-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold">Book Seller</span>
              </label>

              {/* Author */}
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedRoles.includes('author')
                    ? 'border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('author')}
                  onChange={() => toggleRoleSelection('author')}
                  className="w-3.5 h-3.5 rounded text-purple-600 border-stone-300 dark:border-slate-600 focus:ring-purple-500"
                />
                <span className="text-xs font-semibold">Author / Writer</span>
              </label>

              {/* Teacher */}
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedRoles.includes('teacher')
                    ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('teacher')}
                  onChange={() => toggleRoleSelection('teacher')}
                  className="w-3.5 h-3.5 rounded text-teal-600 border-stone-300 dark:border-slate-600 focus:ring-teal-500"
                />
                <span className="text-xs font-semibold">Teacher / Tutor</span>
              </label>

              {/* Creator */}
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all sm:col-span-2 ${
                  selectedRoles.includes('creator')
                    ? 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('creator')}
                  onChange={() => toggleRoleSelection('creator')}
                  className="w-3.5 h-3.5 rounded text-rose-600 border-stone-300 dark:border-slate-600 focus:ring-rose-500"
                />
                <span className="text-xs font-semibold">Educational Video Creator</span>
              </label>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-amber-600 border-stone-300 dark:border-slate-700 focus:ring-amber-500 flex-shrink-0"
              />
              <span className="text-xs text-stone-600 dark:text-slate-400 leading-normal">
                I agree to The Book Exchange{' '}
                <span className="text-amber-600 dark:text-amber-400 font-semibold underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-amber-600 dark:text-amber-400 font-semibold underline">
                  Privacy Policy
                </span>
                . You can activate or deactivate additional roles anytime from Account Settings without separate logins.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Complete Free Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-xs text-stone-500 dark:text-slate-400 pt-1">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
