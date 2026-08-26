import React, { useState } from 'react';
import { DownloadTask } from '../types';
import { 
  CheckCircle2, 
  Download, 
  Loader2, 
  X, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  FileVideo,
  Music
} from 'lucide-react';

interface DownloadModalProps {
  task: DownloadTask | null;
  onClose: () => void;
  onSaveToDisk: (task: DownloadTask) => Promise<void>;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  task,
  onClose,
  onSaveToDisk,
}) => {
  if (!task) return null;

  const [isSaving, setIsSaving] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isCompleted = task.status === 'completed';
  const isAudio = task.formatOption.type === 'audio' || task.formatOption.isAudioExtraction;
  const typeStr = isAudio ? 'audio' : 'video';
  const formatStr = task.formatOption.format.toLowerCase();
  const qualityStr = encodeURIComponent(task.formatOption.quality);
  const titleStr = encodeURIComponent(task.mediaItem.title || '');
  const directDownloadUrl = `/api/download?url=${encodeURIComponent(task.mediaItem.url)}&type=${typeStr}&quality=${qualityStr}&format=${formatStr}&title=${titleStr}`;

  const handleSaveClick = async () => {
    setIsSaving(true);
    setDownloadSuccess(false);

    try {
      // Direct trigger
      await onSaveToDisk(task);
      setDownloadSuccess(true);
    } catch {
      // Fallback direct link navigation
      window.location.href = directDownloadUrl;
      setDownloadSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#131b2e] border border-[#2d3449] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/90">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Header */}
        <div className="flex items-center gap-3.5 mb-6">
          {isCompleted ? (
            <div className="w-11 h-11 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8] flex-shrink-0">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-white font-['Inter',sans-serif]">
              {isCompleted
                ? 'Extraction Ready!'
                : isAudio
                ? 'Converting Audio Stream...'
                : 'Processing High-Speed Stream...'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {isCompleted
                ? 'Original media package ready to save to your disk.'
                : 'Extracting uncompressed stream chunks with metadata.'}
            </p>
          </div>
        </div>

        {/* Media Summary Info */}
        <div className="bg-[#0b1326] border border-[#222a3d] rounded-xl p-3.5 mb-5 flex items-center gap-3.5">
          <img
            src={task.mediaItem.thumbnailUrl}
            alt={task.mediaItem.title}
            referrerPolicy="no-referrer"
            className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white truncate">
              {task.mediaItem.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#908fa0] font-['JetBrains_Mono',monospace]">
              <span className="text-[#818cf8] font-bold">
                {task.formatOption.format} {task.formatOption.quality}
              </span>
              <span>•</span>
              <span>{task.formatOption.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c7c4d7] font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#6366f1]" />
              {task.status === 'initializing' && 'Initializing stream socket...'}
              {task.status === 'fetching_stream' && 'Fetching master chunks...'}
              {task.status === 'converting' && (isAudio ? 'Encoding 320kbps MP3...' : 'Remuxing 60FPS video...')}
              {task.status === 'packaging' && 'Writing metadata container...'}
              {task.status === 'completed' && 'Media processing complete!'}
            </span>
            <span className="text-white font-bold font-['JetBrains_Mono',monospace]">
              {Math.round(task.progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-[#171f33] rounded-full overflow-hidden border border-[#222a3d]">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-[#10b981] to-[#4edea3]'
                  : 'bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#c0c1ff]'
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>

          {/* Speed & ETA stats */}
          {!isCompleted && (
            <div className="flex items-center justify-between text-[11px] text-[#908fa0] font-['JetBrains_Mono',monospace] pt-1">
              <span>Speed: {task.downloadSpeed}</span>
              <span>ETA: {task.eta}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {isCompleted ? (
            <>
              {/* Primary Save Button */}
              <button
                id="btn-save-file-disk"
                onClick={handleSaveClick}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:opacity-95 active:scale-98 text-[#002113] font-bold text-sm shadow-lg shadow-[#10b981]/25 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching Original File ({task.formatOption.quality})...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save {isAudio ? 'Audio' : 'Video'} to Device</span>
                  </>
                )}
              </button>

              {/* Copy Direct Download Link for IDM / FDM */}
              <button
                type="button"
                onClick={() => {
                  const fullUrl = `${window.location.origin}${directDownloadUrl}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(fullUrl);
                  }
                  alert(`Direct Download Link Copied to Clipboard!\n\nYou can paste this link into IDM, FDM, Chrome, or any downloader:\n\n${fullUrl}`);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border border-[#6366f1]/40 text-xs font-semibold text-[#c0c1ff] hover:text-white transition-all text-center cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Copy Direct Download Link (for IDM / Browser)</span>
              </button>

              {downloadSuccess && (
                <div className="p-2.5 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-center text-xs text-[#4edea3] font-medium animate-in fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span>Download initiated! Check your browser's download manager.</span>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-medium text-[#908fa0] hover:text-white transition-all cursor-pointer"
            >
              Run in Background
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

