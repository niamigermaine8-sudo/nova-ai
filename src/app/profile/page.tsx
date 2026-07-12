"use client";

import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLanguage } from "@/components/language/LanguageProvider";
import { LogOut } from "lucide-react";
import { clearAuthenticated } from "@/lib/auth";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();

  useAuthGuard();

  const handleLogout = () => {
    clearAuthenticated();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-white px-6 dark:bg-[#141414]">
      <div className="mx-auto w-full max-w-2xl">
        <DashboardHeader />

        <h1 className="mb-6 font-serif text-2xl text-ink dark:text-white">
          {t.dashboard.profileTitle}
        </h1>

        <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-serif text-xl text-white">
              N
            </div>
            <div>
              <p className="text-base font-medium text-ink dark:text-white">
                Noel Mbarga
              </p>
              <p className="text-sm text-muted dark:text-white/50">
                noel@example.com
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.fullName}
              </label>
              <input
                defaultValue="Noel Mbarga"
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.email}
              </label>
              <input
                defaultValue="noel@example.com"
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.school}
              </label>
              <input
                defaultValue=""
                placeholder="Your school"
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 rounded-md border border-black/10 px-4 py-2.5 text-sm text-ink transition-colors hover:border-black/25 dark:border-white/10 dark:text-white dark:hover:border-white/25"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.logOut}
          </button>
        </div>
      </div>
    </main>
  );
}
