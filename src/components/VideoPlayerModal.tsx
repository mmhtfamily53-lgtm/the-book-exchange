import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ThumbsUp,
  Share2,
  Clock,
  BookOpen,
  MessageSquare,
  Send,
  Download,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoPlayerModal: React.FC = () => {
  const {
    selectedVideo,
    closeVideoPlayerModal,
    likeVideo,
    addVideoComment,
    currentUser
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [lectureNotes, setLectureNotes] = useState(
    '# My Lecture Notes\n- Key Formula: ε = -dΦ/dt (Faraday-Lenz Law)\n- Remember: Direction of induced current always opposes the flux change.\n- Repeated 5-mark question in CBSE 2022 & 2024.'
  );
  const [showNotes, setShowNotes] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  if (!selectedVideo) return null;

  const video = selectedVideo;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (timeStr: string) => {
    // parse mm:ss to seconds
    const parts = timeStr.split(':').map(Number);
    const seconds = parts[0] * 60 + parts[1];
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addVideoComment(video.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-4 max-h-[94vh] flex flex-col">
        {/* Header bar */}
        <div className="px-5 py-3 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
              {video.category}
            </span>
            <span className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
              {video.title}
            </span>
          </div>
          <button
            onClick={closeVideoPlayerModal}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player Box */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full h-full object-contain"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Info & Comments */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <h1 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
                    {video.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-stone-100 dark:border-slate-800">
                    {/* Creator Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={video.creatorAvatar}
                        alt={video.creatorName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-stone-900 dark:text-slate-100">
                            {video.creatorName}
                          </span>
                          <CheckCircle className="w-3.5 h-3.5 text-rose-500 fill-rose-500 text-white" />
                        </div>
                        <span className="text-xs text-stone-500 dark:text-slate-400">
                          {video.board ? `${video.board} • ` : ''}{video.classLevel || 'Educator'}
                        </span>
                      </div>
                      <button className="ml-2 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs">
                        Subscribe
                      </button>
                    </div>

                    {/* Likes & Share & Notes Trigger */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => likeVideo(video.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          video.isLiked
                            ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300 font-bold'
                            : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${video.isLiked ? 'fill-current' : ''}`} />
                        <span>{video.likes}</span>
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          showNotes
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                            : 'border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lecture Notes</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 text-xs text-stone-700 dark:text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-slate-100 mb-1">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{video.uploadedAt}</span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{video.chapter}</span>
                  </div>
                  <p className="whitespace-pre-line">{video.description}</p>
                </div>

                {/* Interactive Lecture Scratchpad if toggled */}
                {showNotes && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        Interactive Student Notebook (Auto-saved)
                      </span>
                      <button
                        onClick={() => {
                          const blob = new Blob([lectureNotes], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${video.title.slice(0, 30)}_notes.txt`;
                          a.click();
                        }}
                        className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Save to Device
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={lectureNotes}
                      onChange={e => setLectureNotes(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900 text-xs font-mono text-stone-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-stone-400" />
                    Discussion & Doubts ({video.comments.length})
                  </h3>

                  {/* Add comment input */}
                  <form onSubmit={handlePostComment} className="flex gap-2.5 mb-4">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Ask the teacher a question or leave feedback..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-3">
                    {video.comments.map(c => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50/60 dark:bg-slate-800/40 text-xs">
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-slate-100">{c.userName}</span>
                            {c.userBadge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300">
                                {c.userBadge}
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                          </div>
                          <p className="text-stone-700 dark:text-slate-300 mt-1">{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Chapters & Timestamps */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    Chapter Markers & Bookmarks
                  </h3>
                  {video.chapters && video.chapters.length > 0 ? (
                    <div className="space-y-1.5">
                      {video.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSeek(ch.time)}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium text-stone-800 dark:text-slate-200"
                        >
                          <span className="truncate pr-2">{ch.title}</span>
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold flex-shrink-0">
                            {ch.time}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400">Full lecture session</p>
                  )}
                </div>

                {/* Free study material companion link */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                    Companion Notes Available
                  </span>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                    Download free chapter formulas & handwritten derivations matching this lecture in the Study Materials section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
