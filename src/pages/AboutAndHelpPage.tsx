import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  ShieldCheck,
  RefreshCw,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Settings,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutAndHelpPage: React.FC<{ initialMode?: 'about' | 'help' | 'settings' }> = ({
  initialMode = 'about'
}) => {
  const { currentUser, toggleUserRole, openAuthModal } = useApp();

  const [activeMode, setActiveMode] = useState<'about' | 'help' | 'settings'>(initialMode);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Book Exchange (barter/trade) work without money?',
      a: 'Any member can list their read books with an exchange wishlist. You can propose a 1:1 book swap or balance any price disparity with a modest cash adjustment (e.g. your book + ₹100 cash for their hardcover). Both users agree on a safe campus or public meetup point.'
    },
    {
      q: 'Is buying second-hand books safe from scams on campus?',
      a: 'Yes! Every purchase on The Book Exchange is covered by our 100% Escrow Protection. The seller does not receive payment until the buyer inspects the book condition during handover or delivery.'
    },
    {
      q: 'How can independent authors and comic artists publish?',
      a: 'Click "Publish Your Work". You can submit original novels, manga panels, textbooks, or poetry. We automatically provision your Author Profile and provide readers a distraction-free digital reader.'
    },
    {
      q: 'Can I have both a Buyer and Seller account under one login?',
      a: 'Absolutely! Unlike other platforms, you do not need two accounts. One account holds your buyer wishlist, seller listings, creator channel, and author studio simultaneously.'
    },
    {
      q: 'Who can claim books in the Free Books (Donation) section?',
      a: 'Any student facing financial constraints can claim donated textbooks and study guides completely free of charge. Only nominal postal postage applies if shipping is required.'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white border border-amber-900/40 shadow-xl space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
          Our Foundation & Community Pledge
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial">
          Knowledge Should Never Be Expensive.
        </h1>
        <p className="text-sm sm:text-base text-stone-200/90 max-w-2xl font-editorial italic leading-relaxed">
          "Where Every Book Finds a Reader and Every Mind Finds Knowledge."
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveMode('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'about'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          About The Platform
        </button>

        <button
          onClick={() => setActiveMode('help')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'help'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Help & FAQs
        </button>

        <button
          onClick={() => setActiveMode('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'settings'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Account Roles & Settings
        </button>
      </div>

      {/* Tab: About */}
      {activeMode === 'about' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-4">
            <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              The Book Exchange Mission
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
              Every academic semester, millions of students spend excessive portions of their budgets
              purchasing brand new textbooks that sit forgotten after exam week. Meanwhile, other students
              struggle to access vital revision notes and guides.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
              <strong>The Book Exchange</strong> bridges this gap by creating an open circular economy:
              curriculum materials are continuously passed forward from senior to junior, fiction lovers
              trade novels without spending money, educators share visual video explanations freely, and
              original authors publish directly without predatory gatekeepers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Campus Powered</h3>
              <p className="text-xs text-stone-600 dark:text-slate-300">
                Covers CBSE, ICSE, NCERT, state boards, engineering, medical, law, and college curricula.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
              <RefreshCw className="w-8 h-8 text-teal-600" />
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Zero Waste Barter</h3>
              <p className="text-xs text-stone-600 dark:text-slate-300">
                Extends the lifecycle of physical books by 5x to 10x, saving thousands of trees and landfills.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Escrow Protected</h3>
              <p className="text-xs text-stone-600 dark:text-slate-300">
                Safe campus handovers, tracked couriers, and zero financial risk for both buyer and seller.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Help & FAQs */}
      {activeMode === 'help' && (
        <div className="space-y-6">
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 hover:text-amber-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-600 dark:text-slate-300 leading-relaxed border-t border-stone-100 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Box */}
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-stone-700 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-stone-900 dark:text-slate-100 text-sm block">
                Need direct help or have a campus partnership inquiry?
              </span>
              <p className="text-stone-500 mt-0.5">
                Reach our community support leads at <strong className="font-mono text-amber-700 dark:text-amber-400">support@thebookexchange.org</strong>
              </p>
            </div>
            <button
              onClick={() => alert('Support team alert sent! A campus volunteer will email you back within 2 hours.')}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Open Support Ticket
            </button>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeMode === 'settings' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-slate-100">
                Multi-Role Profile Configuration
              </h2>
              <p className="text-xs text-stone-500">
                Toggle your account privileges. Multiple roles are supported under your single account.
              </p>
            </div>
            <button
              onClick={openAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Quick Switch User
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 dark:text-slate-100 block">Buyer Privileges</span>
                <span className="text-stone-500">Add books to cart, propose exchanges, save wishlist</span>
              </div>
              <span className="font-bold text-emerald-600">Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 dark:text-slate-100 block">Seller Functionality</span>
                <span className="text-stone-500">List second-hand books, set prices, accept offers</span>
              </div>
              <button
                onClick={() => toggleUserRole('isSeller')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  currentUser.isSeller ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {currentUser.isSeller ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 dark:text-slate-100 block">Creator Channel (Video)</span>
                <span className="text-stone-500">Upload lessons, track student subscribers & views</span>
              </div>
              <button
                onClick={() => toggleUserRole('isCreator')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  currentUser.isCreator ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {currentUser.isCreator ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 dark:text-slate-100 block">Author & Indie Publishing Studio</span>
                <span className="text-stone-500">Write manuscripts, release serialized novels, comics</span>
              </div>
              <button
                onClick={() => toggleUserRole('isAuthor')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  currentUser.isAuthor ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {currentUser.isAuthor ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
