import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  GraduationCap,
  Video,
  Feather,
  Sparkles,
  ArrowRight,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UniversalSearchModal: React.FC = () => {
  const {
    isUniversalSearchOpen,
    closeUniversalSearch,
    books,
    studyMaterials,
    videos,
    publishedWorks,
    openBookDetailModal,
    openVideoPlayerModal,
    openReaderModal,
    setCurrentPage
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'books' | 'study' | 'videos' | 'published'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUniversalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isUniversalSearchOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle search
        if (isUniversalSearchOpen) {
          closeUniversalSearch();
        } else {
          // Open search
          const event = new CustomEvent('open-universal-search');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isUniversalSearchOpen) {
        closeUniversalSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUniversalSearchOpen, closeUniversalSearch]);

  if (!isUniversalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredBooks = books.filter(b => {
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subcategory.toLowerCase().includes(q) ||
      (b.board && b.board.toLowerCase().includes(q)) ||
      (b.classLevel && b.classLevel.toLowerCase().includes(q)) ||
      (b.subject && b.subject.toLowerCase().includes(q)) ||
      (b.isbn && b.isbn.toLowerCase().includes(q)) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const filteredStudyMaterials = studyMaterials.filter(m => {
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.board.toLowerCase().includes(q) ||
      m.classLevel.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.chapter.toLowerCase().includes(q) ||
      m.uploaderName.toLowerCase().includes(q)
    );
  });

  const filteredVideos = videos.filter(v => {
    if (!q) return true;
    return (
      v.title.toLowerCase().includes(q) ||
      v.subject.toLowerCase().includes(q) ||
      v.creatorName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (v.board && v.board.toLowerCase().includes(q))
    );
  });

  const filteredPublished = publishedWorks.filter(p => {
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.genre.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const totalResultsCount =
    (filterTab === 'all' || filterTab === 'books' ? filteredBooks.length : 0) +
    (filterTab === 'all' || filterTab === 'study' ? filteredStudyMaterials.length : 0) +
    (filterTab === 'all' || filterTab === 'videos' ? filteredVideos.length : 0) +
    (filterTab === 'all' || filterTab === 'published' ? filteredPublished.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search titles, NCERT/CBSE classes, authors, HC Verma, videos, comics..."
            className="flex-1 bg-transparent text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeUniversalSearch}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-200"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 border-b border-stone-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'books', label: `Books (${filteredBooks.length})` },
            { id: 'study', label: `Study Materials (${filteredStudyMaterials.length})` },
            { id: 'videos', label: `Videos (${filteredVideos.length})` },
            { id: 'published', label: `Indie & Comics (${filteredPublished.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                filterTab === tab.id
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {totalResultsCount === 0 ? (
            <div className="py-12 text-center text-stone-400 dark:text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto stroke-1 opacity-50 mb-2" />
              <p className="font-semibold text-stone-700 dark:text-slate-300 text-sm">No exact matches found</p>
              <p className="text-xs mt-1">Try searching for "CBSE", "Physics", "Calculus", "Dune", or "NCERT".</p>
            </div>
          ) : (
            <>
              {/* Books Section */}
              {(filterTab === 'all' || filterTab === 'books') && filteredBooks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      Books & Second-hand Marketplace
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage('browse');
                        closeUniversalSearch();
                      }}
                      className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      View in Marketplace <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filteredBooks.slice(0, 4).map(b => (
                      <div
                        key={b.id}
                        onClick={() => {
                          openBookDetailModal(b);
                          closeUniversalSearch();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500 bg-stone-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all"
                      >
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-xs flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                            {b.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                            by {b.author} • {b.subcategory} {b.board ? `• ${b.board}` : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                              ₹{b.sellingPrice}
                            </span>
                            <span className="text-[10px] line-through text-stone-400">
                              ₹{b.originalPrice}
                            </span>
                            {b.forExchange && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                                Swap Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Materials */}
              {(filterTab === 'all' || filterTab === 'study') && filteredStudyMaterials.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      Free Study Materials & Notes
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage('study');
                        closeUniversalSearch();
                      }}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Open Study Hub <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filteredStudyMaterials.slice(0, 3).map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setCurrentPage('study');
                          closeUniversalSearch();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl border border-stone-100 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500 bg-stone-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mr-2">
                            {m.board} • {m.classLevel}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate mt-1">
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400">
                            By {m.uploaderName} • {m.materialType} • {m.downloadsCount} downloads
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Free PDF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {(filterTab === 'all' || filterTab === 'videos') && filteredVideos.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-rose-600" />
                      Educational Videos & Experiments
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage('videos');
                        closeUniversalSearch();
                      }}
                      className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      View All Videos <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filteredVideos.slice(0, 3).map(v => (
                      <div
                        key={v.id}
                        onClick={() => {
                          openVideoPlayerModal(v);
                          closeUniversalSearch();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-800/80 hover:border-rose-400 dark:hover:border-rose-500 bg-stone-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all"
                      >
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 px-1 text-[9px] bg-black/80 text-white font-mono rounded">
                            {v.duration}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                            {v.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                            {v.creatorName} • {v.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Works */}
              {(filterTab === 'all' || filterTab === 'published') && filteredPublished.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-purple-600" />
                      Indie Publications, Novels & Comics
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage('publish');
                        closeUniversalSearch();
                      }}
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Publish Hub <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filteredPublished.slice(0, 3).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          openReaderModal({
                            title: p.title,
                            author: p.authorName,
                            content: p.manuscriptText,
                            panels: p.samplePanels,
                            category: p.category
                          });
                          closeUniversalSearch();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl border border-stone-100 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-500 bg-stone-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all"
                      >
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-xs flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                            by {p.authorName} • {p.genre} ({p.category})
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                            Read Digital Sample →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-stone-100 dark:bg-slate-950/60 border-t border-stone-200 dark:border-slate-800 text-[11px] text-stone-500 dark:text-slate-400 flex items-center justify-between">
          <span className="font-mono">Total indexed items: {books.length + studyMaterials.length + videos.length + publishedWorks.length}</span>
          <span className="font-editorial italic">"Where Every Book Finds a Reader"</span>
        </div>
      </div>
    </div>
  );
};
