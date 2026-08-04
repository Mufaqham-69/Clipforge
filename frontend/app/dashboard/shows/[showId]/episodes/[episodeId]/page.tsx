"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api, type Episode, type Show } from "@/lib/api";
import { WaveformTimeline } from "@/components/WaveformTimeline";
import { ClipCard } from "@/components/ClipCard";

export default function EpisodeDetailPage(
  { params }: { params: { showId: string; episodeId: string } }
) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<HTMLAudioElement>(null);

  const refresh = useCallback(async () => {
    const ep = await api.getEpisode(params.showId, params.episodeId);
    setEpisode(ep);
    return ep;
  }, [params.showId, params.episodeId]);

  useEffect(() => {
    // Fetch show info
    api.listShows().then((shows) => {
      const matched = shows.find((s) => s.id === params.showId);
      if (matched) setShow(matched);
    });
  }, [params.showId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(async () => {
      const ep = await refresh();
      if (ep.status === "ready" || ep.status === "failed") clearInterval(interval);
    }, 6000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (episode?.status === "ready" && !mediaUrl) {
      api.fetchMediaBlobUrl(params.showId, params.episodeId).then(setMediaUrl).catch(() => {});
    }
  }, [episode?.status, mediaUrl, params.showId, params.episodeId]);

  // Synchronize audio current time state
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime);
    };

    player.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [mediaUrl]);

  function seekTo(seconds: number) {
    if (playerRef.current) {
      playerRef.current.currentTime = seconds;
      playerRef.current.play().catch(() => {});
    }
  }

  function updateClip(updated: Episode["clips"][number]) {
    setEpisode((prev) => prev && {
      ...prev,
      clips: prev.clips.map((c) => (c.id === updated.id ? updated : c)),
    });
  }

  if (!episode) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <svg className="animate-spin h-6 w-6 text-lime" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
        <p className="text-xs text-ink-dim font-mono">Loading episode details…</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-6 animate-slide-up">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-ink-dim font-mono">
        <Link href="/dashboard" className="hover:text-lime transition-colors">
          SHOWS
        </Link>
        <span>/</span>
        <Link href={`/dashboard/shows/${params.showId}`} className="hover:text-lime transition-colors truncate">
          {show ? show.name.toUpperCase() : "SHOW"}
        </Link>
        <span>/</span>
        <span className="text-ink truncate uppercase">
          {episode.title}
        </span>
      </div>

      {/* Episode Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight truncate">
            {episode.title}
          </h1>
          <p className="text-xs text-ink-dim mt-1.5 flex items-center gap-2">
            <span className="font-mono bg-surface-raised px-2 py-0.5 rounded border border-line">
              {episode.original_filename}
            </span>
          </p>
        </div>
        <Link
          href={`/dashboard/shows/${params.showId}`}
          className="flex items-center gap-1.5 border border-line hover:border-line/80 text-ink text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4 text-ink-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Episode List</span>
        </Link>
      </div>

      {/* Status workflow loader for incomplete states */}
      {episode.status !== "ready" && episode.status !== "failed" && (
        <section className="bg-surface border border-line rounded-xl p-8 text-center max-w-xl mx-auto space-y-6 my-12 shadow-xl">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-line" />
            <div className="absolute inset-0 rounded-full border-4 border-t-lime animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg">
              {episode.status === "transcribing"
                ? "Transcribing Episode Speech"
                : "Analyzing Transcript Semantics"}
            </h3>
            <p className="text-xs text-ink-dim leading-relaxed max-w-sm mx-auto">
              {episode.status === "transcribing"
                ? "Groq Whisper Large model is chunking and stitching transcript files. This usually takes under a minute."
                : "Cerebras Qwen 235B is analyzing context structure for shocking metrics, cliffhangers, and virality potential."}
            </p>
          </div>

          {/* Simulated progress tracker */}
          <div className="w-full bg-void rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full bg-lime rounded-full transition-all duration-[6000ms] ${
                episode.status === "transcribing" ? "w-[40%]" : "w-[80%]"
              }`}
            />
          </div>
        </section>
      )}

      {/* Failed state block */}
      {episode.status === "failed" && (
        <section className="bg-coral-bg/25 border border-coral/30 rounded-xl p-6 max-w-xl mx-auto text-center space-y-4 my-12">
          <svg className="w-10 h-10 text-coral mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-coral">Processing Failed</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              {episode.error_message ?? "An unexpected error occurred during audio processing."}
            </p>
          </div>
          <button
            onClick={() => refresh()}
            className="bg-line hover:bg-line/80 text-ink text-xs font-mono font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Retry Request
          </button>
        </section>
      )}

      {/* Main Workspace - 2 Columns */}
      {episode.status === "ready" && episode.duration_seconds && (
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Player, Timeline, & Summary (Pinned) */}
          <div className="md:col-span-5 space-y-6 md:sticky md:top-6">
            <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink-dim">
                Episode Media Player
              </h3>

              {mediaUrl ? (
                <div className="space-y-4">
                  {/* Styled audio element wrapper */}
                  <audio
                    ref={playerRef}
                    src={mediaUrl}
                    controls
                    className="w-full accent-lime filter invert bg-transparent"
                  />
                  <div className="flex justify-between items-center text-xs font-mono text-ink-dim px-1">
                    <span>Active Seek Time:</span>
                    <span className="text-lime font-semibold">
                      {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 bg-void border border-line rounded-lg text-ink-dim">
                  <svg className="animate-spin h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs font-mono">Fetching audio blob payload…</span>
                </div>
              )}

              {/* Waveform timeline with dynamic playhead */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim block">
                  Episode Highlights Timeline
                </span>
                <WaveformTimeline
                  durationSeconds={episode.duration_seconds}
                  clips={episode.clips}
                  onSeek={seekTo}
                  currentTime={currentTime}
                />
              </div>
            </div>

            {/* AI Summary Card */}
            {episode.episode_summary && (
              <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-lime">
                  AI Episode Overview
                </h4>
                <p className="text-xs md:text-sm text-ink-dim leading-relaxed">
                  {episode.episode_summary}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Storyboard Card list */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <h2 className="font-display text-lg font-bold text-ink">
                Storyboard Clips ({episode.clips.length})
              </h2>
              <span className="font-mono text-[10px] text-ink-dim bg-surface px-2.5 py-1 rounded-md border border-line">
                RANKED BY VIRALITY POTENTIAL
              </span>
            </div>

            <div className="grid gap-4">
              {episode.clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  episodeId={episode.id}
                  onSeek={seekTo}
                  onUpdated={updateClip}
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
