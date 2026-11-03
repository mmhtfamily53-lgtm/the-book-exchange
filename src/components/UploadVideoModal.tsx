import React, { useState } from 'react';
import {
  X,
  Video,
  Upload,
  Sparkles,
  Tv,
  ListPlus,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationalBoard, EducationalClass, EducationalVideo } from '../types';

export const UploadVideoModal: React.FC = () => {
  const {
    isUploadVideoModalOpen,
    closeUploadVideoModal,
    addVideo,
    currentUser,
    createOrUpdateChannel,
    setCurrentPage
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EducationalVideo['category']>('Class 1-12');
  const [board, setBoard] = useState<EducationalBoard>('CBSE');
  const [classLevel, setClassLevel] = useState<EducationalClass>('Class 12');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Electromagnetism');
  const [duration, setDuration] = useState('14:20');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  if (!isUploadVideoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a video title.');
      return;
    }

    // Auto-create or ensure user has creator channel
    const channelName = currentUser.name.includes('Sir') || currentUser.name.includes('Prof')
      ? currentUser.name
      : `${currentUser.name} Education Hub`;

    createOrUpdateChannel(
      channelName,
      'Sharing comprehensive board exam lessons, concept proofs, and practical demos.',
      currentUser.name.toLowerCase().replace(/\s+/g, '')
    );

    addVideo({
      title: title.trim(),
      description: description.trim() || 'Comprehensive educational session with solved board exam questions.',
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      creatorName: channelName,
      creatorAvatar: currentUser.avatar,
      creatorChannelId: currentUser.channelId || 'chan_me_01',
      board,
      classLevel,
      subject,
      chapter,
      category,
      duration: duration || '12:00',
      chapters: [
        { time: '00:00', title: 'Concept Introduction' },
        { time: '04:15', title: 'Core Derivation / Proof' },
        { time: '09:30', title: 'Board Exam Questions' }
      ]
    });

    closeUploadVideoModal();
    setCurrentPage('videos');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-rose-50/70 dark:bg-rose-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                Upload Educational Video
              </h2>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                Teach the community and automatically launch your Creator Channel.
              </p>
            </div>
          </div>
          <button
            onClick={closeUploadVideoModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Kirchhoff's Laws & Wheatstone Bridge in 15 Minutes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="Class 1-12">Class 1 to 12</option>
                <option value="Competitive">Competitive (JEE/NEET)</option>
                <option value="College">College Lectures</option>
                <option value="Practical Experiment">Practical Experiments</option>
                <option value="Revision">Revision Classes</option>
                <option value="Career Guidance">Career Guidance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Target Board
              </label>
              <select
                value={board}
                onChange={e => setBoard(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="CBSE">CBSE</option>
                <option value="NCERT">NCERT</option>
                <option value="ICSE">ICSE</option>
                <option value="RBSE">RBSE</option>
                <option value="UP Board">UP Board</option>
                <option value="Bihar Board">Bihar Board</option>
                <option value="College / University">College / University</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Class / Level
              </label>
              <select
                value={classLevel}
                onChange={e => setClassLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Undergraduate (UG)">Undergraduate (UG)</option>
                <option value="Competitive (JEE/NEET/UPSC/GATE)">Competitive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Physics / Mathematics"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Chapter / Topic
              </label>
              <input
                type="text"
                value={chapter}
                onChange={e => setChapter(e.target.value)}
                placeholder="Current Electricity"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Duration (mm:ss)
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="15:30"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-mono text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
              Video Description & Key Takeaways
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline the concepts, formulas, and board questions covered in this session..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Auto Channel Notification */}
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 flex items-center gap-2.5 text-xs text-rose-900 dark:text-rose-200">
            <Tv className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              Uploading automatically activates your verified Creator Channel dashboard with video analytics and subscriber tracking!
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Video to Educational Platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
