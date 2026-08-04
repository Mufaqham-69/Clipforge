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

  return (
    <div className="bg-surface border border-line rounded-md p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
          onClick={() => onSeek?.(clip.start_seconds)}
          className="font-mono text-xs text-ink-dim hover:text-lime transition-colors"
        >
          {formatTime(clip.start_seconds)} → {formatTime(clip.end_seconds)}
          <span className="ml-2 text-ink-dim/60">
            ({Math.round(clip.end_seconds - clip.start_seconds)}s)
          </span>
        </button>
        <span className={`hook-badge ${HOOK_STYLE[clip.hook_type] ?? HOOK_STYLE.relatable_moment}`}>
          {clip.hook_type.replace(/_/g, " ")}
        </span>
      </div>

      <h3 className="font-display text-lg mb-1">{clip.title}</h3>
      <p className="text-sm text-ink-dim mb-3">{clip.caption}</p>

      {clip.hashtags.length > 0 && (
        <p className="font-mono text-xs text-violet mb-3">
          {clip.hashtags.map((h) => `#${h}`).join(" ")}
        </p>
      )}

      <p className="text-xs text-ink-dim/70 italic mb-4">{clip.virality_reasoning}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {clip.platforms.map((p) => (
            <span key={p} className="font-mono text-[10px] text-ink-dim border border-line rounded px-1.5 py-0.5">
              {p.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        {clip.render_status === "ready" ? (
          <button
            onClick={handleDownload}
            disabled={busy}
            className="bg-lime text-void text-sm font-semibold px-3 py-1.5 rounded-sm hover:bg-lime-dim transition-colors disabled:opacity-50"
          >
            {busy ? "Downloading…" : "Download clip"}
          </button>
        ) : clip.render_status === "rendering" ? (
          <span className="text-xs text-ink-dim font-mono">Rendering…</span>
        ) : clip.render_status === "failed" ? (
          <button onClick={handleRender} disabled={busy} className="text-xs text-coral font-mono">
            Render failed — retry
          </button>
        ) : (
          <button
            onClick={handleRender}
            disabled={busy}
            className="border border-line text-sm px-3 py-1.5 rounded-sm hover:border-lime transition-colors disabled:opacity-50"
          >
            {busy ? "Starting…" : "Cut this clip"}
          </button>
        )}
      </div>
    </div>
  );
}
