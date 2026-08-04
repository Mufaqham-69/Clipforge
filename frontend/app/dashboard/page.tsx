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

  useEffect(() => {
    api.listShows().then(setShows).catch(() => router.push("/login")).finally(() => setLoading(false));
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Shows</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-lime text-void font-semibold px-4 py-2 rounded-sm hover:bg-lime-dim transition-colors"
        >
          New show
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface border border-line rounded-md p-6 mb-8 flex gap-4 items-end">
          <label className="text-sm flex-1">
            <span className="text-ink-dim mb-1 block">Show name</span>
            <input
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 bg-void focus:border-lime outline-none"
            />
          </label>
          <button disabled={busy} className="bg-lime text-void font-semibold px-4 py-2 rounded-sm hover:bg-lime-dim transition-colors">
            {busy ? "Creating…" : "Create show"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-ink-dim">Loading shows…</p>
      ) : shows.length === 0 ? (
        <p className="text-ink-dim">No shows yet. Create one to start uploading episodes.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shows.map((show) => (
            <Link
              key={show.id}
              href={`/dashboard/shows/${show.id}`}
              className="block bg-surface border border-line rounded-md p-5 hover:border-lime transition-colors"
            >
              <h3 className="font-display text-lg font-semibold">{show.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
