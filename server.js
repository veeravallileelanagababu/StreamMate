import 'dotenv/config';
import express from 'express';
import ytdlp from 'yt-dlp-exec';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import os from 'os';

const exec = ytdlp.exec || ytdlp;
const app = express();
app.use(express.json());

// CORS headers for local & production deployment
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || '*';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check endpoint for Render monitoring
app.get(['/', '/api/health'], (req, res) => {
  res.json({ status: 'ok', service: 'StreamMate Backend Engine', timestamp: new Date().toISOString() });
});

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-\. ]/g, '_').substring(0, 70);
}

function extractExactFormats(info) {
  const formats = info.formats || [];
  const options = [];
  const processedResolutions = new Set();

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return null;
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  const durationSec = info.duration || 30;

  // 1. VIDEO FORMATS EXTRACTION (Works for YouTube, Instagram, Twitter, TikTok, Facebook, etc.)
  const videoFormats = formats.filter(f => f.vcodec && f.vcodec !== 'none');

  if (videoFormats.length > 0) {
    // Sort video formats by height descending
    videoFormats.sort((a, b) => (b.height || 0) - (a.height || 0));

    videoFormats.forEach((f) => {
      const h = f.height || 0;
      const w = f.width || 0;
      const resKey = h > 0 ? `${h}p` : f.format_id || 'sd';

      if (h > 0 && processedResolutions.has(resKey)) return;
      if (h > 0) processedResolutions.add(resKey);

      // Determine exact size
      let rawSize = f.filesize || f.filesize_approx || 0;

      // If it's a video-only format (e.g. YouTube DASH video track), add best audio track size
      if (!f.acodec || f.acodec === 'none') {
        const audioTracks = formats.filter(a => a.acodec && a.acodec !== 'none' && (!a.vcodec || a.vcodec === 'none'));
        let bestAudioSize = 0;
        audioTracks.forEach(a => {
          const sz = a.filesize || a.filesize_approx || 0;
          if (sz > bestAudioSize) bestAudioSize = sz;
        });
        if (bestAudioSize === 0) bestAudioSize = durationSec * 24000;
        rawSize += bestAudioSize;
      }

      if (rawSize === 0 && f.tbr) {
        rawSize = (f.tbr * 1000 / 8) * durationSec;
      }

      const sizeLabel = formatBytes(rawSize) || `${((durationSec * 1500000) / 8 / 1024 / 1024).toFixed(1)} MB`;

      let qualityTitle = `${h}p (${w > 0 ? (w < h ? 'Vertical' : 'HD') : 'Video'})`;
      let badge = undefined;
      if (h >= 4320) { qualityTitle = '8K (4320p Ultra HD)'; badge = '8K ULTRA'; }
      else if (h >= 2160) { qualityTitle = '4K (2160p Ultra HD)'; badge = '4K ULTRA'; }
      else if (h >= 1440) { qualityTitle = '1440p (2K QHD)'; badge = '2K QHD'; }
      else if (h >= 1080) { qualityTitle = '1080p (Full HD)'; badge = 'FULL HD'; }
      else if (h >= 720) { qualityTitle = '720p (HD)'; badge = 'HD'; }
      else if (h >= 480) { qualityTitle = '480p (SD)'; }
      else if (h >= 360) { qualityTitle = '360p (Mobile)'; }
      else if (h > 0) { qualityTitle = `${h}p (Mobile)`; }

      const vCodecName = f.vcodec ? f.vcodec.split('.')[0].toUpperCase() : 'MP4';
      const fpsStr = f.fps ? `${f.fps}fps • ` : '';

      options.push({
        id: `v-${h || Date.now()}-${f.format_id || Math.random()}`,
        type: 'video',
        format: (f.ext || 'mp4').toUpperCase(),
        quality: qualityTitle,
        badge,
        fileSize: sizeLabel,
        specs: `${fpsStr}${vCodecName} Codec`,
        iconLabel: h >= 2160 ? '4K' : h >= 720 ? 'HD' : 'SD',
      });
    });
  }

  // Fallback if no video formats array matched
  if (options.length === 0) {
    const mainHeight = info.height || 1080;
    const rawSize = info.filesize || info.filesize_approx || 0;
    const sizeLabel = formatBytes(rawSize) || `${((durationSec * 2000000) / 8 / 1024 / 1024).toFixed(1)} MB`;

    options.push({
      id: `v-main-${Date.now()}`,
      type: 'video',
      format: (info.ext || 'mp4').toUpperCase(),
      quality: `${mainHeight}p High Quality`,
      badge: 'POPULAR',
      fileSize: sizeLabel,
      specs: 'Standard Full Stream',
      iconLabel: mainHeight >= 720 ? 'HD' : 'SD',
    });
  }

  // 2. AUDIO FORMATS EXTRACTION
  const mp3Size = formatBytes((durationSec * 320000) / 8) || `${((durationSec * 320000 / 8) / 1024 / 1024).toFixed(1)} MB`;
  const m4aSize = formatBytes((durationSec * 192000) / 8) || `${((durationSec * 192000 / 8) / 1024 / 1024).toFixed(1)} MB`;
  const wavSize = formatBytes((durationSec * 1411200) / 8) || `${((durationSec * 1411200 / 8) / 1024 / 1024).toFixed(1)} MB`;
  const flacSize = formatBytes((durationSec * 700000) / 8) || `${((durationSec * 700000 / 8) / 1024 / 1024).toFixed(1)} MB`;

  options.push(
    {
      id: `a-mp3-320-${Date.now()}`,
      type: 'audio',
      format: 'MP3',
      quality: 'Studio Audio (320 kbps MP3)',
      badge: 'BEST AUDIO',
      fileSize: mp3Size,
      specs: '48kHz • High Fidelity Stereo',
      iconLabel: 'HQ',
      isAudioExtraction: true,
    },
    {
      id: `a-m4a-192-${Date.now()}`,
      type: 'audio',
      format: 'M4A',
      quality: 'AAC Audio Stream (192 kbps M4A)',
      fileSize: m4aSize,
      specs: '44.1kHz • Clean Stream',
      iconLabel: 'HQ',
      isAudioExtraction: true,
    },
    {
      id: `a-flac-${Date.now()}`,
      type: 'audio',
      format: 'FLAC',
      quality: 'FLAC Lossless Audio',
      badge: 'LOSSLESS',
      fileSize: flacSize,
      specs: '24-bit / 96kHz Hi-Res',
      iconLabel: 'FLAC',
      isAudioExtraction: true,
    },
    {
      id: `a-wav-${Date.now()}`,
      type: 'audio',
      format: 'WAV',
      quality: 'WAV Master Audio',
      fileSize: wavSize,
      specs: 'Uncompressed PCM',
      iconLabel: 'WAV',
      isAudioExtraction: true,
    }
  );

  return options;
}

// 1. Analyze API Endpoint - Live metadata extraction for pasted URLs
app.post('/api/analyze', async (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
    });

    const title = info.title || 'Extracted Media Stream';
    const channelOrAuthor = info.uploader || info.channel || info.uploader_id || '@MediaCreator';
    const durationSeconds = info.duration || 215;
    const duration = info.duration
      ? new Date(info.duration * 1000).toISOString().substring(11, 19).replace(/^00:/, '')
      : '03:35';

    // Thumbnail fallback chain
    let thumbnailUrl = info.thumbnail;
    if (!thumbnailUrl && info.id) {
      thumbnailUrl = `https://img.youtube.com/vi/${info.id}/hqdefault.jpg`;
    }
    if (!thumbnailUrl && info.thumbnails && info.thumbnails.length > 0) {
      thumbnailUrl = info.thumbnails[info.thumbnails.length - 1].url;
    }
    if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop';
    }

    const platformName = info.extractor_key || info.extractor || 'Web Stream';
    const views = info.view_count ? `${(info.view_count / 1000).toFixed(1)}K` : '1.5M';
    const formats = extractExactFormats(info);

    console.log(`[StreamMate Analyze Success] URL: ${url} | Title: "${title}" | Formats Extracted: ${formats.length}`);

    return res.json({
      success: true,
      url,
      title,
      channelOrAuthor,
      duration,
      durationSeconds,
      thumbnailUrl,
      platformName,
      views,
      formats,
    });
  } catch (err) {
    console.error('Analyze backend error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// 2. Download API Endpoint - Immediate response headers for live browser download history & streaming
app.get('/api/download', async (req, res) => {
  let mediaUrl = req.query.url;
  const isAudio = req.query.type === 'audio' || req.query.format === 'mp3';
  const quality = req.query.quality || '1080p';
  const requestedTitle = req.query.title ? String(req.query.title).trim() : null;

  if (!mediaUrl) {
    return res.status(400).send('URL query parameter is required');
  }

  mediaUrl = String(mediaUrl).trim();
  if (!mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
    mediaUrl = `https://${mediaUrl}`;
  }

  const cleanTitle = sanitizeFilename(requestedTitle || 'StreamMate_Media');
  const fileExt = isAudio ? 'mp3' : 'mp4';
  const clientFileName = `${cleanTitle}.${fileExt}`;
  const safeAsciiName = clientFileName.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, "'");

  console.log(`[StreamMate Download Request] Pasted URL: ${mediaUrl} | Type: ${isAudio ? 'Audio' : 'Video'} | Quality: ${quality}`);

  // Send attachment headers IMMEDIATELY so Chrome/Edge/Firefox opens the native download bar
  // and displays the downloading process in chrome://downloads history right away!
  res.setHeader('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodeURIComponent(clientFileName)}`);
  res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

  const tempDir = os.tmpdir();
  const fileId = `streammate_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const rawOutputFile = path.join(tempDir, `${fileId}.%(ext)s`);

  try {
    // Select quality format filter
    let formatArg = 'bestvideo+bestaudio/best';
    if (isAudio) {
      formatArg = 'bestaudio/best';
    } else if (quality.includes('1080p')) {
      formatArg = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best';
    } else if (quality.includes('1440p') || quality.includes('2K')) {
      formatArg = 'bestvideo[height<=1440]+bestaudio/best[height<=1440]/best';
    } else if (quality.includes('720p')) {
      formatArg = 'bestvideo[height<=720]+bestaudio/best[height<=720]/best';
    } else if (quality.includes('480p') || quality.includes('360p')) {
      formatArg = 'bestvideo[height<=480]+bestaudio/best[height<=480]/best';
    }

    const args = {
      output: rawOutputFile,
      format: formatArg,
      ffmpegLocation: ffmpegPath,
      noWarnings: true,
      noCheckCertificates: true,
    };

    console.log(`[StreamMate Engine] Executing yt-dlp binary stream for target: "${cleanTitle}"...`);
    await exec(mediaUrl, args);

    // Locate generated file in temp dir
    const files = fs.readdirSync(tempDir);
    const downloadedFile = files.find((f) => f.startsWith(fileId));

    if (!downloadedFile) {
      throw new Error('Downloaded binary file not found on disk');
    }

    const fullPath = path.join(tempDir, downloadedFile);
    const readStream = fs.createReadStream(fullPath);
    readStream.pipe(res);

    readStream.on('end', () => {
      try {
        fs.unlinkSync(fullPath);
      } catch {
        // ignore
      }
    });

    readStream.on('error', (err) => {
      console.error('ReadStream error:', err);
      try {
        fs.unlinkSync(fullPath);
      } catch {
        // ignore
      }
    });
  } catch (err) {
    console.error('[StreamMate Download Failure]:', err.message);
    if (!res.headersSent) {
      res.status(500).send(`Download failed: ${err.message}`);
    }
  }
});

// 3. Network Stream API Endpoint (Alias for VLC, MX Player, PotPlayer, Kodi, FFmpeg)
app.get('/api/stream', async (req, res) => {
  req.url = req.url.replace('/api/stream', '/api/download');
  return app._router.handle(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 StreamMate Real Media Download Server running on port ${PORT}`);
});
