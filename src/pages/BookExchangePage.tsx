import React, { useState } from 'react';
import {
  RefreshCw,
  PlusCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';
import { ExchangeProposal } from '../types';

export const BookExchangePage: React.FC = () => {
  const {
    books,
    exchangeProposals,
    updateProposalStatus,
    currentUser,
    startChatWithSeller,
    openListBookModal,
    openExchangeModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available_swaps' | 'my_trades'>('available_swaps');
  const [counterText, setCounterText] = useState<{ [id: string]: string }>({});

  // Books available for exchange
  const exchangeableBooks = books.filter(b => b.forExchange && b.status === 'available');

  // Trade proposals related to user
  const incomingProposals = exchangeProposals.filter(
    p => p.targetOwnerId === currentUser.id
  );
  const outgoingProposals = exchangeProposals.filter(
    p => p.proposerId === currentUser.id
  );

  const handleAcceptProposal = (proposal: ExchangeProposal) => {
    updateProposalStatus(proposal.id, 'accepted');
    // Start chat to coordinate handover
    startChatWithSeller(
      {
        id: proposal.proposerId,
        name: proposal.proposerName,
        email: 'trade@bookexchange.org',
        avatar: proposal.proposerAvatar,
        rating: 5.0,
        reviewsCount: 1,
        location: proposal.deliveryMethod,
        memberSince: '2024'
      },
      `Awesome! I accepted your exchange proposal for "${proposal.targetBook.title}". Let's finalize the meeting spot: ${proposal.meetingPlace || proposal.deliveryMethod}.`
    );
  };

  const handleDeclineProposal = (proposal: ExchangeProposal) => {
    updateProposalStatus(proposal.id, 'declined');
  };

  const handleCounterProposal = (proposal: ExchangeProposal) => {
    const text = counterText[proposal.id] || 'Could you add Rs 50 cash adjustment or swap another textbook?';
    updateProposalStatus(proposal.id, 'countered', text);
    startChatWithSeller(
      {
        id: proposal.proposerId,
        name: proposal.proposerName,
        email: 'trade@bookexchange.org',
        avatar: proposal.proposerAvatar,
        rating: 5.0,
        reviewsCount: 1,
        location: proposal.deliveryMethod,
        memberSince: '2024'
      },
      `Counter offer for "${proposal.targetBook.title}": ${text}`
    );
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white border border-teal-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
            The Community Trade Desk
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-editorial">
            Book Exchange & Peer Barter
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            Trade books you’ve already read for the ones you need. Negotiate 1:1 swaps,
            balance value with cash adjustments, and schedule safe campus handovers.
          </p>
        </div>

        <button
          onClick={openListBookModal}
          className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>List Book for Exchange</span>
        </button>
      </div>

      {/* Tabs: Available Swaps vs Active Trade Requests */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('available_swaps')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'available_swaps'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Browse Available Swaps ({exchangeableBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_trades')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my_trades'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Trade Desk ({incomingProposals.length + outgoingProposals.length})</span>
          {incomingProposals.filter(p => p.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* View 1: Available Swaps */}
      {activeTab === 'available_swaps' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 text-xs text-teal-950 dark:text-teal-200 flex items-center justify-between">
            <span className="font-semibold">
              Tip: Click "Swap" on any book card to construct an exchange proposal with your own books + optional cash balancing.
            </span>
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono">
              Zero platform fees
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeableBooks.map(b => (
              <div key={b.id} className="relative">
                <BookCard book={b} />
                {b.exchangeWishlist && b.exchangeWishlist.length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-900/60 text-[11px] text-teal-900 dark:text-teal-200">
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Looking for in return:
                    </span>
                    <span className="truncate block font-medium">{b.exchangeWishlist.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Active Trade Desk (Proposals Management) */}
      {activeTab === 'my_trades' && (
        <div className="space-y-8">
          {/* Incoming Proposals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                <span>Incoming Trade Offers</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                  {incomingProposals.length}
                </span>
              </h2>
            </div>

            {incomingProposals.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-center text-stone-400 text-xs">
                No incoming trade proposals at this moment. When other members offer to swap for your books, they will appear here!
              </div>
            ) : (
              <div className="space-y-4">
                {incomingProposals.map(prop => (
                  <div
                    key={prop.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prop.proposerAvatar}
                          alt={prop.proposerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
                            {prop.proposerName}
                          </span>
                          <span className="text-[10px] text-stone-400">{prop.createdAt}</span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prop.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : prop.status === 'declined'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : prop.status === 'countered'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        Status: {prop.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Trade Two-Sided Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* What they want */}
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          They Want from You:
                        </span>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prop.targetBook.coverImage}
                            alt={prop.targetBook.title}
                            className="w-10 h-14 object-cover rounded shadow-2xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-stone-900 dark:text-slate-100 truncate">
                              {prop.targetBook.title}
                            </p>
                            <p className="text-stone-500">Valued at ₹{prop.targetBook.sellingPrice}</p>
                          </div>
                        </div>
                      </div>

                      {/* What they offer */}
                      <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 block mb-1">
                          They Offer in Return:
                        </span>
                        {prop.offeredBooks.map(b => (
                          <div key={b.id} className="flex items-center gap-2.5">
                            <img
                              src={b.coverImage}
                              alt={b.title}
                              className="w-10 h-14 object-cover rounded shadow-2xs"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-stone-900 dark:text-slate-100 truncate">
                                {b.title}
                              </p>
                              <p className="text-stone-500">Estimated value ₹{b.sellingPrice}</p>
                              {prop.cashAdjustment !== 0 && (
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                  {prop.cashAdjustment > 0
                                    ? `+ Proposer pays you ₹${prop.cashAdjustment} cash extra`
                                    : `Proposer asks for ₹${Math.abs(prop.cashAdjustment)} cash`}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message & Delivery */}
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900/40 text-xs space-y-1">
                      <p className="text-stone-700 dark:text-slate-300">
                        <strong className="text-stone-900 dark:text-slate-100">Note: </strong>
                        "{prop.message}"
                      </p>
                      <p className="text-stone-500 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        <span>Handover: {prop.deliveryMethod} {prop.meetingPlace ? `(${prop.meetingPlace})` : ''}</span>
                      </p>
                    </div>

                    {/* Actions if pending */}
                    {prop.status === 'pending' && (
                      <div className="pt-2 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => handleAcceptProposal(prop)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept Swap
                        </button>

                        <button
                          onClick={() => handleDeclineProposal(prop)}
                          className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-700 text-stone-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Decline
                        </button>

                        <button
                          onClick={() => handleCounterProposal(prop)}
                          className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-50"
                        >
                          Counter-Offer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Proposals */}
          <div className="space-y-4 pt-6 border-t border-stone-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
              <span>Outgoing Proposals Sent by You</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-slate-300 font-bold">
                {outgoingProposals.length}
              </span>
            </h2>

            {outgoingProposals.map(prop => (
              <div
                key={prop.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prop.targetBook.coverImage}
                    alt={prop.targetBook.title}
                    className="w-10 h-14 object-cover rounded shadow-2xs flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      You proposed swap for:
                    </span>
                    <h4 className="font-bold text-stone-900 dark:text-slate-100">{prop.targetBook.title}</h4>
                    <p className="text-stone-500">
                      Owner: {prop.targetBook.seller.name} • Handover: {prop.deliveryMethod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      prop.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prop.status === 'declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {prop.status.toUpperCase()}
                  </span>

                  <button
                    onClick={() =>
                      startChatWithSeller(prop.targetBook.seller, undefined, {
                        id: prop.targetBook.id,
                        title: prop.targetBook.title,
                        price: prop.targetBook.sellingPrice
                      })
                    }
                    className="p-2 rounded-xl bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 text-stone-700 dark:text-slate-200"
                    title="Chat with owner"
                  >
                    <MessageSquare className="w-4 h-4" />
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
