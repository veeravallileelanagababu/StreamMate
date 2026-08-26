import React, { useState, useRef } from 'react';
import { AppMode } from '../types';
import { Link2, Clipboard, ArrowRight, Sparkles, Loader2, X } from 'lucide-react';

interface HeroInputProps {
  mode?: AppMode;
  urlInput: string;
  setUrlInput: (val: string) => void;
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  urlInput,
  setUrlInput,
  onAnalyze,
  isLoading,
  onSelectSample,
}) => {
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setUrlInput(text.trim());
          setPasteFeedback('Pasted!');
          setTimeout(() => setPasteFeedback(null), 1800);
          return;
        }
      }
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
      setPasteFeedback('Press Ctrl+V');
      setTimeout(() => setPasteFeedback(null), 2500);
    } catch {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
      setPasteFeedback('Press Ctrl+V');
      setTimeout(() => setPasteFeedback(null), 2500);
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text');
    if (pastedData) {
      setUrlInput(pastedData.trim());
      setPasteFeedback('Pasted!');
      setTimeout(() => setPasteFeedback(null), 1800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(urlInput);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center pt-10 pb-8 px-4">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 font-['Inter',sans-serif]">
        Universal Video & Audio Downloader
      </h1>

      {/* Subtitle */}
      <p className="text-[#94a3b8] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-['Inter',sans-serif]">
        Paste any video or audio link (YouTube, Instagram, Twitter/X, TikTok, Facebook, etc.) to get all available <strong className="text-white">Video (8K, 4K, 1080p, 720p, WEBM)</strong> and <strong className="text-[#10b981]">Audio (320kbps MP3, FLAC, WAV, M4A)</strong> download options instantly.
      </p>

      {/* Input Bar Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
        <div className="relative flex items-center bg-[#131b2e] border border-[#2d3449] hover:border-[#464554] focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/20 rounded-xl p-1.5 transition-all shadow-xl shadow-black/40">
          {/* Link Icon */}
          <div className="pl-3.5 pr-2 text-[#908fa0] flex items-center pointer-events-none">
            <Link2 className="w-5 h-5" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            id="media-url-input"
            name="streammate-search-no-autofill"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPaste={handleInputPaste}
            placeholder="Paste video or audio link here (e.g., https://www.youtube.com/watch?v=...)"
            className="w-full bg-transparent text-white placeholder-[#64748b] text-sm sm:text-base focus:outline-none px-2 py-2.5 font-['Inter',sans-serif]"
          />

          {/* Clear button if input is non-empty */}
          {urlInput && (
            <button
              type="button"
              onClick={() => setUrlInput('')}
              className="p-1.5 mr-1 text-[#94a3b8] hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Action Buttons inside Input */}
          <div className="flex items-center gap-2 pr-1">
            {/* Paste Button */}
            <button
              id="paste-clipboard-btn"
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#334155] text-xs font-medium text-[#c7c4d7] hover:text-white transition-all cursor-pointer select-none"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {pasteFeedback || 'Paste'}
              </span>
            </button>

            {/* Analyze / Fetch Download Options Button */}
            <button
              id="analyze-url-btn"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#818cf8] hover:opacity-95 active:scale-98 text-white text-sm font-semibold shadow-lg shadow-[#6366f1]/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Options...</span>
                </>
              ) : (
                <>
                  <span>Fetch Downloads</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Test Samples Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#908fa0]">
        <span className="flex items-center gap-1 text-[#c0c1ff]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Try quick sample:</span>
        </span>
        <button
          type="button"
          onClick={() => onSelectSample('cyberpunk-4k')}
          className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1e293b] border border-[#2d3449] hover:border-[#6366f1] text-[#dae2fd] transition-all cursor-pointer"
        >
          🎬 Cyberpunk 4K Showcase
        </button>
        <button
          type="button"
          onClick={() => onSelectSample('lofi-beats')}
          className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1e293b] border border-[#2d3449] hover:border-[#6366f1] text-[#dae2fd] transition-all cursor-pointer"
        >
          🎵 Lofi Chillhop (320kbps)
        </button>
        <button
          type="button"
          onClick={() => onSelectSample('insta-travel')}
          className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1e293b] border border-[#2d3449] hover:border-[#6366f1] text-[#dae2fd] transition-all cursor-pointer"
        >
          📸 Instagram 4K Reel
        </button>
        <button
          type="button"
          onClick={() => onSelectSample('twitter-tech')}
          className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1e293b] border border-[#2d3449] hover:border-[#6366f1] text-[#dae2fd] transition-all cursor-pointer"
        >
          🐦 Twitter / X Video
        </button>
      </div>
    </div>
  );
};


