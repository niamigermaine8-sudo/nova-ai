"use client";

import { useState } from "react";
import { Keyboard, ArrowUp } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VoiceOrb from "@/components/dashboard/VoiceOrb";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useMusicPlayer } from "@/components/music/MusicPlayerProvider";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardPage() {
  useAuthGuard();
  const music = useMusicPlayer();
  const { state, caption, startListening, submitText, interrupt } = useVoiceAssistant({
    onPlayMusic: (query) => music.playSong(query),
    onPauseMusic: () => {
      if (music.videoId && !music.isPaused) {
        music.pause();
        return true;
      }
      return false;
    },
    onResumeMusic: () => {
      if (music.videoId && music.isPaused) {
        music.resume();
      }
    },
  });
  const { t } = useLanguage();
  const [showTextInput, setShowTextInput] = useState(false);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitText(draft);
    setDraft("");
  }

  return (
    <main className="flex min-h-screen justify-center bg-white px-6 dark:bg-[#141414]">
      <div className="w-full max-w-2xl">
        <DashboardHeader />

        <div className="flex flex-col items-center justify-center gap-8 py-20">
          <VoiceOrb state={state} onClick={startListening} />
          <p className="max-w-sm text-center text-[15px] font-medium text-ink dark:text-white">
            {caption}
          </p>
          {(state === "thinking" || state === "speaking") && (
            <button
              onClick={interrupt}
              className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm text-white"
            >
              Stop
            </button>
          )}
        </div>

        <div className="pb-10 text-center">
          {showTextInput ? (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-xs items-center gap-2 rounded-full border border-black/10 bg-surface px-4 py-2 dark:border-white/10 dark:bg-white/5"
            >
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.dashboard.placeholder}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted dark:text-white dark:placeholder:text-white/40"
              />
              <button
                type="submit"
                aria-label={t.dashboard.send}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowTextInput(true)}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink dark:text-white/40 dark:hover:text-white/70"
            >
              <Keyboard className="h-4 w-4" />
              {t.dashboard.typeInstead}
            </button>
          )}
        </div>
      </div>

    </main>
  );
}
