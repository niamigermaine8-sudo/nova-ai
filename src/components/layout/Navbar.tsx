"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Nova
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
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
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/signin"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            Get started
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-white/5 p-2 text-white/90"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl border-t border-white/5 bg-zinc-950/95 px-6 py-6">
            <nav className="flex flex-col gap-3">
              <Link href="/features" onClick={() => setOpen(false)} className="block py-2 text-white">
                Features
              </Link>
              <Link href="/about" onClick={() => setOpen(false)} className="block py-2 text-white">
                About
              </Link>
              <Link href="/pricing" onClick={() => setOpen(false)} className="block py-2 text-white">
                Pricing
              </Link>
              <Link href="/how-it-works" onClick={() => setOpen(false)} className="block py-2 text-white">
                How it works
              </Link>
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <Link href="/signin" onClick={() => setOpen(false)} className="block rounded-md border border-white/10 bg-white/5 px-4 py-2 text-center text-sm text-white">
                Log in
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block rounded-md bg-accent px-4 py-2 text-center text-sm font-semibold text-white">
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
