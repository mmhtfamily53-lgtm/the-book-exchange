import React, { useState } from 'react';
import {
  BookMarked,
  Sparkles,
  BookOpen,
  Eye,
  Heart,
  ShoppingCart,
  RefreshCw,
  Search,
  Filter,
  PenTool
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';

export const NovelsComicsPage: React.FC<{ initialTab?: 'novels' | 'comics' }> = ({ initialTab = 'novels' }) => {
  const {
    books,
    publishedWorks,
    openReaderModal,
    openPublishModal,
    setCurrentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'novels' | 'comics'>(initialTab);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const novelGenres = [
    'All Genres',
    'Classic Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery & Detective',
    'Historical Mystery',
    'Romance',
    'Thriller'
  ];

  const comicGenres = [
    'All Formats',
    'Manga',
    'Graphic Novels',
    'Superhero Comics',
    'Cyberpunk Manga',
    'Indie Zines'
  ];

  const currentGenres = activeTab === 'novels' ? novelGenres : comicGenres;

  // Filter books matching tab
  const tabBooks = books.filter(b => {
    if (activeTab === 'novels') {
      return b.mainCategory === 'novel' || (b.mainCategory === 'published' && b.subcategory.includes('Novel'));
    } else {
      return b.mainCategory === 'comic' || (b.mainCategory === 'published' && (b.subcategory.includes('Manga') || b.subcategory.includes('Comic')));
    }
  });

  const filteredBooks = tabBooks.filter(b => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subcategory.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedSubcategory !== 'all' && selectedSubcategory !== 'All Genres' && selectedSubcategory !== 'All Formats') {
      if (!b.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase())) return false;
    }
    return true;
  });

  // Also get published works in this category for digital reader
  const relevantPublished = publishedWorks.filter(p => {
    if (activeTab === 'novels') return p.category === 'Novel' || p.category === 'Short Story' || p.category === 'Poetry';
    return p.category === 'Comic' || p.category === 'Manga' || p.category === 'Graphic Novel';
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 text-white border border-amber-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Literary & Visual Arts Lounge
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-editorial">
            Novels, Manga & Graphic Stories
          </h1>
          <p className="text-xs sm:text-sm text-stone-200/80 leading-relaxed">
            Read digital previews, buy collector second-hand editions, trade fiction with fellow bookworms,
            or publish your own manuscripts to a passionate readership.
          </p>
        </div>

        <button
          onClick={openPublishModal}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
        >
          <PenTool className="w-4 h-4 text-slate-950" />
          <span>Publish Your Novel / Comic</span>
        </button>
      </div>

      {/* Tabs: Novels vs Comics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-4">
        <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('novels');
              setSelectedSubcategory('all');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'novels'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-600 dark:text-slate-300 hover:text-stone-900'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Novels & Fiction</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('comics');
              setSelectedSubcategory('all');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'comics'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-stone-600 dark:text-slate-300 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Comics & Manga</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {currentGenres.map((g, idx) => {
          const isSelected =
            (g === 'All Genres' || g === 'All Formats')
              ? selectedSubcategory === 'all'
              : selectedSubcategory === g;
          return (
            <button
              key={idx}
              onClick={() => setSelectedSubcategory(g === 'All Genres' || g === 'All Formats' ? 'all' : g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? activeTab === 'novels'
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Digital Reading Room Row (Free to read samples) */}
      {relevantPublished.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Distraction-Free Digital Reading Room
              </span>
              <h3 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                Community Published Originals (Read Sample Chapters Online)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relevantPublished.map(p => (
              <div
                key={p.id}
                onClick={() =>
                  openReaderModal({
                    title: p.title,
                    author: p.authorName,
                    content: p.manuscriptText,
                    panels: p.samplePanels,
                    category: p.category
                  })
                }
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer shadow-xs transition-all flex items-center gap-3.5 group"
              >
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-12 h-16 object-cover rounded-md shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate group-hover:text-amber-600">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">by {p.authorName}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                    <BookOpen className="w-3 h-3" /> Read Sample Chapter →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Physical Copies / Second-hand Marketplace Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
          Physical Copies & Trade Listings ({filteredBooks.length})
        </h3>

        {filteredBooks.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <BookMarked className="w-10 h-10 mx-auto stroke-1 opacity-50 mb-2" />
            <p className="text-xs">No physical copies found for this genre. Check back soon or list your own!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
