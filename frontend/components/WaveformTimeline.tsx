"use client";

import { useMemo } from "react";
import type { Clip } from "@/lib/api";

/** Deterministic pseudo-random bar heights, seeded by index - just visual
 * texture since we don't decode real waveform data in the MVP. */
function barHeight(i: number): number {
  const seeded = Math.sin(i * 12.9898) * 43758.5453;
  const frac = seeded - Math.floor(seeded);
  return 20 + frac * 80; // 20%-100% height
}

export function WaveformTimeline({
  durationSeconds, clips, onSeek,
}: { durationSeconds: number; clips: Clip[]; onSeek?: (seconds: number) => void }) {
  const bars = useMemo(() => Array.from({ length: 120 }, (_, i) => barHeight(i)), []);

  return (
    <div className="waveform-track">
      {bars.map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: `${h}%` }} />
      ))}
      {clips.map((clip) => {
        const leftPct = (clip.start_seconds / durationSeconds) * 100;
        const widthPct = ((clip.end_seconds - clip.start_seconds) / durationSeconds) * 100;
        return (
          <div
            key={clip.id}
            className="waveform-clip-region"
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            title={clip.title}
            onClick={() => onSeek?.(clip.start_seconds)}
          />
        );
      })}
    </div>
  );
}
