import { MediaItem, MediaFormatOption, PlatformType } from '../types';

export function generateFullFormatOptions(): MediaFormatOption[] {
  return [
    // --- VIDEO FORMATS ---
    {
      id: `v-8k-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '8K (4320p Ultra HD)',
      badge: '8K ULTRA',
      fileSize: '2.4 GB',
      specs: '60fps • HDR • AV1 Master',
      iconLabel: '8K',
    },
    {
      id: `v-4k-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '4K (2160p Ultra HD)',
      badge: 'BEST VIDEO',
      fileSize: '850.5 MB',
      specs: '60fps • HDR • H.264 / HEVC',
      iconLabel: '4K',
    },
    {
      id: `v-1440p-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '1440p (2K QHD)',
      badge: '2K QHD',
      fileSize: '420.0 MB',
      specs: '60fps • High Bitrate',
      iconLabel: 'HD',
    },
    {
      id: `v-1080p-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '1080p (Full HD)',
      badge: 'POPULAR',
      fileSize: '215.2 MB',
      specs: '60fps • H.264',
      iconLabel: 'HD',
    },
    {
      id: `v-720p-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '720p (HD)',
      fileSize: '95.8 MB',
      specs: '30fps • Standard',
      iconLabel: 'SD',
    },
    {
      id: `v-480p-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '480p (SD)',
      fileSize: '45.2 MB',
      specs: '30fps • Compact Stream',
      iconLabel: 'SD',
    },
    {
      id: `v-360p-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: '360p (Mobile)',
      fileSize: '22.4 MB',
      specs: '30fps • Ultra Light',
      iconLabel: 'SD',
    },
    {
      id: `v-webm-4k-${Date.now()}`,
      type: 'video',
      format: 'WEBM',
      quality: '4K (2160p WEBM)',
      badge: 'VP9 WEB',
      fileSize: '790.0 MB',
      specs: '60fps • VP9 Codec',
      iconLabel: 'WEBM',
    },
    {
      id: `v-webm-1080p-${Date.now()}`,
      type: 'video',
      format: 'WEBM',
      quality: '1080p (FHD WEBM)',
      fileSize: '190.5 MB',
      specs: '60fps • VP9 Codec',
      iconLabel: 'WEBM',
    },

    // --- AUDIO FORMATS ---
    {
      id: `a-mp3-320-${Date.now()}`,
      type: 'audio',
      format: 'MP3',
      quality: 'Studio Audio (320 kbps)',
      badge: 'BEST AUDIO',
      fileSize: '15.4 MB',
      specs: '320kbps • 48kHz Stereo Master',
      iconLabel: 'HQ',
      isAudioExtraction: true,
    },
    {
      id: `a-mp3-192-${Date.now()}`,
      type: 'audio',
      format: 'MP3',
      quality: 'Standard MP3 (192 kbps)',
      fileSize: '9.2 MB',
      specs: '192kbps • 44.1kHz Stereo',
      iconLabel: 'AUDIO',
      isAudioExtraction: true,
    },
    {
      id: `a-mp3-128-${Date.now()}`,
      type: 'audio',
      format: 'MP3',
      quality: 'Compact MP3 (128 kbps)',
      badge: 'FAST',
      fileSize: '6.1 MB',
      specs: '128kbps • Small File',
      iconLabel: 'AUDIO',
      isAudioExtraction: true,
    },
    {
      id: `a-flac-${Date.now()}`,
      type: 'audio',
      format: 'FLAC',
      quality: 'Lossless Master (FLAC)',
      badge: 'LOSSLESS',
      fileSize: '680.4 MB',
      specs: '24-bit 96kHz Lossless Audio',
      iconLabel: 'FLAC',
      isAudioExtraction: true,
    },
    {
      id: `a-wav-${Date.now()}`,
      type: 'audio',
      format: 'WAV',
      quality: 'Uncompressed WAV PCM',
      badge: 'RAW PCM',
      fileSize: '520.0 MB',
      specs: '16-bit 44.1kHz Uncompressed',
      iconLabel: 'WAV',
      isAudioExtraction: true,
    },
    {
      id: `a-m4a-${Date.now()}`,
      type: 'audio',
      format: 'M4A',
      quality: 'AAC / M4A (256 kbps)',
      badge: 'AAC APPLE',
      fileSize: '12.3 MB',
      specs: '256kbps • AAC Audio Stream',
      iconLabel: 'AUDIO',
      isAudioExtraction: true,
    },
    {
      id: `a-opus-${Date.now()}`,
      type: 'audio',
      format: 'OPUS',
      quality: 'Opus Audio (160 kbps)',
      badge: 'OPUS',
      fileSize: '7.8 MB',
      specs: '160kbps • High Efficiency',
      iconLabel: 'AUDIO',
      isAudioExtraction: true,
    },
    {
      id: `a-ogg-${Date.now()}`,
      type: 'audio',
      format: 'OGG',
      quality: 'Ogg Vorbis (320 kbps)',
      badge: 'OGG',
      fileSize: '14.8 MB',
      specs: '320kbps • Vorbis Codec',
      iconLabel: 'AUDIO',
      isAudioExtraction: true,
    },
  ];
}

export const SAMPLE_PRESETS: MediaItem[] = [
  {
    id: 'cyberpunk-4k',
    url: 'https://www.youtube.com/watch?v=cyberpunk4k',
    title: 'Cyberpunk Cityscape 4K HDR Showcase - Night Drive',
    channelOrAuthor: 'NeoTokyo Channel',
    views: '1.2M',
    duration: '12:45',
    durationSeconds: 765,
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    platform: 'youtube',
    platformName: 'YouTube',
    is4KAvailable: true,
    hasAudioTrack: true,
    publishedDate: '2 weeks ago',
    description: 'Ultra-realistic ray-traced futuristic megacity showcase captured in native 4K 60FPS HDR with uncompressed master audio.',
    formats: generateFullFormatOptions(),
  },
  {
    id: 'lofi-beats',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    title: 'Lofi Chill Vibes & Midnight Coding Beats [Master 320kbps]',
    channelOrAuthor: 'Aesthetic Sounds Studio',
    views: '3.8M',
    duration: '01:42:10',
    durationSeconds: 6130,
    thumbnailUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg',
    platform: 'youtube',
    platformName: 'YouTube',
    is4KAvailable: true,
    hasAudioTrack: true,
    publishedDate: '1 month ago',
    description: 'Relaxing ambient beats for study, work, and focus with enhanced low-end frequencies and tape warmth.',
    formats: generateFullFormatOptions(),
  },
  {
    id: 'insta-travel',
    url: 'https://www.instagram.com/reel/C38xY1aPL0q/',
    title: 'Hidden Gem in the Swiss Alps - Cinematic Drone 4K',
    channelOrAuthor: '@wanderlust_adventures',
    views: '840K',
    duration: '0:58',
    durationSeconds: 58,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    platform: 'instagram',
    platformName: 'Instagram Reel',
    is4KAvailable: true,
    hasAudioTrack: true,
    publishedDate: '3 days ago',
    description: 'Stunning alpine views captured at golden hour with ProRes log profile and color grading.',
    formats: generateFullFormatOptions(),
  },
  {
    id: 'twitter-tech',
    url: 'https://twitter.com/ai_future/status/1789201948201',
    title: 'Breakthrough Quantum Computing Neural Architecture Demo',
    channelOrAuthor: '@TechFrontier_X',
    views: '412K',
    duration: '02:15',
    durationSeconds: 135,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    platform: 'twitter',
    platformName: 'Twitter / X',
    is4KAvailable: false,
    hasAudioTrack: true,
    publishedDate: 'Yesterday',
    description: 'Realtime particle simulation benchmarked across 1,024 tensor processing cores.',
    formats: generateFullFormatOptions(),
  },
];

// Helper to extract YouTube video ID from various YouTube URL formats
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

// Helper to parse title from URL path / query slug
function parseSlugTitle(url: string, platformName: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    // Check search params for title/v
    const searchParams = parsed.searchParams;
    if (searchParams.has('title')) {
      const t = searchParams.get('title');
      if (t) return decodeURIComponent(t).replace(/[-_]/g, ' ');
    }

    // Process pathname segments
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      // Find a segment that looks like a readable title (more than just an ID)
      for (const segment of pathSegments.reverse()) {
        if (segment.length > 3 && !/^[0-9]+$/.test(segment) && !/^[a-f0-9]{24,}$/i.test(segment)) {
          // Clean slug like my-awesome-video-2026
          const cleaned = decodeURIComponent(segment)
            .replace(/\.[a-z0-9]+$/i, '') // strip extension
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleaned.length >= 3 && !/^(watch|reel|p|status|video|videos|embed)$/i.test(cleaned)) {
            // Capitalize words
            return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
          }
        }
      }
    }

    // Domain fallback
    const host = parsed.hostname.replace('www.', '');
    return `Media Stream from ${host}`;
  } catch {
    return `${platformName} Media Content`;
  }
}

export function parseAndGenerateMedia(inputUrl: string, requestedMode: 'all' | 'mp4' | 'mp3' = 'all'): MediaItem {
  const cleanUrl = inputUrl.trim();
  const lower = cleanUrl.toLowerCase();

  // Match existing presets if explicitly requested or matched
  const presetMatch = SAMPLE_PRESETS.find((p) => p.url.toLowerCase() === lower || p.id === lower);
  if (presetMatch) {
    return presetMatch;
  }

  // Detect Platform
  let platform: PlatformType = 'other';
  let platformName = 'Web Video / Audio';
  let channel = '@MediaCreator';
  let title = '';
  let thumbnailUrl = '';
  let duration = '03:45';
  let durationSeconds = 225;

  // 1. YouTube
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    platform = 'youtube';
    platformName = 'YouTube';
    const ytId = extractYouTubeId(cleanUrl);
    if (ytId) {
      thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      title = `YouTube Video (${ytId})`;
    } else {
      thumbnailUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop';
      title = 'YouTube Master Recording';
    }

    const slugTitle = parseSlugTitle(cleanUrl, 'YouTube');
    if (slugTitle && !slugTitle.includes('watch') && !slugTitle.includes('Media Stream')) {
      title = slugTitle;
    } else if (ytId) {
      title = `YouTube Video Stream [ID: ${ytId}]`;
    }

    channel = 'YouTube Channel Creator';
  } 
  // 2. Instagram
  else if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    platform = 'instagram';
    platformName = 'Instagram';
    thumbnailUrl = 'https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=1200&auto=format&fit=crop';
    
    const reelMatch = cleanUrl.match(/\/(reel|p|reels)\/([A-Za-z0-9_-]+)/);
    if (reelMatch) {
      title = `Instagram Reel (${reelMatch[2]})`;
    } else {
      title = parseSlugTitle(cleanUrl, 'Instagram');
    }
    channel = '@instagram_creator';
    duration = '00:59';
    durationSeconds = 59;
  } 
  // 3. Twitter / X
  else if (lower.includes('twitter.com') || lower.includes('x.com') || lower.includes('t.co')) {
    platform = 'twitter';
    platformName = 'Twitter / X';
    thumbnailUrl = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1200&auto=format&fit=crop';
    
    const tweetMatch = cleanUrl.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status\/([0-9]+)/);
    if (tweetMatch) {
      channel = `@${tweetMatch[1]}`;
      title = `Viral Post & Video by @${tweetMatch[1]}`;
    } else {
      title = parseSlugTitle(cleanUrl, 'Twitter / X');
      channel = '@X_User';
    }
    duration = '01:30';
    durationSeconds = 90;
  } 
  // 4. TikTok
  else if (lower.includes('tiktok.com')) {
    platform = 'tiktok';
    platformName = 'TikTok';
    thumbnailUrl = 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop';
    
    const ttMatch = cleanUrl.match(/@([A-Za-z0-9._]+)\/video\/([0-9]+)/);
    if (ttMatch) {
      channel = `@${ttMatch[1]}`;
      title = `TikTok Reel by @${ttMatch[1]}`;
    } else {
      title = parseSlugTitle(cleanUrl, 'TikTok');
      channel = '@tiktok_creator';
    }
    duration = '00:45';
    durationSeconds = 45;
  } 
  // 5. Facebook
  else if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    platform = 'facebook';
    platformName = 'Facebook';
    thumbnailUrl = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop';
    title = parseSlugTitle(cleanUrl, 'Facebook Video');
    channel = 'Facebook Page';
    duration = '02:15';
    durationSeconds = 135;
  }
  // 6. Generic / Other URL
  else {
    platform = 'other';
    try {
      const parsedUrl = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      platformName = parsedUrl.hostname.replace('www.', '');
      channel = `@${platformName.split('.')[0]}`;
    } catch {
      platformName = 'Web Stream';
      channel = '@MediaSource';
    }
    title = parseSlugTitle(cleanUrl, platformName);
    thumbnailUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop';
  }

  return {
    id: `custom-${Date.now()}`,
    url: cleanUrl,
    title,
    channelOrAuthor: channel,
    views: `${(Math.floor(Math.random() * 900) + 100).toLocaleString()}K`,
    duration,
    durationSeconds,
    thumbnailUrl,
    platform,
    platformName,
    is4KAvailable: true,
    hasAudioTrack: true,
    publishedDate: 'Recently uploaded',
    description: `Original media parsed and extracted from ${cleanUrl}. Full resolution video tracks and studio audio streams generated.`,
    formats: generateFullFormatOptions(),
  };
}

