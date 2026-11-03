import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  CheckCircle,
  Truck,
  MapPin,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cartItems,
    removeFromCart,
    updateCartShipping,
    checkoutCart,
    currentUser,
    setCurrentPage
  } = useApp();

  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.location || 'North Campus, Delhi University');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ orderId: string; total: number } | null>(null);

  if (!isCartDrawerOpen) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.book.sellingPrice, 0);
  const shippingTotal = cartItems.reduce((acc, curr) => acc + curr.shippingCost, 0);
  const grandTotal = subtotal + shippingTotal;

  const handleExecuteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      const res = checkoutCart();
      setIsCheckingOut(false);
      setCompletedOrder({ orderId: res.orderId, total: grandTotal });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-stone-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-slate-100 font-editorial">
              Your Book Cart ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={() => {
              setCompletedOrder(null);
              closeCartDrawer();
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        {completedOrder ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold font-editorial text-stone-900 dark:text-slate-100">
              Order Confirmed & Escrow Secured!
            </h3>
            <p className="text-xs text-stone-600 dark:text-slate-300">
              Order ID: <strong className="font-mono text-emerald-600">{completedOrder.orderId}</strong>
            </p>
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-left w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Paid:</span>
                <span className="font-bold text-stone-900 dark:text-slate-100 font-mono">₹{completedOrder.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Delivery To:</span>
                <span className="font-semibold text-stone-800 dark:text-slate-200 truncate">{deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Protection:</span>
                <span className="text-emerald-600 font-semibold">100% Escrow Guarantee</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400">
              Funds are held safely in escrow until you inspect the book condition at campus handover or delivery!
            </p>
            <button
              onClick={() => {
                setCompletedOrder(null);
                closeCartDrawer();
                setCurrentPage('library');
              }}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
            >
              View in My Library
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center text-stone-400">
            <ShoppingCart className="w-12 h-12 stroke-1 mb-3 opacity-60" />
            <p className="font-semibold text-stone-700 dark:text-slate-300 text-sm">Your cart is empty</p>
            <p className="text-xs mt-1">Browse second-hand books, study notes, or novels to add.</p>
            <button
              onClick={() => {
                closeCartDrawer();
                setCurrentPage('browse');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <form onSubmit={handleExecuteCheckout} className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
            {/* Items list */}
            <div className="space-y-3">
              {cartItems.map(item => (
                <div
                  key={item.book.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 flex gap-3"
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-2xs flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                      by {item.book.author}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {item.book.isFreeDonation ? 'FREE' : `₹${item.book.sellingPrice}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.book.id)}
                        className="text-stone-400 hover:text-rose-500"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Shipping selector */}
                    <div className="mt-2 pt-2 border-t border-stone-200 dark:border-slate-700/60">
                      <select
                        value={item.shippingOption}
                        onChange={e => updateCartShipping(item.book.id, e.target.value as any)}
                        className="w-full text-[10px] py-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300"
                      >
                        <option value="Free Campus Pickup">Free Campus Handover (₹0)</option>
                        <option value="Standard Delivery ($2.50)">Standard Courier (₹60)</option>
                        <option value="Express Courier ($4.99)">Same-Day Express (₹120)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Address */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <span className="font-bold text-stone-700 dark:text-slate-300 block">
                  Delivery / Handover Spot:
                </span>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Campus gate, hostel room, or home address"
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contact phone number"
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              {/* Escrow badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero Risk: Payment is released only after you verify the book.</span>
              </div>
            </div>

            {/* Bottom Checkout Section */}
            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Books Subtotal:</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping / Handover:</span>
                  <span className="font-mono">₹{shippingTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-slate-100 pt-1 border-t border-stone-100 dark:border-slate-800">
                  <span>Total Due:</span>
                  <span className="font-mono text-base text-amber-600 dark:text-amber-400">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Securing Order Escrow...</span>
                ) : (
                  <>
                    <span>Confirm Order & Escrow Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
