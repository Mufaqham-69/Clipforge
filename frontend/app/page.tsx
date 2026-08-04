"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STEPS_CONTENT = [
  {
    number: "01",
    label: "Upload",
    title: "Drop in your media files in seconds",
    text: "Drop any video or audio file — MP3, WAV, MP4, MKV. There are no size limits, and we handle the encoding automatically.",
    badge: "Fast Uploads",
  },
  {
    number: "02",
    label: "Transcribe",
    title: "Stitched multi-chunk transcription",
    text: "Groq's Whisper Large model processes your episode in seconds. We stitch the timestamps together so every word is perfectly synced.",
    badge: "99% Accuracy",
  },
  {
    number: "03",
    label: "Find the hooks",
    title: "Deep semantic analysis, not keywords",
    text: "Our agent reads the full transcript to find high-virality hooks like cliffhangers, shocking stats, and controversial takes.",
    badge: "AI Agent",
  },
  {
    number: "04",
    label: "Cut & caption",
    title: "Render social-ready cuts instantly",
    text: "Each candidate comes with ready-to-use portrait captions, trendy hashtags, and a 1-click ffmpeg render.",
    badge: "1-Click Render",
  },
];

const MOCK_CLIPS = [
  {
    id: "clip-1",
    title: "The AI singularity is closer than you think",
    caption: "The timeline for AGI just got cut in half. Are we ready for what's coming next? 🤖🔥 #future #ai #singularity #tech",
    start: "12:04",
    end: "12:41",
    startSec: 724,
    endSec: 761,
    hook_type: "controversial_take",
    virality: "High-virality cliffhanger. Creator directly challenges common assumptions about AGI timelines, forcing comments and debate.",
    platforms: ["TikTok", "Reels", "Shorts"],
    score: 95,
  },
  {
    id: "clip-2",
    title: "How we scaled to $10M ARR in 8 months",
    caption: "The exact 3-step playbook we used to scale our startup at lightning speed. Save this for later! 📈💼 #startup #founder #marketing",
    start: "35:20",
    end: "35:52",
    startSec: 2120,
    endSec: 2152,
    hook_type: "shocking_stat",
    virality: "Shocking business statistic. Retains viewers immediately by naming the exact $10M revenue figure and promising a step-by-step layout.",
    platforms: ["TikTok", "Shorts"],
    score: 91,
  },
  {
    id: "clip-3",
    title: "The secret to hiring absolute killers",
    caption: "Stop looking at resumes. Here is the single interview question that filters out 99% of average candidates. ❌🧠 #hiring #leadership #jobs",
    start: "52:10",
    end: "52:45",
    startSec: 3130,
    endSec: 3165,
    hook_type: "actionable_insight",
    virality: "Highly actionable management insight. Focuses on a major frustration (hiring) and provides an immediate, usable interview technique.",
    platforms: ["TikTok", "Reels"],
    score: 88,
  },
];

const FAQS = [
  {
    q: "How does ClipForge find the best moments?",
    a: "ClipForge uses an advanced AI agent powered by Cerebras Qwen 235B. Unlike basic keyword search tools, it analyzes the entire semantic flow of the episode to detect structural elements like emotional beats, cliffhangers, shocking data points, and humor.",
  },
  {
    q: "What video and audio formats are supported?",
    a: "We support almost all popular formats including MP3, WAV, MP4, MOV, and MKV. Your uploaded video is automatically parsed, and we extract both high-quality audio for transcription and high-resolution video frames for cutting.",
  },
  {
    q: "Is there a limit on how long my episodes can be?",
    a: "No! ClipForge is built to handle massive episodes. Whether it's a quick 15-minute interview or a 3-hour long-form podcast, our backend automatically splits, processes, and stitches the transcript together without breaking a sweat.",
  },
  {
    q: "What platforms are the clips formatted for?",
    a: "Clips are optimized for portrait orientation formats (9:16), making them ready for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn video posts. We even format captions and generate specific hashtags for each platform.",
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeClip, setActiveClip] = useState(MOCK_CLIPS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [renderState, setRenderState] = useState<Record<string, string>>({});
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  // Auto-rotate steps every 6 seconds if not manually clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % STEPS_CONTENT.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeClip.caption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRender = (id: string) => {
    setRenderState((prev) => ({ ...prev, [id]: "rendering" }));
    setTimeout(() => {
      setRenderState((prev) => ({ ...prev, [id]: "ready" }));
    }, 3000);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className="mesh-bg min-h-screen text-ink overflow-x-hidden">
      {/* Navbar */}
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
            className="relative group overflow-hidden bg-lime text-void font-bold px-4 py-2 rounded-md hover:bg-lime/90 transition-all duration-300 shadow-[0_0_15px_rgba(212,255,63,0.2)] hover:shadow-[0_0_25px_rgba(212,255,63,0.4)]"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-28 text-center relative">
        {/* Decorative Grid Overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#16161D_1px,transparent_1px),linear-gradient(to_bottom,#16161D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20 opacity-30 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs mb-8 text-ink-dim animate-slide-up">
          <span className="flex h-2 w-2 rounded-full bg-lime animate-pulse" />
          <span className="font-mono tracking-wide">AI-Powered Repurposing Agent v2.0</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl leading-[1.08] mb-6 font-bold tracking-tight max-w-4xl mx-auto animate-slide-up">
          Stop scrubbing transcripts for the{" "}
          <span className="gradient-text animate-pulse-slow font-extrabold relative">
            viral three minutes
            <span className="absolute bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-lime/40 to-violet/40 rounded-full blur-[1px] -z-10" />
          </span>.
        </h1>

        <p className="text-lg md:text-xl text-ink-dim mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
          ClipForge reads the full episode, finds the exact moments that actually work as short-form clips, and outputs a ranked storyboard with high-converting captions, viral reasoning, and one-click cut renders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 animate-slide-up">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-lime text-void font-bold px-8 py-4 rounded-md text-base hover:bg-lime/90 transition-all duration-300 shadow-[0_0_20px_rgba(212,255,63,0.3)] hover:shadow-[0_0_30px_rgba(212,255,63,0.5)] transform hover:-translate-y-0.5"
          >
            Upload your first episode free
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto bg-surface border border-line text-ink font-semibold px-8 py-4 rounded-md text-base hover:bg-surface-raised hover:border-lime transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Interactive Demo</span>
            <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Interactive Dashboard Mockup */}
        <section id="demo" className="max-w-5xl mx-auto bg-surface border border-line rounded-xl shadow-[0_20px_50px_rgba(11,11,15,0.8)] overflow-hidden text-left p-6 md:p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet/5 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/5 blur-[100px] -z-10 rounded-full" />

          {/* Mockup Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-line pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-violet font-semibold uppercase tracking-wider bg-violet-bg px-2 py-0.5 rounded border border-violet/30">
                  DEMO RUN
                </span>
                <p className="font-mono text-xs text-ink-dim">EP047 · 68:14</p>
              </div>
              <h2 className="font-display text-xl font-bold mt-1 text-ink">
                Scaling Startups & The AI Paradigm
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 bg-line hover:bg-line/80 text-ink text-xs font-mono font-semibold px-4 py-2 rounded-md transition-colors"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-lime fill-current" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="4" height="16" />
                      <rect x="16" y="4" width="4" height="16" />
                    </svg>
                    <span>PAUSE SIMULATION</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-lime fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>PLAY AUDIO MATCH</span>
                  </>
                )}
              </button>
              <span className="hook-badge text-lime bg-lime/10 border-lime animate-pulse">
                Ready to cut
              </span>
            </div>
          </div>

          {/* Interactive Waveform Track */}
          <div className="waveform-track mb-8 relative">
            {/* Deterministic mock wave bars */}
            {Array.from({ length: 90 }).map((_, i) => {
              const height = 20 + ((i * 47) % 75);
              return (
                <div
                  key={i}
                  className={`waveform-bar ${
                    isPlaying ? "bg-lime/30" : "bg-line"
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}

            {/* Playhead simulation overlay */}
            <div
              className="waveform-playhead"
              style={{
                left: `${
                  activeClip.id === "clip-1"
                    ? "18%"
                    : activeClip.id === "clip-2"
                    ? "52%"
                    : "76%"
                }`,
              }}
            />

            {/* Interactive Regions overlay */}
            <div
              className={`waveform-clip-region ${
                activeClip.id === "clip-1" ? "bg-lime/30 border-lime" : ""
              }`}
              style={{ left: "12%", width: "16%" }}
              onClick={() => {
                setActiveClip(MOCK_CLIPS[0]);
                setIsPlaying(true);
              }}
              title="Clip 1: Controversial Take"
            />
            <div
              className={`waveform-clip-region ${
                activeClip.id === "clip-2" ? "bg-lime/30 border-lime" : ""
              }`}
              style={{ left: "48%", width: "12%" }}
              onClick={() => {
                setActiveClip(MOCK_CLIPS[1]);
                setIsPlaying(true);
              }}
              title="Clip 2: Shocking Stat"
            />
            <div
              className={`waveform-clip-region ${
                activeClip.id === "clip-3" ? "bg-lime/30 border-lime" : ""
              }`}
              style={{ left: "72%", width: "14%" }}
              onClick={() => {
                setActiveClip(MOCK_CLIPS[2]);
                setIsPlaying(true);
              }}
              title="Clip 3: Actionable Insight"
            />
          </div>

          {/* Workspace Layout Grid */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column: Clips Selector */}
            <div className="md:col-span-5 space-y-3">
              <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider mb-1">
                AI Detected Storyboard Clips ({MOCK_CLIPS.length})
              </p>
              {MOCK_CLIPS.map((clip) => {
                const isSelected = activeClip.id === clip.id;
                return (
                  <button
                    key={clip.id}
                    onClick={() => {
                      setActiveClip(clip);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex flex-col gap-2 ${
                      isSelected
                        ? "bg-surface-raised border-lime shadow-[0_0_15px_rgba(212,255,63,0.05)]"
                        : "bg-surface-raised/40 border-line hover:border-line/80 hover:bg-surface-raised/60"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-xs text-ink-dim">
                        {clip.start} → {clip.end}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-lime bg-lime/10 px-2 py-0.5 rounded">
                        Score: {clip.score}
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-sm text-ink group-hover:text-lime">
                      {clip.title}
                    </h4>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Dynamic Clip Detail Viewer */}
            <div className="md:col-span-7 bg-surface-raised border border-line rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <span
                    className={`hook-badge ${
                      activeClip.hook_type === "shocking_stat"
                        ? "text-coral bg-coral-bg border-coral"
                        : activeClip.hook_type === "controversial_take"
                        ? "text-coral bg-coral-bg border-coral"
                        : "text-violet bg-violet-bg border-violet"
                    }`}
                  >
                    {activeClip.hook_type.replace(/_/g, " ")}
                  </span>
                  <div className="flex gap-1.5">
                    {activeClip.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="font-mono text-[9px] text-ink-dim border border-line rounded px-1.5 py-0.5"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold mb-2">{activeClip.title}</h3>

                {/* Caption display box */}
                <div className="bg-void border border-line rounded p-3 mb-4 relative group">
                  <p className="text-xs text-ink-dim leading-relaxed pr-8">{activeClip.caption}</p>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 text-ink-dim hover:text-lime transition-colors p-1.5 bg-surface rounded"
                    title="Copy caption"
                  >
                    {isCopied ? (
                      <svg className="w-3.5 h-3.5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* AI Reasoning */}
                <div className="text-xs text-ink-dim mb-6 bg-surface p-3 rounded border-l-2 border-lime">
                  <span className="font-semibold text-ink block mb-0.5">AI Virality Insight:</span>
                  {activeClip.virality}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs text-ink-dim">
                  Resolution: <strong className="text-ink">9:16 vertical</strong>
                </span>

                {renderState[activeClip.id] === "ready" ? (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="bg-lime text-void text-xs font-bold px-4 py-2 rounded hover:bg-lime/90 transition-all duration-300"
                  >
                    Download clip (.mp4)
                  </a>
                ) : renderState[activeClip.id] === "rendering" ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-lime" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs text-ink-dim font-mono">Rendering ffmpeg cut…</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRender(activeClip.id)}
                    className="border border-line hover:border-lime hover:bg-lime/5 text-ink text-xs font-semibold px-4 py-2 rounded transition-all duration-300"
                  >
                    Cut this clip
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Podcast Logos Grid / Social Proof */}
      <section className="bg-surface/50 border-y border-line/30 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-dim/60 mb-6">
            Trusted by creators from the world's top podcasts
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity">
            <span className="font-display font-bold text-lg text-ink-dim hover:text-ink transition-colors cursor-default">
              THE JOE ROGAN EXP
            </span>
            <span className="font-display font-bold text-lg text-ink-dim hover:text-ink transition-colors cursor-default">
              LEX FRIDMAN POD
            </span>
            <span className="font-display font-bold text-lg text-ink-dim hover:text-ink transition-colors cursor-default">
              DIARY OF A CEO
            </span>
            <span className="font-display font-bold text-lg text-ink-dim hover:text-ink transition-colors cursor-default">
              HUBERMAN LAB
            </span>
            <span className="font-display font-bold text-lg text-ink-dim hover:text-ink transition-colors cursor-default">
              MY FIRST MILLION
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Tabs: How it Works */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Built to automate the boring stuff.</h2>
          <p className="text-ink-dim max-w-xl mx-auto">
            From raw audio uploads to ready-to-schedule social short video cuts, our autonomous agent handles the steps.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Tabs Selector Column */}
          <div className="md:col-span-5 space-y-3">
            {STEPS_CONTENT.map((step, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={step.label}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-5 rounded-lg border transition-all duration-300 flex items-start gap-4 ${
                    isActive
                      ? "bg-surface-raised border-lime shadow-md"
                      : "bg-surface/30 border-line/40 hover:border-line hover:bg-surface/50"
                  }`}
                >
                  <span className={`font-mono text-sm ${isActive ? "text-lime" : "text-ink-dim"}`}>
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-base">{step.label}</h3>
                    <p className="text-xs text-ink-dim mt-1.5 leading-relaxed">
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Column */}
          <div className="md:col-span-7 bg-surface border border-line rounded-xl p-8 relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 blur-[80px]" />
            <div>
              <span className="font-mono text-[10px] font-bold tracking-wider text-lime uppercase bg-lime/10 border border-lime/30 px-3 py-1 rounded-full inline-block mb-6">
                {STEPS_CONTENT[activeTab].badge}
              </span>
              <h3 className="font-display text-2xl font-bold mb-4">
                {STEPS_CONTENT[activeTab].title}
              </h3>
              <p className="text-ink-dim leading-relaxed text-sm md:text-base">
                {STEPS_CONTENT[activeTab].text}
              </p>
            </div>

            <div className="border-t border-line/60 pt-6 mt-8 flex justify-between items-center">
              <span className="text-xs text-ink-dim font-mono">
                Step {activeTab + 1} of {STEPS_CONTENT.length}
              </span>
              <Link href="/signup" className="text-sm font-semibold text-lime hover:text-lime-dim transition-colors flex items-center gap-1">
                <span>Start today</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
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

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-tr from-surface to-surface-raised border border-line rounded-2xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(212,255,63,0.1),transparent_70%)]" />
          <h2 className="font-display text-3xl md:text-4xl mb-4 font-bold tracking-tight">
            Stop scrubbing transcripts today.
          </h2>
          <p className="text-ink-dim mb-8 max-w-md mx-auto text-sm md:text-base">
            Get 1 episode processed completely free. No subscription required, set up your workspace in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-lime text-void font-bold px-6 py-3 rounded-md hover:bg-lime/90 transition-all duration-300 shadow-[0_0_15px_rgba(212,255,63,0.2)]"
            >
              Sign up instantly
            </Link>
            <Link
              href="/pricing"
              className="border border-line hover:border-lime/30 text-ink font-semibold px-6 py-3 rounded-md transition-colors"
            >
              See pricing plans
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
              Autonomous AI agent designed to stitch transcripts, analyze viral hooks, and render social clips for creators.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#demo" className="hover:text-lime transition-colors">Interactive Demo</a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-lime transition-colors">Pricing Options</Link>
              </li>
              <li>
                <a href="#" className="hover:text-lime transition-colors">API Reference</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-lime transition-colors">Groq Whisper API</a>
              </li>
              <li>
                <a href="#" className="hover:text-lime transition-colors">Cerebras LLM</a>
              </li>
              <li>
                <a href="#" className="hover:text-lime transition-colors">Lemon Squeezy Webhooks</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink mb-4">Stay updated</h4>
            <p className="text-xs mb-3">Join our newsletter for optimization guides.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="bg-surface border border-line rounded px-3 py-1.5 w-full text-xs text-ink focus:border-lime outline-none"
              />
              <button
                className="bg-line hover:bg-line/80 text-ink text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                onClick={() => alert("Subscribed! Thank you.")}
              >
                Join
              </button>
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
