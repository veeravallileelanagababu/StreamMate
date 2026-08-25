import React, { useState, useRef } from 'react';
import { MediaItem } from '../types';
import { X, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize } from 'lucide-react';

interface MediaPreviewModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  media,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !media) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(18);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0b1326] border border-[#2d3449] rounded-2xl overflow-hidden shadow-2xl shadow-black/90">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#131b2e] border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-['JetBrains_Mono',monospace]">
              Master Stream Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-white p-1 rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          <img
            src={media.thumbnailUrl}
            alt={media.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Animated pulse scanline */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Center Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-[#6366f1] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          {/* Video bottom controls bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Timeline seek bar */}
            <div
              className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full overflow-hidden mb-3 cursor-pointer transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, newPct)));
              }}
            >
              <div
                className="h-full bg-[#6366f1] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-[#c0c1ff] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-[#c0c1ff] cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#c7c4d7]">
                  02:18 / {media.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold font-['JetBrains_Mono',monospace]">
                  4K 60FPS HDR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Meta in Preview */}
        <div className="p-4 bg-[#131b2e] border-t border-[#222a3d] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white truncate max-w-lg font-['Inter',sans-serif]">
              {media.title}
            </h4>
            <p className="text-xs text-[#908fa0] mt-0.5 font-['JetBrains_Mono',monospace]">
              {media.channelOrAuthor} • {media.views} views
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#334155] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
