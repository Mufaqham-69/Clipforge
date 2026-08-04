"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, type Episode } from "@/lib/api";
import { WaveformTimeline } from "@/components/WaveformTimeline";
import { ClipCard } from "@/components/ClipCard";

export default function EpisodeDetailPage(
  { params }: { params: { showId: string; episodeId: string } }
) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const playerRef = useRef<HTMLAudioElement>(null);

  const refresh = useCallback(async () => {
    const ep = await api.getEpisode(params.showId, params.episodeId);
    setEpisode(ep);
    return ep;
  }, [params.showId, params.episodeId]);

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

  function seekTo(seconds: number) {
    if (playerRef.current) {
      playerRef.current.currentTime = seconds;
      playerRef.current.play();
    }
  }

  function updateClip(updated: Episode["clips"][number]) {
    setEpisode((prev) => prev && {
      ...prev,
      clips: prev.clips.map((c) => (c.id === updated.id ? updated : c)),
    });
  }

  if (!episode) return <main className="max-w-4xl mx-auto px-6 py-12 text-ink-dim">Loading episode…</main>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">{episode.title}</h1>

      {episode.status !== "ready" && episode.status !== "failed" && (
        <p className="text-lime font-mono text-sm mb-8">
          {episode.status === "transcribing" ? "Transcribing the full episode…" : "Reading the transcript for clip-worthy moments…"}
        </p>
      )}
      {episode.status === "failed" && (
        <p className="text-coral text-sm mb-8">{episode.error_message ?? "Processing failed."}</p>
      )}

      {episode.status === "ready" && episode.duration_seconds && (
        <>
          {mediaUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio ref={playerRef} src={mediaUrl} controls className="w-full mb-4" />
          )}

          <div className="mb-8">
            <WaveformTimeline
              durationSeconds={episode.duration_seconds}
              clips={episode.clips}
              onSeek={seekTo}
            />
          </div>

          {episode.episode_summary && (
            <p className="text-sm text-ink-dim mb-10 bg-surface border border-line rounded-md p-5">
              {episode.episode_summary}
            </p>
          )}

          <h2 className="font-display text-xl font-semibold mb-4">
            Storyboard — {episode.clips.length} clip{episode.clips.length === 1 ? "" : "s"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
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
        </>
      )}
    </main>
  );
}
