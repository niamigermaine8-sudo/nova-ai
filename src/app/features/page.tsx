import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
  MessageCircle,
  Zap,
  Hand,
  Music,
  Bell,
  Moon,
  Globe,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Speak naturally",
    description:
      "Nova understands full sentences and context, not just fixed commands. Ask the way you'd ask a person.",
  },
  {
    icon: Sparkles,
    title: "Powered by real AI",
    description:
      "Every question goes to Gemini, so answers are genuinely intelligent, not a list of canned replies.",
  },
  {
    icon: Zap,
    title: "Answers instantly",
    description:
      "Nova thinks fast and replies out loud right away, so conversations feel natural, not laggy.",
  },
  {
    icon: Music,
    title: "Plays music on request",
    description:
      "Say \"play\" and a song, and Nova finds and plays it immediately in a built-in player. No tab switching.",
  },
  {
    icon: Hand,
    title: "Works hands-free",
    description:
      "Say \"Hey Nova\" to start talking any time, or tap the mic. Type instead whenever you'd rather not talk.",
  },
  {
    icon: Bell,
    title: "Reminders and history",
    description:
      "Ask Nova to remember something, and revisit every past conversation from the History page.",
  },
  {
    icon: Moon,
    title: "Light or dark, your call",
    description:
      "Switch the whole dashboard between light and dark from Settings. Nova remembers your choice.",
  },
  {
    icon: Globe,
    title: "Built to grow",
    description:
      "Language, voice, and response style are all configurable in Settings, with more on the way.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-zinc-950 px-6 pb-24 pt-20 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent">
            EVERYTHING NOVA CAN DO
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Built to listen, think, and act
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Nova combines real speech recognition, a real AI model, and real
            actions — all in one voice-first assistant.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur"
              >
                <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                <p className="mt-4 text-[15px] font-semibold text-white">
                  {feature.title}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="relative mt-16 flex justify-center">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            Get started
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
