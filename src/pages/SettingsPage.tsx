import React, { useState } from 'react';
import {
  User,
  Lock,
  Shield,
  Bell,
  Eye,
  Store,
  Tv,
  Feather,
  GraduationCap,
  Crown,
  AlertTriangle,
  CheckCircle2,
  Save,
  ArrowLeft,
  Trash2,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { currentUser, setCurrentUser, setCurrentPage, logout } = useApp();

  const [activeTab, setActiveTab] = useState<'security' | 'roles' | 'privacy' | 'danger'>('security');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isGoogleOnly, setIsGoogleOnly] = useState<boolean>(false);

  React.useEffect(() => {
    async function checkUserAuthProvider() {
      if (isSupabaseConfigured) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const hasGoogle = user.app_metadata?.provider === 'google' ||
              user.identities?.some(id => id.provider === 'google');
            const hasEmailProvider = user.identities?.some(id => id.provider === 'email');
            if (hasGoogle && !hasEmailProvider) {
              setIsGoogleOnly(true);
            }
          }
        } catch {
          // Keep default
        }
      } else if (currentUser.boardOrUniversity === 'Verified Google Account' || currentUser.bio?.includes('Google')) {
        setIsGoogleOnly(true);
      }
    }
    checkUserAuthProvider();
  }, [currentUser]);

  // Role Activation State
  const [roleLoading, setRoleLoading] = useState<string | null>(null);
  const [roleMsg, setRoleMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Seller Onboarding
  const [sellerCampus, setSellerCampus] = useState(currentUser.boardOrUniversity || '');
  const [agreeEscrow, setAgreeEscrow] = useState(true);

  // Creator Onboarding
  const [channelName, setChannelName] = useState(`${currentUser.name} Academy`);
  const [channelDesc, setChannelDesc] = useState('Educational video series and chapter problem walkthroughs.');

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handlers
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 6) {
      setPwdMsg({ text: 'New password must be at least 6 characters long.', error: true });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdMsg({ text: 'New passwords do not match.', error: true });
      return;
    }

    if (!isGoogleOnly && !currentPassword) {
      setPwdMsg({ text: 'Please enter your current password.', error: true });
      return;
    }

    setPwdLoading(true);

    try {
      // 1. If Supabase is configured and has an active user session, authoritatively update in Supabase
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
          if (updateError) {
            setPwdMsg({ text: updateError.message || 'Supabase could not update your password.', error: true });
            setPwdLoading(false);
            return;
          }
        }
      }

      // 2. Synchronize new password with SQLite database
      const res = await api.changePassword({
        currentPassword: isGoogleOnly ? undefined : currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
        isGoogleAccount: isGoogleOnly
      });

      setPwdMsg({
        text: res.message || 'Your password has been changed successfully. You can now use your new password across all devices.',
        error: false
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsGoogleOnly(false);
    } catch (err: any) {
      setPwdMsg({ text: err.message || 'Failed to change password. Please check your current password.', error: true });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleActivateRole = async (role: 'seller' | 'creator' | 'author' | 'teacher', details?: any) => {
    setRoleLoading(role);
    setRoleMsg(null);

    try {
      const res = await api.activateRole(role, details);
      if (res && res.user) {
        setCurrentUser(res.user);
        setRoleMsg({ text: res.message || `Activated ${role} features.`, error: false });
      }
    } catch (err: any) {
      setRoleMsg({ text: err.message || 'Failed to activate role.', error: true });
    } finally {
      setRoleLoading(null);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (!confirm('Are you completely sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);

    try {
      await api.deleteAccount(deletePassword, deleteReason);
      alert('Your account has been deleted.');
      logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Account Link */}
      <button
        onClick={() => setCurrentPage('account')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account Portal</span>
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
          Account & Security Centre
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
          Manage your credentials, activate role workspaces, and adjust privacy preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-slate-800 gap-2 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'
          }`}
        >
          Login & Password
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roles'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'
          }`}
        >
          Role Activation & Workspaces
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'
          }`}
        >
          Privacy & Notifications
        </button>
        <button
          onClick={() => setActiveTab('danger')}
          className={`py-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'danger'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-rose-600'
          }`}
        >
          Data Management
        </button>
      </div>

      {/* TAB 1: LOGIN & SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100 mb-1">
              {isGoogleOnly ? 'Set Account Password' : 'Change Account Password'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mb-5">
              {isGoogleOnly
                ? 'Your account was created via Google Sign-In. You can set a password to also sign in directly using your email address.'
                : 'Ensure your new password contains at least 6 characters with a combination of letters and numbers.'}
            </p>

            {isGoogleOnly && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs mb-4 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>Signed in via Google. Setting a password adds email/password sign-in capability to your account.</span>
              </div>
            )}

            {pwdMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  pwdMsg.error
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {pwdMsg.error ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {!isGoogleOnly && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {pwdLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>

          {/* Active Session Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 mb-1">
              Active Browser Session
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
              Signed in from this device with secure JWT bearer authentication.
            </p>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 text-xs">
              <div>
                <p className="font-semibold text-stone-800 dark:text-slate-200">Current Web Session</p>
                <p className="text-[11px] text-stone-400">Authenticated Token Active • Secure SQLite Session</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                Active Now
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE ACTIVATION & WORKSPACES */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100 mb-1">
              Activate Ordinary User Roles
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mb-6">
              You can hold multiple roles simultaneously under your single login. Activate seller, creator, author, or educator privileges with one click.
            </p>

            {roleMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  roleMsg.error
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700'
                }`}
              >
                {roleMsg.error ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                <span>{roleMsg.text}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* 1. Seller Activation */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Book Seller Functionality</span>
                      {currentUser.isSeller && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          (Already Active)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      List second-hand curriculum textbooks for sale, set prices, and collect escrow payouts.
                    </p>
                  </div>
                </div>

                {!currentUser.isSeller ? (
                  <button
                    onClick={() => handleActivateRole('seller', { agreedToEscrow: true })}
                    disabled={roleLoading === 'seller'}
                    className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    {roleLoading === 'seller' ? 'Activating...' : 'Activate Seller'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('seller-dashboard')}
                    className="py-2 px-4 rounded-xl border border-amber-500 text-amber-600 dark:text-amber-400 font-semibold text-xs hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    Open Seller Studio
                  </button>
                )}
              </div>

              {/* 2. Creator Channel Activation */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Educational Video Creator</span>
                      {currentUser.isCreator && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          (Already Active)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      Upload board exam tutorials, solve previous year question papers, and build student subscribers.
                    </p>
                  </div>
                </div>

                {!currentUser.isCreator ? (
                  <button
                    onClick={() => handleActivateRole('creator', { channelName, description: channelDesc })}
                    disabled={roleLoading === 'creator'}
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    {roleLoading === 'creator' ? 'Activating...' : 'Start Channel'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('creator-dashboard')}
                    className="py-2 px-4 rounded-xl border border-rose-500 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    Open Creator Studio
                  </button>
                )}
              </div>

              {/* 3. Indie Author Studio */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Author & Publisher Studio</span>
                      {currentUser.isAuthor && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          (Already Active)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      Publish original novels, comics, or manga and distribute to community readers.
                    </p>
                  </div>
                </div>

                {!currentUser.isAuthor ? (
                  <button
                    onClick={() => handleActivateRole('author', { penName: currentUser.name })}
                    disabled={roleLoading === 'author'}
                    className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    {roleLoading === 'author' ? 'Activating...' : 'Activate Author'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('author-dashboard')}
                    className="py-2 px-4 rounded-xl border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-xs hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    Open Author Studio
                  </button>
                )}
              </div>

              {/* 4. Educator Badge */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Teacher & Educator Verification</span>
                      {currentUser.isTeacher && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          (Verified Educator)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      Mark study notes as teacher-verified and provide curriculum guidance.
                    </p>
                  </div>
                </div>

                {!currentUser.isTeacher ? (
                  <button
                    onClick={() => handleActivateRole('teacher', { institution: currentUser.boardOrUniversity })}
                    disabled={roleLoading === 'teacher'}
                    className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    {roleLoading === 'teacher' ? 'Verifying...' : 'Verify Educator'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    Badge Verified
                  </span>
                )}
              </div>
            </div>

            {/* Protected Roles Security Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Protected Platform Governance:</p>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">
                  Administrative privileges (Owner, Founder, Admin, Moderator) cannot be self-assigned through public settings or client requests. The Platform Owner account is permanently verified via backend server configuration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY & PREFERENCES */}
      {activeTab === 'privacy' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100 mb-1">
            Privacy & Notification Preferences
          </h2>
          <p className="text-xs text-stone-500 dark:text-slate-400 mb-4">
            Control which contact details and notifications are active on your profile.
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-slate-100">
                  Escrow Order Updates via Email
                </p>
                <p className="text-[11px] text-stone-500 dark:text-slate-400">
                  Receive notifications when an order is placed, shipped, or marked ready for handover.
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-slate-100">
                  Book Exchange Proposal Alerts
                </p>
                <p className="text-[11px] text-stone-500 dark:text-slate-400">
                  Receive immediate alerts when another student proposes a textbook trade.
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-slate-100">
                  Hide Phone Number on Public Listings
                </p>
                <p className="text-[11px] text-stone-500 dark:text-slate-400">
                  Only disclose phone numbers to buyers after an order or exchange is mutually confirmed.
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded" />
            </label>
          </div>
        </div>
      )}

      {/* TAB 4: DATA MANAGEMENT & DELETION */}
      {activeTab === 'danger' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 mb-1">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-base font-bold font-editorial">
              Account Deactivation & Deletion
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
            Permanent account deletion removes your personal profile, wishlist, and unfulfilled listings.
            Completed order history and financial dispute audits are retained in anonymized form for legal compliance.
          </p>

          {currentUser.isOwner ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-semibold">
              The primary Platform Owner account is permanently protected and cannot be deleted.
            </div>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-4 pt-3 max-w-md">
              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {deleteError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Confirm Password to Delete Account
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your current password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-rose-200 dark:border-rose-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Reason for Leaving (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Graduated, no longer need textbooks, etc."
                  value={deleteReason}
                  onChange={e => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={deleteLoading}
                className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Processing Deletion...' : 'Permanently Delete My Account'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
