"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLanguage } from "@/components/language/LanguageProvider";

type UserAccount = {
  _id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function UsersPage() {
  useAuthGuard();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/auth/users");
        const body = await response.json();
        if (!response.ok) {
          setError(body.error || "Unable to load accounts.");
          return;
        }
        setUsers(body.users || []);
      } catch (err) {
        setError("Unable to load accounts.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-10 dark:bg-[#141414]">
      <div className="mx-auto w-full max-w-4xl">
        <DashboardHeader />

        <div className="mt-8 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-zinc-950/95">
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Accounts</h1>
          <p className="mt-2 text-sm text-muted dark:text-white/60">
            All accounts stored in the database.
          </p>

          {loading ? (
            <div className="mt-6 text-sm text-ink dark:text-white">Loading accounts...</div>
          ) : error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="mt-6 text-sm text-muted dark:text-white/60">No accounts found.</div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-slate-200 px-5 py-4 font-semibold dark:border-white/10">
                <div>Name</div>
                <div>Email</div>
                <div>Created</div>
              </div>
              {users.map((user) => (
                <div key={user._id} className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-t border-slate-200 px-5 py-4 odd:bg-white odd:dark:bg-zinc-900 even:bg-slate-50 even:dark:bg-zinc-950 dark:border-white/10">
                  <div>{user.fullName}</div>
                  <div>{user.email}</div>
                  <div>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
