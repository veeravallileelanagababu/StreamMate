import React, { useState } from 'react';
import { MediaItem, MediaFormatOption } from '../types';
import { 
  Download, 
  Settings, 
  Play, 
  Eye, 
  User, 
  Music, 
  ArrowLeft, 
  Share2, 
  Check, 
  Clock,
  Video,
  Layers,
  Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface MediaResultViewProps {
  media: MediaItem;
  onDownloadOption: (option: MediaFormatOption) => void;
  onOpenAdvanced: () => void;
  onReset: () => void;
  onPreviewMedia: () => void;
}

export const MediaResultView: React.FC<MediaResultViewProps> = ({
  media,
  onDownloadOption,
  onOpenAdvanced,
  onReset,
  onPreviewMedia,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio'>('all');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const videoOptions = media.formats.filter((f) => f.type === 'video');
  const audioOptions = media.formats.filter((f) => f.type === 'audio' || f.isAudioExtraction);

  const displayedFormats = media.formats.filter((option) => {
    if (filterType === 'video') return option.type === 'video';
    if (filterType === 'audio') return option.type === 'audio' || option.isAudioExtraction;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top back / action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="back-to-search-btn"
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Convert another URL</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="share-link-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-medium text-[#c7c4d7] hover:text-white transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#10b981]">URL Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Card */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-[#222a3d] rounded-2xl overflow-hidden shadow-2xl sticky top-20">
          {/* Thumbnail with overlay duration */}
          <div className="relative aspect-video w-full bg-black/40 overflow-hidden group">
            <img
              src={media.thumbnailUrl}
              alt={media.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Duration badge bottom right */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-white text-xs font-semibold font-['JetBrains_Mono',monospace] tracking-wider border border-white/10">
              {media.duration}
            </div>

            {/* Play Preview Button Overlay */}
            <button
              id="preview-media-btn"
              onClick={onPreviewMedia}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#6366f1]/90 hover:bg-[#6366f1] text-white flex items-center justify-center shadow-lg shadow-black/50 transform hover:scale-110 active:scale-95 transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
              title="Preview media playback"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>
          </div>

          {/* Media Info Content */}
          <div className="p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4 font-['Inter',sans-serif]">
              {media.title}
            </h3>

            {/* Creator and Stats */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#94a3b8] mb-4">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#6366f1]" />
                <span className="text-[#dae2fd] font-medium">{media.channelOrAuthor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#908fa0]" />
                <span>{media.views} views</span>
              </div>
              {media.publishedDate && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#908fa0]" />
                  <span>{media.publishedDate}</span>
                </div>
              )}
            </div>

            {/* Platform Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#222a3d]">
              <span className="px-2.5 py-1 rounded bg-[#171f33] border border-[#2d3449] text-xs font-semibold text-[#c7c4d7]">
                {media.platformName}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#6366f1]/15 border border-[#6366f1]/30 text-xs font-semibold text-[#c0c1ff]">
                8K / 4K Ready
              </span>
              <span className="px-2.5 py-1 rounded bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-semibold text-[#4edea3]">
                Lossless Audio Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Download Options */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Header with Title and Advanced Settings button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222a3d]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Inter',sans-serif]">
                Download Options
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5 font-['Inter',sans-serif]">
                {media.formats.length} total options (Video & Audio) available
              </p>
            </div>

            <button
              id="advanced-settings-btn"
              onClick={onOpenAdvanced}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] hover:border-[#464554] text-xs font-medium text-[#c7c4d7] hover:text-white transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Advanced Settings</span>
            </button>
          </div>

          {/* Filter Tabs (All, Video, Audio) */}
          <div className="flex items-center gap-2 p-1 bg-[#131b2e] border border-[#222a3d] rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#6366f1] text-white font-semibold shadow-md shadow-[#6366f1]/20'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Formats ({media.formats.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('video')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                filterType === 'video'
                  ? 'bg-[#6366f1] text-white font-semibold shadow-md shadow-[#6366f1]/20'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Video ({videoOptions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('audio')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                filterType === 'audio'
                  ? 'bg-[#10b981] text-[#002113] font-bold shadow-md shadow-[#10b981]/20'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio ({audioOptions.length})</span>
            </button>
          </div>

          {/* Options List */}
          <div className="flex flex-col gap-3">
            {displayedFormats.map((option) => {
              const isAudio = option.isAudioExtraction || option.type === 'audio';

              if (isAudio) {
                // Audio Format Card
                return (
                  <div
                    key={option.id}
                    id={`download-card-${option.id}`}
                    className="group relative bg-[#131b2e] hover:bg-[#171f33] border border-[#10b981]/30 hover:border-[#10b981]/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg shadow-[#10b981]/5"
                  >
                    <div className="flex items-center gap-4">
                      {/* Audio Icon Box */}
                      <div className="w-11 h-11 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] flex-shrink-0 font-['JetBrains_Mono',monospace] text-xs font-bold">
                        {option.iconLabel || 'MP3'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white font-['Inter',sans-serif]">
                            {option.format} {option.quality}
                          </h4>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#10b981]/20 text-[#4edea3] border border-[#10b981]/30">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#94a3b8] font-['JetBrains_Mono',monospace] mt-1">
                          {option.fileSize} • {option.specs}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons (Copy Direct Link + Download) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const typeStr = option.type === 'audio' || option.isAudioExtraction ? 'audio' : 'video';
                          const formatStr = option.format.toLowerCase();
                          const qualityStr = encodeURIComponent(option.quality);
                          const titleStr = encodeURIComponent(media.title);
                          const baseUrl = API_BASE_URL || window.location.origin;
                          const directUrl = `${baseUrl}/api/download?url=${encodeURIComponent(media.url)}&type=${typeStr}&quality=${qualityStr}&format=${formatStr}&title=${titleStr}`;
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(directUrl);
                          }
                          alert(`Direct Download Link Copied to Clipboard:\n\n${directUrl}`);
                        }}
                        className="flex items-center gap-1 px-3 py-2.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-[#c7c4d7] hover:text-white transition-all cursor-pointer"
                        title="Copy direct download link for IDM / FDM / Browser"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#818cf8]" />
                        <span className="hidden sm:inline">Copy Link</span>
                      </button>

                      <button
                        id={`btn-download-${option.id}`}
                        onClick={() => onDownloadOption(option)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] active:scale-98 text-[#002113] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#10b981]/20 cursor-pointer whitespace-nowrap"
                      >
                        <Music className="w-4 h-4 fill-current" />
                        <span>Download Audio</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // Video Format Card (8K, 4K, 1440p, 1080p, 720p, etc.)
              return (
                <div
                  key={option.id}
                  id={`download-card-${option.id}`}
                  className="group bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#3b455b] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
                >
                  <div className="flex items-center gap-4">
                    {/* Badge Icon Box (8K / 4K / HD / SD) */}
                    <div className="w-11 h-11 rounded-lg bg-[#171f33] border border-[#2d3449] flex items-center justify-center text-[#c0c1ff] flex-shrink-0 font-['JetBrains_Mono',monospace] text-xs font-bold shadow-inner">
                      {option.iconLabel}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white font-['Inter',sans-serif]">
                          {option.format} {option.quality}
                        </h4>
                        {option.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#6366f1]/25 text-[#c0c1ff] border border-[#6366f1]/40">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] font-['JetBrains_Mono',monospace] mt-1">
                        {option.fileSize} • {option.specs}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons (Copy Direct Link + Download Video) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const typeStr = 'video';
                        const formatStr = option.format.toLowerCase();
                        const qualityStr = encodeURIComponent(option.quality);
                        const titleStr = encodeURIComponent(media.title);
                        const baseUrl = API_BASE_URL || window.location.origin;
                        const directUrl = `${baseUrl}/api/download?url=${encodeURIComponent(media.url)}&type=${typeStr}&quality=${qualityStr}&format=${formatStr}&title=${titleStr}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(directUrl);
                        }
                        alert(`Direct Download Link Copied to Clipboard:\n\n${directUrl}`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-semibold text-[#c7c4d7] hover:text-white transition-all cursor-pointer"
                      title="Copy direct download link for IDM / FDM / Browser"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#818cf8]" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </button>

                    <button
                      id={`btn-download-${option.id}`}
                      onClick={() => onDownloadOption(option)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] active:scale-98 border border-[#334155] hover:border-[#6366f1] text-[#dae2fd] hover:text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 text-[#818cf8]" />
                      <span>Download Video</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

