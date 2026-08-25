import React from 'react';
import { DownloadTask } from '../types';
import { X, History, Trash2, Download, CheckCircle, Music, Video, Clock } from 'lucide-react';

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

              return (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#0b1326] border border-[#222a3d] hover:border-[#334155] transition-all flex flex-col gap-2.5"
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

                  <div className="flex items-center justify-between pt-2 border-t border-[#171f33] text-[11px]">
                    <span className="text-[#908fa0] flex items-center gap-1 font-['JetBrains_Mono',monospace]">
                      <Clock className="w-3 h-3" />
                      {new Date(task.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={() => onSaveToDisk(task)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] hover:border-[#6366f1] text-[#dae2fd] text-xs font-medium transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-[#818cf8]" />
                      <span>Save</span>
                    </button>
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
