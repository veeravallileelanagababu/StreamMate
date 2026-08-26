import React from 'react';
import { DownloadTask } from '../types';
import { X, History, Trash2, Download, CheckCircle2, Loader2, Music, Video, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadTask[];
  onClearHistory: () => void;
  onSaveToDisk: (task: DownloadTask) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSaveToDisk,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131b2e] border-l border-[#2d3449] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#222a3d]">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#6366f1]" />
            <h3 className="text-base font-bold text-white font-['Inter',sans-serif]">
              Extraction History
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#171f33] border border-[#2d3449] text-[11px] font-bold text-[#c7c4d7]">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear all history"
                className="p-1.5 rounded-lg text-[#908fa0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#908fa0] hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#908fa0]">
              <div className="w-12 h-12 rounded-full bg-[#171f33] flex items-center justify-center mb-3">
                <History className="w-6 h-6 text-[#464554]" />
              </div>
              <p className="text-sm font-semibold text-[#dae2fd]">No downloads yet</p>
              <p className="text-xs text-[#908fa0] mt-1 max-w-xs">
                Converted videos and extracted audio will appear here for fast access.
              </p>
            </div>
          ) : (
            history.map((task) => {
              const isAudio = task.formatOption.type === 'audio' || task.formatOption.isAudioExtraction;
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-[#0b1326] border border-[#222a3d] hover:border-[#334155] transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={task.mediaItem.thumbnailUrl}
                      alt={task.mediaItem.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate font-['Inter',sans-serif]">
                        {task.mediaItem.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#908fa0] font-['JetBrains_Mono',monospace]">
                        <span className={isAudio ? 'text-[#10b981]' : 'text-[#818cf8]'}>
                          {task.formatOption.format} {task.formatOption.quality}
                        </span>
                        <span>•</span>
                        <span>{task.formatOption.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Downloading Progress Bar if actively downloading */}
                  {!isCompleted && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-[#818cf8] font-['JetBrains_Mono',monospace]">
                        <span className="flex items-center gap-1.5 text-xs text-[#c0c1ff]">
                          <Loader2 className="w-3 h-3 animate-spin text-[#818cf8]" />
                          <span>Downloading stream...</span>
                        </span>
                        <span className="font-bold">{Math.round(task.progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#171f33] rounded-full overflow-hidden border border-[#222a3d]">
                        <div
                          className="h-full bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#10b981] transition-all duration-200"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#171f33] text-[11px]">
                    <span className="text-[#908fa0] flex items-center gap-1 font-['JetBrains_Mono',monospace]">
                      <Clock className="w-3 h-3" />
                      {new Date(task.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {isCompleted ? (
                      <button
                        onClick={() => onSaveToDisk(task)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#4edea3] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Save to Device</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#6366f1]/15 text-[#c0c1ff] text-[11px] font-medium border border-[#6366f1]/30">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Downloading</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
