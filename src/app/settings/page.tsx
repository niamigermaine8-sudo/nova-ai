"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/components/language/LanguageProvider";
import { languageOptions, type Language } from "@/lib/i18n";
import { Sun, Moon } from "lucide-react";

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
      <p className="mb-4 text-sm font-medium text-ink dark:text-white">
        {title}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted dark:text-white/60">{label}</span>
      {children}
    </div>
  );
}

const selectClass =
  "rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-ink outline-none dark:border-white/10 dark:bg-white/5 dark:text-white";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [voice, setVoice] = useState(() => {
    try {
      return window.localStorage.getItem("nova-voice") || "Nova";
    } catch {
      return "Nova";
    }
  });
  const [responseLength, setResponseLength] = useState(() => {
    try {
      return window.localStorage.getItem("nova-response-length") || t.balanced;
    } catch {
      return t.balanced;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("nova-voice", voice);
    } catch {}
  }, [voice]);

  useEffect(() => {
    try {
      window.localStorage.setItem("nova-response-length", responseLength);
    } catch {}
  }, [responseLength]);

  return (
    <main className="min-h-screen bg-white px-6 dark:bg-[#141414]">
      <div className="mx-auto w-full max-w-2xl">
        <DashboardHeader />

        <h1 className="mb-6 font-serif text-2xl text-ink dark:text-white">
          {t.settingsTitle}
        </h1>

        <div className="grid gap-4 pb-16 sm:grid-cols-2">
          <SettingsCard title={t.appearance}>
            <Row label={t.theme}>
              <div className="flex items-center gap-1 rounded-full border border-black/10 p-1 dark:border-white/10">
                <button
                  onClick={() => setTheme("light")}
                  aria-label={t.lightLabel}
                  aria-pressed={theme === "light"}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    theme === "light"
                      ? "bg-accent text-white"
                      : "text-muted dark:text-white/50"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  aria-label={t.darkLabel}
                  aria-pressed={theme === "dark"}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    theme === "dark"
                      ? "bg-accent text-white"
                      : "text-muted dark:text-white/50"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
              </div>
            </Row>
          </SettingsCard>

          <SettingsCard title={t.general}>
            <Row label={t.language}>
              <select
                className={selectClass}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Row>
          </SettingsCard>

          <SettingsCard title={t.voice}>
            <Row label={t.voiceLabel}>
              <select
                className={selectClass}
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
              >
                <option>Nova</option>
                <option>Aria</option>
                <option>Rio</option>
              </select>
            </Row>
          </SettingsCard>

          <SettingsCard title={t.ai}>
            <Row label={t.responseLength}>
              <select
                className={selectClass}
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value)}
              >
                <option>{t.concise}</option>
                <option>{t.balanced}</option>
                <option>{t.detailed}</option>
              </select>
            </Row>
          </SettingsCard>
        </div>
      </div>
    </main>
  );
}
