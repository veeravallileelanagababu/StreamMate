import React, { useState } from 'react';
import { MediaItem, MediaFormatOption, DownloadTask, AdvancedSettings } from './types';
import { SAMPLE_PRESETS, parseAndGenerateMedia } from './data/sampleMedia';
import { Header } from './components/Header';
import { HeroInput } from './components/HeroInput';
import { SupportedPlatforms } from './components/SupportedPlatforms';
import { QualitySettings } from './components/QualitySettings';
import { MediaResultView } from './components/MediaResultView';
import { DownloadModal } from './components/DownloadModal';
import { MediaPreviewModal } from './components/MediaPreviewModal';
import { Footer } from './components/Footer';

import { generatePlayableAudioBlob, generatePlayableVideoBlob } from './utils/mediaGenerator';
import { API_BASE_URL } from './config';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

  // Modals & Drawers
  const [activeTask, setActiveTask] = useState<DownloadTask | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  // Trigger Download or Audio Conversion
  const handleDownloadOption = (option: MediaFormatOption) => {
    if (!currentMedia) return;

    const newTask: DownloadTask = {
      id: `task-${Date.now()}`,
      mediaItem: currentMedia,
      formatOption: option,
      progress: 0,
      status: 'initializing',
      downloadSpeed: '38.4 MB/s',
      eta: '4s',
      timestamp: Date.now(),
    };

    setActiveTask(newTask);

    // Multi-stage download progress
    let currentProgress = 15;
    const interval = setInterval(() => {
      currentProgress += 35;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        const completedTask: DownloadTask = {
          ...newTask,
          progress: 100,
          status: 'completed',
          downloadSpeed: '0 MB/s',
          eta: '0s',
        };

        setActiveTask(completedTask);
      } else {
        const updatedTask: DownloadTask = {
          ...newTask,
          progress: currentProgress,
          status: currentProgress > 50 ? 'packaging' : 'fetching_stream',
          downloadSpeed: '52.1 MB/s',
          eta: '1s',
        };

        setActiveTask((prev) => (prev ? updatedTask : null));
      }
    }, 150);
  };

  // Trigger actual browser download of real original video/audio file natively in default browser
  const handleSaveToDisk = async (task: DownloadTask) => {
    const isAudio = task.formatOption.type === 'audio' || task.formatOption.isAudioExtraction;
    const typeStr = isAudio ? 'audio' : 'video';
    const formatStr = task.formatOption.format.toLowerCase();
    const qualityStr = encodeURIComponent(task.formatOption.quality);
    const titleStr = encodeURIComponent(task.mediaItem.title || '');

    // Normalize pasted URL for download API
    let mediaUrl = task.mediaItem.url ? task.mediaItem.url.trim() : '';
    if (mediaUrl && !mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
      mediaUrl = `https://${mediaUrl}`;
    }
    if (!mediaUrl) {
      mediaUrl = 'https://www.youtube.com/watch?v=cyberpunk4k';
    }

    const directDownloadUrl = `${API_BASE_URL}/api/download?url=${encodeURIComponent(mediaUrl)}&type=${typeStr}&quality=${qualityStr}&format=${formatStr}&title=${titleStr}`;

    // Trigger direct native browser download so default browser (Chrome, Edge, Firefox)
    // manages file downloading, displays progress bar in browser history & download manager
    try {
      const link = document.createElement('a');
      link.href = directDownloadUrl;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback if browser direct anchor fails
      const cleanTitle = (task.mediaItem.title || 'StreamMate_Media')
        .replace(/[\\/:*?"<>|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      let blob: Blob | null = null;
      if (isAudio) {
        blob = await generatePlayableAudioBlob(task.mediaItem.title);
      } else {
        blob = await generatePlayableVideoBlob(task.mediaItem.title);
      }
      const ext = isAudio ? 'wav' : blob.type.includes('webm') ? 'webm' : 'mp4';
      const fileName = `${cleanTitle}.${ext}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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

      {/* Modals and Overlays */}
      <DownloadModal
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onSaveToDisk={handleSaveToDisk}
      />



      <MediaPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        media={currentMedia}
      />


    </div>
  );
}

