import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/95 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>Nova — voice-first AI built for the browser.</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          <Link href="/features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link href="/pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white">
            How it works
          </Link>
        </div>
      </div>
    </footer>
  );
}
