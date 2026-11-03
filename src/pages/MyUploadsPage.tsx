import React from 'react';
import {
  UploadCloud,
  PlusCircle,
  Tag,
  DollarSign,
  Trash2,
  CheckCircle,
  MessageSquare,
  Eye,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyUploadsPage: React.FC = () => {
  const {
    books,
    deleteBook,
    updateBookStatus,
    openListBookModal,
    currentUser,
    openBookDetailModal
  } = useApp();

  const myListings = books.filter(b => b.seller.id === currentUser.id);

  const activeCount = myListings.filter(b => b.status === 'available').length;
  const soldCount = myListings.filter(b => b.status === 'sold' || b.status === 'traded').length;
  const potentialEarnings = myListings.reduce(
    (acc, b) => (b.status === 'available' ? acc + b.sellingPrice : acc),
    0
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
            Seller Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            My Book Listings & Uploads
          </h1>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Manage your books listed for sale or exchange on the campus marketplace.
          </p>
        </div>

        <button
          onClick={openListBookModal}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Another Book</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Active Listed Books</span>
          <span className="text-2xl font-extrabold text-stone-900 dark:text-slate-100 font-mono mt-1 block">
            {activeCount}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Books Sold / Traded</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
            {soldCount}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Potential Value</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            ₹{potentialEarnings}
          </span>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
          Your Inventory ({myListings.length})
        </h2>

        {myListings.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
            <UploadCloud className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
            <p className="text-base font-bold text-stone-800 dark:text-slate-200">You haven't listed any books yet</p>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              Clear your bookshelf of semester textbooks, novels, or comics and earn extra cash or trade for new reads!
            </p>
            <button
              onClick={openListBookModal}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs"
            >
              List First Book
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myListings.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-2xs flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {b.condition}
                      </span>
                      {b.forExchange && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          Swap Open
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-900 dark:text-slate-100 text-sm truncate mt-1">
                      {b.title}
                    </h3>
                    <p className="text-stone-500 truncate">
                      by {b.author} • Listed at <strong className="font-mono text-emerald-600">₹{b.sellingPrice}</strong> (MRP ₹{b.originalPrice})
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {b.status === 'available' ? (
                    <button
                      onClick={() => updateBookStatus(b.id, 'sold')}
                      className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold text-xs hover:bg-emerald-100"
                    >
                      Mark as Traded / Sold
                    </button>
                  ) : (
                    <button
                      onClick={() => updateBookStatus(b.id, 'available')}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-700 font-semibold text-xs hover:bg-stone-100"
                    >
                      Relist as Available
                    </button>
                  )}

                  <button
                    onClick={() => openBookDetailModal(b)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-slate-200 hover:bg-stone-200"
                    title="View Listing"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteBook(b.id)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-slate-700 text-stone-400 hover:text-rose-600"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
