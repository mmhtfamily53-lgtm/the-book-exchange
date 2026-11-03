import React from 'react';
import {
  Heart,
  RefreshCw,
  ShoppingCart,
  Eye,
  MapPin,
  CheckCircle,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Book } from '../types';
import { useApp } from '../context/AppContext';

interface BookCardProps {
  book: Book;
  onQuickView?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onQuickView }) => {
  const {
    openBookDetailModal,
    openExchangeModal,
    addToCart,
    toggleWishlist,
    isWishlisted,
    currentUser
  } = useApp();

  const isLiked = isWishlisted(book.id);
  const discountPercent =
    book.originalPrice > 0
      ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
      : 0;

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(book);
    } else {
      openBookDetailModal(book);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/80 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <div
        onClick={handleCardClick}
        className="relative w-full aspect-[4/5] bg-stone-100 dark:bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        {/* Book image with book spine shadow effect */}
        <div className="relative h-full aspect-[2/3] book-shadow transition-transform duration-300 group-hover:scale-105">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover rounded-r-md rounded-l-xs"
            loading="lazy"
          />
          {/* Subtle realistic spine edge gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-white/10 to-transparent rounded-l-xs pointer-events-none" />
        </div>

        {/* Condition Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs backdrop-blur-md ${
              book.condition === 'Brand New'
                ? 'bg-emerald-600/90 text-white'
                : book.condition === 'Like New'
                ? 'bg-blue-600/90 text-white'
                : book.condition === 'Annotated / Study-Marked'
                ? 'bg-amber-600/90 text-white'
                : 'bg-stone-800/80 text-white'
            }`}
          >
            {book.condition}
          </span>

          {book.isFreeDonation && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-600 text-white shadow-xs">
              Free Donation
            </span>
          )}

          {book.board && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-amber-300 backdrop-blur-sm">
              {book.board} {book.classLevel ? `• ${book.classLevel}` : ''}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-800/80 text-stone-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Pill */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            Quick Inspect
          </span>
        </div>
      </div>

      {/* Book Information Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Format */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-slate-400 font-medium mb-1">
            <span className="truncate uppercase tracking-wide text-amber-700 dark:text-amber-400 font-bold">
              {book.subcategory}
            </span>
            {book.forExchange && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                <RefreshCw className="w-2.5 h-2.5" /> Swap Open
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="text-sm font-bold text-stone-900 dark:text-slate-100 line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-stone-600 dark:text-slate-400 mt-1 truncate">
            by <span className="font-medium text-stone-800 dark:text-slate-200">{book.author}</span>
          </p>

          {/* Location & Seller note */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-slate-400 mt-2 truncate">
            <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
            <span className="truncate">{book.seller.campusOrSchool || book.location}</span>
          </div>
        </div>

        {/* Price & Action Bottom Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900 dark:text-slate-100 font-mono">
                {book.isFreeDonation ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-sans">FREE</span>
                ) : (
                  `₹${book.sellingPrice}`
                )}
              </span>
              {book.originalPrice > book.sellingPrice && !book.isFreeDonation && (
                <span className="text-[11px] line-through text-stone-400">
                  ₹{book.originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && !book.isFreeDonation && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Swap Button */}
            {book.forExchange && (
              <button
                onClick={() => openExchangeModal(book)}
                className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold transition-colors"
                title="Propose a Book Exchange"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Buy / Add to Cart Button */}
            <button
              onClick={() => addToCart(book)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
              title="Add to Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{book.isFreeDonation ? 'Claim' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
