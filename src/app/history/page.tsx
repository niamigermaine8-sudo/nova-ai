"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLanguage } from "@/components/language/LanguageProvider";
import { ChevronDown, Trash2, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";


type SavedEntry = {
  question: string;
  reply: string;
  language?: string;
  time: string; // ISO
};

const STORAGE_KEY = "nova-history";

export default function HistoryPage() {
  useAuthGuard();
  const { t } = useLanguage();
  const getInitialEntries = () => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const list: SavedEntry[] = raw ? JSON.parse(raw) : [];
        return list;
      }
    } catch (e) {
      console.warn("Failed to load history", e);
    }
    return [] as SavedEntry[];
  };

  const [entries, setEntries] = useState<SavedEntry[]>(getInitialEntries);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const groups = useMemo(() => {
    const today: SavedEntry[] = [];
    const yesterday: SavedEntry[] = [];
    const earlier: SavedEntry[] = [];
    const now = new Date();

    for (const e of entries) {
      const d = new Date(e.time);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) today.push(e);
      else if (diffDays === 1) yesterday.push(e);
      else earlier.push(e);
    }

    return [
      { label: t.dashboard.today, entries: today },
      { label: t.dashboard.yesterday, entries: yesterday },
      { label: t.dashboard.lastWeek, entries: earlier },
    ].filter((group) => group.entries.length > 0);
  }, [entries, t]);

  function formatTime(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  }

  function deleteEntry(entry: SavedEntry) {
    const updated = entries.filter((item) => item.time !== entry.time || item.question !== entry.question);
    setEntries(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function toggleGroup(label: string) {
    setExpandedGroup((current) => (current === label ? null : label));
    setExpandedEntry(null);
  }

  function toggleEntry(entryKey: string) {
    setExpandedEntry((current) => (current === entryKey ? null : entryKey));
  }

  return (
    <main className="min-h-screen bg-white px-6 dark:bg-[#141414]">
      <div className="mx-auto w-full max-w-2xl">
        <DashboardHeader />

        <h1 className="mb-6 font-serif text-2xl text-ink dark:text-white">
          {t.dashboard.historyTitle}
        </h1>

        <div className="space-y-4 pb-16">
          {groups.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-surface px-4 py-6 text-center text-sm text-muted dark:border-white/10 dark:bg-white/5">
              {t.dashboard.noHistory}
            </div>
          ) : (
            groups.map((group) => {
              const isGroupOpen = expandedGroup === group.label;
              return (
                <div key={group.label} className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-4 text-left text-sm font-medium text-ink transition hover:bg-surface/80 dark:bg-white/5 dark:text-white"
                    onClick={() => toggleGroup(group.label)}
                  >
                    <span>{group.label} ({group.entries.length})</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isGroupOpen ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  {isGroupOpen && (
                    <div className="divide-y divide-black/10 dark:divide-white/10">
                      {group.entries.map((entry, index) => {
                        const entryKey = `${entry.time}-${index}`;
                        const isEntryOpen = expandedEntry === entryKey;
                        return (
                          <div key={entryKey} className="bg-white px-4 py-3 dark:bg-[#141414]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink dark:text-white">{entry.question}</p>
                                <p className="mt-1 text-xs text-muted dark:text-white/50">{formatTime(entry.time)}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-full border border-black/10 bg-surface px-3 py-1 text-xs text-ink transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                  onClick={() => toggleEntry(entryKey)}
                                >
                                  {isEntryOpen ? t.dashboard.hideAnswer : t.dashboard.showAnswer}
                                </button>
                                <button
                                  type="button"
                                  className="rounded-full border border-black/10 bg-surface px-3 py-1 text-xs text-ink transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                  onClick={() => {
                                    try {
                                      navigator.clipboard.writeText(entry.question);
                                    } catch {}
                                  }}
                                  aria-label={t.dashboard.copyQuestion}
                                >
                                  <Copy className="mr-1 inline-block h-3.5 w-3.5" />
                                  {t.dashboard.copyQuestion}
                                </button>
                                <button
                                  type="button"
                                  className="rounded-full border border-black/10 bg-surface px-3 py-1 text-xs text-ink transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                  onClick={() => {
                                    try {
                                      navigator.clipboard.writeText(entry.reply);
                                    } catch {}
                                  }}
                                  aria-label={t.dashboard.copyAnswer}
                                >
                                  <Copy className="mr-1 inline-block h-3.5 w-3.5" />
                                  {t.dashboard.copyAnswer}
                                </button>
                                <button
                                  type="button"
                                  className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700 transition hover:bg-red-100 dark:border-red-600/40 dark:bg-red-500/10 dark:text-red-200"
                                  onClick={() => deleteEntry(entry)}
                                  aria-label={t.dashboard.deleteEntry}
                                >
                                  <Trash2 className="mr-1 inline-block h-3.5 w-3.5" />
                                  {t.dashboard.deleteEntry}
                                </button>
                              </div>
                            </div>
                            {isEntryOpen && (
                              <div className="mt-3 rounded-xl border border-black/10 bg-surface p-4 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-white">
                                {entry.reply}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}


