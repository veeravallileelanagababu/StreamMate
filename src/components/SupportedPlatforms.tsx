import React from 'react';
import { Play, Camera, MessageSquare, Video, Music } from 'lucide-react';

interface SupportedPlatformsProps {
  onSelectPlatformSample?: (platform: string) => void;
}

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ onSelectPlatformSample }) => {
  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      desc: 'Extract 4K video and high-quality audio',
      iconBg: 'bg-[#ff0000]/15 text-[#ff4e4e] border-[#ff0000]/25',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#ff0000]/20 flex items-center justify-center text-[#ff3b30] border border-[#ff0000]/30 shadow-md shadow-[#ff0000]/10">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      ),
      sampleId: 'cyberpunk-4k',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Save Reels, Stories, and Posts instantly',
      iconBg: 'bg-[#e1306c]/15 text-[#f77737] border-[#e1306c]/25',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fd1d1d]/20 via-[#e1306c]/20 to-[#833ab4]/20 flex items-center justify-center text-[#f77737] border border-[#e1306c]/30 shadow-md shadow-[#e1306c]/10">
          <Camera className="w-5 h-5" />
        </div>
      ),
      sampleId: 'insta-travel',
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      desc: 'Download media from any public tweet',
      iconBg: 'bg-[#1da1f2]/15 text-[#1da1f2] border-[#1da1f2]/25',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#1da1f2]/20 flex items-center justify-center text-[#38bdf8] border border-[#1da1f2]/30 shadow-md shadow-[#1da1f2]/10">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
      ),
      sampleId: 'twitter-tech',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Inter',sans-serif]">
          Supported Platforms
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-['Inter',sans-serif]">
          High-speed extraction from your favorite platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {platforms.map((p) => (
          <div
            key={p.id}
            id={`platform-card-${p.id}`}
            onClick={() => onSelectPlatformSample && onSelectPlatformSample(p.sampleId)}
            className="group relative bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#3b455b] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
          >
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
              {p.icon}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-['Inter',sans-serif]">
              {p.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-['Inter',sans-serif]">
              {p.desc}
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold text-[#818cf8] tracking-wider uppercase">
              Click to test sample →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
