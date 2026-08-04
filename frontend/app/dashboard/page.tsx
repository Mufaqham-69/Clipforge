"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Show } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .listShows()
      .then(setShows)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const show = await api.createShow(newName);
      setShows((prev) => [show, ...prev]);
      setNewName("");
      setShowForm(false);
      router.push(`/dashboard/shows/${show.id}`);
    } finally {
      setBusy(false);
    }
  }

  // Filter shows based on search query
  const filteredShows = shows.filter((show) =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10 animate-slide-up">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Workspace Shows</h1>
          <p className="text-sm text-ink-dim mt-1">
            Organize your episodes by podcast show or agency campaign.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-lime text-void font-bold px-4 py-2.5 rounded-lg hover:bg-lime/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,255,63,0.15)] text-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Show Campaign</span>
        </button>
      </div>

      {/* Metrics Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-xl p-5 space-y-1.5">
          <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider">Active Shows</p>
          <h3 className="font-display text-2xl font-bold text-ink">{shows.length}</h3>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5 space-y-1.5">
          <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider">Episodes Cut</p>
          <h3 className="font-display text-2xl font-bold text-ink">14</h3>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5 space-y-1.5">
          <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider">Processed Min</p>
          <h3 className="font-display text-2xl font-bold text-ink">485 min</h3>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5 space-y-1.5 bg-gradient-to-tr from-surface to-surface-raised border-lime/30">
          <p className="font-mono text-[10px] text-lime uppercase tracking-wider font-semibold">Active Trial Credit</p>
          <h3 className="font-display text-2xl font-bold text-lime">1 Episode</h3>
        </div>
      </div>

      {/* Form creation drawer */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface border border-line rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-end animate-slide-up"
        >
          <label className="text-sm flex-1 w-full">
            <span className="text-ink-dim font-medium mb-1.5 block">Show Campaign Name</span>
            <input
              required
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Real Estate Daily / Startup Secrets"
              className="w-full border border-line rounded-lg px-4 py-3 bg-void focus:border-lime focus:ring-1 focus:ring-lime outline-none transition-all placeholder:text-ink-dim/30 text-sm"
            />
          </label>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 sm:flex-none border border-line hover:border-line/80 text-ink text-sm px-4 py-3 rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="flex-1 sm:flex-none bg-lime text-void font-bold px-6 py-3 rounded-lg hover:bg-lime/90 transition-all text-sm flex items-center justify-center gap-1.5"
            >
              {busy ? "Creating…" : "Create show"}
            </button>
          </div>
        </form>
      )}

      {/* Search and listings */}
      <div className="space-y-4">
        <div className="flex gap-4">
          {/* Search bar input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-line rounded-lg pl-10 pr-4 py-2.5 bg-surface focus:border-lime outline-none transition-all placeholder:text-ink-dim/40 text-sm"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <p className="text-xs text-ink-dim font-mono">Retrieving workspace campaigns…</p>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="border border-dashed border-line rounded-xl p-16 text-center space-y-3">
            <svg className="w-10 h-10 text-ink-dim/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="font-display font-bold text-lg text-ink">No shows match your query</h3>
            <p className="text-sm text-ink-dim max-w-xs mx-auto">
              {shows.length === 0
                ? "Create a campaign folder to start uploading raw podcast media clips."
                : "Try searching using a different keyword or create a new campaign."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredShows.map((show) => (
              <Link
                key={show.id}
                href={`/dashboard/shows/${show.id}`}
                className="group relative bg-surface border border-line hover:border-lime/40 rounded-xl p-6 hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                {/* Folder icon visual */}
                <div className="p-3 bg-surface-raised border border-line rounded-lg group-hover:border-lime/30 transition-all flex items-center justify-center">
                  <svg className="w-6 h-6 text-lime group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-lime truncate">
                    {show.name}
                  </h3>
                  <p className="text-xs text-ink-dim mt-1.5 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-line rounded-full" />
                    <span>View episode listing workspace</span>
                  </p>
                </div>
                <div className="self-center">
                  <svg className="w-5 h-5 text-ink-dim group-hover:text-lime transition-transform transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
