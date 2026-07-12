"use client";

import { Mic } from "lucide-react";
import type { VoiceState } from "@/hooks/useVoiceAssistant";

const waveHeights = [10, 20, 28, 16, 24];

export default function VoiceOrb({
  state,
  onClick,
}: {
  state: VoiceState;
  onClick: () => void;
}) {
  const active = state === "listening";

  return (
    <button
      onClick={onClick}
      aria-label="Talk to Nova"
      disabled={state === "thinking" || state === "speaking"}
      className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-accent transition-all duration-300 disabled:cursor-default ${
        active ? "scale-105 shadow-[0_0_0_14px_rgba(255,255,255,0.18)]" : ""
      }`}
    >
      <span className="absolute -inset-6 animate-ring1 rounded-full border border-black/10 dark:border-white/10" />
      <span className="absolute -inset-10 animate-ring2 rounded-full border border-black/5 dark:border-white/5" />

      <div className="flex flex-col items-center">
        {active ? (
          <span className="relative flex h-7 items-center gap-[3px]">
            {waveHeights.map((h, i) => (
              <span
                key={i}
                className="w-1 animate-wave rounded-full bg-white"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </span>
        ) : (
          <Mic className="relative h-9 w-9 text-white" strokeWidth={1.75} />
        )}
        <span className={`mt-2 text-xs font-medium text-white/90 ${active ? 'opacity-100' : 'opacity-0'}`}>
          {active ? 'Listening…' : ''}
        </span>
      </div>
    </button>
  );
}
