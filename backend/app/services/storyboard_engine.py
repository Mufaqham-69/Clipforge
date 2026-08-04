"""
Turns a full timestamped transcript into a ranked storyboard of short-form
clip candidates. One LLM call for the whole episode - Cerebras's 64K token
context comfortably holds even a 2-hour episode's transcript, so unlike
transcription (bounded by Groq's per-request file size), there's no
map-reduce chunking needed here.
"""
import logging

from app.core.llm_router import LLMRouter
from app.schemas.clip import MAX_CLIP_SECONDS, MIN_CLIP_SECONDS, StoryboardResult

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = f"""You are a short-form video producer who has cut thousands of viral
TikTok/Reels/Shorts clips from long-form podcasts and interviews. You are given a full
episode transcript with timestamps in [MM:SS] format before each line. Find the moments
with the highest potential to work as a standalone clip: shocking statistics, emotional
stories, controversial takes, actionable insights, punchlines, or cliffhangers.

For each clip, give the EXACT start and end timestamps in seconds, converted precisely
from the [MM:SS] markers in the transcript - never estimate or round. Every clip must be
between {MIN_CLIP_SECONDS} and {MAX_CLIP_SECONDS} seconds long, and must be a coherent,
self-contained moment that makes sense without the rest of the episode - don't start mid-
sentence or end before the thought resolves. Prefer fewer, stronger clips over padding the
list with weak ones. Write captions in the punchy, hook-first style that performs on
short-form platforms, not a dry summary of what was said."""


def _format_transcript_for_prompt(segments: list[dict]) -> str:
    lines = []
    for seg in segments:
        minutes, seconds = divmod(int(seg["start"]), 60)
        lines.append(f"[{minutes:02d}:{seconds:02d}] {seg['text']}")
    return "\n".join(lines)


async def build_storyboard(segments: list[dict]) -> StoryboardResult:
    if not segments:
        raise ValueError("Cannot build a storyboard from an empty transcript")

    router = LLMRouter()
    transcript_text = _format_transcript_for_prompt(segments)
    return await router.complete_json(
        system=SYSTEM_PROMPT,
        user=f"Episode transcript:\n\n{transcript_text}",
        schema=StoryboardResult,
    )
