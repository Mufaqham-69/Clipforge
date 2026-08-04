"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { access_token } = await api.login(email, password);
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid md:grid-cols-12 min-h-screen text-ink bg-void overflow-hidden">
      {/* Left panel - Branding and Testimonials */}
      <div className="hidden md:flex md:col-span-5 relative bg-surface border-r border-line p-12 flex-col justify-between overflow-hidden">
        {/* Glowing background circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-violet/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-lime/5 blur-[100px] pointer-events-none" />
        
        {/* Top brand indicator */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void">
            CF
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Clip<span className="text-lime">Forge</span>
          </span>
        </Link>

        {/* Dynamic citation slider */}
        <div className="relative z-10 space-y-6">
          <span className="text-lime font-mono text-xs uppercase tracking-wider block">
            ★ Creator Spotlight
          </span>
          <p className="text-xl text-ink leading-relaxed font-display font-medium italic">
            "ClipForge helped us turn our 2-hour long-form episodes into 12 highly engaging short clips. Our views on TikTok went from 2,000 to over 450,000 in less than a month."
          </p>
          <div>
            <h4 className="font-bold text-ink text-sm">Sarah Jenkins</h4>
            <p className="text-xs text-ink-dim">Executive Producer, The Tech Blueprint Podcast</p>
          </div>
        </div>

        {/* Feature quick checkmarks list */}
        <div className="relative z-10 space-y-3.5 border-t border-line/60 pt-8">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-ink-dim font-medium">99.4% Accurate Multi-Chunk Transcription</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-ink-dim font-medium">Cerebras-powered Virality Scoring System</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-ink-dim font-medium">Instant 1-Click ffmpeg Local Rendering</span>
          </div>
        </div>
      </div>

      {/* Right panel - Form login */}
      <div className="col-span-12 md:col-span-7 flex flex-col justify-center px-6 sm:px-16 md:px-24 py-12 relative">
        {/* Subtle grid pattern behind form on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#16161D_1px,transparent_1px),linear-gradient(to_bottom,#16161D_1px,transparent_1px)] bg-[size:3rem_3rem] -z-10 opacity-10 pointer-events-none md:hidden" />
        
        <div className="max-w-md w-full mx-auto space-y-8 animate-slide-up">
          <div>
            {/* Logo display on mobile */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void">
                CF
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Clip<span className="text-lime">Forge</span>
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-ink-dim mt-2">
              Log in to manage your shows and generate new storyboards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="text-ink-dim mb-1.5 block font-medium">Email Address</span>
                <input
                  required
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-line rounded-lg px-4 py-3 bg-surface focus:border-lime focus:ring-1 focus:ring-lime outline-none transition-all placeholder:text-ink-dim/40 text-sm"
                />
              </label>

              <label className="block text-sm relative">
                <span className="text-ink-dim mb-1.5 block font-medium">Password</span>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-line rounded-lg pl-4 pr-12 py-3 bg-surface focus:border-lime focus:ring-1 focus:ring-lime outline-none transition-all placeholder:text-ink-dim/40 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            </div>

            {error && (
              <div className="bg-coral-bg/30 border border-coral/30 text-coral text-xs p-3.5 rounded-lg flex items-center gap-2 animate-pulse">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={busy}
              className="w-full bg-lime text-void font-bold px-5 py-3.5 rounded-lg hover:bg-lime/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,255,63,0.15)] hover:shadow-[0_0_20px_rgba(212,255,63,0.3)] text-sm"
            >
              {busy ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-void" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging in…</span>
                </>
              ) : (
                <span>Log in to Dashboard</span>
              )}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs border-t border-line/60 pt-6">
            <span className="text-ink-dim">
              New to ClipForge?{" "}
              <Link href="/signup" className="text-lime font-semibold hover:underline">
                Create an account
              </Link>
            </span>
            <Link href="/" className="text-ink-dim hover:text-ink transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
