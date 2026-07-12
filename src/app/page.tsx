export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_45%)]" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between py-6">
          <span className="text-lg font-semibold tracking-tight text-white">Nova</span>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 sm:flex">
            <a className="transition hover:text-white" href="/features">
              Features
            </a>
            <a className="transition hover:text-white" href="/about">
              About
            </a>
            <a className="transition hover:text-white" href="/pricing">
              Pricing
            </a>
            <a className="transition hover:text-white" href="/signin">
              Log in
            </a>
          </nav>
          <a
            className="hidden rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_60px_-40px_rgba(59,130,246,0.8)] transition hover:bg-blue-500 sm:inline-flex"
            href="/signup"
          >
            Get started
          </a>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-300/70">
            Voice-first, from the ground up
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl">
            A voice that actually listens
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Nova understands what you need, answers out loud, and gets things done. No typing required.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <a
              id="get-started"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
              href="/signup"
            >
              Get started
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              href="/how-it-works"
            >
              See how it works
            </a>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.75)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_0_8px_rgba(59,130,246,0.12)]" />
              Tap the orb to speak
            </div>
            <div className="grid w-[18rem] grid-cols-8 gap-2 sm:w-[22rem]">
              {Array.from({ length: 8 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 rounded-full bg-blue-500/80 animate-pulse"
                  style={{ animationDelay: `${index * 80}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
