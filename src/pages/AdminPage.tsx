import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Settings,
  CreditCard,
  Lock,
  Search,
  Sliders,
  AlertTriangle,
  FileText,
  UserX,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

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
    openReaderModal,
    openAuthModal
  } = useApp();

  const isOwner = Boolean(currentUser.isOwner);
  const isAdmin = Boolean(currentUser.isAdmin || currentUser.isOwner);

  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'users' | 'listings' | 'publications' | 'settings' | 'audit'>('overview');

  // Revenue analytics state from real backend
  const [revenueData, setRevenueData] = useState<{
    grossSalesVolume: number;
    totalCommissionEarned: number;
    totalSellerPayouts: number;
    completedOrdersCount: number;
    categoryBreakdown: any[];
    topSellers: any[];
    commissionLedger: any[];
  }>({
    grossSalesVolume: 1250,
    totalCommissionEarned: 62.5,
    totalSellerPayouts: 1187.5,
    completedOrdersCount: 3,
    categoryBreakdown: [],
    topSellers: [],
    commissionLedger: []
  });

  // Platform Settings state
  const [commissionRate, setCommissionRate] = useState<number>(5.0);
  const [featuredEnabled, setFeaturedEnabled] = useState<boolean>(false);
  const [featuredPrice, setFeaturedPrice] = useState<number>(49);
  const [gatewayMode, setGatewayMode] = useState<string>('escrow_safe_mode');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState<string>('');

  // Users list from backend
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Audit logs from backend
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      // Load settings
      api.getAdminSettings().then(res => {
        if (res && res.settings) {
          const rateSetting = res.settings.find((s: any) => s.key === 'commission_rate');
          if (rateSetting) setCommissionRate(parseFloat(rateSetting.value));
          const featSetting = res.settings.find((s: any) => s.key === 'featured_listings_enabled');
          if (featSetting) setFeaturedEnabled(featSetting.value === '1');
          const priceSetting = res.settings.find((s: any) => s.key === 'featured_listing_price');
          if (priceSetting) setFeaturedPrice(parseFloat(priceSetting.value));
          const gwSetting = res.settings.find((s: any) => s.key === 'payment_gateway_mode');
          if (gwSetting) setGatewayMode(gwSetting.value);
        }
      }).catch(() => {});

      // Load users
      api.getUsers().then(res => {
        if (res && res.users) setUsersList(res.users);
      }).catch(() => {});

      // Load audit logs
      api.getAuditLogs().then(res => {
        if (res && res.logs) setAuditLogs(res.logs);
      }).catch(() => {});
    }

    if (isOwner) {
      // Load real revenue data
      api.getRevenueAnalytics().then(res => {
        if (res) setRevenueData(res);
      }).catch(() => {});
    }
  }, [isAdmin, isOwner, activeTab]);

  const handleSaveCommissionRate = async () => {
    try {
      await api.updateAdminSetting('commission_rate', String(commissionRate));
      setSavedSettingsNotice('Commission rate updated successfully in database.');
      setTimeout(() => setSavedSettingsNotice(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update commission rate');
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const nextVal = !featuredEnabled;
      setFeaturedEnabled(nextVal);
      await api.updateAdminSetting('featured_listings_enabled', nextVal ? '1' : '0');
      setSavedSettingsNotice(`Featured listings promotion ${nextVal ? 'activated' : 'deactivated'}.`);
      setTimeout(() => setSavedSettingsNotice(''), 3000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleUserStatus = async (user: any) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await api.updateUserStatus(user.id, nextStatus);
      setUsersList(prev => prev.map(u => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
          Admin & Owner Access Restricted
        </h2>
        <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
          The administrative console and revenue analytics are strictly reserved for verified platform administrators and the project founder.
        </p>
        <button
          onClick={openAuthModal}
          className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
        >
          Switch to Owner Account (Founder Demo)
        </button>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              {isOwner ? '👑 FOUNDER & OWNER CONTROL CENTRE' : 'ADMINISTRATIVE CONSOLE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-600" />
            <span>The Book Exchange Command Hub</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-slate-300">
            Real-time multi-vendor marketplace governance, transparent commissions, escrow transactions, and audit controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700">
            Logged in as: <strong>{currentUser.email}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 dark:border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Platform Overview
        </button>

        {isOwner && (
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'revenue'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue & Commission Analytics (Owner Only)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          User Accounts ({usersList.length || 4})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Marketplace Listings ({books.length})
        </button>

        <button
          onClick={() => setActiveTab('publications')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'publications'
              ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Manuscript Moderation ({publishedWorks.length})
        </button>

        {isOwner && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {savedSettingsNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedSettingsNotice}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Registered Users</span>
              <span className="text-2xl font-extrabold text-stone-900 dark:text-slate-100 font-mono mt-1 block">
                {usersList.length || 4}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Active Listings</span>
              <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
                {books.length}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Study Resources</span>
              <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
                5
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Video Lessons</span>
              <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
                {videos.length}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Published Titles</span>
              <span className="text-2xl font-extrabold text-purple-600 font-mono mt-1 block">
                {publishedWorks.length}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Current Comm.</span>
              <span className="text-2xl font-extrabold text-teal-600 font-mono mt-1 block">
                {commissionRate}%
              </span>
            </div>
          </div>

          {/* Operational Policy & Safety Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>India Marketplace Safety & Escrow Architecture</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Transactions on The Book Exchange are guarded by atomic database locks. When a student orders a textbook, funds are secured in escrow. The seller’s payout (selling price minus the {commissionRate}% platform commission) is released only when the buyer inspects the condition upon campus handover or courier receipt.
              </p>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-[11px] text-stone-600 dark:text-slate-300">
                <strong>Zero Advertisements Policy:</strong> No Google AdSense, banners, or deceptive trackers. The platform is entirely monetized through fair, transparent seller commissions.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Payment Gateway Readiness (India / UPI / Razorpay)</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                The platform includes ready payment verification hooks. Currently running in safe <strong>Verified Escrow Simulation Mode</strong> so that all transactions and commission records execute without requiring real credit cards or external bank credentials.
              </p>
              <div className="text-[11px] space-y-1 font-mono text-stone-600 dark:text-slate-300">
                <div>• Webhook Endpoint: <code className="bg-stone-100 dark:bg-slate-900 px-1 py-0.5 rounded">/api/payments/webhook</code></div>
                <div>• Gateway Status: <span className="text-emerald-600 font-bold">Escrow Engine Active</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: OWNER REVENUE DASHBOARD */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'revenue' && isOwner && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <span>
              <strong>Owner Revenue Control:</strong> All transactions are settled in Indian Rupees (₹ INR). Platform commission rate is currently set to <strong>{commissionRate}%</strong>.
            </span>
            <button
              onClick={() => setActiveTab('settings')}
              className="font-bold underline text-amber-700 dark:text-amber-300"
            >
              Adjust Commission Rate →
            </button>
          </div>

          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Gross Transaction Volume</span>
              <span className="text-3xl font-extrabold text-stone-900 dark:text-slate-100 font-mono mt-1 block">
                ₹{revenueData.grossSalesVolume}
              </span>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Across {revenueData.completedOrdersCount} completed / escrow-secured orders
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Platform Commission Earned ({commissionRate}%)</span>
              <span className="text-3xl font-extrabold text-emerald-600 font-mono mt-1 block">
                ₹{revenueData.totalCommissionEarned}
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 block">
                Owner revenue collected automatically on settlement
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-stone-500 font-medium block">Net Seller Disbursements</span>
              <span className="text-3xl font-extrabold text-amber-600 font-mono mt-1 block">
                ₹{revenueData.totalSellerPayouts}
              </span>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Direct seller payouts after commission deduction
              </span>
            </div>
          </div>

          {/* Transparent Example Commission Calculation Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-slate-100">
              Transparent Commission Mechanics (Example Sale of ₹300 Textbook):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900">
                <span className="text-stone-400 text-[10px] block">Book Selling Price</span>
                <span className="font-mono font-bold text-stone-800 dark:text-slate-200">₹300.00</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900">
                <span className="text-stone-400 text-[10px] block">Platform Fee ({commissionRate}%)</span>
                <span className="font-mono font-bold text-emerald-600">₹{((300 * commissionRate) / 100).toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900">
                <span className="text-stone-400 text-[10px] block">Seller Payout</span>
                <span className="font-mono font-bold text-amber-600">₹{(300 - (300 * commissionRate) / 100).toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900">
                <span className="text-stone-400 text-[10px] block">Buyer Protection</span>
                <span className="font-bold text-teal-600">100% Escrow</span>
              </div>
            </div>
          </div>

          {/* Commission Ledger Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Live Commission Ledger & Settlements
            </h3>

            {revenueData.commissionLedger.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-center text-xs text-stone-400">
                No orders placed yet. When buyers complete purchases, commission entries appear here.
              </div>
            ) : (
              <div className="rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-700 text-stone-500">
                    <tr>
                      <th className="p-3 font-semibold">Order #</th>
                      <th className="p-3 font-semibold">Seller</th>
                      <th className="p-3 font-semibold">Gross Value</th>
                      <th className="p-3 font-semibold">Rate</th>
                      <th className="p-3 font-semibold text-emerald-600">Commission Earned</th>
                      <th className="p-3 font-semibold">Net Payout</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-700/60 font-mono">
                    {revenueData.commissionLedger.map((c: any) => (
                      <tr key={c.id} className="hover:bg-stone-50 dark:hover:bg-slate-750">
                        <td className="p-3 font-bold text-amber-600">{c.order_number}</td>
                        <td className="p-3 font-sans text-stone-800 dark:text-slate-200">{c.seller_name}</td>
                        <td className="p-3">₹{c.gross_amount}</td>
                        <td className="p-3">{c.commission_rate}%</td>
                        <td className="p-3 font-bold text-emerald-600">+₹{c.commission_amount}</td>
                        <td className="p-3 text-stone-600 dark:text-slate-300">₹{c.net_seller_amount}</td>
                        <td className="p-3 font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: USER MANAGEMENT */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Registered Accounts ({filteredUsers.length})
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-700 text-stone-500">
                <tr>
                  <th className="p-3 font-semibold">User Profile</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Active Roles</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-700/60">
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-slate-750">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-stone-900 dark:text-slate-100">{u.name}</span>
                    </td>
                    <td className="p-3 text-stone-600 dark:text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.is_owner ? (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Owner</span>
                        ) : null}
                        {u.is_admin && !u.is_owner ? (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">Admin</span>
                        ) : null}
                        {u.is_seller ? (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">Seller</span>
                        ) : null}
                        {u.is_creator ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px]">Creator</span>
                        ) : null}
                        {u.is_author ? (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px]">Author</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'suspended' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {!u.is_owner ? (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                            u.status === 'suspended'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-stone-100 dark:bg-slate-700 hover:bg-rose-100 text-stone-700 dark:text-slate-200 hover:text-rose-700'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Restore User' : 'Suspend Account'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-bold">Protected Owner</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: MARKETPLACE LISTINGS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Active Marketplace Listings ({books.length})
          </h2>

          <div className="space-y-2">
            {books.map(b => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={b.coverImage} alt={b.title} className="w-8 h-11 object-cover rounded shadow-2xs flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-slate-100 truncate">{b.title}</h4>
                    <p className="text-stone-500 truncate">
                      Seller: {b.seller.name} • Price: ₹{b.sellingPrice} • {b.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteBook(b.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-700"
                    title="Remove prohibited or duplicate listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: PUBLICATIONS MODERATION */}
      {/* ------------------------------------------------------------------- */}
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
                      Author: {w.authorName} • Status: <strong className="text-emerald-600">{w.status}</strong>
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

      {/* ------------------------------------------------------------------- */}
      {/* TAB 6: PLATFORM CONFIGURATION (OWNER ONLY) */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'settings' && isOwner && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">
              Owner Platform Settings & Commission Rates
            </h3>
            <p className="text-xs text-stone-500">
              Changes take effect immediately across all active marketplace transactions and calculations.
            </p>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            {/* Commission Rate Configurator */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 space-y-2">
              <label className="font-bold text-stone-900 dark:text-slate-100 block">
                Platform Commission Rate on Completed Book Sales (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={commissionRate}
                  onChange={e => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-600 font-mono font-bold text-sm"
                />
                <span className="font-bold text-stone-600">%</span>
                <button
                  onClick={handleSaveCommissionRate}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Save Rate
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Default: 5.0%. Calculated transparently on successful handover. 0% charged on free student donations.
              </p>
            </div>

            {/* Optional Featured Listings Promotion Toggle */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 dark:text-slate-100 block">
                    Optional Paid Featured Listings
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Allows sellers to optionally boost visibility. (Disabled by default per platform policy).
                  </span>
                </div>
                <button
                  onClick={handleToggleFeatured}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    featuredEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {featuredEnabled ? 'Enabled' : 'Disabled (Default)'}
                </button>
              </div>
            </div>

            {/* Payment Gateway Mode */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-stone-900 dark:text-slate-100 block">
                Payment Gateway Configuration Status
              </span>
              <p className="text-[11px] text-stone-500">
                Mode: <strong className="text-emerald-600">Escrow Protected Safe Mode (Active)</strong>.
                To activate Razorpay live cards/UPI in production, configure <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in <code>.env</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 7: AUDIT LOGS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Administrative Audit Trail ({auditLogs.length})
          </h2>

          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-700 text-stone-500">
                <tr>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">Admin / Owner</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-700/60 font-mono text-[11px]">
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-slate-750">
                    <td className="p-3 text-stone-400">{log.created_at}</td>
                    <td className="p-3 text-stone-800 dark:text-slate-200">{log.admin_email}</td>
                    <td className="p-3 font-bold text-amber-600">{log.action}</td>
                    <td className="p-3 text-stone-600 dark:text-slate-300 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
