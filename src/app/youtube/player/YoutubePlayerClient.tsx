"use client";

import { useSearchParams } from "next/navigation";

export default function YoutubePlayerClient() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const title = searchParams.get("title") || "Nova YouTube player";

  if (!videoId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="mb-4 text-xl font-semibold">Video unavailable</h1>
          <p className="text-sm text-zinc-300">No YouTube video was provided for playback.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-8">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">Nova Music Player</p>
          <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black sm:w-[80vw] lg:w-[60vw]">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1`}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  );
}
