"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAuthenticated } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields to create your account.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await response.json();
      if (!response.ok) {
        toast.error(body.error || "Unable to create account.");
        return;
      }

      toast.success("Account created successfully. Redirecting to login...");
      router.push("/signin");
    } catch (error) {
      toast.error("Unable to create account. Please try again later.");
      console.error("Signup error", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-white sm:px-10">
      <Toaster richColors position="top-right" />
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            Nova
          </Link>
          <Link
            href="/signin"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </header>

        <main className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-300/70">
              Get started
            </p>
            <h1 className="text-4xl font-semibold text-white">
              Create your Nova account.
            </h1>
            <p className="text-sm leading-6 text-zinc-300">
              Join Nova and start controlling your assistant with your voice.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90" htmlFor="fullName">
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Noel Mbaraga"
                value={formData.fullName}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, fullName: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="noel@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pr-12"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, password: event.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="inline-flex items-start gap-3 text-sm text-zinc-300">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-blue-500" />
              <span>I agree to the terms of service and privacy policy</span>
            </label>

            <Button type="submit" className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500">
              Create account
            </Button>
          </form>

          <div className="relative my-6 text-center text-sm text-zinc-400">
            <span className="absolute left-0 top-1/2 h-px w-24 -translate-y-1/2 bg-white/10 sm:w-28" />
            <span className="relative bg-zinc-950 px-3">or</span>
            <span className="absolute right-0 top-1/2 h-px w-24 -translate-y-1/2 bg-white/10 sm:w-28" />
          </div>

          <div>
            <Button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600">G</span>
              Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-300">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-white transition hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
