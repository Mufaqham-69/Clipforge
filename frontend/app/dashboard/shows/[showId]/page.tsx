"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, type Episode } from "@/lib/api";
import { UploadDropzone } from "@/components/UploadDropzone";

const STATUS_LABEL: Record<Episode["status"], string> = {
  uploaded: "Queued",
  transcribing: "Transcribing…",
  analyzing: "Finding clips…",
  ready: "Ready",
  failed: "Failed",
};

export default function ShowDetailPage({ params }: { params: { showId: string } }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    api.listEpisodes(params.showId).then(setEpisodes).finally(() => setLoading(false));
  }, [params.showId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 6000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Episodes</h1>

      <section className="mb-10">
        <UploadDropzone
          onUpload={async (file) => {
            await api.uploadEpisode(params.showId, file);
            refresh();
          }}
        />
      </section>

      {loading ? (
        <p className="text-ink-dim">Loading episodes…</p>
      ) : episodes.length === 0 ? (
        <p className="text-ink-dim">No episodes yet. Upload one to get its first storyboard.</p>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/dashboard/shows/${params.showId}/episodes/${ep.id}`}
              className="flex items-center justify-between bg-surface border border-line rounded-md px-5 py-4 hover:border-lime transition-colors"
            >
              <div>
                <h3 className="font-display font-semibold">{ep.title}</h3>
                {ep.status === "ready" && (
                  <p className="text-xs text-ink-dim font-mono mt-1">{ep.clips.length} clip(s) found</p>
                )}
              </div>
              <span className={`hook-badge ${ep.status === "ready" ? "text-lime bg-lime/10 border-lime" :
                ep.status === "failed" ? "text-coral bg-coral-bg border-coral" :
                "text-ink-dim bg-surface-raised border-line"}`}>
                {STATUS_LABEL[ep.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
