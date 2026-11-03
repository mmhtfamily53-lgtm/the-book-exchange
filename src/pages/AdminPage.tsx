import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  BookOpen,
  Video,
  Feather,
  MessageCircle,
  Users,
  Eye,
  Trash2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPage: React.FC = () => {
  const {
    books,
    deleteBook,
    videos,
    publishedWorks,
    approvePublication,
    rejectPublication,
    feedbacks,
    updateFeedbackStatus,
    currentUser,
    openReaderModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'listings' | 'feedback'>('overview');

  const pendingPubs = publishedWorks.filter(p => p.status === 'pending_approval');
  const activePubs = publishedWorks.filter(p => p.status === 'published');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
            Internal Operations & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-600" />
            <span>Platform Administration & Moderation</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Verify independent publications, review curriculum listings, and monitor student escrow safety.
          </p>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Analytics & Overview' },
          { id: 'publications', label: `Manuscripts (${publishedWorks.length})` },
          { id: 'listings', label: `Marketplace Listings (${books.length})` },
          { id: 'feedback', label: `Feedback Queue (${feedbacks.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Total Books in System</span>
              <span className="text-2xl font-extrabold text-stone-900 dark:text-slate-100 font-mono mt-1 block">
                {books.length}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Published Original Titles</span>
              <span className="text-2xl font-extrabold text-purple-600 font-mono mt-1 block">
                {publishedWorks.length}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Active Video Lessons</span>
              <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
                {videos.length}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Reported Complaints</span>
              <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
                0
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
              Community Health & Integrity Highlights
            </h3>
            <ul className="text-xs text-stone-600 dark:text-slate-300 space-y-2 list-disc list-inside">
              <li>All seller payouts held in automated 100% campus escrow until buyer verification.</li>
              <li>Free donation books flagged for zero commercial markup or predatory resale.</li>
              <li>CBSE, ICSE and university curriculum editions checked against official academic syllabus codes.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Publications Moderation */}
      {activeTab === 'publications' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Original Author Publications ({publishedWorks.length})
          </h2>

          <div className="space-y-3">
            {publishedWorks.map(w => (
              <div
                key={w.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.coverImage}
                    alt={w.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-2xs flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-600">
                      {w.category} • {w.genre}
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-slate-100">{w.title}</h3>
                    <p className="text-stone-500">
                      Author: {w.authorName} • {w.readsCount} reads • Status: <strong className="text-emerald-600">{w.status}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-semibold hover:bg-stone-50"
                  >
                    Inspect Manuscript
                  </button>
                  <button
                    onClick={() => approvePublication(w.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Marketplace Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Marketplace Listings Management ({books.length})
          </h2>

          <div className="space-y-2">
            {books.map(b => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={b.coverImage} alt={b.title} className="w-8 h-11 object-cover rounded" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-slate-100 truncate">{b.title}</h4>
                    <p className="text-stone-500 truncate">
                      Seller: {b.seller.name} • Price: ₹{b.sellingPrice} • {b.condition}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteBook(b.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100"
                  title="Remove from platform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Feedback Queue */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Feedback Submissions Queue ({feedbacks.length})
          </h2>

          <div className="space-y-3">
            {feedbacks.map(f => (
              <div
                key={f.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-slate-100">
                    {f.name} ({f.email})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {f.category}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-slate-300">"{f.message}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-700">
                  <span className="text-[10px] text-stone-400">{f.submittedAt}</span>
                  <button
                    onClick={() => updateFeedbackStatus(f.id, 'Resolved')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
