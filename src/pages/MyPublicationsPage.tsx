import React from 'react';
import {
  Feather,
  PlusCircle,
  Eye,
  Star,
  Users,
  BookOpen,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyPublicationsPage: React.FC = () => {
  const {
    publishedWorks,
    currentUser,
    openPublishModal,
    openReaderModal
  } = useApp();

  const myWorks = publishedWorks.filter(p => p.authorId === currentUser.id);

  const totalReads = myWorks.reduce((acc, w) => acc + w.readsCount, 0);
  const totalLikes = myWorks.reduce((acc, w) => acc + w.likesCount, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-0.5">
            Author & Independent Publisher Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
            My Published Books & Comics
          </h1>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Track digital readership, review feedback, and manage your published manuscripts.
          </p>
        </div>

        <button
          onClick={openPublishModal}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Feather className="w-4 h-4" />
          <span>Write / Publish New Work</span>
        </button>
      </div>

      {/* Author Portfolio Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-editorial text-stone-900 dark:text-slate-100">
                {currentUser.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Author & Creator
              </span>
            </div>
            <p className="text-xs text-stone-500 max-w-md mt-1">
              {currentUser.bio || 'Independent author sharing original novels and academic study guides.'}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 text-center border-t sm:border-t-0 sm:border-l border-stone-100 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
          <div>
            <span className="block text-xl font-extrabold text-purple-600 font-mono">
              {myWorks.length}
            </span>
            <span className="text-[11px] text-stone-400">Publications</span>
          </div>
          <div>
            <span className="block text-xl font-extrabold text-stone-900 dark:text-slate-100 font-mono">
              {totalReads.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-400">Total Reads</span>
          </div>
          <div>
            <span className="block text-xl font-extrabold text-amber-500 font-mono">
              {totalLikes.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-400">Reader Hearts</span>
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
          Your Manuscripts ({myWorks.length})
        </h3>

        {myWorks.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
            <Feather className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
            <p className="text-base font-bold text-stone-800 dark:text-slate-200">No works published yet</p>
            <p className="text-xs mt-1">Share an original novel, comic script, poetry anthology, or academic study guide.</p>
            <button
              onClick={openPublishModal}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs"
            >
              Publish First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myWorks.map(w => (
              <div
                key={w.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4">
                    <img
                      src={w.coverImage}
                      alt={w.title}
                      className="w-16 h-24 object-cover rounded-xl shadow-2xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-purple-600">
                        {w.category} • {w.genre}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100 truncate mt-0.5">
                        {w.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {w.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-600">
                    {w.isFree ? 'Free Read' : `₹${w.price}`}
                  </span>
                  <button
                    onClick={() =>
                      openReaderModal({
                        title: w.title,
                        author: w.authorName,
                        content: w.manuscriptText,
                        panels: w.samplePanels,
                        category: w.category
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 text-stone-800 dark:text-slate-200 font-semibold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Reader View
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
