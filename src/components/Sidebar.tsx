import React from 'react';
import {
  Home,
  BookOpen,
  GraduationCap,
  Video,
  BookMarked,
  Sparkles,
  RefreshCw,
  PenTool,
  Gift,
  Bookmark,
  UploadCloud,
  Tv,
  Feather,
  MessageSquare,
  MessageCircle,
  HelpCircle,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    currentUser,
    isAuthenticated,
    openAuthModal,
    conversations,
    exchangeProposals,
    cartItems
  } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingTradesCount = exchangeProposals.filter(p => p.status === 'pending').length;

  const mainNavItems: { id: PageRoute; label: string; icon: React.ReactNode; badge?: number; color?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'browse', label: 'Browse Books', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'study', label: 'Study Materials', icon: <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'videos', label: 'Educational Videos', icon: <Video className="w-5 h-5 text-rose-600 dark:text-rose-400" /> },
    { id: 'novels', label: 'Novels', icon: <BookMarked className="w-5 h-5 text-amber-600 dark:text-amber-400" /> },
    { id: 'comics', label: 'Comics & Manga', icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" /> },
    { id: 'exchange', label: 'Book Exchange', icon: <RefreshCw className="w-5 h-5 text-teal-600 dark:text-teal-400" />, badge: pendingTradesCount },
    { id: 'publish', label: 'Publish Your Work', icon: <PenTool className="w-5 h-5 text-orange-600 dark:text-orange-400" /> },
    { id: 'free', label: 'Free Books (Donation)', icon: <Gift className="w-5 h-5 text-pink-600 dark:text-pink-400" /> }
  ];

  const userDeskItems: { id: PageRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'account', label: 'My Account Hub', icon: <User className="w-5 h-5 text-amber-400" /> },
    { id: 'library', label: 'My Library', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'uploads', label: 'My Uploads (Seller)', icon: <UploadCloud className="w-5 h-5" /> },
    { id: 'channel', label: 'My Channel (Creator)', icon: <Tv className="w-5 h-5" /> },
    { id: 'publications', label: 'My Publications (Author)', icon: <Feather className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, badge: unreadMessagesCount },
    { id: 'feedback', label: 'Feedback & Reviews', icon: <MessageCircle className="w-5 h-5" /> }
  ];

  const adminAndHelpItems: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    ...(currentUser.isAdmin || currentUser.isOwner
      ? [{ id: 'admin' as PageRoute, label: 'Owner & Admin Hub', icon: <ShieldCheck className="w-5 h-5 text-amber-500" /> }]
      : []),
    { id: 'about', label: 'About & How It Works', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings & Security', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleNavClick = (route: PageRoute) => {
    setCurrentPage(route);
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <span className="font-editorial text-lg font-bold tracking-tight text-white block leading-tight">
                THE BOOK EXCHANGE
              </span>
              <span className="text-[10px] uppercase font-semibold text-amber-400/90 tracking-wider">
                Knowledge For All
              </span>
            </div>
          )}
        </div>

        {/* Mobile close or desktop toggle button */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* User Quick Bar / Sign In */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/40">
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => handleNavClick('profile')}
              className="relative cursor-pointer group flex-shrink-0"
              title="View Public Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-amber-500/40 group-hover:border-amber-400 transition-colors"
              />
              {currentUser.isOwner && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-slate-950 font-bold">
                  ★
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div
                onClick={() => handleNavClick('account')}
                className="min-w-0 flex-1 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="text-xs font-semibold text-slate-100 truncate flex items-center gap-1.5">
                  {currentUser.name}
                  {currentUser.isOwner ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Owner
                    </span>
                  ) : currentUser.isSeller ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                      Seller
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-700 text-stone-300 font-mono">
                      Reader
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentUser.boardOrUniversity || currentUser.location}
                </div>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button
                onClick={() => handleNavClick('account')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold transition-colors cursor-pointer"
                title="Account Hub"
              >
                Hub
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Guest Reader
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Sign in to save books
                </div>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
                title="Sign In"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
        {/* Core Discovery */}
        <div>
          {!isSidebarCollapsed && (
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1.5">
              Explore & Marketplace
            </div>
          )}
          <div className="space-y-0.5">
            {mainNavItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-900/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Workspace */}
        <div>
          {!isSidebarCollapsed && (
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1.5">
              Personal Desk
            </div>
          )}
          <div className="space-y-0.5">
            {userDeskItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-900/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin, Help & About */}
        <div>
          {!isSidebarCollapsed && (
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1.5">
              Platform & Support
            </div>
          )}
          <div className="space-y-0.5">
            {adminAndHelpItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Tagline */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400 text-center">
          <p className="font-editorial italic text-slate-300">
            "Knowledge Should Never Be Expensive."
          </p>
          <span className="text-[9px] text-amber-500 font-mono">Community Powered · 2026</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
