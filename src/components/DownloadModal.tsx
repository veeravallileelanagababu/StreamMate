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
  Music,
  Clock,
  ArrowDownCircle
} from 'lucide-react';

import { API_BASE_URL } from '../config';

interface DownloadModalProps {
  task: DownloadTask | null;
  onClose: () => void;
  onSaveToDisk: (task: DownloadTask) => Promise<void>;
}

function formatBytesLabel(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 MB';
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  task,
  onClose,
  onSaveToDisk,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!task) return null;

  const isCompleted = task.status === 'completed';
  const isAudio = task.formatOption.type === 'audio' || task.formatOption.isAudioExtraction;
  const typeStr = isAudio ? 'audio' : 'video';
  const formatStr = task.formatOption.format.toLowerCase();
  const qualityStr = encodeURIComponent(task.formatOption.quality);
  const titleStr = encodeURIComponent(task.mediaItem.title || '');
  const bytesStr = task.formatOption.bytes ? `&bytes=${task.formatOption.bytes}` : '';
  const formatIdStr = task.formatOption.formatId ? `&formatId=${encodeURIComponent(task.formatOption.formatId)}` : '';
  const directDownloadUrl = `${API_BASE_URL}/api/download?url=${encodeURIComponent(task.mediaItem.url)}&type=${typeStr}&quality=${qualityStr}&format=${formatStr}&title=${titleStr}${bytesStr}${formatIdStr}`;

  const handleSaveClick = async () => {
    setIsSaving(true);
    setDownloadSuccess(false);

    try {
      await onSaveToDisk(task);
      setDownloadSuccess(true);
    } catch {
      window.location.href = directDownloadUrl;
      setDownloadSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const totalSizeVal = task.totalBytes || task.formatOption.bytes || 0;
  const transferredVal = task.transferredBytes !== undefined ? task.transferredBytes : (isCompleted ? totalSizeVal : 0);

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
        <div className="flex items-center gap-3.5 mb-5">
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
                ? 'Download Complete & Saved!'
                : isAudio
                ? 'Downloading Audio Stream...'
                : 'Downloading Video Stream...'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {isCompleted
                ? 'Original file saved to your device.'
                : 'Streaming file directly in browser with real-time stats.'}
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

        {/* Live Downloading Dashboard Box */}
        <div className="bg-[#0b1326] border border-[#222a3d] rounded-xl p-4 mb-6 space-y-3">
          {/* Header text and Percentage */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c7c4d7] font-medium flex items-center gap-1.5">
              {!isCompleted && <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-ping" />}
              {isCompleted
                ? 'Download 100% complete!'
                : transferredVal > 0
                ? `Downloading ${formatBytesLabel(transferredVal)}...`
                : 'Preparing media stream from server...'}
            </span>
            <span className="text-white font-bold font-['JetBrains_Mono',monospace] text-sm">
              {Math.round(task.progress)}%
            </span>
          </div>

          {/* Thick Progress bar */}
          <div className="w-full h-3 bg-[#171f33] rounded-full overflow-hidden border border-[#222a3d] p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                isCompleted
                  ? 'bg-gradient-to-r from-[#10b981] to-[#4edea3]'
                  : 'bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#38bdf8]'
              }`}
              style={{ width: `${Math.max(task.progress, 2)}%` }}
            />
          </div>

          {/* 3 Prominent Stat Cards: Downloaded Size | Internet Speed | Estimated Time (ETA) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1.5 font-['JetBrains_Mono',monospace]">
            {/* Card 1: Downloaded Size */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#908fa0] uppercase tracking-wider font-sans font-semibold mb-0.5 flex items-center gap-1">
                <ArrowDownCircle className="w-3 h-3 text-[#818cf8]" />
                Downloaded
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate w-full">
                {formatBytesLabel(transferredVal)}
              </span>
              <span className="text-[9.5px] text-[#818cf8] mt-0.5">
                of {formatBytesLabel(totalSizeVal)}
              </span>
            </div>

            {/* Card 2: Internet Speed */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#908fa0] uppercase tracking-wider font-sans font-semibold mb-0.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#38bdf8]" />
                Speed
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#38bdf8] truncate w-full">
                {isCompleted ? '0 MB/s' : (task.downloadSpeed || 'Calculated')}
              </span>
              <span className="text-[9.5px] text-[#908fa0] mt-0.5">
                Internet Rate
              </span>
            </div>

            {/* Card 3: Estimated Time (ETA) */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#908fa0] uppercase tracking-wider font-sans font-semibold mb-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#10b981]" />
                Est. Time
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#4edea3] truncate w-full">
                {isCompleted ? '0s' : (task.eta || 'Estimating')}
              </span>
              <span className="text-[9.5px] text-[#908fa0] mt-0.5">
                Time Left
              </span>
            </div>
          </div>
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
                    <span>Saving File to Device...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save {isAudio ? 'Audio' : 'Video'} Again to Device</span>
                  </>
                )}
              </button>

              {/* Copy Direct Download Link */}
              <button
                type="button"
                onClick={() => {
                  const fullUrl = `${window.location.origin}${directDownloadUrl}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(fullUrl);
                  }
                  alert(`Direct Download Link Copied to Clipboard!\n\n${fullUrl}`);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border border-[#6366f1]/40 text-xs font-semibold text-[#c0c1ff] hover:text-white transition-all text-center cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Copy Direct Download Link</span>
              </button>

              {downloadSuccess && (
                <div className="p-2.5 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-center text-xs text-[#4edea3] font-medium animate-in fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span>File saved to your device! Check your downloads folder.</span>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-medium text-[#908fa0] hover:text-white transition-all cursor-pointer"
            >
              Cancel / Close Modal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

