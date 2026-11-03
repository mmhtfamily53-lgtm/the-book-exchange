/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Modals
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ExchangeProposalModal } from './components/ExchangeProposalModal';
import { ListingModal } from './components/ListingModal';
import { PublishingModal } from './components/PublishingModal';
import { UploadVideoModal } from './components/UploadVideoModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ReaderModal } from './components/ReaderModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowseBooksPage } from './pages/BrowseBooksPage';
import { StudyMaterialsPage } from './pages/StudyMaterialsPage';
import { VideosPage } from './pages/VideosPage';
import { NovelsComicsPage } from './pages/NovelsComicsPage';
import { BookExchangePage } from './pages/BookExchangePage';
import { PublishPage } from './pages/PublishPage';
import { FreeBooksPage } from './pages/FreeBooksPage';
import { MyLibraryPage } from './pages/MyLibraryPage';
import { MyUploadsPage } from './pages/MyUploadsPage';
import { MyChannelPage } from './pages/MyChannelPage';
import { MyPublicationsPage } from './pages/MyPublicationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminPage } from './pages/AdminPage';
import { AboutAndHelpPage } from './pages/AboutAndHelpPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'browse':
        return <BrowseBooksPage />;
      case 'study':
        return <StudyMaterialsPage />;
      case 'videos':
        return <VideosPage />;
      case 'novels':
        return <NovelsComicsPage initialTab="novels" />;
      case 'comics':
        return <NovelsComicsPage initialTab="comics" />;
      case 'exchange':
        return <BookExchangePage />;
      case 'publish':
        return <PublishPage />;
      case 'free':
        return <FreeBooksPage />;
      case 'library':
        return <MyLibraryPage />;
      case 'uploads':
        return <MyUploadsPage />;
      case 'channel':
        return <MyChannelPage />;
      case 'publications':
        return <MyPublicationsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutAndHelpPage initialMode="about" />;
      case 'help':
        return <AboutAndHelpPage initialMode="help" />;
      case 'settings':
        return <AboutAndHelpPage initialMode="settings" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-slate-950 text-stone-900 dark:text-slate-100 flex transition-colors">
      {/* Left Collapsible Persistent Sidebar */}
      <Sidebar />

      {/* Main Right Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Universal Header */}
        <Header />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {renderActivePage()}
        </main>

        {/* Universal Footer */}
        <Footer />
      </div>

      {/* Global Interactive Modals & Drawers */}
      <UniversalSearchModal />
      <BookDetailModal />
      <ExchangeProposalModal />
      <ListingModal />
      <PublishingModal />
      <UploadVideoModal />
      <VideoPlayerModal />
      <ReaderModal />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
