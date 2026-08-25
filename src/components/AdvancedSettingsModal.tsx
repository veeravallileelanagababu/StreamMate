import React from 'react';
import { AdvancedSettings } from '../types';
import { X, Sliders, Check, Volume2, Film, Scissors, Subtitles, ShieldCheck } from 'lucide-react';

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdvancedSettings;
  onSaveSettings: (settings: AdvancedSettings) => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<AdvancedSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#131b2e] border border-[#2d3449] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222a3d] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Inter',sans-serif]">
                Advanced Stream Settings
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Fine-tune encoding, codecs, audio bitrate, and trimming options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-white p-1 rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Video Codec */}
          <div>
            <label className="block text-xs font-semibold text-[#c7c4d7] mb-2 uppercase tracking-wider font-['JetBrains_Mono',monospace]">
              Preferred Video Codec
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'h264', label: 'H.264 (Universal)' },
                { id: 'hevc', label: 'HEVC / H.265' },
                { id: 'av1', label: 'AV1 (Next-Gen)' },
                { id: 'vp9', label: 'VP9' },
              ].map((codec) => (
                <button
                  key={codec.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      videoCodec: codec.id as AdvancedSettings['videoCodec'],
                    })
                  }
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer ${
                    localSettings.videoCodec === codec.id
                      ? 'bg-[#6366f1] text-white border-[#818cf8] font-bold shadow-md shadow-[#6366f1]/30'
                      : 'bg-[#171f33] text-[#908fa0] hover:text-white border-[#2d3449] hover:border-[#464554]'
                  }`}
                >
                  {codec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Bitrate & Codec */}
          <div>
            <label className="block text-xs font-semibold text-[#c7c4d7] mb-2 uppercase tracking-wider font-['JetBrains_Mono',monospace]">
              Audio Encoding Quality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '320k', label: '320 kbps (Studio)' },
                { id: '256k', label: '256 kbps (High)' },
                { id: '192k', label: '192 kbps (Standard)' },
                { id: '128k', label: '128 kbps (Compact)' },
              ].map((br) => (
                <button
                  key={br.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      audioBitrate: br.id as AdvancedSettings['audioBitrate'],
                    })
                  }
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer ${
                    localSettings.audioBitrate === br.id
                      ? 'bg-[#10b981] text-[#002113] border-[#4edea3] font-bold shadow-md shadow-[#10b981]/30'
                      : 'bg-[#171f33] text-[#908fa0] hover:text-white border-[#2d3449] hover:border-[#464554]'
                  }`}
                >
                  {br.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-[#222a3d]">
            {/* Embed ID3 & Cover Art */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b1326] border border-[#222a3d] hover:border-[#334155] cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#6366f1]" />
                <div>
                  <div className="text-white font-medium text-xs">Auto ID3 Metadata & Album Art</div>
                  <div className="text-[11px] text-[#908fa0]">Inject artist name, high-res cover art & year tags</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.embedCoverArt}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, embedCoverArt: e.target.checked })
                }
                className="w-4 h-4 accent-[#6366f1] rounded cursor-pointer"
              />
            </label>

            {/* Audio Normalization */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b1326] border border-[#222a3d] hover:border-[#334155] cursor-pointer">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#10b981]" />
                <div>
                  <div className="text-white font-medium text-xs">Normalize Audio Levels (-14 LUFS)</div>
                  <div className="text-[11px] text-[#908fa0]">Prevents sudden volume spikes or muffled audio</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.normalizeAudio}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, normalizeAudio: e.target.checked })
                }
                className="w-4 h-4 accent-[#10b981] rounded cursor-pointer"
              />
            </label>

            {/* Subtitles */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b1326] border border-[#222a3d] hover:border-[#334155] cursor-pointer">
              <div className="flex items-center gap-3">
                <Subtitles className="w-4 h-4 text-[#818cf8]" />
                <div>
                  <div className="text-white font-medium text-xs">Extract Closed Captions (.SRT)</div>
                  <div className="text-[11px] text-[#908fa0]">Include subtitle tracks in multi-stream packaging</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.includeSubtitles}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, includeSubtitles: e.target.checked })
                }
                className="w-4 h-4 accent-[#6366f1] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#222a3d]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-xs font-semibold text-[#908fa0] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md shadow-[#6366f1]/25 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
