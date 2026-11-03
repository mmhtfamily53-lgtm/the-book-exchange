import React from 'react';
import {
  BookOpen,
  Compass,
  ArrowRight,
  GraduationCap,
  Video,
  Sparkles,
  RefreshCw,
  PenTool,
  Gift,
  ShieldCheck,
  Users,
  Search,
  CheckCircle,
  Play,
  Heart,
  ChevronRight,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';

export const HomePage: React.FC = () => {
  const {
    setCurrentPage,
    books,
    studyMaterials,
    videos,
    publishedWorks,
    openUniversalSearch,
    openVideoPlayerModal,
    openReaderModal,
    openListBookModal,
    openPublishModal
  } = useApp();

  const featuredBooks = books.slice(0, 4);
  const featuredStudy = studyMaterials.slice(0, 3);
  const trendingVideos = videos.slice(0, 2);
  const popularComicsAndNovels = books.filter(b => b.mainCategory === 'novel' || b.mainCategory === 'comic').slice(0, 3);
  const indiePublications = publishedWorks.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION & WELCOME SCREEN */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-700/60">
        {/* Subtle decorative circles & lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>"Knowledge Should Never Be Expensive."</span>
          </div>

          {/* Primary Name & Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-editorial tracking-tight text-white leading-tight">
            THE BOOK EXCHANGE
          </h1>

          <p className="text-base sm:text-xl font-editorial italic text-stone-200 max-w-2xl mx-auto leading-relaxed">
            "Buy Books. Exchange Knowledge. Learn Together. Publish Your Imagination."
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An all-in-one community hub for students, teachers, book lovers, and authors.
            Save up to 80% on textbooks, swap novels without money, access free exam guides, watch video lessons, and publish your own work.
          </p>

          {/* TWO PROMINENT OPTIONS REQUESTED BY BRIEF:
              1. START BROWSING – Visitors can immediately explore books, study materials, videos, novels, and comics without creating an account.
              2. EXPLORE WEBSITE – Opens the complete website dashboard with all navigation options and features. */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('browse')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-950/40 hover:scale-105 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-slate-950" />
              <span>START BROWSING</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('browse')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-sm sm:text-base border border-slate-600/80 flex items-center justify-center gap-3 backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>EXPLORE WEBSITE DASHBOARD</span>
            </button>
          </div>

          {/* Quick Universal Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div
              onClick={openUniversalSearch}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-stone-200 text-xs sm:text-sm cursor-pointer shadow-lg backdrop-blur-md transition-all group"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-left truncate">
                Search CBSE, ICSE, NCERT, JEE, HC Verma, novels, comics, or lectures...
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                Click to Search
              </span>
            </div>
          </div>
        </div>

        {/* Community Impact Stats Strip */}
        <div className="mt-12 pt-8 border-t border-slate-700/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">14,800+</span>
            <span className="text-xs text-slate-300 font-medium">Books Exchanged</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">3,200+</span>
            <span className="text-xs text-slate-300 font-medium">Free Study Guides</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">980+</span>
            <span className="text-xs text-slate-300 font-medium">Published Authors</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">₹2.4 Cr+</span>
            <span className="text-xs text-slate-300 font-medium">Saved by Students</span>
          </div>
        </div>
      </section>

      {/* 2. HOW THE PLATFORM WORKS (4-STEP EXPLAINER) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
            Simple, Transparent & Community-Driven
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            How The Book Exchange Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Buy & Save Big</h3>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              Find second-hand school and university books at 50% to 80% discount. Every listing is verified with clear condition marks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-lg font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Zero-Cash Exchange</h3>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              Trade books directly with campus peers. Offer a book you already read in exchange for the one you need next semester.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-lg font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Learn with Videos</h3>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              Watch curated educational videos, download verified teacher formula notes, and join peer doubt discussion boards.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-lg font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Publish Your Voice</h3>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              Write and self-publish original novels, manga, comics, and study primers with instant digital reader access and author profiles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SECOND-HAND BOOKS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
              Curriculum & Best-Sellers
            </span>
            <h2 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Featured Second-Hand Books
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('browse')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            View All ({books.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map(b => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR STUDY MATERIALS & FREE EXAM GUIDES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
              100% Free Educational Library
            </span>
            <h2 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Popular Study Materials & Notes
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('study')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Open Study Hub <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStudy.map(m => (
            <div
              key={m.id}
              onClick={() => setCurrentPage('study')}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                    {m.board} • {m.classLevel}
                  </span>
                  <span className="text-[10px] text-stone-400">• {m.materialType}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 line-clamp-2">
                  {m.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">{m.uploaderName}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Free PDF ({m.fileSize})
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRENDING EDUCATIONAL VIDEOS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-0.5">
              Visual Learning & Practical Demos
            </span>
            <h2 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Trending Educational Videos
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('videos')}
            className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            Video Platform ({videos.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingVideos.map(v => (
            <div
              key={v.id}
              onClick={() => openVideoPlayerModal(v)}
              className="group rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-rose-500 overflow-hidden cursor-pointer transition-all flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-56 aspect-video sm:aspect-auto bg-stone-900 flex-shrink-0">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                  {v.duration}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-rose-600 mb-1">
                    <span>{v.category}</span>
                    <span>•</span>
                    <span className="text-stone-400">{v.subject}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 line-clamp-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {v.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-stone-800 dark:text-slate-200">{v.creatorName}</span>
                  <span>{v.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INDIE PUBLISHING & NOVELS / COMICS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-0.5">
              Original Works & Graphic Stories
            </span>
            <h2 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Published by Community Authors
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('publish')}
            className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            Publishing Desk <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indiePublications.map(p => (
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
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-purple-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] w-full max-w-[180px] mx-auto rounded-xl overflow-hidden book-shadow mb-4">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-700 text-white">
                    {p.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 text-center line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-500 text-center mt-0.5">
                  by <span className="font-semibold text-stone-700 dark:text-slate-300">{p.authorName}</span>
                </p>
                <p className="text-xs text-stone-600 dark:text-slate-300 mt-2 line-clamp-2 text-center">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {p.isFree ? 'Free to Read' : `₹${p.price}`}
                </span>
                <span className="text-stone-500 font-semibold hover:underline flex items-center gap-1">
                  Read Sample Chapter →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DONATION CALLOUT FOR STUDENTS IN NEED */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white p-8 sm:p-10 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            The Free Books & Donation Initiative
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial">
            Have Finished Books? Donate Them to Students Who Can't Afford Them.
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Every donated book goes directly to verified students in rural or low-income schools.
            Zero seller fees. Pick up organized through campus volunteers.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('free')}
              className="px-6 py-2.5 rounded-xl bg-white text-pink-700 font-bold text-xs shadow-md hover:bg-pink-50 transition-colors"
            >
              Browse Donated Books
            </button>
            <button
              onClick={openListBookModal}
              className="px-6 py-2.5 rounded-xl bg-pink-900/60 hover:bg-pink-900 text-white font-bold text-xs border border-white/20 transition-colors"
            >
              Donate a Book (Free of charge)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
