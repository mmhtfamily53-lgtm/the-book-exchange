import React from 'react';
import {
  BookOpen,
  Heart,
  ShieldCheck,
  RefreshCw,
  GraduationCap,
  Sparkles,
  MapPin,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight text-white block">
                  THE BOOK EXCHANGE
                </span>
                <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                  Knowledge Should Never Be Expensive
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier all-in-one community hub for students, readers, educators, and authors.
              Buy verified second-hand books, exchange with peers without cash, access free syllabus notes,
              watch video lessons, and self-publish original manuscripts.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Student Escrow & Campus Handover Protected</span>
            </div>
          </div>

          {/* Navigation Column 1: Marketplace & Learning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Marketplace & Study
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('browse')} className="hover:text-amber-400 transition-colors">
                  Browse All Books
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('study')} className="hover:text-amber-400 transition-colors">
                  CBSE / NCERT Notes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('videos')} className="hover:text-amber-400 transition-colors">
                  Educational Videos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('exchange')} className="hover:text-amber-400 transition-colors">
                  Peer Book Barter
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('free')} className="hover:text-amber-400 transition-colors">
                  Free Donated Books
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Creative & Indie */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Fiction & Publishing
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('novels')} className="hover:text-amber-400 transition-colors">
                  Novels & Classics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('comics')} className="hover:text-amber-400 transition-colors">
                  Comics & Manga
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('publish')} className="hover:text-amber-400 transition-colors">
                  Publish Your Work
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('publications')} className="hover:text-amber-400 transition-colors">
                  Author Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('channel')} className="hover:text-amber-400 transition-colors">
                  Creator Channel
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Support & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-amber-400 transition-colors">
                  Our Mission & How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help')} className="hover:text-amber-400 transition-colors">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('feedback')} className="hover:text-amber-400 transition-colors">
                  Submit Feedback
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-amber-400 transition-colors">
                  Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('settings')} className="hover:text-amber-400 transition-colors">
                  Account Roles
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-editorial italic text-slate-300">
            "Buy Books. Exchange Knowledge. Learn Together. Publish Your Imagination."
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>© 2026 THE BOOK EXCHANGE</span>
            <span>•</span>
            <span className="text-amber-400">Open Knowledge Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
