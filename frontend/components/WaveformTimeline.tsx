"use client";

import { useMemo } from "react";
import type { Clip } from "@/lib/api";

function barHeight(i: number): number {
  const seeded = Math.sin(i * 12.9898) * 43758.5453;
  const frac = seeded - Math.floor(seeded);
  return 20 + frac * 80;
}

export function WaveformTimeline({
  durationSeconds, clips, onSeek, currentTime = 0,
}: { durationSeconds: number; clips: Clip[]; onSeek?: (seconds: number) => void; currentTime?: number }) {
  const bars = useMemo(() => Array.from({ length: 120 }, (_, i) => barHeight(i)), []);

  const playheadPct = useMemo(() => {
    if (!durationSeconds) return 0;
    return Math.min(100, Math.max(0, (currentTime / durationSeconds) * 100));
  }, [currentTime, durationSeconds]);

  return (
    <div className="waveform-track relative">
      {bars.map((h, i) => {
        const barPct = (i / bars.length) * 100;
        const isPlayed = barPct <= playheadPct;
        return (
          <div
            key={i}
            className={`waveform-bar ${isPlayed ? "bg-lime/40" : "bg-line"}`}
            style={{ height: `${h}%` }}
          />
        );
      })}

      {clips.map((clip) => {
        const leftPct = (clip.start_seconds / durationSeconds) * 100;
        const widthPct = ((clip.end_seconds - clip.start_seconds) / durationSeconds) * 100;
        return (
          <div
            key={clip.id}
            className="waveform-clip-region"
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            title={`Clip: ${clip.title} (${Math.round(clip.end_seconds - clip.start_seconds)}s)`}
            onClick={() => onSeek?.(clip.start_seconds)}
          />
        );
      })}

      {durationSeconds > 0 && (
        <div
          className="waveform-playhead"
          style={{ left: `${playheadPct}%` }}
        />
      )}
    </div>
  );
}
