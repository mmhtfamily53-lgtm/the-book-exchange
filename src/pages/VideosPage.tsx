import React, { useState } from 'react';
import {
  Video,
  Play,
  Upload,
  Tv,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationalVideo } from '../types';

export const VideosPage: React.FC = () => {
  const {
    videos,
    channels,
    openVideoPlayerModal,
    openUploadVideoModal,
    currentUser,
    setCurrentPage
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'Class 1-12', label: 'Class 1 to 12' },
    { id: 'Competitive', label: 'Competitive (JEE/NEET/UPSC)' },
    { id: 'Practical Experiment', label: 'Practical Experiments' },
    { id: 'Revision', label: 'Revision & One-Shots' },
    { id: 'Career Guidance', label: 'Career Roadmaps' }
  ];

  const filteredVideos = videos.filter(v => {
    if (activeCategory !== 'all' && v.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        v.title.toLowerCase().includes(q) ||
        v.subject.toLowerCase().includes(q) ||
        v.creatorName.toLowerCase().includes(q) ||
        (v.board && v.board.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white border border-rose-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
            Open Educational Video Network
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-editorial">
            Educational Videos & Live Demos
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
            Watch concept breakdowns, high school board problem solutions, lab experiments,
            and college lectures taught by passionate teachers and student rankers.
          </p>
        </div>

        <button
          onClick={openUploadVideoModal}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video / Launch Channel</span>
        </button>
      </div>

      {/* Featured Educator Channels Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 flex items-center gap-2">
            <Tv className="w-4 h-4 text-rose-600" />
            Featured Creator Channels
          </h2>
          <button
            onClick={() => setCurrentPage('channel')}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            My Channel Dashboard →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channels.map(chan => (
            <div
              key={chan.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs flex items-center gap-3.5"
            >
              <img
                src={chan.avatar}
                alt={chan.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                    {chan.name}
                  </h3>
                  {chan.verified && (
                    <CheckCircle className="w-3 h-3 text-rose-500 fill-rose-500 text-white flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                  {chan.handle} • {chan.subscribersCount.toLocaleString()} learners
                </p>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                  {chan.videosCount} video lessons
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search lessons or topics..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(v => (
          <div
            key={v.id}
            onClick={() => openVideoPlayerModal(v)}
            className="group rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-rose-500 overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div>
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                  {v.duration}
                </span>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/80 text-white uppercase backdrop-blur-sm">
                  {v.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
                  <span>{v.board ? `${v.board} • ` : ''}{v.classLevel || v.subject}</span>
                  <span>•</span>
                  <span className="text-stone-400 font-normal">{v.chapter}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 line-clamp-2 group-hover:text-rose-600 transition-colors">
                  {v.title}
                </h3>

                <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-2">
                  {v.description}
                </p>
              </div>
            </div>

            {/* Creator & Metrics */}
            <div className="p-4 pt-3 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={v.creatorAvatar}
                  alt={v.creatorName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <span className="font-semibold text-stone-800 dark:text-slate-200 truncate">
                  {v.creatorName}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] flex-shrink-0">
                <span>{v.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
