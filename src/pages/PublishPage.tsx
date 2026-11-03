import React from 'react';
import {
  Feather,
  Sparkles,
  BookOpen,
  Eye,
  CheckCircle,
  Users,
  PenTool,
  ShieldCheck,
  Star,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PublishPage: React.FC = () => {
  const {
    publishedWorks,
    openPublishModal,
    openReaderModal,
    currentUser,
    setCurrentPage
  } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 text-white p-8 sm:p-12 border border-purple-800/40 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
            Self-Publishing & Independent Press
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial leading-tight">
            Publish Your Imagination. Build Your Readership.
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
            The Book Exchange provides independent novelists, comic creators, poets, and academic
            educators an open platform to publish original works with built-in digital reading,
            community reviews, and zero publisher gatekeeping.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={openPublishModal}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-purple-950/40 hover:scale-105 transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>Publish Your Work (Free & Open)</span>
            </button>

            <button
              onClick={() => setCurrentPage('publications')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>View My Author Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Indie Publishing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <BookOpen className="w-8 h-8 text-purple-600" />
          <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Digital Reader App</h3>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Every published work gets an elegant distraction-free reading viewer with light/sepia/dark modes and font controls.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <Sparkles className="w-8 h-8 text-amber-600" />
          <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Novels & Manga Panels</h3>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Publish serialized chapters or graphic novel panels. Readers can flip panels on mobile or desktop with zero lag.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <Users className="w-8 h-8 text-emerald-600" />
          <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Author Profile & Fans</h3>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Automatically launches an author profile with bio, reader ratings, review comments, and direct reader messaging.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Retain 100% Rights</h3>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            You maintain all copyrights and intellectual property. Publish for free or set paid print-on-demand pricing.
          </p>
        </div>
      </div>

      {/* Featured Community Published Works */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-0.5">
              Fresh Off The Community Press
            </span>
            <h2 className="text-2xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Featured Indie Publications
            </h2>
          </div>
          <button
            onClick={openPublishModal}
            className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            Submit Your Manuscript <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedWorks.map(work => (
            <div
              key={work.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover & format */}
                <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden book-shadow mb-4 bg-stone-100 dark:bg-slate-900">
                  <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs">
                    {work.category}
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                    {work.genre}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 line-clamp-1">
                    {work.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    by <span className="font-semibold text-stone-800 dark:text-slate-200">{work.authorName}</span>
                  </p>
                </div>

                <p className="text-xs text-stone-600 dark:text-slate-300 mt-3 line-clamp-3 text-center leading-relaxed">
                  {work.description}
                </p>

                {/* Author Bio Badge */}
                <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-slate-900/50 border border-stone-100 dark:border-slate-700/60 flex items-center gap-2.5 text-xs">
                  <img
                    src={work.authorAvatar}
                    alt={work.authorName}
                    className="w-8 h-8 rounded-full object-cover border border-purple-400"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-stone-900 dark:text-slate-100 block truncate">
                      {work.authorName}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate block">
                      {work.authorBio}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reader CTA */}
              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-700 dark:text-purple-400">
                  {work.isFree ? 'Free to Read' : `₹${work.price}`}
                </span>
                <button
                  onClick={() =>
                    openReaderModal({
                      title: work.title,
                      author: work.authorName,
                      content: work.manuscriptText,
                      panels: work.samplePanels,
                      category: work.category
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Read Digital Sample
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
