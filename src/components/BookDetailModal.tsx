import React from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Check,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Share2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    closeBookDetailModal,
    openExchangeModal,
    addToCart,
    toggleWishlist,
    isWishlisted,
    startChatWithSeller,
    openReaderModal
  } = useApp();

  if (!selectedBook) return null;

  const book = selectedBook;
  const isLiked = isWishlisted(book.id);
  const discountPercent =
    book.originalPrice > 0
      ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Close Button Header */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(book.id)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition-colors ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-slate-800/90 text-stone-600 dark:text-slate-300 hover:text-rose-500'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={closeBookDetailModal}
            className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-stone-600 dark:text-slate-300 hover:text-stone-900 shadow-md transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Book Image & Seller Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden book-shadow border border-stone-200 dark:border-slate-700 bg-stone-100 dark:bg-slate-800">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600 text-white shadow-md">
                  {book.condition}
                </span>
              </div>

              {/* Verified Seller Box */}
              <div className="w-full mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <img
                    src={book.seller.avatar}
                    alt={book.seller.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-stone-900 dark:text-slate-100 truncate">
                        {book.seller.name}
                      </span>
                      {book.seller.isVerifiedStudent && (
                        <span className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Verified Campus Student">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-slate-400 truncate">
                      {book.seller.campusOrSchool || 'Verified Community Member'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 dark:text-slate-400">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">★ {book.seller.rating}</span>
                      <span>({book.seller.reviewsCount} trades & reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-slate-700 flex items-center justify-between text-xs text-stone-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {book.seller.location}
                  </span>
                  <button
                    onClick={() => {
                      startChatWithSeller(book.seller, `Hi ${book.seller.name}! I am interested in your listing: "${book.title}".`, {
                        id: book.id,
                        title: book.title,
                        price: book.sellingPrice
                      });
                      closeBookDetailModal();
                    }}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
              </div>

              {/* Escrow & Buyer Protection notice */}
              <div className="w-full mt-3 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Protected by The Book Exchange 100% Student Escrow & Campus Handover Guarantee.</span>
              </div>
            </div>

            {/* Right Column: Book Details & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category & Board Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400">
                    {book.subcategory}
                  </span>
                  {book.board && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                      {book.board}
                    </span>
                  )}
                  {book.classLevel && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300">
                      {book.classLevel}
                    </span>
                  )}
                  {book.forExchange && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Swap Eligible
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100 tracking-tight leading-snug">
                  {book.title}
                </h1>
                <p className="text-sm font-medium text-stone-600 dark:text-slate-300 mt-1">
                  By <span className="font-semibold text-stone-900 dark:text-slate-100">{book.author}</span>
                </p>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-slate-400 block">
                      Second-Hand Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-stone-900 dark:text-slate-100 font-mono">
                        {book.isFreeDonation ? 'FREE' : `₹${book.sellingPrice}`}
                      </span>
                      {book.originalPrice > book.sellingPrice && !book.isFreeDonation && (
                        <span className="text-sm line-through text-stone-400">
                          MRP ₹{book.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  {discountPercent > 0 && !book.isFreeDonation && (
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                        SAVE {discountPercent}%
                      </span>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        You save ₹{book.originalPrice - book.sellingPrice}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400 mb-1.5">
                    Description & Notes
                  </h4>
                  <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                  {book.conditionNotes && (
                    <div className="mt-2.5 p-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-xs text-stone-700 dark:text-slate-300">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Condition Note: </span>
                      {book.conditionNotes}
                    </div>
                  )}
                </div>

                {/* Exchange Wishlist Box if available */}
                {book.forExchange && book.exchangeWishlist && book.exchangeWishlist.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40">
                    <span className="text-xs uppercase font-bold tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5 mb-2">
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                      Seller’s Exchange Wishlist (What they accept in return)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {book.exchangeWishlist.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-200 text-xs font-medium border border-teal-200 dark:border-teal-800"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specification Table */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {book.isbn && (
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/60">
                      <span className="text-stone-400 block text-[10px]">ISBN</span>
                      <span className="font-mono font-medium text-stone-800 dark:text-slate-200">{book.isbn}</span>
                    </div>
                  )}
                  {book.edition && (
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/60">
                      <span className="text-stone-400 block text-[10px]">Edition</span>
                      <span className="font-medium text-stone-800 dark:text-slate-200">{book.edition}</span>
                    </div>
                  )}
                  {book.pageCount && (
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/60">
                      <span className="text-stone-400 block text-[10px]">Pages</span>
                      <span className="font-medium text-stone-800 dark:text-slate-200">{book.pageCount} pages</span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/60">
                    <span className="text-stone-400 block text-[10px]">Language</span>
                    <span className="font-medium text-stone-800 dark:text-slate-200">{book.language}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/60">
                    <span className="text-stone-400 block text-[10px]">Posted</span>
                    <span className="font-medium text-stone-800 dark:text-slate-200">{book.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action CTA Buttons */}
              <div className="mt-8 pt-5 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
                {/* Digital Reader Preview if available */}
                {book.digitalSampleContent && (
                  <button
                    onClick={() => {
                      openReaderModal({
                        title: book.title,
                        author: book.author,
                        content: book.digitalSampleContent!
                      });
                      closeBookDetailModal();
                    }}
                    className="flex-1 min-w-[140px] px-4 py-3 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Read Sample Preview
                  </button>
                )}

                {/* Propose Exchange Button */}
                {book.forExchange && (
                  <button
                    onClick={() => {
                      openExchangeModal(book);
                      closeBookDetailModal();
                    }}
                    className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Propose Book Swap
                  </button>
                )}

                {/* Buy Button */}
                <button
                  onClick={() => {
                    addToCart(book);
                    closeBookDetailModal();
                  }}
                  className="flex-1 min-w-[160px] px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {book.isFreeDonation ? 'Claim Free Donation' : `Buy Now for ₹${book.sellingPrice}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
