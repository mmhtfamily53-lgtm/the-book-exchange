import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  ShoppingBag,
  Store,
  Tv,
  Feather,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    currentUser,
    setCurrentUser,
    loginUser,
    toggleUserRole
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'roles'>('roles');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isBuyer, setIsBuyer] = useState(currentUser.isBuyer);
  const [isSeller, setIsSeller] = useState(currentUser.isSeller);
  const [isCreator, setIsCreator] = useState(currentUser.isCreator);
  const [isAuthor, setIsAuthor] = useState(currentUser.isAuthor);

  if (!isAuthModalOpen) return null;

  const quickPersonas = [
    {
      title: 'College Student (Buyer & Swapper)',
      roleDesc: 'Trades semester textbooks, downloads study notes, watches physics lectures',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@bookexchange.org',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      campus: 'Delhi University / CBSE Alumnus',
      roles: { isBuyer: true, isSeller: true, isCreator: false, isAuthor: false }
    },
    {
      title: 'Active Second-hand Seller',
      roleDesc: 'Lists curriculum guides, offers local campus handovers, collects manga',
      name: 'Priya Sundaram',
      email: 'priya.sundaram@iit.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      campus: 'IIT Madras (Freshman)',
      roles: { isBuyer: true, isSeller: true, isCreator: false, isAuthor: false }
    },
    {
      title: 'Teacher & Video Creator',
      roleDesc: 'Uploads revision videos, solves board exams, shares handwritten formula sheets',
      name: 'Er. Rajesh Gupta',
      email: 'rajesh.physics@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      campus: 'Kendriya Vidyalaya Faculty',
      roles: { isBuyer: true, isSeller: false, isCreator: true, isAuthor: false }
    },
    {
      title: 'Published Indie Author',
      roleDesc: 'Publishes original novels, reviews community manuscripts, writes fiction',
      name: 'Suniti Banerjee',
      email: 'suniti.author@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      campus: 'Independent Literary Guild',
      roles: { isBuyer: true, isSeller: true, isCreator: false, isAuthor: true }
    }
  ];

  const handleSelectPersona = (p: typeof quickPersonas[0]) => {
    setCurrentUser(prev => ({
      ...prev,
      name: p.name,
      email: p.email,
      avatar: p.avatar,
      boardOrUniversity: p.campus,
      isBuyer: p.roles.isBuyer,
      isSeller: p.roles.isSeller,
      isCreator: p.roles.isCreator,
      isAuthor: p.roles.isAuthor
    }));
    closeAuthModal();
  };

  const handleSaveRoles = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, name, { isBuyer, isSeller, isCreator, isAuthor });
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-800/80">
          <div>
            <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
              Account Roles & Profile Manager
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              One login with multi-role capability: Buyer, Seller, Creator & Author.
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Demo Personas */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 block mb-2">
              1-Click Instant Persona Switcher:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickPersonas.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPersona(p)}
                  className="p-3 rounded-2xl border border-stone-200 dark:border-slate-700/80 hover:border-amber-500 dark:hover:border-amber-400 bg-stone-50/50 dark:bg-slate-800/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors truncate">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-slate-400 truncate">
                        {p.name} • {p.campus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customize Roles Under One Login */}
          <form onSubmit={handleSaveRoles} className="space-y-4 pt-2 border-t border-stone-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 block">
              Customize Active Account Features:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Role Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                      Buyer Account (Always Enabled)
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-slate-400">
                      Browse books, order second-hand copies, save wishlist, propose exchanges
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isBuyer}
                  onChange={e => setIsBuyer(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                      Seller Functionality
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-slate-400">
                      List books for sale or swap, set second-hand prices, manage incoming orders
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isSeller}
                  onChange={e => setIsSeller(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Tv className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                      Creator Channel (Video Platform)
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-slate-400">
                      Upload educational videos, create playlists, view student subscriber analytics
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isCreator}
                  onChange={e => setIsCreator(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Feather className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                      Author / Publisher Studio
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-slate-400">
                      Publish original novels, comics, and study guides with author portfolio
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAuthor}
                  onChange={e => setIsAuthor(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Apply & Save Account Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
