import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to try Nova out.",
    features: [
      "Voice recognition and text-to-speech",
      "AI-powered answers",
      "Play music by voice",
      "10 conversations a day",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "For everyday, unlimited use.",
    features: [
      "Everything in Free",
      "Unlimited conversations",
      "Faster AI responses",
      "Custom wake word",
      "Priority support",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Student",
    price: "$0",
    period: "with school email",
    description: "Free Pro access for students and educators.",
    features: [
      "Everything in Pro",
      "No card required",
      "Great for class projects",
    ],
    cta: "Verify your school",
    href: "/signup",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-zinc-950 px-6 pb-24 pt-20 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent">
            PRICING
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Simple pricing, no surprises
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
            Start for free. Upgrade whenever Nova becomes part of your daily
            routine.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl border p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur ${
                plan.highlighted
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-xs text-white/50">{plan.period}</span>
              </div>
              <p className="mt-2 text-[13px] text-white/60">{plan.description}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[13px] text-white/70"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition hover:opacity-90 ${
                  plan.highlighted
                    ? "bg-accent text-white"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
