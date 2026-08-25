import React from 'react';
import { History, Sparkles, Video, Music } from 'lucide-react';

interface HeaderProps {
  onOpenHistory?: () => void;
  historyCount?: number;
  onResetToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount = 0,
  onResetToHome,
}) => {
  return (
    <header className="w-full border-b border-[#222a3d] bg-[#0b1326]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] via-[#7c3aed] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/25 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-black text-xl tracking-tighter">S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-['Inter',sans-serif]">
                StreamMate
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/15 border border-[#6366f1]/30 text-[10px] font-bold text-[#c0c1ff] uppercase tracking-wider hidden sm:inline-block">
                All-in-One Downloader
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights in Header */}
        <div className="hidden md:flex items-center gap-6 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-1.5 text-[#c7c4d7]">
            <Video className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>8K / 4K / 1080p Video</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c7c4d7]">
            <Music className="w-3.5 h-3.5 text-[#10b981]" />
            <span>320kbps MP3 & Lossless Audio</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {onOpenHistory && (
            <button
              id="header-history-btn"
              onClick={onOpenHistory}
              title="Recent Downloads & Activity"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#334155] text-xs font-medium text-[#c7c4d7] hover:text-white transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-[#6366f1]" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#6366f1] text-white text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

