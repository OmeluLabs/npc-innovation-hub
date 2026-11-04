// src/pages/landing/HubIntroVideo.tsx
import React, { useState } from "react";
import { useHubVideo } from "../../hooks/useHubVideo";

const CLOUDINARY_VIDEO_PATH = "/video/upload/";
const VIDEO_EXTENSION_RE = /\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i;

/**
 * Cloudinary can generate a video thumbnail by swapping the delivery
 * extension for an image one — this only works for Cloudinary's own
 * `/video/upload/` delivery URLs, so anything else falls back to null
 * (the caller renders a static placeholder instead).
 */
export const getCloudinaryVideoThumbnail = (
  videoUrl: string,
): string | null => {
  if (!videoUrl.includes(CLOUDINARY_VIDEO_PATH)) return null;
  if (!VIDEO_EXTENSION_RE.test(videoUrl)) return null;
  return videoUrl.replace(
    VIDEO_EXTENSION_RE,
    (_match, _ext, query: string | undefined) => `.jpg${query || ""}`,
  );
};

const HubIntroVideo: React.FC = () => {
  const { video, loading } = useHubVideo();
  const [isPlaying, setIsPlaying] = useState(false);

  // Nothing uploaded yet is a normal state, not an error — render nothing.
  if (loading || !video) return null;

  const thumbnail = getCloudinaryVideoThumbnail(video.videoUrl);

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white via-surface-muted to-white">
      <div className="container mx-auto max-w-5xl text-center">
        {video.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {video.title}
          </h2>
        )}
        {video.description && (
          <p className="text-lg text-primary/80 max-w-3xl mx-auto mb-10">
            {video.description}
          </p>
        )}

        <div className="relative rounded-[24px] overflow-hidden shadow-xl aspect-video bg-primary">
          {isPlaying ? (
            <video
              src={video.videoUrl}
              controls
              preload="none"
              className="w-full h-full object-cover"
              data-testid="hub-intro-video"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play video${video.title ? `: ${video.title}` : ""}`}
              className="group relative block w-full h-full"
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 transition-transform group-hover:scale-105">
                  <svg
                    className="w-8 h-8 text-primary ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HubIntroVideo;
