# ClipForge — Audio-to-Shorts Storyboard & Repurposing Agent

 A podcaster or video creator uploads a full
episode, the agent transcribes it, reads the whole thing for moments that
work as standalone short-form clips (shocking stats, emotional beats,
controversial takes, punchlines, cliffhangers), and hands back a storyboard:
exact timestamps, a hook-first caption, hashtags, and a one-click render to
an actual cut clip file.

## What's actually here

- **Backend** (`/backend`) — FastAPI + Celery/Redis + Postgres. The agent
  pipeline:
  - `app/services/media.py` — ffmpeg/ffprobe wrappers: re-encodes the
    episode's audio to a small speech-optimized format and chunks it so
    each piece clears Groq's 25MB per-request transcription limit; cuts
    exact-timestamp clips out of the original file (video or audio-only)
  - `app/services/transcription.py` — orchestrates chunked transcription
    and stitches each chunk's timestamps back to absolute episode time
  - `app/services/storyboard_engine.py` — one LLM call over the full
    timestamped transcript (Cerebras's 64K context easily holds a 2-hour
    episode), constrained by `app/schemas/clip.py`'s validation: every
    clip the model proposes must be 12-95 seconds and `end > start`, or
    the router's retry loop sends the validation error back and asks
    again — the schema is doing real work here, not just typing
  - `app/core/llm_router.py` — Groq (Whisper Large v3, transcription) +
    Cerebras (Qwen3 235B, analysis), the two providers this concept's
    doc specified
- **Frontend** (`/frontend`) — Next.js 14 + Tailwind, dark theme. Episode
  page has a waveform strip with clip regions overlaid at their real time
  position, an inline player you can seek by clicking a clip, and
  storyboard cards with render/download actions.
- **Billing** — Lemon Squeezy, same integration as the Casefile project's,
  pointed at a $40/mo variant instead of $100/mo.

## Verified, not just written

- The full ffmpeg pipeline ran against real synthetic audio and video files
  in testing: chunking a 90-second file into correctly-offset pieces,
  cutting an exact 15-second audio clip and an exact 10-second video clip
- The chunk-timestamp stitching math was tested against mocked multi-chunk
  transcription responses and confirmed correct
- The `ClipCandidate` schema was tested to actually reject too-short,
  too-long, and inverted-range clips — not just accept whatever comes back
- The full signup → show → episode → Lemon Squeezy webhook flow ran
  end-to-end against a live FastAPI instance
- Frontend type-checks clean (`tsc --noEmit`) across every page and
  component

## Running it locally

1. `cp backend/.env.example backend/.env` and fill in:
   - `GROQ_API_KEY` — free tier at https://console.groq.com (2,000 minutes/day
     as of early 2026 — plenty for building and testing)
   - `CEREBRAS_API_KEY` — free tier at https://cloud.cerebras.ai
   - Leave Lemon Squeezy keys blank to start — everything except episode
     upload works without billing configured, and new orgs start in
     `trialing`
2. `cp frontend/.env.example frontend/.env`
3. `docker compose up --build`
4. Frontend at `http://localhost:3000`, API docs at `http://localhost:8000/docs`

Without Docker, you need `ffmpeg` installed locally (`apt install ffmpeg` /
`brew install ffmpeg`) before `uvicorn app.main:app --reload` will work —
the media pipeline shells out to it directly.

## Wiring up Lemon Squeezy

Same steps as the Casefile project: create a Store and a $40/month
subscription Variant in the dashboard, an API key, and a webhook pointed at
`/api/billing/webhook` subscribed to the `subscription_*` events. Full
walkthrough is in that project's README if you don't have it open already.

## Before your first real creator uploads an episode

- **Large uploads** — `MAX_UPLOAD_MB` defaults to 2GB and the upload route
  proxies the whole file through the API server. Fine for audio podcasts;
  a 4K video episode will be slow and memory-heavy this way. Move to
  presigned direct-to-storage uploads (S3/R2) before video creators with
  large files are a real segment of your users.
- **The in-browser player fetches the whole original file as a blob**
  (`api.fetchMediaBlobUrl`) because native `<audio>`/`<video>` tags can't
  send the `Authorization` header our API requires. Fine for typical
  podcast lengths, not fine for a 2-hour 4K video loaded fully into browser
  memory — swap for range-request streaming (signed URLs from S3/R2) at
  the same time you fix the upload path above.
- **Chunk boundaries have no overlap** (see the comment in
  `extract_audio_chunks`) — a word can occasionally split across a
  20-minute chunk boundary. Rare enough not to matter for finding clip
  *moments*, but add a few seconds of overlap + de-dupe if you ever need
  frame-perfect transcripts.
- **ffmpeg re-encodes on every clip render**, which is CPU-bound. Fine at
  low volume on a single worker; add worker concurrency (already set to 2
  in `docker-compose.yml`) or a dedicated render queue before this is a
  bottleneck at real scale.
- **Get 5-10 creators actually using the storyboard before you trust the
  hook-detection quality** — "shocking stat" vs "relatable moment" is a
  judgment call the model is making with no ground truth to check itself
  against; creator feedback on which clips they actually post is your
  real quality signal, not anything you can validate in code.
