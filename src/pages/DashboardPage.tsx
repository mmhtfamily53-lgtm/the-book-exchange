import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Tv,
  Feather,
  GraduationCap,
  Crown,
  Package,
  PlusCircle,
  RefreshCw,
  Heart,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardPageProps {
  initialTab?: 'buyer' | 'seller' | 'creator' | 'author' | 'teacher';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialTab = 'buyer' }) => {
  const {
    currentUser,
    activeRoleView,
    setActiveRoleView,
    setCurrentPage,
    orderHistory,
    books,
    publishedWorks,
    videos,
    exchangeProposals,
    wishlist,
    openListBookModal,
    openPublishModal,
    openUploadVideoModal
  } = useApp();

  const [workspace, setWorkspace] = useState<'buyer' | 'seller' | 'creator' | 'author' | 'teacher'>(
    initialTab || (activeRoleView === 'owner' ? 'buyer' : (activeRoleView as any))
  );

  // Filter user's specific records
  const userBooks = books.filter(b => b.seller.id === currentUser.id);
  const userSoldBooks = userBooks.filter(b => b.status === 'sold');
  const userPublications = publishedWorks.filter(p => p.authorId === currentUser.id);
  const userVideos = videos.filter(v => (v as any).creatorId === currentUser.id || v.creatorChannelId === currentUser.channelId);
  const userExchanges = exchangeProposals.filter(
    p => p.proposerId === currentUser.id || p.targetOwnerId === currentUser.id
  );

  // Calculate seller financial metrics
  const totalSellerSales = userSoldBooks.reduce((acc, b) => acc + b.sellingPrice, 0);
  const platformFee = Math.round(totalSellerSales * 0.05); // 5% platform commission
  const netEarnings = totalSellerSales - platformFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Personal Workspace
          </span>
          <h1 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            Authenticated as <span className="font-mono">{currentUser.email}</span>
          </p>
        </div>

        {/* Workspace Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => {
              setWorkspace('buyer');
              setActiveRoleView('buyer');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              workspace === 'buyer'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buyer</span>
          </button>

          <button
            onClick={() => {
              if (currentUser.isSeller) {
                setWorkspace('seller');
                setActiveRoleView('seller');
              } else {
                setCurrentPage('settings');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              workspace === 'seller'
                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 shadow-xs'
                : currentUser.isSeller
                ? 'text-stone-500 hover:text-stone-900 dark:text-slate-400'
                : 'text-stone-400 opacity-60'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Seller {currentUser.isSeller ? '' : '(Locked)'}</span>
          </button>

          {currentUser.isCreator && (
            <button
              onClick={() => {
                setWorkspace('creator');
                setActiveRoleView('creator');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                workspace === 'creator'
                  ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-slate-400'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-rose-600" />
              <span>Creator</span>
            </button>
          )}

          {currentUser.isAuthor && (
            <button
              onClick={() => {
                setWorkspace('author');
                setActiveRoleView('author');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                workspace === 'author'
                  ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-slate-400'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-purple-600" />
              <span>Author</span>
            </button>
          )}

          {currentUser.isOwner && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Owner Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 1. BUYER DASHBOARD */}
      {/* ----------------------------------------------------------- */}
      {workspace === 'buyer' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Completed Orders
              </span>
              <p className="text-xl font-bold text-stone-900 dark:text-slate-100">{orderHistory.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Wishlist Items
              </span>
              <p className="text-xl font-bold text-stone-900 dark:text-slate-100">{wishlist.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Active Exchanges
              </span>
              <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{userExchanges.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Escrow Protection
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-4 h-4" /> 100% Active
              </span>
            </div>
          </div>

          {/* Orders History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                Recent Escrow Orders
              </h2>
              <button
                onClick={() => setCurrentPage('browse')}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                + Browse More Books
              </button>
            </div>

            {orderHistory.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400 dark:text-slate-500">
                You haven&apos;t placed any book orders yet. Browse curriculum textbooks to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {orderHistory.map(o => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl border border-stone-100 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-800 dark:text-slate-200">
                          {o.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {o.items.length} item(s) • Total: ₹{o.total} • Placed on {o.date}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`Order ${o.id} tracking: In transit with campus handover protection.`)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      Track Shipment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. SELLER STUDIO DASHBOARD */}
      {/* ----------------------------------------------------------- */}
      {workspace === 'seller' && (
        <div className="space-y-6">
          {/* Seller Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Active Listings
              </span>
              <p className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
                {userBooks.filter(b => b.status === 'available').length} Books
              </p>
              <button
                onClick={openListBookModal}
                className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> List Another Book
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Gross Sales
              </span>
              <p className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
                ₹{totalSellerSales}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                {userSoldBooks.length} book(s) purchased
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                Net Payout (After 5% Fee)
              </span>
              <p className="text-2xl font-bold font-editorial text-emerald-700 dark:text-emerald-300">
                ₹{netEarnings}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                Platform Commission: ₹{platformFee}
              </p>
            </div>
          </div>

          {/* Active Listings Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                Your Current Marketplace Listings
              </h2>
              <button
                onClick={openListBookModal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Book</span>
              </button>
            </div>

            {userBooks.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400 dark:text-slate-500">
                You have no active listings. Click &quot;Add Book&quot; to upload your first textbook.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-slate-800">
                {userBooks.map(b => (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                          {b.author} • {b.condition}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                        ₹{b.sellingPrice}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          b.status === 'sold'
                            ? 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 3. CREATOR STUDIO DASHBOARD */}
      {/* ----------------------------------------------------------- */}
      {workspace === 'creator' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
              Educational Video Creator Studio
            </h2>
            <button
              onClick={openUploadVideoModal}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload Video</span>
            </button>
          </div>

          <p className="text-xs text-stone-500 dark:text-slate-400">
            You have uploaded {userVideos.length} educational lecture(s).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {userVideos.map(v => (
              <div key={v.id} className="p-3 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/40">
                <img src={v.thumbnail} alt={v.title} className="w-full h-32 object-cover rounded-xl mb-2" />
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">{v.title}</h4>
                <p className="text-[10px] text-stone-500">{v.views} views • {v.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 4. AUTHOR STUDIO DASHBOARD */}
      {/* ----------------------------------------------------------- */}
      {workspace === 'author' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
              Author Publishing Studio
            </h2>
            <button
              onClick={openPublishModal}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish Manuscript</span>
            </button>
          </div>

          <p className="text-xs text-stone-500 dark:text-slate-400">
            You have published {userPublications.length} original novel(s) or comic(s).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {userPublications.map(p => (
              <div key={p.id} className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/40 flex items-center gap-3">
                <img src={p.coverImage} alt={p.title} className="w-14 h-20 object-cover rounded-xl flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">{p.category}</span>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">{p.title}</h4>
                  <p className="text-[11px] text-stone-500">{p.readsCount} reads • Status: {p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
