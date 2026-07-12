import { Suspense } from "react";
import YoutubePlayerClient from "./YoutubePlayerClient";

export default function YoutubePlayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white">Loading player...</div>}>
      <YoutubePlayerClient />
    </Suspense>
  );
}
