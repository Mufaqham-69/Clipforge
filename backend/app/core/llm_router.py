"""
Groq handles transcription (Whisper Large v3 on their LPU inference - fast
enough that creators aren't stuck waiting on a 1-hour episode). Cerebras
handles the analysis pass (Qwen3 235B, 64K token context) - a full episode
transcript fits in one call, so there's no map-reduce needed for the
storyboard step, only for transcription (which is bounded by Groq's 25MB
per-request file limit, not context length - see app/services/transcription.py).
"""
import json
import logging
from pathlib import Path
from typing import Type, TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

T = TypeVar("T", bound=BaseModel)

GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
CEREBRAS_CHAT_URL = "https://api.cerebras.ai/v1/chat/completions"


class LLMError(RuntimeError):
    pass


class LLMRouter:
    async def transcribe_audio(self, file_path: str) -> dict:
        """
        Transcribes a single audio file that's already under Groq's 25MB
        request cap. Returns {"text": str, "segments": [{"start","end","text"}]}.
        Chunking a longer original into request-sized pieces happens one
        level up, in app/services/transcription.py.
        """
        if not settings.GROQ_API_KEY:
            raise LLMError("GROQ_API_KEY not set")

        headers = {"Authorization": f"Bearer {settings.GROQ_API_KEY}"}
        data = {
            "model": settings.GROQ_WHISPER_MODEL,
            "response_format": "verbose_json",
            "timestamp_granularities[]": "segment",
        }

        async with httpx.AsyncClient(timeout=180) as client:
            with open(file_path, "rb") as f:
                files = {"file": (Path(file_path).name, f, "audio/mpeg")}
                resp = await client.post(GROQ_TRANSCRIPTION_URL, headers=headers, data=data, files=files)
            resp.raise_for_status()
            result = resp.json()

        return {
            "text": result.get("text", "").strip(),
            "segments": [
                {"start": float(seg["start"]), "end": float(seg["end"]), "text": seg["text"].strip()}
                for seg in result.get("segments", [])
            ],
        }

    async def complete_text(self, system: str, user: str, temperature: float = 0.3) -> str:
        if not settings.CEREBRAS_API_KEY:
            raise LLMError("CEREBRAS_API_KEY not set")
        headers = {"Authorization": f"Bearer {settings.CEREBRAS_API_KEY}"}
        payload = {
            "model": settings.CEREBRAS_MODEL,
            "temperature": temperature,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(CEREBRAS_CHAT_URL, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

    async def complete_json(
        self, system: str, user: str, schema: Type[T], temperature: float = 0.2, max_retries: int = 2
    ) -> T:
        json_instructions = (
            f"\n\nRespond with ONLY valid JSON matching this schema, no prose, "
            f"no markdown fences:\n{schema.model_json_schema()}"
        )
        prompt = user + json_instructions
        last_error: str | None = None

        for attempt in range(max_retries + 1):
            if last_error:
                prompt = (
                    user
                    + json_instructions
                    + f"\n\nYour previous response failed validation with this error, "
                      f"fix it and respond again with ONLY corrected JSON:\n{last_error}"
                )
            raw = await self.complete_text(system, prompt, temperature)
            cleaned = _strip_json_fences(raw)
            try:
                data = json.loads(cleaned)
                return schema.model_validate(data)
            except (json.JSONDecodeError, ValidationError) as exc:
                last_error = str(exc)
                logger.warning("LLM JSON validation failed (attempt %s): %s", attempt, exc)

        raise LLMError(f"Model failed to produce valid {schema.__name__} after {max_retries + 1} attempts")


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        text = text.replace("```json", "").replace("```", "")
    return text.strip()
