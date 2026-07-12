"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language/LanguageProvider";
import { Clock, Settings, User, Mic } from "lucide-react";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/dashboard", label: t.nav.home, icon: Mic },
    { href: "/history", label: t.nav.history, icon: Clock },
    { href: "/settings", label: t.nav.settings, icon: Settings },
    { href: "/profile", label: t.nav.profile, icon: User },
  ];

  return (
    <div className="flex items-center justify-between py-8">
      <Link href="/dashboard" className="font-serif text-xl text-ink dark:text-white">
        Nova
      </Link>
      <div className="flex items-center gap-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                active
                  ? "border-accent text-accent"
                  : "border-black/10 text-ink hover:border-black/25 dark:border-white/10 dark:text-white dark:hover:border-white/25"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
