"use client";

import { useState } from "react";
import { api, type Clip } from "@/lib/api";

const HOOK_STYLE: Record<string, string> = {
  shocking_stat: "text-coral bg-coral-bg border-coral",
  emotional_story: "text-violet bg-violet-bg border-violet",
  controversial_take: "text-coral bg-coral-bg border-coral",
  actionable_insight: "text-lime bg-lime/10 border-lime",
  punchline: "text-lime bg-lime/10 border-lime",
  cliffhanger: "text-violet bg-violet-bg border-violet",
  relatable_moment: "text-ink-dim bg-surface-raised border-line",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ClipCard({
  clip, episodeId, onSeek, onUpdated,
}: { clip: Clip; episodeId: string; onSeek?: (seconds: number) => void; onUpdated?: (clip: Clip) => void }) {
  const [busy, setBusy] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleRender() {
    setBusy(true);
    try {
      const updated = await api.renderClip(episodeId, clip.id);
      onUpdated?.(updated);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      await api.downloadClip(episodeId, clip.id, `${clip.title.replace(/\s+/g, "_")}.mp4`);
    } finally {
      setBusy(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(clip.caption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Determine standard score default if confidence not set
  const viralityScore = clip.confidence ? Math.round(clip.confidence * 100) : 85;

  return (
    <div className="bg-surface border border-line rounded-xl p-5 hover:border-line/80 transition-all duration-300 relative group flex flex-col justify-between min-h-[220px]">
      <div>
        {/* Clip meta timeline & badge row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            onClick={() => onSeek?.(clip.start_seconds)}
            className="flex items-center gap-1.5 font-mono text-xs text-ink-dim hover:text-lime transition-colors group/seek"
          >
            <svg className="w-3.5 h-3.5 text-lime fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{formatTime(clip.start_seconds)} → {formatTime(clip.end_seconds)}</span>
            <span className="text-ink-dim/50 group-hover/seek:text-lime">
              ({Math.round(clip.end_seconds - clip.start_seconds)}s)
            </span>
          </button>
          <span className={`hook-badge ${HOOK_STYLE[clip.hook_type] ?? HOOK_STYLE.relatable_moment}`}>
            {clip.hook_type.replace(/_/g, " ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-ink mb-1 mt-1 group-hover:text-lime transition-colors">
          {clip.title}
        </h3>

        {/* Caption panel */}
        <div className="bg-void border border-line rounded-lg p-3 my-3 relative group/caption">
          <p className="text-xs text-ink-dim leading-relaxed pr-8">{clip.caption}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 text-ink-dim hover:text-lime transition-colors p-1 bg-surface-raised rounded"
            title="Copy copy text"
          >
            {isCopied ? (
              <svg className="w-3 h-3 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>

        {/* Hashtags */}
        {clip.hashtags && clip.hashtags.length > 0 && (
          <p className="font-mono text-[10px] text-violet mb-3 tracking-wide">
            {clip.hashtags.map((h) => `#${h}`).join(" ")}
          </p>
        )}

        {/* Virality score and collapsible analysis details */}
        <div className="border-t border-line/50 pt-3 mt-3">
          <div className="flex items-center justify-between">
            {/* Virality bar indicator */}
            <div className="flex items-center gap-2 flex-1 max-w-[160px]">
              <span className="text-[10px] font-mono text-ink-dim whitespace-nowrap">Virality Score:</span>
              <div className="w-full bg-void rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet to-lime rounded-full"
                  style={{ width: `${viralityScore}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-lime">{viralityScore}%</span>
            </div>

            {/* Expander toggle */}
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-[10px] text-ink-dim hover:text-ink flex items-center gap-1 font-mono uppercase tracking-wide py-1"
            >
              <span>{showReasoning ? "Hide Reasoning" : "Analyze Hook"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showReasoning ? "rotate-180 text-lime" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showReasoning && (
            <div className="mt-2.5 p-3 bg-surface-raised border border-line rounded-lg text-[11px] text-ink-dim leading-relaxed animate-slide-up border-l-2 border-lime">
              <span className="font-semibold text-ink block mb-0.5">AI Hook Rationale:</span>
              {clip.virality_reasoning}
            </div>
          )}
        </div>
      </div>

      {/* Footer rendering controls row */}
      <div className="flex items-center justify-between border-t border-line/60 pt-4 mt-4">
        {/* Intended platforms */}
        <div className="flex gap-1">
          {clip.platforms.map((p) => (
            <span key={p} className="font-mono text-[9px] text-ink-dim border border-line rounded px-1.5 py-0.5 bg-surface-raised uppercase tracking-wide">
              {p.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        {/* Dynamic button renders */}
        {clip.render_status === "ready" ? (
          <button
            onClick={handleDownload}
            disabled={busy}
            className="bg-lime text-void text-xs font-bold px-4 py-2 rounded-lg hover:bg-lime/90 transition-all shadow-[0_0_10px_rgba(212,255,63,0.15)] disabled:opacity-50"
          >
            {busy ? "Downloading…" : "Download clip"}
          </button>
        ) : clip.render_status === "rendering" ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5 text-lime" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] text-ink-dim font-mono">Rendering…</span>
          </div>
        ) : clip.render_status === "failed" ? (
          <button
            onClick={handleRender}
            disabled={busy}
            className="text-xs text-coral font-semibold hover:underline border border-coral/30 hover:border-coral px-3 py-1.5 rounded bg-coral-bg/25 transition-colors"
          >
            Render failed — retry
          </button>
        ) : (
          <button
            onClick={handleRender}
            disabled={busy}
            className="border border-line text-xs hover:border-lime text-ink font-semibold px-4 py-2 rounded-lg transition-all hover:bg-lime/5 disabled:opacity-50"
          >
            {busy ? "Starting…" : "Cut this clip"}
          </button>
        )}
      </div>
    </div>
  );
}
