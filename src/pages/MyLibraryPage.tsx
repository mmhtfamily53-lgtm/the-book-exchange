import React, { useState } from 'react';
import {
  Bookmark,
  Heart,
  Download,
  BookOpen,
  Clock,
  Sparkles,
  RefreshCw,
  PackageCheck,
  Eye,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';

export const MyLibraryPage: React.FC = () => {
  const {
    books,
    wishlist,
    toggleWishlist,
    orderHistory,
    studyMaterials,
    openReaderModal,
    openExchangeModal,
    setCurrentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders' | 'downloads'>('wishlist');

  const wishlistedBooks = books.filter(b => wishlist.includes(b.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
          Personal Reading & Study Desk
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
          My Library & Saved Wishlist
        </h1>
        <p className="text-xs text-stone-600 dark:text-slate-300">
          Manage your saved books, track order shipments, and review downloaded semester guides.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wishlist'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Wishlist ({wishlistedBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>Orders & Escrow Receipts ({orderHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'downloads'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Study Guides & Downloads</span>
        </button>
      </div>

      {/* Tab 1: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {/* Book Match Radar Feature */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Book Radar Active:</strong> We notify you the moment another student lists a book on your wishlist for local campus swap!
              </span>
            </div>
            <button
              onClick={() => setCurrentPage('browse')}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex-shrink-0"
            >
              Browse more books →
            </button>
          </div>

          {wishlistedBooks.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
              <Heart className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
              <p className="text-sm font-bold text-stone-800 dark:text-slate-200">Your wishlist is empty</p>
              <p className="text-xs mt-1">Click the heart icon on any book in the marketplace to track price drops and swap matches.</p>
              <button
                onClick={() => setCurrentPage('browse')}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs"
              >
                Explore Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedBooks.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orderHistory.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
              <PackageCheck className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
              <p className="text-sm font-bold text-stone-800 dark:text-slate-200">No orders placed yet</p>
              <p className="text-xs mt-1">Add second-hand books to cart and checkout to secure escrow purchase.</p>
            </div>
          ) : (
            orderHistory.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                      {order.id}
                    </span>
                    <span className="text-xs text-stone-400">• {order.date}</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.book.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="w-8 h-11 object-cover rounded shadow-2xs"
                        />
                        <span className="font-bold text-stone-800 dark:text-slate-200">
                          {item.book.title}
                        </span>
                      </div>
                      <span className="font-mono text-stone-700 dark:text-slate-300">
                        ₹{item.book.sellingPrice}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-slate-700 flex justify-between text-xs font-bold text-stone-900 dark:text-slate-100">
                  <span>Total Escrow Secured:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Downloads */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyMaterials.slice(0, 2).map(m => (
              <div
                key={m.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">
                    {m.board} • {m.classLevel}
                  </span>
                  <h4 className="font-bold text-stone-900 dark:text-slate-100 line-clamp-1">{m.title}</h4>
                  <p className="text-stone-400 text-[11px]">{m.materialType} • {m.fileSize}</p>
                </div>
                <button
                  onClick={() =>
                    openReaderModal({
                      title: m.title,
                      author: m.uploaderName,
                      content: m.fullContent || m.previewSnippet
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 text-stone-800 dark:text-slate-200 font-semibold"
                >
                  Open Notes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
