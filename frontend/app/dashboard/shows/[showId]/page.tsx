"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, type Episode, type Show } from "@/lib/api";
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
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const refresh = useCallback(() => {
    api
      .listEpisodes(params.showId)
      .then(setEpisodes)
      .finally(() => setLoading(false));
  }, [params.showId]);

  useEffect(() => {
    // Resolve show name from the list
    api.listShows().then((shows) => {
      const matched = shows.find((s) => s.id === params.showId);
      if (matched) setShow(matched);
    });
  }, [params.showId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 6000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Filter episodes by query
  const filteredEpisodes = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-slide-up">
      {/* Breadcrumbs & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-ink-dim font-mono">
          <Link href="/dashboard" className="hover:text-lime transition-colors">
            SHOWS
          </Link>
          <span>/</span>
          <span className="text-ink truncate uppercase">
            {show ? show.name : params.showId.slice(0, 8)}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">
              {show ? show.name : "Show Workspace"}
            </h1>
            <p className="text-sm text-ink-dim mt-1">
              Upload long episodes to find high-performing short-form video hooks.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 border border-line hover:border-line/80 text-ink text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
          >
            <svg className="w-4 h-4 text-ink-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Campaigns</span>
          </Link>
        </div>
      </div>

      {/* Upload Zone Section */}
      <section className="bg-surface border border-line rounded-xl p-6">
        <h3 className="font-display font-semibold mb-3 text-sm text-ink">Upload New Episode</h3>
        <UploadDropzone
          onUpload={async (file) => {
            await api.uploadEpisode(params.showId, file);
            refresh();
          }}
        />
      </section>

      {/* Episode Listings */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-4">
          <h2 className="font-display text-lg font-bold">
            Episodes ({episodes.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-line rounded-lg pl-9 pr-4 py-2 bg-surface focus:border-lime outline-none transition-all placeholder:text-ink-dim/40 text-xs"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-dim/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-6 w-6 text-lime" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs text-ink-dim font-mono">Retrieving episode status logs…</p>
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="border border-dashed border-line rounded-xl p-16 text-center space-y-3">
            <svg className="w-10 h-10 text-ink-dim/40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <h4 className="font-display font-semibold text-base text-ink">No episodes found</h4>
            <p className="text-xs text-ink-dim max-w-xs mx-auto">
              {episodes.length === 0
                ? "Drop an audio or video file above to start the transcript parsing agent."
                : "Try a different search query."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredEpisodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/dashboard/shows/${params.showId}/episodes/${ep.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between bg-surface border border-line hover:border-lime/40 rounded-xl p-5 hover:shadow-md transition-all duration-300 gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-display font-bold text-base text-ink group-hover:text-lime truncate">
                      {ep.title}
                    </h3>
                    <span className="font-mono text-[9px] text-ink-dim bg-surface-raised px-2 py-0.5 rounded border border-line">
                      {ep.original_filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-dim">
                    <span className="font-mono">{new Date(ep.uploaded_at).toLocaleDateString()}</span>
                    {ep.status === "ready" && ep.clips && (
                      <>
                        <span className="inline-block w-1.5 h-1.5 bg-line rounded-full" />
                        <span className="font-mono text-lime font-semibold">
                          {ep.clips.length} candidate clip{ep.clips.length === 1 ? "" : "s"} found
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {ep.status !== "ready" && ep.status !== "failed" && (
                    <svg className="animate-spin h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span
                    className={`hook-badge ${
                      ep.status === "ready"
                        ? "text-lime bg-lime/10 border-lime"
                        : ep.status === "failed"
                        ? "text-coral bg-coral-bg border-coral animate-pulse"
                        : "text-ink-dim bg-surface-raised border-line"
                    }`}
                  >
                    {STATUS_LABEL[ep.status]}
                  </span>
                  <svg className="w-5 h-5 text-ink-dim group-hover:text-lime transition-transform transform group-hover:translate-x-1 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
