import React from 'react';
import { AppMode } from '../types';
import { Video, AudioWaveform, Tag, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface QualitySettingsProps {
  mode?: AppMode;
}

export const QualitySettings: React.FC<QualitySettingsProps> = () => {
  const features = [
    {
      id: '8k-4k-extract',
      title: '8K & 4K Video Extraction',
      desc: 'High-resolution video processing with maximum bitrates, 60FPS, and HDR support.',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#171f33] border border-[#2d3449] flex items-center justify-center text-[#c0c1ff] shadow-inner">
          <Video className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: '320k-audio',
      title: '320kbps & FLAC Lossless Audio',
      desc: 'Crystal clear studio audio extraction with 320kbps MP3 and 24-bit 96kHz FLAC audio.',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#171f33] border border-[#2d3449] flex items-center justify-center text-[#4edea3] shadow-inner">
          <AudioWaveform className="w-5 h-5 text-[#10b981]" />
        </div>
      ),
    },
    {
      id: 'id3-metadata',
      title: 'Automated ID3 & Cover Art',
      desc: 'Automatically fetches and embeds title, artist, album, and high-res cover art metadata.',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#171f33] border border-[#2d3449] flex items-center justify-center text-[#38bdf8] shadow-inner">
          <Tag className="w-5 h-5" />
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Inter',sans-serif]">
          Master Engine Features
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-['Inter',sans-serif]">
          High-performance video and audio processing engine with zero quality loss
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {features.map((f) => (
          <div
            key={f.id}
            id={`quality-card-${f.id}`}
            className="relative bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#3b455b] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-['Inter',sans-serif]">
              {f.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-['Inter',sans-serif]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

