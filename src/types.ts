export type AppMode = 'all' | 'mp4' | 'mp3';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'reddit' | 'other';

export interface MediaFormatOption {
  id: string;
  type: 'video' | 'audio';
  format: string; // 'MP4' | 'MP3' | 'WEBM' | 'WAV' | 'FLAC' | 'M4A' | 'OPUS' | 'OGG' | 'AVI'
  quality: string; // '8K (4320p)' | '4K (2160p)' | '1080p (FHD)' | '720p (HD)' | '320kbps' | '192kbps' | etc.
  badge?: string;
  fileSize: string;
  bytes?: number; // Exact total bytes for Content-Length header
  specs: string; // '60fps • HDR' | '320kbps • Lossless Source'
  iconLabel: string; // '8K' | '4K' | 'HQ' | 'HD' | 'SD' | 'AUDIO' | 'FLAC' | 'WAV' | 'WEBM'
  downloadUrl?: string;
  isAudioExtraction?: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  channelOrAuthor: string;
  views: string;
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  platform: PlatformType;
  platformName: string;
  is4KAvailable: boolean;
  hasAudioTrack: boolean;
  formats: MediaFormatOption[];
  videoStreamUrl?: string;
  audioStreamUrl?: string;
  publishedDate?: string;
  description?: string;
}

export interface DownloadTask {
  id: string;
  mediaItem: MediaItem;
  formatOption: MediaFormatOption;
  progress: number; // 0 to 100
  status: 'initializing' | 'fetching_stream' | 'converting' | 'packaging' | 'completed' | 'failed';
  downloadSpeed: string;
  eta: string;
  timestamp: number;
  downloadBlobUrl?: string;
}

export interface AdvancedSettings {
  videoCodec: 'h264' | 'hevc' | 'av1' | 'vp9';
  audioCodec: 'mp3' | 'aac' | 'flac' | 'opus' | 'wav';
  audioBitrate: '128k' | '192k' | '256k' | '320k';
  videoFramerate: 'auto' | '30' | '60';
  normalizeAudio: boolean;
  includeSubtitles: boolean;
  embedCoverArt: boolean;
  trimMedia: boolean;
  trimStart: string;
  trimEnd: string;
}
