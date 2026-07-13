"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLanguage } from "@/components/language/LanguageProvider";
import { LogOut } from "lucide-react";
import { clearAuthenticated, getAuthenticatedUser, setAuthenticated } from "@/lib/auth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Toaster, toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ fullName: "", email: "", school: "" });
  const [isSaving, setIsSaving] = useState(false);

  useAuthGuard();

  useEffect(() => {
    const user = getAuthenticatedUser();
    if (user) {
      setFormData({ fullName: user.fullName, email: user.email, school: user.school || "" });
    }
  }, []);

  const handleLogout = () => {
    clearAuthenticated();
    router.push("/");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }

    setIsSaving(true);
    try {
      const user = getAuthenticatedUser();
      if (!user) {
        toast.error("Unable to locate authenticated user.");
        return;
      }

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: user.email,
          fullName: formData.fullName,
          email: formData.email,
          school: formData.school,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        toast.error(body.error || "Unable to save profile.");
      } else {
        setAuthenticated({ fullName: body.user.fullName, email: body.user.email, school: body.user.school });
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Profile update error", error);
      toast.error("Unable to save profile. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "N";

  return (
    <main className="min-h-screen bg-white px-6 dark:bg-[#141414]">
      <div className="mx-auto w-full max-w-2xl">
        <Toaster richColors position="top-right" />
        <DashboardHeader />

        <h1 className="mb-6 font-serif text-2xl text-ink dark:text-white">
          {t.dashboard.profileTitle}
        </h1>

        <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 p-6 dark:border-white/10">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-serif text-xl text-white">
              {initials}
            </div>
            <div>
              <p className="text-base font-medium text-ink dark:text-white">
                {formData.fullName || "Your name"}
              </p>
              <p className="text-sm text-muted dark:text-white/50">
                {formData.email || "your.email@example.com"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.fullName}
              </label>
              <input
                value={formData.fullName}
                onChange={(e) => setFormData((current) => ({ ...current, fullName: e.target.value }))}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.email}
              </label>
              <input
                value={formData.email}
                onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted dark:text-white/50">
                {t.dashboard.school}
              </label>
              <input
                value={formData.school}
                onChange={(e) => setFormData((current) => ({ ...current, school: e.target.value }))}
                placeholder="Your school"
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2.5 text-sm text-ink transition-colors hover:border-black/25 dark:border-white/10 dark:text-white dark:hover:border-white/25"
            >
              <LogOut className="h-4 w-4" />
              {t.dashboard.logOut}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
