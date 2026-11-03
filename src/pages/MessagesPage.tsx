import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  BookOpen,
  MapPin,
  CheckCheck,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    activeChatId,
    setActiveChatId,
    sendMessage,
    currentUser,
    openBookDetailModal,
    books
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const currentChat =
    conversations.find(c => c.id === activeChatId) || conversations[0];

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentChat) return;
    sendMessage(currentChat.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
          Campus Direct Chat
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-slate-100">
          Messages & Trader Discussions
        </h1>
        <p className="text-xs text-stone-600 dark:text-slate-300">
          Safely chat with sellers, buyers, and authors to coordinate book condition inspections and campus handovers.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col md:flex-row h-[620px]">
        {/* Left: Chat List */}
        <div className="w-full md:w-80 border-r border-stone-200 dark:border-slate-700 flex flex-col">
          <div className="p-3.5 border-b border-stone-100 dark:border-slate-700">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-slate-700/60">
            {filteredConversations.map(chat => {
              const isSelected = currentChat?.id === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/30'
                      : 'hover:bg-stone-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <img
                    src={chat.participantAvatar}
                    alt={chat.participantName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                        {chat.participantName}
                      </h4>
                      <span className="text-[10px] text-stone-400">{chat.lastTimestamp}</span>
                    </div>
                    {chat.contextBookTitle && (
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold truncate block mt-0.5">
                        Re: {chat.contextBookTitle}
                      </span>
                    )}
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {currentChat ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-slate-700 flex items-center justify-between bg-stone-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <img
                  src={currentChat.participantAvatar}
                  alt={currentChat.participantName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-stone-900 dark:text-slate-100">
                    {currentChat.participantName}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {currentChat.participantRole}
                  </span>
                </div>
              </div>

              {currentChat.contextBookTitle && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[180px]">{currentChat.contextBookTitle}</span>
                </div>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentChat.messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-amber-600 text-white rounded-br-xs'
                          : 'bg-stone-100 dark:bg-slate-700 text-stone-900 dark:text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.bookReference && (
                        <div className="p-2 mb-2 rounded-xl bg-black/10 text-[11px] font-semibold flex items-center justify-between gap-2">
                          <span className="truncate">Listing: {msg.bookReference.title}</span>
                          <span className="font-mono">₹{msg.bookReference.price}</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-stone-200 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Message ${currentChat.participantName}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-stone-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
