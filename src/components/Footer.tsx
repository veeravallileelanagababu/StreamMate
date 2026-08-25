import React, { useState } from 'react';
import { Shield, ExternalLink, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <footer className="w-full border-t border-[#222a3d] bg-[#0b1326] mt-auto py-8 text-xs text-[#908fa0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: StreamGuard Brand */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white tracking-tight font-['Inter',sans-serif]">
            StreamGuard
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#908fa0]">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-[#dae2fd] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-[#dae2fd] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveModal('api')}
            className="hover:text-[#dae2fd] transition-colors cursor-pointer"
          >
            API Docs
          </button>
          <button
            onClick={() => setActiveModal('support')}
            className="hover:text-[#dae2fd] transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>

        {/* Right: Copyright Statement */}
        <div className="text-[#908fa0] text-center md:text-right font-['Inter',sans-serif]">
          © 2024 StreamGuard. Professional video processing tools.
        </div>
      </div>

      {/* Info Modals for Footer Links */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#131b2e] border border-[#2d3449] rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 capitalize font-['Inter',sans-serif]">
              {activeModal === 'privacy' && 'StreamGuard Privacy Policy'}
              {activeModal === 'terms' && 'Terms of Service'}
              {activeModal === 'api' && 'StreamGuard REST API & Webhooks'}
              {activeModal === 'support' && 'StreamGuard Support & SLA'}
            </h3>

            <div className="text-xs text-[#c7c4d7] leading-relaxed space-y-2.5 my-4">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    StreamGuard operates on an uncompressed direct-proxy pipeline. We do not persist or store personal media logs or extracted streams beyond the active transient user session.
                  </p>
                  <p>
                    All audio and video extraction requests are processed through encrypted TLS 1.3 streams without third-party tracking cookies or ad telemetry.
                  </p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>
                    StreamMate and StreamGuard tools are intended for personal media backup, offline study, creative editing under fair use, and author-approved content extraction.
                  </p>
                  <p>
                    Users are responsible for complying with the terms of service of source platforms and respecting intellectual property laws.
                  </p>
                </>
              )}
              {activeModal === 'api' && (
                <>
                  <p>
                    StreamMate offers high-throughput API endpoints for batch media analysis, 4K HDR stream extraction, and 320kbps MP3 audio transcoding.
                  </p>
                  <p className="font-['JetBrains_Mono',monospace] bg-[#0b1326] p-2 rounded border border-[#222a3d] text-[#818cf8]">
                    POST /api/v1/extract?url=...&format=mp4&quality=4k
                  </p>
                </>
              )}
              {activeModal === 'support' && (
                <>
                  <p>
                    Need assistance or experiencing an unsupported video format? Our media infrastructure engineers monitor extractors 24/7.
                  </p>
                  <p className="text-[#6366f1] font-semibold">
                    support@streamguard.io • Response time &lt; 2 hours
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#222a3d]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[#6366f1] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
