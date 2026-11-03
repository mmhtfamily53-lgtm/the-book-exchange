import React, { useState } from 'react';
import {
  X,
  BookPlus,
  Sparkles,
  Camera,
  Upload,
  Check,
  RefreshCw,
  Gift,
  DollarSign,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, BookCondition, BookMainCategory, EducationalBoard, EducationalClass } from '../types';

export const ListingModal: React.FC = () => {
  const {
    isListBookModalOpen,
    closeListBookModal,
    addBook,
    setCurrentPage,
    currentUser
  } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [mainCategory, setMainCategory] = useState<BookMainCategory>('educational');
  const [subcategory, setSubcategory] = useState('Mathematics');
  const [board, setBoard] = useState<EducationalBoard>('CBSE');
  const [classLevel, setClassLevel] = useState<EducationalClass>('Class 12');
  const [subject, setSubject] = useState('Physics');
  const [originalPrice, setOriginalPrice] = useState<number>(500);
  const [sellingPrice, setSellingPrice] = useState<number>(200);
  const [condition, setCondition] = useState<BookCondition>('Like New');
  const [conditionNotes, setConditionNotes] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
  const [forSale, setForSale] = useState(true);
  const [forExchange, setForExchange] = useState(true);
  const [isFreeDonation, setIsFreeDonation] = useState(false);
  const [exchangeWishlistText, setExchangeWishlistText] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');

  if (!isListBookModalOpen) return null;

  // Fast auto-fill templates
  const presets = [
    {
      label: 'Class 12 CBSE Physics',
      title: 'SL Arora Simplified Physics Class 12 (Set of 2 Volumes)',
      author: 'S.L. Arora',
      category: 'educational' as BookMainCategory,
      sub: 'Physics',
      board: 'CBSE' as EducationalBoard,
      cls: 'Class 12' as EducationalClass,
      orig: 1100,
      sell: 450,
      img: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
      desc: 'Complete 2-volume physics guide for CBSE boards. Includes past 10-year derivation questions and concept maps.'
    },
    {
      label: 'NCERT Class 10 Maths',
      title: 'NCERT Mathematics Class 10 with Solved Board Exemplar',
      author: 'NCERT Board',
      category: 'educational' as BookMainCategory,
      sub: 'Mathematics',
      board: 'NCERT' as EducationalBoard,
      cls: 'Class 10' as EducationalClass,
      orig: 240,
      sell: 90,
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      desc: 'All exercises solved with pencil margin notes. Includes chapter-wise summary notes.'
    },
    {
      label: 'Popular Novel',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      category: 'novel' as BookMainCategory,
      sub: 'Fiction',
      orig: 499,
      sell: 190,
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      desc: 'Between life and death there is a library. Pristine reading copy, spine undamaged.'
    },
    {
      label: 'Manga / Comic',
      title: 'Jujutsu Kaisen Vol. 1',
      author: 'Gege Akutami',
      category: 'comic' as BookMainCategory,
      sub: 'Manga',
      orig: 699,
      sell: 280,
      img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      desc: 'First volume of the hit supernatural manga. Gloss cover in acid-free sleeve.'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setAuthor(p.author);
    setMainCategory(p.category);
    setSubcategory(p.sub);
    if (p.board) setBoard(p.board);
    if (p.cls) setClassLevel(p.cls);
    setOriginalPrice(p.orig);
    setSellingPrice(p.sell);
    setCoverImage(p.img);
    setDescription(p.desc);
  };

  const handleConditionChange = (c: BookCondition) => {
    setCondition(c);
    // Smart valuation suggestion
    if (!isFreeDonation && originalPrice > 0) {
      let multiplier = 0.5;
      if (c === 'Brand New') multiplier = 0.75;
      else if (c === 'Like New') multiplier = 0.6;
      else if (c === 'Very Good') multiplier = 0.5;
      else if (c === 'Good') multiplier = 0.4;
      else if (c === 'Annotated / Study-Marked') multiplier = 0.35;
      else multiplier = 0.3;
      setSellingPrice(Math.round(originalPrice * multiplier));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert('Please provide book title and author.');
      return;
    }

    const wishlistTags = exchangeWishlistText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addBook({
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      mainCategory,
      subcategory,
      board: mainCategory === 'educational' ? board : undefined,
      classLevel: mainCategory === 'educational' ? classLevel : undefined,
      subject: mainCategory === 'educational' ? subject : undefined,
      description: description.trim() || 'Well-maintained book available for immediate sale or trade on campus.',
      originalPrice,
      sellingPrice: isFreeDonation ? 0 : sellingPrice,
      condition,
      conditionNotes: conditionNotes.trim(),
      location: currentUser.location,
      forSale: isFreeDonation ? false : forSale,
      forExchange: isFreeDonation ? false : forExchange,
      isFreeDonation,
      exchangeWishlist: wishlistTags.length > 0 ? wishlistTags : undefined,
      isbn: isbn.trim() || undefined,
      edition: edition.trim() || undefined,
      language: 'English',
      tags: [mainCategory, subcategory, condition, ...(board ? [board] : [])]
    });

    closeListBookModal();
    setCurrentPage('browse');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                List a Book for Sale or Exchange
              </h2>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Help fellow students and readers save money.
              </p>
            </div>
          </div>
          <button
            onClick={closeListBookModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Fast Autofill 1-Click Presets */}
          <div className="p-3.5 rounded-2xl bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fast 1-Click Popular Templates (Speed autofill):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-xs font-medium text-stone-800 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Book Essentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
              1. Book Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. NCERT Physics Class 12 Vol 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Author / Publisher *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. Dr. H.C. Verma / NCERT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Primary Category
                </label>
                <select
                  value={mainCategory}
                  onChange={e => setMainCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="educational">Educational & Academic</option>
                  <option value="novel">Novels & Literature</option>
                  <option value="comic">Comics & Manga</option>
                  <option value="general">General Non-fiction & Prep</option>
                </select>
              </div>

              {mainCategory === 'educational' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                      Board / Curriculum
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
                      <option value="Maharashtra Board">Maharashtra Board</option>
                      <option value="College / University">College / University</option>
                      <option value="Competitive Exams">Competitive (JEE/NEET/UPSC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                      Class Level
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
                      <option value="Postgraduate (PG)">Postgraduate (PG)</option>
                      <option value="Competitive (JEE/NEET/UPSC/GATE)">Competitive Exam</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Condition & Smart Valuation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
              2. Condition & Pricing Valuation
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-2">
                Book Condition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {(
                  [
                    'Brand New',
                    'Like New',
                    'Very Good',
                    'Good',
                    'Annotated / Study-Marked'
                  ] as BookCondition[]
                ).map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => handleConditionChange(c)}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      condition === c
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                        : 'border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                  Original MRP (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={e => {
                    const p = Number(e.target.value);
                    setOriginalPrice(p);
                    if (!isFreeDonation) setSellingPrice(Math.round(p * 0.5));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-mono font-bold text-stone-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span>Your Second-Hand Price (₹)</span>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    {originalPrice > sellingPrice && !isFreeDonation
                      ? `${Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)}% Discount`
                      : ''}
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={isFreeDonation}
                  value={isFreeDonation ? 0 : sellingPrice}
                  onChange={e => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Donation Toggle */}
            <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-600" />
                <div>
                  <span className="text-xs font-bold text-pink-900 dark:text-pink-200 block">
                    Donate as Free Book for Students in Need
                  </span>
                  <span className="text-[10px] text-pink-700 dark:text-pink-300">
                    Set price to ₹0. Verified students can claim it directly.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFreeDonation}
                onChange={e => {
                  setIsFreeDonation(e.target.checked);
                  if (e.target.checked) setSellingPrice(0);
                }}
                className="w-4 h-4 text-pink-600 rounded"
              />
            </div>
          </div>

          {/* Section 3: Exchange Options */}
          {!isFreeDonation && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                3. Exchange Preferences
              </h3>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forSale}
                    onChange={e => setForSale(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Allow Direct Purchase (Cash / Cart)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forExchange}
                    onChange={e => setForExchange(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span>Allow Book Exchange / Swap</span>
                </label>
              </div>

              {forExchange && (
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                    Books You Want in Return (Wishlist tags, comma separated)
                  </label>
                  <input
                    type="text"
                    value={exchangeWishlistText}
                    onChange={e => setExchangeWishlistText(e.target.value)}
                    placeholder="e.g. HC Verma Vol 2, RD Sharma Class 11, Berserk Manga"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Section 4: Cover Image & Notes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
              4. Cover Image & Description
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Cover Photo Image URL
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
                Description & Annotation Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mention page conditions, highlights, included test booklets, or campus meetup times..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
            >
              <BookPlus className="w-4 h-4" />
              Publish Listing to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
