import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Gift,
  BookOpen,
  X,
  PlusCircle,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';
import { BookCondition, EducationalBoard, EducationalClass } from '../types';

export const BrowseBooksPage: React.FC = () => {
  const { books, openListBookModal } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [exchangeOnly, setExchangeOnly] = useState(false);
  const [freeDonationOnly, setFreeDonationOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'discount'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter computation
  const filteredBooks = books.filter(b => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subcategory.toLowerCase().includes(q) ||
        (b.board && b.board.toLowerCase().includes(q)) ||
        (b.classLevel && b.classLevel.toLowerCase().includes(q)) ||
        (b.isbn && b.isbn.toLowerCase().includes(q)) ||
        b.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (selectedMainCategory !== 'all' && b.mainCategory !== selectedMainCategory) {
      return false;
    }

    // Board
    if (selectedBoard !== 'all' && b.board !== selectedBoard) {
      return false;
    }

    // Class
    if (selectedClass !== 'all' && b.classLevel !== selectedClass) {
      return false;
    }

    // Condition
    if (selectedCondition !== 'all' && b.condition !== selectedCondition) {
      return false;
    }

    // Exchange
    if (exchangeOnly && !b.forExchange) {
      return false;
    }

    // Free donation
    if (freeDonationOnly && !b.isFreeDonation) {
      return false;
    }

    // Price
    if (b.sellingPrice > maxPrice) {
      return false;
    }

    return true;
  });

  // Sort computation
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'discount') {
      const discA = a.originalPrice > 0 ? (a.originalPrice - a.sellingPrice) / a.originalPrice : 0;
      const discB = b.originalPrice > 0 ? (b.originalPrice - b.sellingPrice) / b.originalPrice : 0;
      return discB - discA;
    }
    return 0; // featured default order
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMainCategory('all');
    setSelectedBoard('all');
    setSelectedClass('all');
    setSelectedCondition('all');
    setExchangeOnly(false);
    setFreeDonationOnly(false);
    setMaxPrice(2000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedMainCategory !== 'all' ||
    selectedBoard !== 'all' ||
    selectedClass !== 'all' ||
    selectedCondition !== 'all' ||
    exchangeOnly ||
    freeDonationOnly ||
    maxPrice < 2000;

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Quick Actions Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
            Second-hand & Community Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            Book Marketplace
          </h1>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Buy verified books at steep discounts or trade directly with campus students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-3.5 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-300 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
          </button>

          <button
            onClick={openListBookModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell or Swap a Book</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Panel (Desktop persistent, Mobile collapsable) */}
        <aside
          className={`lg:col-span-3 space-y-6 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200 dark:border-slate-700/80 shadow-xs ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Search Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1.5">
              Keywords
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Title, author, or ISBN..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={selectedMainCategory}
              onChange={e => setSelectedMainCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-800 dark:text-slate-200"
            >
              <option value="all">All Categories</option>
              <option value="educational">Educational & Curriculum</option>
              <option value="novel">Novels & Literature</option>
              <option value="comic">Comics & Manga</option>
              <option value="published">Indie Published Works</option>
            </select>
          </div>

          {/* Board (If Educational) */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1.5">
              Board / System
            </label>
            <select
              value={selectedBoard}
              onChange={e => setSelectedBoard(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-800 dark:text-slate-200"
            >
              <option value="all">All Boards</option>
              <option value="CBSE">CBSE</option>
              <option value="NCERT">NCERT</option>
              <option value="ICSE">ICSE</option>
              <option value="RBSE">RBSE</option>
              <option value="UP Board">UP Board</option>
              <option value="Bihar Board">Bihar Board</option>
              <option value="Maharashtra Board">Maharashtra Board</option>
              <option value="College / University">College / University</option>
              <option value="Competitive Exams">Competitive (JEE/NEET/UPSC)</option>
            </select>
          </div>

          {/* Class Level */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1.5">
              Class / Standard
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-800 dark:text-slate-200"
            >
              <option value="all">All Classes</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="Undergraduate (UG)">Undergraduate (UG)</option>
              <option value="Postgraduate (PG)">Postgraduate (PG)</option>
              <option value="Competitive (JEE/NEET/UPSC/GATE)">Competitive Exam</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1.5">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-800 dark:text-slate-200"
            >
              <option value="all">Any Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Annotated / Study-Marked">Study Annotated</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
              <span>Max Price</span>
              <span className="font-mono text-amber-600">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Special Toggles */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-slate-700">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={exchangeOnly}
                onChange={e => setExchangeOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-teal-600" /> Exchange Available Only
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={freeDonationOnly}
                onChange={e => setFreeDonationOnly(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded"
              />
              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-pink-600" /> Free Student Donations Only
              </span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Header Controls: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 text-xs">
            <span className="text-stone-600 dark:text-slate-300 font-semibold">
              Showing <strong className="text-amber-600 dark:text-amber-400">{sortedBooks.length}</strong> available listings
            </span>

            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-semibold text-stone-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {sortedBooks.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8">
              <BookOpen className="w-12 h-12 mx-auto stroke-1 text-stone-400 opacity-60 mb-3" />
              <h3 className="text-base font-bold text-stone-800 dark:text-slate-200">No matching books found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, choosing another board/class, or clear filters to view all books.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedBooks.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
