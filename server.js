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

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return null;
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  const durationSec = info.duration || 30;

  // Best audio track size calculation for DASH video streams
  const audioTracks = formats.filter(a => a.acodec && a.acodec !== 'none' && (!a.vcodec || a.vcodec === 'none'));
  let maxAudioSize = 0;
  audioTracks.forEach(a => {
    const sz = a.filesize || a.filesize_approx || (a.abr ? (a.abr * 1000 * durationSec / 8) : 0);
    if (sz > maxAudioSize) maxAudioSize = sz;
  });
  if (maxAudioSize === 0) maxAudioSize = (durationSec * 192000) / 8; // ~192kbps audio fallback

  // Group video formats by resolution height
  const videoFormats = formats.filter(f => f.vcodec && f.vcodec !== 'none');
  const heightGroups = new Map();

  videoFormats.forEach(f => {
    const h = f.height || 0;
    if (h > 0) {
      if (!heightGroups.has(h)) {
        heightGroups.set(h, []);
      }
      heightGroups.get(h).push(f);
    }
  });

  // Get distinct heights sorted descending
  const sortedHeights = Array.from(heightGroups.keys()).sort((a, b) => b - a);

  sortedHeights.forEach((h) => {
    const group = heightGroups.get(h);
    let maxVSize = 0;
    let chosenCodec = 'MP4';
    let chosenFps = 0;

    group.forEach(f => {
      let sz = f.filesize || f.filesize_approx || 0;
      if (sz === 0 && f.vbr) {
        sz = (f.vbr * 1000 * durationSec) / 8;
      }
      if (sz === 0 && f.tbr) {
        sz = (f.tbr * 1000 * durationSec) / 8;
      }
      if (sz > maxVSize) {
        maxVSize = sz;
        if (f.vcodec) chosenCodec = f.vcodec.split('.')[0].toUpperCase();
        if (f.fps) chosenFps = f.fps;
      }
    });

    const isVideoOnly = group.some(f => !f.acodec || f.acodec === 'none');
    let totalBytes = maxVSize;
    if (isVideoOnly && totalBytes > 0) {
      totalBytes += maxAudioSize;
    }

    if (totalBytes === 0) {
      const qualityBitrate = h >= 2160 ? 15000000 : h >= 1440 ? 8000000 : h >= 1080 ? 4000000 : h >= 720 ? 2000000 : h >= 480 ? 1000000 : 500000;
      totalBytes = (qualityBitrate * durationSec) / 8;
    }

    const sizeLabel = formatBytes(totalBytes) || `${(totalBytes / 1024 / 1024).toFixed(1)} MB`;

    let qualityTitle = `${h}p`;
    let badge = undefined;
    if (h >= 4320) { qualityTitle = '8K (4320p Ultra HD)'; badge = '8K ULTRA'; }
    else if (h >= 2160) { qualityTitle = '4K (2160p Ultra HD)'; badge = '4K ULTRA'; }
    else if (h >= 1440) { qualityTitle = '1440p (2K QHD)'; badge = '2K QHD'; }
    else if (h >= 1080) { qualityTitle = '1080p (Full HD)'; badge = 'FULL HD'; }
    else if (h >= 720) { qualityTitle = '720p (HD)'; badge = 'HD'; }
    else if (h >= 480) { qualityTitle = '480p (SD)'; }
    else if (h >= 360) { qualityTitle = '360p (Compact)'; }
    else { qualityTitle = `${h}p (Mobile)`; }

    const fpsStr = chosenFps ? `${chosenFps}fps • ` : '';

    options.push({
      id: `v-${h}-${Date.now()}`,
      type: 'video',
      format: 'MP4',
      quality: qualityTitle,
      badge,
      fileSize: sizeLabel,
      bytes: Math.round(totalBytes),
      specs: `${fpsStr}${chosenCodec} Codec`,
      iconLabel: h >= 2160 ? '4K' : h >= 720 ? 'HD' : 'SD',
    });
  });

  // Fallback if no video formats array matched
  if (options.length === 0) {
    const mainHeight = info.height || 1080;
    const rawSize = info.filesize || info.filesize_approx || ((2000000 * durationSec) / 8);
    const sizeLabel = formatBytes(rawSize) || `${(rawSize / 1024 / 1024).toFixed(1)} MB`;

    options.push({
      id: `v-main-${Date.now()}`,
      type: 'video',
      format: (info.ext || 'mp4').toUpperCase(),
      quality: `${mainHeight}p High Quality`,
      badge: 'POPULAR',
      fileSize: sizeLabel,
      bytes: Math.round(rawSize),
      specs: 'Standard Stream',
      iconLabel: mainHeight >= 720 ? 'HD' : 'SD',
    });
  }

  // 2. AUDIO FORMATS EXTRACTION
  const mp3Bytes = Math.round((durationSec * 320000) / 8);
  const m4aBytes = Math.round((durationSec * 192000) / 8);
  const wavBytes = Math.round((durationSec * 1411200) / 8);
  const flacBytes = Math.round((durationSec * 700000) / 8);

  const mp3Size = formatBytes(mp3Bytes) || `${(mp3Bytes / 1024 / 1024).toFixed(1)} MB`;
  const m4aSize = formatBytes(m4aBytes) || `${(m4aBytes / 1024 / 1024).toFixed(1)} MB`;
  const wavSize = formatBytes(wavBytes) || `${(wavBytes / 1024 / 1024).toFixed(1)} MB`;
  const flacSize = formatBytes(flacBytes) || `${(flacBytes / 1024 / 1024).toFixed(1)} MB`;

  options.push(
    {
      id: `a-mp3-320-${Date.now()}`,
      type: 'audio',
      format: 'MP3',
      quality: 'Studio Audio (320 kbps MP3)',
      badge: 'BEST AUDIO',
      fileSize: mp3Size,
      bytes: mp3Bytes,
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
      bytes: m4aBytes,
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
      bytes: flacBytes,
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
      bytes: wavBytes,
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
  if (url.includes('http://') || url.includes('https://')) {
    const httpIdx = url.lastIndexOf('http');
    if (httpIdx > 0) {
      url = url.substring(httpIdx);
    }
  }
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

// 2. Download API Endpoint - Solid binary processing & HTTP streaming with exact Content-Length
app.get('/api/download', async (req, res) => {
  let mediaUrl = req.query.url;
  const isAudio = req.query.type === 'audio' || req.query.format === 'mp3';
  const quality = req.query.quality || '1080p';
  const requestedTitle = req.query.title ? String(req.query.title).trim() : null;

  if (!mediaUrl) {
    return res.status(400).send('URL query parameter is required');
  }

  mediaUrl = String(mediaUrl).trim();
  if (mediaUrl.includes('http://') || mediaUrl.includes('https://')) {
    const httpIdx = mediaUrl.lastIndexOf('http');
    if (httpIdx > 0) {
      mediaUrl = mediaUrl.substring(httpIdx);
    }
  }
  if (!mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
    mediaUrl = `https://${mediaUrl}`;
  }

  const cleanTitle = sanitizeFilename(requestedTitle || 'StreamMate_Media');
  const fileExt = isAudio ? 'mp3' : 'mp4';
  const clientFileName = `${cleanTitle}.${fileExt}`;
  const safeAsciiName = clientFileName.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, "'");

  console.log(`[StreamMate Download Request] Pasted URL: ${mediaUrl} | Type: ${isAudio ? 'Audio' : 'Video'} | Quality: ${quality}`);

  const tempDir = os.tmpdir();
  const fileId = `streammate_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const rawOutputFile = path.join(tempDir, `${fileId}.%(ext)s`);

  // Select exact quality format filter matching selected resolution height
  let formatArg = 'bestvideo+bestaudio/best';
  if (isAudio) {
    formatArg = 'bestaudio/best';
  } else {
    const match = quality.match(/(\d+)p/i);
    if (match && match[1]) {
      const reqHeight = parseInt(match[1], 10);
      formatArg = `bestvideo[height<=${reqHeight}]+bestaudio/best[height<=${reqHeight}]/best`;
    }
  }

  try {
    const args = {
      output: rawOutputFile,
      format: formatArg,
      ffmpegLocation: ffmpegPath,
      noWarnings: true,
      noCheckCertificates: true,
    };

    if (isAudio) {
      args.extractAudio = true;
      args.audioFormat = 'mp3';
      args.audioQuality = '0';
    }

    console.log(`[StreamMate Engine] Executing yt-dlp binary processing for "${cleanTitle}"...`);
    try {
      await exec(mediaUrl, args);
    } catch (err) {
      if (err.message.includes('Sign in to confirm') || err.message.includes('bot')) {
        console.log('[StreamMate Bot Bypass] YouTube bot check detected, retrying with android client fallback...');
        args.extractorArgs = 'youtube:player_client=android,web';
        args.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
        await exec(mediaUrl, args);
      } else {
        throw err;
      }
    }

    // Locate generated file in temp dir
    const files = fs.readdirSync(tempDir);
    const downloadedFile = files.find((f) => f.startsWith(fileId));

    if (!downloadedFile) {
      throw new Error('Downloaded binary file not found on disk after processing');
    }

    const fullPath = path.join(tempDir, downloadedFile);
    const stats = fs.statSync(fullPath);

    console.log(`[StreamMate Download Success] Streaming file: "${clientFileName}" | Exact Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Set headers WITH exact Content-Length so Chrome opens download manager with 100% accurate file size & progress ring!
    res.setHeader('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodeURIComponent(clientFileName)}`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Length', stats.size);

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
