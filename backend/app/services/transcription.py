"""
Full-episode transcription. Groq's per-request file limit (25MB) is what
forces chunking here - it's not a context-length problem, so the fix is
mechanical: split, transcribe each piece, shift timestamps by the chunk's
offset, and concatenate.
"""
import logging
import shutil
import tempfile

from app.core.config import get_settings
from app.core.llm_router import LLMRouter
from app.services.media import extract_audio_chunks

logger = logging.getLogger(__name__)
settings = get_settings()


async def transcribe_episode(source_path: str) -> dict:
    """Returns {"text": full_text, "segments": [{"start","end","text"}, ...]} for the whole episode."""
    router = LLMRouter()
    workdir = tempfile.mkdtemp(prefix="episode_chunks_")
    try:
        chunks = extract_audio_chunks(source_path, workdir, settings.TRANSCRIPTION_CHUNK_SECONDS)
        if not chunks:
            raise ValueError("No audio chunks were produced - source file may be empty or corrupt")

        all_segments: list[dict] = []
        text_parts: list[str] = []

        for chunk_path, offset in chunks:
            result = await router.transcribe_audio(chunk_path)
            if result["text"]:
                text_parts.append(result["text"])
            for seg in result["segments"]:
                all_segments.append({
                    "start": seg["start"] + offset,
                    "end": seg["end"] + offset,
                    "text": seg["text"],
                })

        return {"text": " ".join(text_parts).strip(), "segments": all_segments}
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
