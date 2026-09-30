import React, { useState } from 'react';
import { MediaItem, MediaFormatOption, DownloadTask, AdvancedSettings } from './types';
import { SAMPLE_PRESETS, parseAndGenerateMedia } from './data/sampleMedia';
import { Header } from './components/Header';
import { HeroInput } from './components/HeroInput';
import { SupportedPlatforms } from './components/SupportedPlatforms';
import { QualitySettings } from './components/QualitySettings';
import { MediaResultView } from './components/MediaResultView';
import { MediaPreviewModal } from './components/MediaPreviewModal';
import { Footer } from './components/Footer';
import { Download, CheckCircle2 } from 'lucide-react';

import { generatePlayableAudioBlob, generatePlayableVideoBlob } from './utils/mediaGenerator';
import { API_BASE_URL } from './config';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

  // Modals & Notifications
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<{ title: string; quality: string; format: string } | null>(null);

  // Analyze URL or Preset
  const handleAnalyze = async (inputUrl: string) => {
    setIsLoading(true);
    let targetUrl = inputUrl.trim() || 'https://www.youtube.com/watch?v=cyberpunk4k';
    if (targetUrl && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    
    // Parse baseline media structure with all video & audio options
    let media = parseAndGenerateMedia(targetUrl, 'all');

    // 1. Try fetching backend live metadata via yt-dlp
    try {
      if (targetUrl.startsWith('http')) {
        const backendRes = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
        });
        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.success && backendData.title) {
            media = {
              ...media,
              url: backendData.url || targetUrl,
              title: backendData.title,
              channelOrAuthor: backendData.channelOrAuthor || media.channelOrAuthor,
              thumbnailUrl: backendData.thumbnailUrl || media.thumbnailUrl,
              duration: backendData.duration || media.duration,
              durationSeconds: backendData.durationSeconds || media.durationSeconds,
              platformName: backendData.platformName || media.platformName,
              views: backendData.views || media.views,
              formats: backendData.formats && backendData.formats.length > 0 ? backendData.formats : media.formats,
            };
          }
        } else {
          // 2. Fallback to noembed
          const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`;
          const res = await fetch(noembedUrl);
          if (res.ok) {
            const data = await res.json();
            if (data && data.title) {
              media = {
                ...media,
                url: targetUrl,
                title: data.title,
                channelOrAuthor: data.author_name || media.channelOrAuthor,
                thumbnailUrl: data.thumbnail_url || media.thumbnailUrl,
              };
            }
          }
        }
      }
    } catch {
      // Graceful fallback to client-side parsed metadata
    }

    setTimeout(() => {
      setCurrentMedia(media);
      setIsLoading(false);
    }, 400);
  };

  // Quick sample selection
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === sampleId) || SAMPLE_PRESETS[0];
    setUrlInput(found.url);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentMedia(found);
      setIsLoading(false);
    }, 400);
  };

  // Trigger Direct Native Browser Download (appears in browser download history Ctrl+J)
  // Show toast notification when download link is clicked
  const handleDownloadOption = (option: MediaFormatOption) => {
    if (!currentMedia) return;

    // Show non-intrusive toast feedback confirming the browser download
    setDownloadToast({
      title: currentMedia.title || 'Media File',
      quality: option.quality,
      format: option.format,
    });

    // Auto-dismiss toast notification after 6 seconds
    setTimeout(() => {
      setDownloadToast(null);
    }, 6000);
  };

  const handleResetToHome = () => {
    setCurrentMedia(null);
    setUrlInput('');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-['Inter',sans-serif] selection:bg-[#6366f1]/30 selection:text-white">
      {/* Top Header */}
      <Header
        onResetToHome={handleResetToHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {currentMedia ? (
          /* Results View with All Video & Audio Download Options */
          <MediaResultView
            media={currentMedia}
            onDownloadOption={handleDownloadOption}
            onReset={handleResetToHome}
            onPreviewMedia={() => setIsPreviewOpen(true)}
          />
        ) : (
          /* Converter Home Screen */
          <div className="flex-1 flex flex-col items-center">
            {/* Hero Section */}
            <HeroInput
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onSelectSample={handleSelectSample}
            />

            {/* Supported Platforms */}
            <SupportedPlatforms onSelectPlatformSample={handleSelectSample} />

            {/* Quality Settings Features */}
            <QualitySettings />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Non-intrusive Browser Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#131b2e]/95 backdrop-blur-md border border-[#10b981]/40 text-white px-4 py-3 rounded-xl shadow-2xl shadow-black/60 transition-all duration-300">
          <div className="w-9 h-9 rounded-lg bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] flex-shrink-0">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div className="pr-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-xs font-bold text-[#4edea3] uppercase tracking-wider">Download Sent to Browser</span>
            </div>
            <p className="text-xs text-white font-medium max-w-[280px] truncate mt-0.5">
              {downloadToast.title}
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5 font-['JetBrains_Mono',monospace]">
              {downloadToast.format} • {downloadToast.quality} — Check browser downloads (Ctrl+J)
            </p>
          </div>
          <button
            onClick={() => setDownloadToast(null)}
            className="text-[#94a3b8] hover:text-white text-xs px-2 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}



      <MediaPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        media={currentMedia}
      />


    </div>
  );
}

