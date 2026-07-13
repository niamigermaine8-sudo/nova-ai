/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const parseISODuration = (iso: string | undefined) => {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const hours = parseInt(m[1] || "0", 10);
  const minutes = parseInt(m[2] || "0", 10);
  const seconds = parseInt(m[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim();
  const relatedToVideoId = url.searchParams.get("relatedToVideoId")?.trim();
  const hasApiKey = !!YOUTUBE_API_KEY;

  if (!query && !relatedToVideoId) {
    return NextResponse.json(
      { error: "Missing query or relatedToVideoId parameter." },
      { status: 400 }
    );
  }

  const searchVideo = async (searchQuery: string, filterMusic = true) => {
    const searchParams = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: "5",
      q: searchQuery,
      key: YOUTUBE_API_KEY,
      order: "relevance",
    });

    if (filterMusic) {
      searchParams.set("videoEmbeddable", "true");
      searchParams.set("videoSyndicated", "true");
      searchParams.set("videoCategoryId", "10");
    } else {
      searchParams.set("videoEmbeddable", "true");
      searchParams.set("videoSyndicated", "true");
    }

    if (!hasApiKey) {
      return parseYouTubeSearchHtml(searchQuery);
    }

    const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`);
    const rawText = await searchResponse.text();
    if (!searchResponse.ok) {
      try {
        const json = JSON.parse(rawText);
        return { error: json.error?.message || rawText || "YouTube API request failed." };
      } catch {
        return { error: rawText || "YouTube API request failed." };
      }
    }

    const searchData = JSON.parse(rawText);
    const videoIds = (searchData.items || [])
      .map((item: any) => item?.id?.videoId)
      .filter(Boolean);

    if (!videoIds.length) {
      return { error: "No playable video found." };
    }

    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "snippet,status,contentDetails");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsText = await detailsResponse.text();
    if (!detailsResponse.ok) {
      try {
        const json = JSON.parse(detailsText);
        return { error: json.error?.message || detailsText || "YouTube API request failed." };
      } catch {
        return { error: detailsText || "YouTube API request failed." };
      }
    }

    const detailsData = JSON.parse(detailsText);
    const playable = (detailsData.items || []).find((item: any) => {
      const status = item?.status;
      const details = item?.contentDetails;
      if (!status?.embeddable || status?.privacyStatus !== "public" || status?.uploadStatus !== "processed") {
        return false;
      }
      if (details?.regionRestriction) {
        return false;
      }
      return true;
    });

    if (!playable) {
      return { error: "No playable embeddable video available." };
    }

    return {
      videoId: playable.id,
      title: playable.snippet?.title || searchQuery,
      durationSeconds: parseISODuration(playable.contentDetails?.duration),
    };
  };

  const fetchRelated = async (videoId: string) => {
    if (!hasApiKey) {
      return parseYouTubeSearchHtml("related music");
    }

    const relatedParams = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: "5",
      relatedToVideoId: videoId,
      key: YOUTUBE_API_KEY,
      order: "relevance",
    });
    relatedParams.set("videoEmbeddable", "true");
    relatedParams.set("videoSyndicated", "true");

    const relatedResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?${relatedParams.toString()}`);
    const rawText = await relatedResponse.text();
    if (!relatedResponse.ok) {
      try {
        const json = JSON.parse(rawText);
        return { error: json.error?.message || rawText || "YouTube API request failed." };
      } catch {
        return { error: rawText || "YouTube API request failed." };
      }
    }

    const searchData = JSON.parse(rawText);
    const videoIds = (searchData.items || [])
      .map((item: any) => item?.id?.videoId)
      .filter(Boolean);

    if (!videoIds.length) {
      return { error: "No related videos found." };
    }

    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "snippet,status,contentDetails");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsText = await detailsResponse.text();
    if (!detailsResponse.ok) {
      try {
        const json = JSON.parse(detailsText);
        return { error: json.error?.message || detailsText || "YouTube API request failed." };
      } catch {
        return { error: detailsText || "YouTube API request failed." };
      }
    }

    const detailsData = JSON.parse(detailsText);
    const playable = (detailsData.items || []).find((item: any) => {
      const status = item?.status;
      const details = item?.contentDetails;
      if (!status?.embeddable || status?.privacyStatus !== "public" || status?.uploadStatus !== "processed") {
        return false;
      }
      if (details?.regionRestriction) {
        return false;
      }
      return true;
    });

    if (!playable) {
      return { error: "No playable related video available." };
    }

    return {
      videoId: playable.id,
      title: playable.snippet?.title || "Related music",
      durationSeconds: parseISODuration(playable.contentDetails?.duration),
    };
  };

  const parseYouTubeSearchHtml = async (searchQuery: string) => {
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}&hl=en&gl=US`;
    const response = await fetch(youtubeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return { error: `YouTube search page request failed (${response.status})` };
    }

    const html = await response.text();
    const match = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});/) || html.match(/window\["ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/);
    if (!match) {
      return { error: "Unable to parse YouTube search results." };
    }

    let initialData;
    try {
      initialData = JSON.parse(match[1]);
    } catch {
      return { error: "Unable to parse YouTube search JSON." };
    }

    const findVideo = (value: any): any => {
      if (!value || typeof value !== "object") return null;
      if (Array.isArray(value)) {
        for (const item of value) {
          const found = findVideo(item);
          if (found) return found;
        }
      } else {
        if (value.videoRenderer && value.videoRenderer.videoId) {
          return value.videoRenderer;
        }
        for (const key of Object.keys(value)) {
          const found = findVideo(value[key]);
          if (found) return found;
        }
      }
      return null;
    };

    const videoRenderer = findVideo(initialData);
    if (!videoRenderer) {
      return { error: "No video result found in YouTube search." };
    }

    const titleText = videoRenderer.title?.runs?.map((run: any) => run.text).join("") || searchQuery;
    return {
      videoId: videoRenderer.videoId,
      title: titleText,
    };
  };

  let result;
  if (relatedToVideoId) {
    result = await fetchRelated(relatedToVideoId);
    if (result?.error) {
      result = await searchVideo("related music", false);
    }
  } else if (query) {
    result = await searchVideo(query, true);
    if (result?.error) {
      result = await searchVideo(query, false);
    }

    if (!result || result.error) {
      result = await parseYouTubeSearchHtml(query);
    }
  }

  if (!result || result.error) {
    return NextResponse.json(
      { error: result?.error || "No YouTube video found for this query." },
      { status: 404 }
    );
  }

  const durationSeconds = result && typeof result === "object" && "durationSeconds" in result ? (result as any).durationSeconds : null;

  return NextResponse.json({
    videoId: result.videoId,
    title: result.title,
    durationSeconds: durationSeconds || null,
  });
}
