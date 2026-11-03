import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Plus,
  Check,
  MapPin,
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, ExchangeProposal } from '../types';

export const ExchangeProposalModal: React.FC = () => {
  const {
    isExchangeModalOpen,
    targetBookForExchange,
    closeExchangeModal,
    books,
    currentUser,
    createExchangeProposal,
    setCurrentPage
  } = useApp();

  // User's own books available to offer in trade
  const myAvailableBooks = books.filter(
    b => b.seller.id === currentUser.id && b.status === 'available'
  );

  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [cashDifference, setCashDifference] = useState<number>(0);
  const [cashDirection, setCashDirection] = useState<'pay_extra' | 'even_swap' | 'request_cash'>('pay_extra');
  const [deliveryMethod, setDeliveryMethod] = useState<ExchangeProposal['deliveryMethod']>('Campus Handover');
  const [meetingPlace, setMeetingPlace] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');
  const [customBookTitle, setCustomBookTitle] = useState('');

  if (!isExchangeModalOpen || !targetBookForExchange) return null;

  const targetBook = targetBookForExchange;

  const toggleSelectMyBook = (bookId: string) => {
    setSelectedBookIds(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();

    let offeredBooks = myAvailableBooks.filter(b => selectedBookIds.includes(b.id));

    // If user has no listed books yet, create a quick proxy book object from their typed title
    if (offeredBooks.length === 0 && customBookTitle.trim()) {
      const proxyBook: Book = {
        id: `bk_proxy_${Date.now()}`,
        title: customBookTitle.trim(),
        author: 'Offered by you',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        mainCategory: 'general',
        subcategory: 'Exchange Offer',
        description: 'Offered in direct trade proposal',
        originalPrice: targetBook.sellingPrice,
        sellingPrice: targetBook.sellingPrice,
        condition: 'Very Good',
        seller: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          rating: 5.0,
          reviewsCount: 1,
          location: currentUser.location,
          memberSince: '2024'
        },
        location: currentUser.location,
        forSale: false,
        forExchange: true,
        isFreeDonation: false,
        language: 'English',
        tags: ['Trade Offer'],
        createdAt: 'Just now',
        status: 'available'
      };
      offeredBooks = [proxyBook];
    }

    if (offeredBooks.length === 0) {
      alert('Please select at least one book from your shelf or enter the title of the book you want to swap.');
      return;
    }

    const netCashAdjustment =
      cashDirection === 'pay_extra'
        ? Math.abs(cashDifference)
        : cashDirection === 'request_cash'
        ? -Math.abs(cashDifference)
        : 0;

    createExchangeProposal(
      targetBook,
      offeredBooks,
      netCashAdjustment,
      tradeMessage || `Hi ${targetBook.seller.name}! I would love to exchange for your copy of "${targetBook.title}". Let me know if my offer works for you!`,
      deliveryMethod,
      meetingPlace || (deliveryMethod === 'Campus Handover' ? 'Campus Library Quad' : 'Local Hub')
    );

    closeExchangeModal();
    setCurrentPage('exchange');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-teal-50/60 dark:bg-teal-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-slate-100">
                The Trade Desk: Propose Book Exchange
              </h2>
              <p className="text-[11px] text-teal-800 dark:text-teal-300">
                Swap knowledge without spending a fortune.
              </p>
            </div>
          </div>
          <button
            onClick={closeExchangeModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitProposal} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Book Summary */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/80 flex items-center gap-3">
            <img
              src={targetBook.coverImage}
              alt={targetBook.title}
              className="w-12 h-16 object-cover rounded-lg shadow-xs flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Book You Want to Receive
              </span>
              <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100 truncate">
                {targetBook.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-slate-400 truncate">
                Owned by <span className="font-semibold text-stone-700 dark:text-slate-300">{targetBook.seller.name}</span> • Valued at ₹{targetBook.sellingPrice}
              </p>
            </div>
          </div>

          {/* Seller Wishlist reminder */}
          {targetBook.exchangeWishlist && targetBook.exchangeWishlist.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-1">Seller is looking for:</span>
              <p>{targetBook.exchangeWishlist.join(', ')}</p>
            </div>
          )}

          {/* Step 1: Select Your Book to Offer */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 block mb-2">
              1. What book(s) will you offer in exchange?
            </label>

            {myAvailableBooks.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {myAvailableBooks.map(b => {
                  const isSelected = selectedBookIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleSelectMyBook(b.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 shadow-xs'
                          : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-teal-600 text-white' : 'border border-stone-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-8 h-11 object-cover rounded shadow-2xs flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400">
                          {b.condition} • Estimated ₹{b.sellingPrice}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Quick manual offer input if shelf is empty or want to offer unlisted book */}
            <div className="mt-2.5">
              <span className="text-[11px] text-stone-500 dark:text-slate-400 block mb-1">
                Or enter book title you own and wish to trade:
              </span>
              <input
                type="text"
                value={customBookTitle}
                onChange={e => setCustomBookTitle(e.target.value)}
                placeholder="e.g. Halliday & Resnick Fundamentals of Physics (9th Ed)"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Step 2: Cash Difference Balancing */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 block mb-2">
              2. Cash Adjustment (To balance value difference)
            </label>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'pay_extra', label: 'I will pay extra cash (+)' },
                { id: 'even_swap', label: 'Direct 1:1 Even Swap' },
                { id: 'request_cash', label: 'I request cash difference (-)' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setCashDirection(opt.id as any);
                    if (opt.id === 'even_swap') setCashDifference(0);
                  }}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    cashDirection === opt.id
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                      : 'border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {cashDirection !== 'even_swap' && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700 dark:text-slate-300">
                  {cashDirection === 'pay_extra' ? 'Extra cash amount:' : 'Requested cash amount:'}
                </span>
                <div className="relative w-36">
                  <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={cashDifference || ''}
                    onChange={e => setCashDifference(Number(e.target.value))}
                    placeholder="100"
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-bold font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Delivery / Handover Preference */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 block mb-2">
              3. Handover & Delivery Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'Campus Handover', label: 'Campus Handover (Zero cost)' },
                { id: 'Local Public Spot', label: 'Local Cafe / Metro' },
                { id: 'Postal Courier', label: 'Postal Courier (Speed Post)' }
              ].map(d => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDeliveryMethod(d.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    deliveryMethod === d.id
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                      : 'border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                value={meetingPlace}
                onChange={e => setMeetingPlace(e.target.value)}
                placeholder="Suggested spot: e.g. Central Library Gate or Connaught Place Metro Station"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Step 4: Personal Message to Seller */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 block mb-1">
              4. Pitch or Message to Seller
            </label>
            <textarea
              rows={3}
              value={tradeMessage}
              onChange={e => setTradeMessage(e.target.value)}
              placeholder="Hi! I have this book in like-new condition with solved exam papers included. Let's exchange this week!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Exchange Proposal to {targetBook.seller.name}
            </button>
            <p className="text-[11px] text-center text-stone-500 dark:text-slate-400 mt-2">
              The owner will be alerted immediately. You can track and renegotiate in your Active Trades Desk.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
