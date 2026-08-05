"use client";

import Link from "next/link";
import { useState } from "react";

const WORKFLOW_STEPS = [
  {
    number: "01",
    label: "Ingestion",
    title: "Multi-format file upload",
    text: "Upload audio or video files directly. The ingestion pipeline supports standard media containers including MP3, WAV, MP4, and MKV with automatic format normalisation.",
  },
  {
    number: "02",
    label: "Transcription",
    title: "Speech-to-text stitching",
    text: "Process raw audio through high-speed speech-to-text engines. Stitched offset mapping aligns every word to absolute timestamps.",
  },
  {
    number: "03",
    label: "Analysis",
    title: "Semantic hook detection",
    text: "Scan transcripts for narrative elements. The engine flags structural clips based on emotional variance, key metrics, and cliffhanger structures.",
  },
  {
    number: "04",
    label: "Export",
    title: "Automated media cutting",
    text: "Select candidates and render portrait cuts with auto-formatted captions, target hashtags, and platform-specific dimensions.",
  },
];

const PREVIEW_CLIPS = [
  {
    id: "clip-1",
    title: "AGI Timeline Analysis",
    caption: "The timeline for artificial general intelligence is accelerating. Are enterprise teams prepared for the shift? 🤖 #artificialintelligence #futureofwork #tech",
    start: "12:04",
    end: "12:41",
    duration: "37s",
    hook_type: "Controversial Take",
    platforms: ["TikTok", "Reels", "Shorts"],
    score: 95,
  },
  {
    id: "clip-2",
    title: "Scaling Revenue Models",
    caption: "The playbook we executed to scale from zero to $10M ARR. Key growth channels explained. 📈 #startups #growth #saas",
    start: "35:20",
    end: "35:52",
    duration: "32s",
    hook_type: "Shocking Stat",
    platforms: ["TikTok", "Shorts"],
    score: 91,
  },
  {
    id: "clip-3",
    title: "Talent Acquisition Frameworks",
    caption: "Resumes don't tell the whole story. Here is the evaluation criteria we use to filter top talent. ❌ #recruiting #management #business",
    start: "52:10",
    end: "52:45",
    duration: "35s",
    hook_type: "Actionable Insight",
    platforms: ["TikTok", "Reels"],
    score: 88,
  },
];

const FAQS = [
  {
    q: "How does the hook detection engine evaluate clips?",
    a: "ClipForge uses semantic analysis to parse the context of the transcript. Unlike basic keyword counters, it maps structural markers—like data declarations, transitions, and questions—to evaluate the narrative flow and rank clips by engagement indicators.",
  },
  {
    q: "Which file formats are supported?",
    a: "We support standard audio and video formats, including MP3, WAV, MP4, MOV, and MKV. Video uploads are separated into dedicated audio channels for transcription and source video assets for clipping.",
  },
  {
    q: "Is there an episode duration limit?",
    a: "The system is architected to parse long-form content. Whether it is a 10-minute interview or a 3-hour panel discussion, the processing pipeline segmentally transcribes and compiles the output cleanly.",
  },
  {
    q: "What export formats are supported?",
    a: "Clips are rendered in vertical 9:16 layout formats optimized for standard social video players. Each clip package includes ready-to-copy metadata and text formatting tailored for TikTok, YouTube Shorts, and Instagram Reels.",
  },
];

export default function LandingPage() {
  const [selectedClip, setSelectedClip] = useState(PREVIEW_CLIPS[0]);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className="mesh-bg min-h-screen text-ink overflow-x-hidden">
      {/* Header */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-line/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void">
            CF
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Clip<span className="text-lime">Forge</span>
          </span>
        </div>
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/pricing" className="text-ink-dim hover:text-ink transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-ink-dim hover:text-ink transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-lime text-void font-bold px-4 py-2 rounded-md hover:bg-lime/90 transition-all duration-300 shadow-[0_0_15px_rgba(212,255,63,0.15)]"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-28 text-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#16161D_1px,transparent_1px),linear-gradient(to_bottom,#16161D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20 opacity-30 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs mb-8 text-ink-dim animate-slide-up">
          <span className="flex h-2 w-2 rounded-full bg-lime" />
          <span className="font-mono tracking-wide">Automated Video Extraction Pipeline</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl leading-[1.08] mb-6 font-bold tracking-tight max-w-4xl mx-auto animate-slide-up">
          Extract high-performing shorts from{" "}
          <span className="gradient-text font-extrabold relative">
            long-form episodes
            <span className="absolute bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-lime/40 to-violet/40 rounded-full blur-[1px] -z-10" />
          </span>.
        </h1>

        <p className="text-lg md:text-xl text-ink-dim mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
          ClipForge transcribes your episodes, evaluates semantic peaks to detect high-relevance hooks, and generates styled vertical clips ready for social distribution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 animate-slide-up">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-lime text-void font-bold px-8 py-4 rounded-md text-base hover:bg-lime/90 transition-all duration-300 shadow-[0_0_20px_rgba(212,255,63,0.15)] transform hover:-translate-y-0.5"
          >
            Start Free Onboarding
          </Link>
          <a
            href="#preview"
            className="w-full sm:w-auto bg-surface border border-line text-ink font-semibold px-8 py-4 rounded-md text-base hover:bg-surface-raised hover:border-lime transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>View Workspace Demo</span>
            <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Dashboard Preview - Static, Polished showcase */}
        <section id="preview" className="max-w-5xl mx-auto bg-surface border border-line rounded-xl shadow-[0_20px_50px_rgba(11,11,15,0.8)] overflow-hidden text-left p-6 md:p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet/5 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/5 blur-[100px] -z-10 rounded-full" />

          {/* Panel Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-line pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-violet font-semibold uppercase tracking-wider bg-violet-bg px-2 py-0.5 rounded border border-violet/30">
                  WORKSPACE VIEWER
                </span>
                <p className="font-mono text-xs text-ink-dim">EP047 · 68:14</p>
              </div>
              <h2 className="font-display text-xl font-bold mt-1 text-ink">
                Scaling Startups & The AI Paradigm
              </h2>
            </div>
            <span className="hook-badge text-lime bg-lime/10 border-lime">
              Analysis Completed
            </span>
          </div>

          {/* Waveform Visualization */}
          <div className="waveform-track mb-8 relative">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="waveform-bar bg-line"
                style={{ height: `${20 + ((i * 47) % 75)}%` }}
              />
            ))}

            {/* Pinned highlights representing clips */}
            <div className="waveform-clip-region bg-lime/15 border-lime" style={{ left: "12%", width: "16%" }} />
            <div className="waveform-clip-region bg-line border-line/40" style={{ left: "48%", width: "12%" }} />
            <div className="waveform-clip-region bg-line border-line/40" style={{ left: "72%", width: "14%" }} />
          </div>

          {/* Preview grid */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left side selector */}
            <div className="md:col-span-5 space-y-3">
              <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider mb-1">
                Extracted Hook candidates
              </p>
              {PREVIEW_CLIPS.map((clip) => {
                const isSelected = selectedClip.id === clip.id;
                return (
                  <button
                    key={clip.id}
                    onClick={() => setSelectedClip(clip)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex flex-col gap-2 ${
                      isSelected
                        ? "bg-surface-raised border-lime shadow-md"
                        : "bg-surface-raised/40 border-line hover:border-line/80 hover:bg-surface-raised/60"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-xs text-ink-dim">
                        {clip.start} → {clip.end} ({clip.duration})
                      </span>
                      <span className="font-mono text-[10px] font-bold text-lime bg-lime/10 px-2 py-0.5 rounded">
                        Score: {clip.score}%
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-sm text-ink">
                      {clip.title}
                    </h4>
                  </button>
                );
              })}
            </div>

            {/* Right side details */}
            <div className="md:col-span-7 bg-surface-raised border border-line rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <span className="hook-badge text-violet bg-violet-bg border-violet">
                    {selectedClip.hook_type}
                  </span>
                  <div className="flex gap-1.5">
                    {selectedClip.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="font-mono text-[9px] text-ink-dim border border-line rounded px-1.5 py-0.5"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold mb-2">{selectedClip.title}</h3>

                <div className="bg-void border border-line rounded p-3 mb-4">
                  <p className="text-xs text-ink-dim leading-relaxed pr-8">{selectedClip.caption}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs text-ink-dim font-mono">
                  Aspect ratio: 9:16 portrait
                </span>
                <Link
                  href="/signup"
                  className="bg-lime text-void text-xs font-bold px-4 py-2 rounded hover:bg-lime/90 transition-all"
                >
                  Generate Video Cut
                </Link>
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Social Proof */}
      <section className="bg-surface/50 border-y border-line/30 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-dim/60 mb-6">
            Supported Distribution Channels
          </p>
          <div className="grid grid-cols-3 gap-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity max-w-xl mx-auto">
            <span className="font-display font-bold text-sm tracking-wider text-ink-dim hover:text-ink cursor-default">
              YOUTUBE SHORTS
            </span>
            <span className="font-display font-bold text-sm tracking-wider text-ink-dim hover:text-ink cursor-default">
              TIKTOK VIDEO
            </span>
            <span className="font-display font-bold text-sm tracking-wider text-ink-dim hover:text-ink cursor-default">
              INSTAGRAM REELS
            </span>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Platform Architecture</h2>
          <p className="text-ink-dim max-w-xl mx-auto">
            A linear progression model designed to extract high-value short clips in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.label}
              className="bg-surface border border-line rounded-lg p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <span className="font-mono text-xs text-lime block mb-4">{step.number}</span>
                <h3 className="font-display font-bold text-base mb-2">{step.label}</h3>
                <p className="text-xs text-ink-dim leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="py-20 bg-surface/20 border-t border-line/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = !!faqOpen[idx];
              return (
                <div
                  key={idx}
                  className="bg-surface-raised border border-line/50 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-display font-semibold text-ink hover:text-lime transition-colors"
                  >
                    <span>{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-ink-dim transition-transform duration-300 ${
                        isOpen ? "transform rotate-180 text-lime" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[200px] border-t border-line/50 p-5 bg-surface/30" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm text-ink-dim leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-tr from-surface to-surface-raised border border-line rounded-2xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(212,255,63,0.1),transparent_70%)]" />
          <h2 className="font-display text-3xl md:text-4xl mb-4 font-bold tracking-tight">
            Simplify video repurposing.
          </h2>
          <p className="text-ink-dim mb-8 max-w-md mx-auto text-sm md:text-base">
            Configure your workspace, upload content, and receive clip candidates in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-lime text-void font-bold px-6 py-3 rounded-md hover:bg-lime/90 transition-all duration-300 shadow-[0_0_15px_rgba(212,255,63,0.2)]"
            >
              Create Account
            </Link>
            <Link
              href="/pricing"
              className="border border-line hover:border-lime/30 text-ink font-semibold px-6 py-3 rounded-md transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/30 bg-void py-12 text-ink-dim text-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void text-xs">
                CF
              </div>
              <span className="font-display text-base font-bold text-ink tracking-tight">
                Clip<span className="text-lime">Forge</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Automated workflow engine for video transcription, semantic segmentation, and social export formatting.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#preview" className="hover:text-lime transition-colors">Workspace Demo</a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-lime transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-ink-dim">Groq API</span>
              </li>
              <li>
                <span className="text-ink-dim">Cerebras Systems</span>
              </li>
              <li>
                <span className="text-ink-dim">ffmpeg Engine</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Developer Tools</h4>
            <p className="text-xs mb-3">Read implementation and API deployment docs.</p>
            <div className="flex gap-2">
              <a
                href="https://github.com/Mufaqham-69/Clipforge"
                target="_blank"
                rel="noreferrer"
                className="bg-line hover:bg-line/80 text-ink text-xs font-semibold px-4 py-1.5 rounded transition-colors block text-center"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-line/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 ClipForge Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
