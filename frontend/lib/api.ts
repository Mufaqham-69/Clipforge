const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type HookType =
  | "shocking_stat" | "emotional_story" | "controversial_take"
  | "actionable_insight" | "punchline" | "cliffhanger" | "relatable_moment";

export type Clip = {
  id: string;
  start_seconds: number;
  end_seconds: number;
  title: string;
  caption: string;
  hashtags: string[];
  hook_type: HookType;
  platforms: string[];
  virality_reasoning: string;
  confidence: number;
  render_status: "not_rendered" | "rendering" | "ready" | "failed";
  rendered_file_path: string | null;
};

export type Episode = {
  id: string;
  show_id: string;
  title: string;
  original_filename: string;
  status: "uploaded" | "transcribing" | "analyzing" | "ready" | "failed";
  duration_seconds: number | null;
  episode_summary: string | null;
  error_message: string | null;
  uploaded_at: string;
  clips: Clip[];
};

export type Show = { id: string; name: string };

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  signup: (data: { workspace_name: string; full_name: string; email: string; password: string }) =>
    request<{ access_token: string }>("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    return request<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
  },

  listShows: () => request<Show[]>("/api/shows"),
  createShow: (name: string) => request<Show>("/api/shows", { method: "POST", body: JSON.stringify({ name }) }),

  listEpisodes: (showId: string) => request<Episode[]>(`/api/shows/${showId}/episodes`),
  getEpisode: (showId: string, episodeId: string) =>
    request<Episode>(`/api/shows/${showId}/episodes/${episodeId}`),
  uploadEpisode: (showId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<Episode>(`/api/shows/${showId}/episodes`, { method: "POST", body: formData });
  },

  async fetchMediaBlobUrl(showId: string, episodeId: string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/shows/${showId}/episodes/${episodeId}/media`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load episode media");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },

  renderClip: (episodeId: string, clipId: string) =>
    request<Clip>(`/api/episodes/${episodeId}/clips/${clipId}/render`, { method: "POST" }),

  async downloadClip(episodeId: string, clipId: string, filename: string): Promise<void> {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/episodes/${episodeId}/clips/${clipId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to download clip");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  createCheckoutSession: () =>
    request<{ checkout_url: string }>("/api/billing/create-checkout-session", { method: "POST" }),
};
