import React, { useState } from 'react';
import {
  Gift,
  Heart,
  PlusCircle,
  CheckCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';

export const FreeBooksPage: React.FC = () => {
  const { books, openListBookModal, addToCart } = useApp();

  const freeBooks = books.filter(b => b.isFreeDonation);

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-pink-950 via-rose-900 to-amber-950 text-white border border-pink-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30">
            Free Community Book Bank & Student Giving
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-editorial">
            Free Books for Students in Need
          </h1>
          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
            Education is a fundamental right, not a luxury. All books in this section are 100% donated
            by alumni, schools, and kind-hearted readers. Zero cost for books—pickup in person or pay nominal shipping.
          </p>
        </div>

        <button
          onClick={openListBookModal}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
        >
          <Gift className="w-4 h-4 text-pink-600" />
          <span>Donate a Book to a Student</span>
        </button>
      </div>

      {/* Trust & Verification Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Priority given to students with verified student IDs or recommendation letters.</span>
        </div>
        <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300">
          <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
          <span>All donated books are physically inspected for complete chapters before handover.</span>
        </div>
      </div>

      {/* Free Books Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Currently Available Donated Books ({freeBooks.length})
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ₹0 Cost • Free to Claim
          </span>
        </div>

        {freeBooks.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
            <Gift className="w-12 h-12 mx-auto stroke-1 opacity-60 mb-3" />
            <p className="text-base font-bold text-stone-800 dark:text-slate-200">No free books available right now</p>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              Be the first to donate a finished curriculum guide or novel to support a young student!
            </p>
            <button
              onClick={openListBookModal}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-600 text-white font-semibold text-xs"
            >
              Donate Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeBooks.map(b => (
              <div key={b.id} className="relative">
                <BookCard book={b} />
                <div className="mt-2 p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-[11px] text-pink-900 dark:text-pink-300 flex items-center justify-between">
                  <span>Donated by: <strong>{b.seller.name}</strong></span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Claim 1-Click</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
