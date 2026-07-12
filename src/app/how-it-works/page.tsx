import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { Mic, Brain, Volume2, Zap } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "You speak",
    description:
      "Tap the mic or say \"Hey Nova.\" Your browser's built-in speech recognition transcribes what you say, in real time, right there on the page.",
  },
  {
    icon: Brain,
    title: "Nova understands",
    description:
      "Your words are sent securely to Google's Gemini AI model, which reads the request and figures out what you actually need.",
  },
  {
    icon: Zap,
    title: "Nova takes action",
    description:
      "Asking a question gets you a real answer. Saying \"play\" and a song searches YouTube and starts playing it immediately, right in the app.",
  },
  {
    icon: Volume2,
    title: "Nova replies out loud",
    description:
      "The response is spoken back to you using your browser's text-to-speech, so the whole exchange feels like a real conversation.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-zinc-950 px-6 pb-24 pt-20 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent">
            HOW IT WORKS
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            From voice to answer, in four steps
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
            No hidden black box. Here's exactly what happens every time you
            talk to Nova.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-2xl space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="w-px flex-1 bg-white/10" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-xs text-white/40">Step {i + 1}</p>
                  <p className="mt-1 text-base font-semibold text-white">{step.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-14 flex justify-center">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            Try it yourself
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
