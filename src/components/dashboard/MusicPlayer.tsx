"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function MusicPlayer({
  videoId,
  title,
  onClose,
  onVideoEnded,
  onVideoError,
  iframeRef,
}: {
  videoId: string | null;
  title: string | null;
  onClose: () => void;
  onVideoEnded: () => void;
  onVideoError?: (failedVideoId: string | null, error?: unknown) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const onVideoEndedRef = useRef(onVideoEnded);
  const onVideoErrorRef = useRef(onVideoError);
  const videoIdRef = useRef(videoId);

  useEffect(() => {
    // keep refs up to date when callbacks or videoId change
    onVideoEndedRef.current = onVideoEnded;
    onVideoErrorRef.current = onVideoError;
    videoIdRef.current = videoId;
  }, [onVideoEnded, onVideoError, videoId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com") && !event.origin.includes("youtube-nocookie.com")) {
        return;
      }

      let payload: unknown = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      const p = payload as Record<string, unknown>;
      if (p?.event === "onStateChange" && (p.info as number) === 0) {
        try {
          onVideoEndedRef.current?.();
        } catch {
          // ignore
        }
      }

      if (p?.event === "onError") {
        try {
          onVideoErrorRef.current?.(videoIdRef.current || null, payload);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!videoId) {
    return null;
  }

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&enablejsapi=1`;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.24em] text-blue-300/80">Now playing</p>
          <p className="truncate text-sm font-semibold text-white">{title || "Nova Music"}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close player"
          className="rounded-full p-2 text-white transition hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="aspect-video w-full bg-black">
        <iframe
          ref={iframeRef}
          className="h-full w-full"
          src={src}
          title={title || "Nova music player"}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
