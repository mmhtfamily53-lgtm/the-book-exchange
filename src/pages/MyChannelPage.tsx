import React, { useState } from 'react';
import {
  Tv,
  Upload,
  Video,
  Play,
  Users,
  Eye,
  Trash2,
  CheckCircle,
  BarChart3,
  ListPlus,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyChannelPage: React.FC = () => {
  const {
    videos,
    channels,
    currentUser,
    openUploadVideoModal,
    openVideoPlayerModal
  } = useApp();

  const userChannel = channels.find(c => c.id === currentUser.channelId) || channels[0];
  const myVideos = videos.filter(v => v.creatorChannelId === userChannel.id);

  const totalViews = myVideos.reduce((acc, v) => acc + v.views, 0);
  const totalLikes = myVideos.reduce((acc, v) => acc + v.likes, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Channel Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-slate-700 bg-slate-900 shadow-md">
        <div className="h-44 sm:h-56 w-full relative">
          <img
            src={userChannel.bannerImage}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Channel Header Profile */}
        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={userChannel.avatar}
              alt={userChannel.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-2xl flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-editorial text-white">
                  {userChannel.name}
                </h1>
                <CheckCircle className="w-5 h-5 text-rose-500 fill-rose-500 text-white" />
              </div>
              <p className="text-xs text-stone-300">
                {userChannel.handle} • {userChannel.subscribersCount.toLocaleString()} subscribers • {myVideos.length} uploaded videos
              </p>
              <p className="text-xs text-stone-300 max-w-xl line-clamp-2">
                {userChannel.description}
              </p>
            </div>
          </div>

          <button
            onClick={openUploadVideoModal}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer self-start sm:self-end"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Lesson</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Total Channel Views</span>
          <span className="text-2xl font-extrabold text-stone-900 dark:text-slate-100 font-mono mt-1 block">
            {totalViews.toLocaleString()}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Community Subscribers</span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
            {userChannel.subscribersCount.toLocaleString()}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Total Student Likes</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            {totalLikes.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Uploaded Videos List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
          Your Uploaded Video Lessons ({myVideos.length})
        </h2>

        {myVideos.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-8 text-stone-400">
            <Tv className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
            <p className="text-base font-bold text-stone-800 dark:text-slate-200">No videos uploaded yet</p>
            <p className="text-xs mt-1">Share an educational experiment, solved exam problem, or career guidance lesson.</p>
            <button
              onClick={openUploadVideoModal}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs"
            >
              Upload First Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVideos.map(v => (
              <div
                key={v.id}
                onClick={() => openVideoPlayerModal(v)}
                className="group rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-rose-500 overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                      {v.duration}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      {v.category} • {v.subject}
                    </span>
                    <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100 line-clamp-2">
                      {v.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{v.views.toLocaleString()} views</span>
                  <span>{v.likes} likes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
