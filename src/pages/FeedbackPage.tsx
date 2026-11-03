import React, { useState } from 'react';
import {
  MessageCircle,
  Star,
  Send,
  CheckCircle,
  Sparkles,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeedbackPage: React.FC = () => {
  const { feedbacks, submitFeedback, currentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [category, setCategory] = useState<'General' | 'Suggestion' | 'Complaint' | 'Bug Report' | 'Idea'>('Suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitFeedback({
      name: name.trim() || 'Community Member',
      email: email.trim() || 'user@bookexchange.org',
      category,
      rating,
      message: message.trim()
    });

    setSubmitted(true);
    setMessage('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
          Community Voice & Quality Assurance
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
          Feedback & Reviews
        </h1>
        <p className="text-xs text-stone-600 dark:text-slate-300">
          Help us improve The Book Exchange. Share feature suggestions, report broken links, or leave reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            <span>Submit Community Feedback</span>
          </h2>

          {submitted && (
            <div className="p-4 mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your feedback has been received and logged for the team to review.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-slate-300 block mb-1">Feedback Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700"
                >
                  <option value="Suggestion">Suggestion / Improvement</option>
                  <option value="Idea">New Feature Idea</option>
                  <option value="General">General Compliment / Review</option>
                  <option value="Bug Report">Bug / Issue Report</option>
                  <option value="Complaint">Listing / User Complaint</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-slate-300 block mb-1">Overall Experience Rating</label>
                <div className="flex items-center gap-1 py-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-slate-300 block mb-1">
                Your Feedback or Suggestions *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your thoughts on book exchanges, video players, textbook requests, or interface improvements..."
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        </div>

        {/* Recent Community Feedback Feed */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Recent Community Reviews ({feedbacks.length})
          </h2>

          <div className="space-y-3">
            {feedbacks.map(fb => (
              <div
                key={fb.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-slate-100">{fb.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300">
                      {fb.category}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-stone-600 dark:text-slate-300 leading-relaxed">
                  "{fb.message}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-slate-700">
                  <span>{fb.submittedAt}</span>
                  <span className="text-emerald-600 font-semibold">{fb.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
