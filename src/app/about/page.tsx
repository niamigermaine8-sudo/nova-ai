import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-zinc-950 px-6 pb-24 pt-20 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent">
            ABOUT NOVA
          </p>
          <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
            A voice assistant built from scratch
          </h1>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-[15px] leading-relaxed text-white/70 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)] backdrop-blur">
          <p>
            Nova started as a simple question: what would it take to build
            something like Alexa or Siri, from the ground up, using nothing
            but the browser and a few well-chosen APIs?
          </p>
          <p>
            Most assistants hide their thinking behind a company&apos;s
            closed platform. Nova does the opposite. It uses the
            browser&apos;s own speech recognition to listen, Google&apos;s
            Gemini model to actually understand and reason about what you
            asked, and real actions — playing music, opening apps, setting
            reminders — instead of just replying with text.
          </p>
          <p>
            The goal isn&apos;t to replace Alexa. It&apos;s to prove that a
            genuinely capable, natural-sounding voice assistant can be built
            by one person, with modern tools, in a reasonable amount of time
            — and to make every part of how it works visible and
            understandable rather than hidden inside a black box.
          </p>
          <p>
            Nova is a work in progress. Voice recognition, response quality,
            and the actions it can take all keep improving as it grows.
          </p>
        </div>

        <div className="relative mt-14 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-opacity hover:bg-accent/90"
          >
            Get started
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20"
          >
            See how it works
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
