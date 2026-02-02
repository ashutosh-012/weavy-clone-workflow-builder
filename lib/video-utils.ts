export interface FrameExtractionResult {
  frameUrl: string;
  actualTimestamp: number;
  videoDuration: number;
  warning?: string;
}

export function extractFrameFromVideo(videoUrl: string, timestamp: number): Promise<FrameExtractionResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const videoDuration = video.duration;
      let actualTimestamp = timestamp;
      let warning: string | undefined;

      if (timestamp < 0) {
        actualTimestamp = 0;
        warning = `Timestamp ${timestamp}s is negative. Using 0s instead.`;
      } else if (timestamp > videoDuration) {
        actualTimestamp = videoDuration - 0.1;
        warning = `Timestamp ${timestamp}s exceeds video duration (${videoDuration.toFixed(2)}s). Using last frame.`;
      }

      video.currentTime = actualTimestamp;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const frameDataUrl = canvas.toDataURL('image/png');
      const videoDuration = video.duration;
      const actualTimestamp = video.currentTime;
      
      let warning: string | undefined;
      if (timestamp > videoDuration) {
        warning = `Timestamp ${timestamp}s exceeds video duration (${videoDuration.toFixed(2)}s). Extracted last frame.`;
      } else if (timestamp < 0) {
        warning = `Timestamp ${timestamp}s is negative. Extracted first frame.`;
      }
      
      video.pause();
      video.src = '';
      video.load();
      
      resolve({
        frameUrl: frameDataUrl,
        actualTimestamp,
        videoDuration,
        warning,
      });
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = videoUrl;
    video.load();
  });
}