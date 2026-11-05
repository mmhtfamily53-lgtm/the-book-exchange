import React, { useState } from 'react';
import {
  Search,
  Menu,
  Bell,
  ShoppingCart,
  PlusCircle,
  Sun,
  Moon,
  MessageSquare,
  Sparkles,
  BookPlus,
  Video,
  Feather,
  CheckCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    setMobileSidebarOpen,
    openUniversalSearch,
    cartItems,
    openCartDrawer,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentPage,
    openListBookModal,
    openPublishModal,
    openUploadVideoModal,
    openAuthModal,
    currentUser,
    isAuthenticated,
    darkMode,
    toggleDarkMode,
    conversations
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showQuickActionsDropdown, setShowQuickActionsDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Universal Search Trigger Bar */}
          <div
            onClick={openUniversalSearch}
            className="flex-1 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700/60 text-stone-500 dark:text-slate-400 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer shadow-xs transition-all group"
          >
            <Search className="w-4 h-4 text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            <span className="text-sm truncate">
              Search by title, author, CBSE/NCERT board, college, comic or video...
            </span>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-white dark:bg-slate-700 border border-stone-300 dark:border-slate-600 text-stone-600 dark:text-slate-300 shadow-2xs">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create / Upload Menu */}
          <div className="relative">
            <button
              onClick={() => setShowQuickActionsDropdown(!showQuickActionsDropdown)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Contribute</span>
            </button>

            {showQuickActionsDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    openListBookModal();
                    setShowQuickActionsDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-stone-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-700"
                >
                  <BookPlus className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-semibold block">List Book for Sale / Swap</span>
                    <span className="text-[10px] text-stone-500 dark:text-slate-400">Sell or trade second-hand copies</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    openPublishModal();
                    setShowQuickActionsDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-stone-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-700"
                >
                  <Feather className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-semibold block">Publish Original Book / Comic</span>
                    <span className="text-[10px] text-stone-500 dark:text-slate-400">Novels, manga & textbooks</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    openUploadVideoModal();
                    setShowQuickActionsDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-stone-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-700"
                >
                  <Video className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="font-semibold block">Upload Educational Video</span>
                    <span className="text-[10px] text-stone-500 dark:text-slate-400">Lessons, experiments, revisions</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Messages */}
          <button
            onClick={() => setCurrentPage('messages')}
            className="relative p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="relative p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-2xl py-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-stone-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-stone-800 dark:text-slate-100 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-slate-700/60">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-400 dark:text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionRoute) {
                            setCurrentPage(n.actionRoute);
                            setShowNotificationsDropdown(false);
                          }
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-700/50 transition-colors ${
                          !n.read ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-stone-800 dark:text-slate-100">{n.title}</p>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-stone-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={openCartDrawer}
            className="relative p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            title="Shopping Cart & Orders"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile / Account Trigger */}
          <button
            onClick={() => setCurrentPage('account')}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-stone-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all bg-stone-50 dark:bg-slate-800 cursor-pointer shadow-xs"
            title={isAuthenticated ? `${currentUser.name} (Account Hub)` : 'Sign In / Account Portal'}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
            />
            <span className="hidden sm:inline text-xs font-semibold text-stone-700 dark:text-slate-200">
              {isAuthenticated ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
