import Link from "next/link";

const STEPS = [
  { label: "Upload", text: "Drop the full episode in — audio or video, any length. We chunk it automatically." },
  { label: "Transcribe", text: "Every word gets timestamped, fast enough that a 90-minute episode doesn't mean a coffee break." },
  { label: "Find the hooks", text: "The agent reads the whole transcript for shocking stats, emotional beats, and punchlines — not just keyword spotting." },
  { label: "Cut & caption", text: "Each candidate comes with exact timestamps, a hook-first caption, hashtags, and a one-click render." },
];

export default function LandingPage() {
  return (
    <main>
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display text-xl font-bold">Clip<span className="text-lime">Forge</span></span>
        <div className="flex gap-6 items-center text-sm">
          <Link href="/pricing" className="text-ink-dim hover:text-ink">Pricing</Link>
          <Link href="/login" className="text-ink-dim hover:text-ink">Log in</Link>
          <Link href="/signup" className="bg-lime text-void font-semibold px-4 py-2 rounded-sm hover:bg-lime-dim transition-colors">
            Start free
          </Link>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-5xl leading-[1.1] mb-6 font-bold">
            Stop scrubbing transcripts<br />for the <span className="text-lime">viral three minutes.</span>
          </h1>
          <p className="text-lg text-ink-dim mb-8 max-w-md">
            ClipForge reads the full episode, finds the moments that actually work as
            short-form clips, and hands you exact timestamps, captions, and cut files —
            not just a transcript with your name on it.
          </p>
          <div className="flex gap-4 items-center">
            <Link href="/signup" className="bg-lime text-void font-semibold px-5 py-3 rounded-sm hover:bg-lime-dim transition-colors">
              Upload your first episode free
            </Link>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-ink-dim">EP047 · 68:14</p>
            <span className="hook-badge text-lime bg-lime/10 border-lime">Ready</span>
          </div>
          <div className="waveform-track mb-4">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="waveform-bar" style={{ height: `${20 + ((i * 37) % 80)}%` }} />
            ))}
            <div className="waveform-clip-region" style={{ left: "18%", width: "9%" }} />
            <div className="waveform-clip-region" style={{ left: "52%", width: "6%" }} />
            <div className="waveform-clip-region" style={{ left: "76%", width: "11%" }} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="hook-badge text-coral bg-coral-bg border-coral">shocking stat</span>
              <span className="font-mono text-xs text-ink-dim">12:04 → 12:41</span>
            </div>
            <div className="flex justify-between">
              <span className="hook-badge text-violet bg-violet-bg border-violet">cliffhanger</span>
              <span className="font-mono text-xs text-ink-dim">35:20 → 35:52</span>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-surface py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.label}>
              <p className="font-mono text-xs text-lime mb-2">0{i + 1}</p>
              <h3 className="font-display text-lg mb-2 font-semibold">{step.label}</h3>
              <p className="text-sm text-ink-dim">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl mb-4 font-bold">Built for creators, not enterprise media teams.</h2>
        <p className="text-ink-dim mb-8">One flat rate. No per-clip fees, no seat limits, no annual contract.</p>
        <Link href="/pricing" className="bg-lime text-void font-semibold px-5 py-3 rounded-sm inline-block hover:bg-lime-dim transition-colors">
          See pricing
        </Link>
      </section>
    </main>
  );
}
