"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import MusicPlayer from "@/components/dashboard/MusicPlayer";

type MusicPlayerContextValue = {
  videoId: string | null;
  title: string | null;
  isPaused: boolean;
  playSong: (query: string) => Promise<string>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoIdRef = useRef<string | null>(null);
  const failCountRef = useRef<Record<string, number>>({});

  const sendCommand = useCallback((command: string, args: unknown[] = []) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: command, args }),
      "*"
    );
  }, []);

  const pause = useCallback(() => {
    sendCommand("pauseVideo", []);
    setIsPaused(true);
  }, [sendCommand]);

  const resume = useCallback(() => {
    sendCommand("playVideo", []);
    setIsPaused(false);
  }, [sendCommand]);

  const stop = useCallback(() => {
    setVideoId(null);
    setTitle(null);
    setIsPaused(false);
  }, []);

  const playRelatedSong = useCallback(async (previousVideoId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/youtube?relatedToVideoId=${encodeURIComponent(previousVideoId)}`);
      const body = await response.json().catch(() => null);
      if (!response.ok || !body || body.error) {
        console.warn("Related music request failed", body?.error || response.status);
        return;
      }
      const data = body;
      const id = data.videoId;
      if (!id || typeof id !== "string") {
        return;
      }
      setVideoId(id);
      videoIdRef.current = id;
      setTitle(data.title || "Related music");
      // reset fail count for new video
      failCountRef.current[id] = 0;
      setIsPaused(false);
    } catch (error) {
      console.error("Related music error", error);
    }
  }, []);

  const playSong = useCallback(async (query: string): Promise<string> => {
    try {
      const response = await fetch("/api/youtube?query=" + encodeURIComponent(query));
      const body = await response.json().catch(() => null);

      if (!response.ok || !body || body.error) {
        const errorMessage = body?.error || `YouTube search failed (${response?.status ?? "unknown"})`;
        console.warn("Music player request failed", errorMessage);
        setVideoId(null);
        setTitle(query);
        setIsPaused(false);
        return `Now playing ${query} from YouTube search.`;
      }

      const data = body;
      const id = data.videoId;
      if (!id || typeof id !== "string") {
        console.warn("Music player returned invalid video ID", data);
        setVideoId(null);
        setTitle(query);
        setIsPaused(false);
        return `Now playing ${query} from YouTube search.`;
      }

      setVideoId(id);
      videoIdRef.current = id;
      setTitle(data.title || query);
      // reset fail counts when starting a new song
      failCountRef.current = {};
      failCountRef.current[id] = 0;
      setIsPaused(false);
      return `Now playing ${data.title || query}.`;
    } catch (error) {
      console.error("Music player error", error);
      setVideoId(null);
      setTitle(query);
      setIsPaused(false);
      return `Now playing ${query} from YouTube search.`;
    }
  }, []);

  const value = useMemo(
    () => ({
      videoId,
      title,
      isPaused,
      playSong,
      stop,
      pause,
      resume,
    }),
    [videoId, title, isPaused, playSong, stop, pause, resume]
  );

  const handleVideoError = useCallback((failedVideoId: string | null, error?: unknown) => {
    if (!failedVideoId) return;
    const prev = failCountRef.current[failedVideoId] || 0;
    const next = prev + 1;
    failCountRef.current[failedVideoId] = next;
    console.warn("Video error for", failedVideoId, "attempt", next, error);
    if (next >= 3) {
      console.warn("Too many failures for", failedVideoId, "stopping playback.");
      stop();
      return;
    }
    playRelatedSong(failedVideoId);
  }, [playRelatedSong, stop]);

  const handleVideoEnd = useCallback((endedVideoId: string | null) => {
    if (!endedVideoId) return;
    // try related first
    playRelatedSong(endedVideoId);
    // after a short delay, if videoId hasn't changed, fallback to a generic related search
    const currentId = endedVideoId;
    setTimeout(() => {
      if (videoIdRef.current === currentId) {
        console.warn("Related attempt didn't change video, falling back to search for related music");
        playSong("related music").catch(() => {});
      }
    }, 1500);
  }, [playRelatedSong, playSong]);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <MusicPlayer
        videoId={videoId}
        title={title}
        onClose={stop}
        onVideoEnded={() => handleVideoEnd(videoId)}
        onVideoError={handleVideoError}
        iframeRef={iframeRef}
      />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
