import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  Bookmark,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReaderModal: React.FC = () => {
  const { selectedReader, closeReaderModal } = useApp();

  const [paperTheme, setPaperTheme] = useState<'cream' | 'sepia' | 'dark'>('cream');
  const [fontSize, setFontSize] = useState<number>(18);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  if (!selectedReader) return null;

  const { title, author, content, panels, category } = selectedReader;

  const themeStyles = {
    cream: 'bg-[#FDFBF7] text-[#2C241E] border-stone-200',
    sepia: 'bg-[#F4ECD8] text-[#433422] border-[#E2D4B7]',
    dark: 'bg-[#18181B] text-[#E4E4E7] border-zinc-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden my-4 max-h-[95vh] flex flex-col transition-colors ${themeStyles[paperTheme]}`}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3 border-b flex items-center justify-between gap-4 backdrop-blur-md bg-black/5">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold truncate font-editorial">{title}</h2>
            <p className="text-[11px] opacity-75 truncate">by {author}</p>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2">
            {/* Paper Theme Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-black/10 text-xs">
              <button
                onClick={() => setPaperTheme('cream')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                  paperTheme === 'cream' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'opacity-70'
                }`}
              >
                Paper
              </button>
              <button
                onClick={() => setPaperTheme('sepia')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                  paperTheme === 'sepia' ? 'bg-[#EBDDC1] text-amber-950 shadow-xs font-bold' : 'opacity-70'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => setPaperTheme('dark')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                  paperTheme === 'dark' ? 'bg-zinc-800 text-white shadow-xs font-bold' : 'opacity-70'
                }`}
              >
                Night
              </button>
            </div>

            {/* Font Sizer */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-black/10 text-xs">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="p-1 hover:opacity-100 opacity-70"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="font-mono text-[11px] px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="p-1 hover:opacity-100 opacity-70"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <button
              onClick={closeReaderModal}
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Canvas / Document View */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-10 max-w-3xl mx-auto w-full">
          {/* Comics / Manga Panel Viewer if available */}
          {panels && panels.length > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between text-xs opacity-75">
                <span className="font-bold uppercase tracking-wider">Comic Panel Preview</span>
                <span>
                  Panel {currentPanelIndex + 1} of {panels.length}
                </span>
              </div>
              <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-black/20">
                <img
                  src={panels[currentPanelIndex]}
                  alt="Comic Panel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  disabled={currentPanelIndex === 0}
                  onClick={() => setCurrentPanelIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-1.5 rounded-xl bg-black/10 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  disabled={currentPanelIndex === panels.length - 1}
                  onClick={() => setCurrentPanelIndex(prev => Math.min(panels.length - 1, prev + 1))}
                  className="px-4 py-1.5 rounded-xl bg-black/10 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Book / Novel / Manuscript Text */}
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="font-serif leading-relaxed whitespace-pre-line tracking-wide select-text space-y-6"
          >
            {content}
          </div>

          {/* Reader Finished End Badge */}
          <div className="mt-16 pt-8 border-t border-black/10 text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest opacity-60">
              End of Chapter Sample
            </span>
            <p className="text-sm font-editorial italic opacity-90">
              Enjoyed this chapter? Support the author on The Book Exchange through reviews and physical orders!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
