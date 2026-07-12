"use client";

import { useCallback, useState } from "react";

export function useMusicPlayer() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const playSong = useCallback(async (query: string): Promise<string> => {
    try {
      const response = await fetch("/api/youtube?query=" + encodeURIComponent(query));
      const body = await response.json().catch(() => null);

      if (!response.ok || !body || body.error) {
        const fallbackQuery = query;
        setVideoId(null);
        setSearchQuery(fallbackQuery);
        setTitle(query);

        const errorMessage = body?.error || `YouTube search failed (${response.status})`;
        console.warn("Music API fallback to embedded search", errorMessage);
        return `Now playing ${query} from YouTube search.`;
      }

      const data = body;
      const id = data.videoId;
      if (!id || typeof id !== "string") {
        throw new Error("Invalid video ID");
      }

      setVideoId(id);
      setSearchQuery(null);
      setTitle(data.title || query);
      return `Now playing ${data.title || query}.`;
    } catch (error) {
      console.warn("Music player error, using search embed fallback", error);
      setVideoId(null);
      setSearchQuery(query);
      setTitle(query);
      return `Now playing ${query} from YouTube search.`;
    }
  }, []);

  const stop = useCallback(() => {
    setVideoId(null);
    setSearchQuery(null);
    setTitle(null);
  }, []);

  return {
    videoId,
    searchQuery,
    title,
    playSong,
    stop,
  };
}
