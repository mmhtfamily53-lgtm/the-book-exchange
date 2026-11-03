import React, { useState } from 'react';
import {
  X,
  Feather,
  Sparkles,
  BookOpen,
  Image,
  DollarSign,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PublishedWork } from '../types';

export const PublishingModal: React.FC = () => {
  const {
    isPublishModalOpen,
    closePublishModal,
    publishWork,
    currentUser,
    setCurrentPage
  } = useApp();

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState(currentUser.name);
  const [category, setCategory] = useState<PublishedWork['category']>('Novel');
  const [genre, setGenre] = useState('Fantasy / Sci-Fi');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80');
  const [manuscriptText, setManuscriptText] = useState(
    `PROLOGUE: THE WHISPERING VAULT\n\nThe archives of the Grand Library did not sleep when the sun fell below the horizon.\n\nFrom the high copper rafters, lantern oil sputtered against the chill. Sister Veronika pulled her woolen shawl tighter around her shoulders as she reached for the bound parchment volume numbered forty-seven.\n\n"If you open that cipher," a soft voice warned from the shadows behind the cedar stacks, "the censors in the capital will know before midnight."\n\nCHAPTER ONE: INK AND ASH\n\nShe did not turn around. She knew the cadence of that voice...`
  );
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(140);
  const [tagsText, setTagsText] = useState('Indie Novel, Fantasy, Original Fiction');

  if (!isPublishModalOpen) return null;

  const wordCount = manuscriptText.trim() ? manuscriptText.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !manuscriptText.trim()) {
      alert('Please provide book title and manuscript text.');
      return;
    }

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    publishWork({
      title: title.trim(),
      category,
      genre,
      description: description.trim() || `An original ${category} written by ${authorName}.`,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      manuscriptText: manuscriptText.trim(),
      isFree,
      price: isFree ? 0 : price,
      pageCount,
      tags
    });

    closePublishModal();
    setCurrentPage('publications');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-purple-50/70 dark:bg-purple-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                Author & Creator Publishing Studio
              </h2>
              <p className="text-[11px] text-purple-800 dark:text-purple-300">
                Publish your novels, comics, poetry & textbooks to a global community.
              </p>
            </div>
          </div>
          <button
            onClick={closePublishModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Book / Comic Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Chronicles of the Amber Spire"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Author Pen Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Your author display name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Type & Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Format Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="Novel">Novel / Fiction</option>
                <option value="Comic">Comic Book</option>
                <option value="Manga">Manga / Graphic Novel</option>
                <option value="Textbook">Textbook / Study Guide</option>
                <option value="Poetry">Poetry Collection</option>
                <option value="Short Story">Short Story Anthology</option>
                <option value="Research">Academic Research Paper</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="e.g. Cyberpunk Noir / Historical"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Estimated Pages
              </label>
              <input
                type="number"
                min="1"
                value={pageCount}
                onChange={e => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-mono text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Cover & Blurb */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Cover Art URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Book Blurb & Synopsis
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your book's core premise to hook potential readers..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Online Writing Editor & Manuscript */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                Online Manuscript / Chapter 1 Editor
              </label>
              <span className="text-[11px] font-mono text-stone-500 dark:text-slate-400">
                Word Count: <strong className="text-purple-600">{wordCount} words</strong>
              </span>
            </div>
            <textarea
              rows={8}
              required
              value={manuscriptText}
              onChange={e => setManuscriptText(e.target.value)}
              placeholder="Paste or write your opening chapters or comic script here..."
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs leading-relaxed font-mono text-stone-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">
              Supports markdown headers (CHAPTER 1, PROLOGUE) and script format for comics.
            </p>
          </div>

          {/* Pricing & Free Option */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-2">
              Reader Access & Pricing
            </h4>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="pricing"
                  checked={isFree}
                  onChange={() => {
                    setIsFree(true);
                    setPrice(0);
                  }}
                  className="w-4 h-4 text-purple-600"
                />
                <span>Free to Read (Maximize Audience & Community Reviews)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="pricing"
                  checked={!isFree}
                  onChange={() => {
                    setIsFree(false);
                    setPrice(99);
                  }}
                  className="w-4 h-4 text-purple-600"
                />
                <span>Paid eBook / Physical Print Edition</span>
              </label>
            </div>

            {!isFree && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700 dark:text-slate-300">Set Price:</span>
                <div className="relative w-32">
                  <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-bold font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              Publish Work & Activate Author Profile
            </button>
            <p className="text-[11px] text-center text-stone-500 dark:text-slate-400 mt-2">
              Your work will be instantly available in the Novels & Comics library and the Indie Press Desk!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
