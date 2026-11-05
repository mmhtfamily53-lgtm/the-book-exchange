import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tv,
  Feather,
  Crown,
  BookOpen,
  Camera,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, setCurrentPage, books, publishedWorks, videos } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [boardOrUniversity, setBoardOrUniversity] = useState(currentUser.boardOrUniversity || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // User's public items
  const userBooks = books.filter(b => b.seller.id === currentUser.id);
  const userWorks = publishedWorks.filter(p => p.authorId === currentUser.id);
  const userVideos = videos.filter(v => (v as any).creatorId === currentUser.id || v.creatorChannelId === currentUser.channelId);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await api.updateProfile({
        name,
        bio,
        location,
        boardOrUniversity,
        phone,
        avatar
      });

      if (res && res.user) {
        setCurrentUser(res.user);
        setFeedbackMsg('Profile updated successfully.');
        setIsEditing(false);
      }
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Account Link */}
      <button
        onClick={() => setCurrentPage('account')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account Portal</span>
      </button>

      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt('Enter image URL for avatar:', avatar);
                    if (newUrl) setAvatar(newUrl);
                  }}
                  className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-amber-600 text-white shadow-md hover:bg-amber-500 transition-colors cursor-pointer"
                  title="Change avatar photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
                  {currentUser.name}
                </h1>
                {currentUser.isOwner ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold inline-flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Founder & Owner
                  </span>
                ) : currentUser.isAdmin ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                    Community Member
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified User
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {currentUser.location}
                </span>
                {currentUser.boardOrUniversity && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> {currentUser.boardOrUniversity}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
            {feedbackMsg}
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-stone-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Update Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Board / School / University
                </label>
                <input
                  type="text"
                  value={boardOrUniversity}
                  onChange={e => setBoardOrUniversity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Phone (Visible only for confirmed handovers)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Short Biography / Academic Interests
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell other students about the subjects you study or books you collect..."
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        )}
      </div>

      {/* User's Public Contributions */}
      <div className="space-y-6">
        {/* Active Book Listings */}
        <div>
          <h2 className="text-lg font-bold font-editorial text-stone-900 dark:text-slate-100 mb-3">
            Listed Second-Hand Books ({userBooks.length})
          </h2>

          {userBooks.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-stone-300 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400">
              You haven&apos;t listed any second-hand books yet.{' '}
              <button
                onClick={() => setCurrentPage('seller-dashboard')}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline ml-1"
              >
                Create your first listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBooks.map(b => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-14 h-18 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">{b.author}</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                      ₹{b.sellingPrice}{' '}
                      <span className="text-[10px] text-stone-400 font-normal">
                        ({b.condition})
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Works */}
        {userWorks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold font-editorial text-stone-900 dark:text-slate-100 mb-3">
              Authored Publications ({userWorks.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userWorks.map(w => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={w.coverImage}
                    alt={w.title}
                    className="w-14 h-18 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      {w.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                      {w.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-1">{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
