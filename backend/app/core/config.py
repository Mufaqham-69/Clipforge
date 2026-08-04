from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- App ---
    APP_NAME: str = "ClipForge"
    ENV: str = "development"
    SECRET_KEY: str = "change-me-in-prod"
    FRONTEND_URL: str = "http://localhost:3000"

    # --- Database ---
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/clipforge"

    # --- Redis / Celery ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Auth ---
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7

    # --- Groq (transcription: Whisper Large v3) ---
    GROQ_API_KEY: str = ""
    GROQ_WHISPER_MODEL: str = "whisper-large-v3"

    # --- Cerebras (storyboard analysis: Qwen3 235B) ---
    CEREBRAS_API_KEY: str = ""
    CEREBRAS_MODEL: str = "qwen-3-235b-a22b-instruct-2507"

    # --- Media processing ---
    # Groq's hard cap is 25MB per transcription request. Chunks are re-encoded
    # to mono 16kHz 64kbps MP3 first (speech-optimized, tiny), so 20 minutes
    # per chunk stays comfortably under that even before accounting for the
    # re-encode shrinking things further.
    TRANSCRIPTION_CHUNK_SECONDS: int = 20 * 60

    # --- File storage ---
    UPLOAD_DIR: str = "./uploads"
    CLIPS_DIR: str = "./clips"
    # Full episode video files are large. This is a local-disk MVP limit -
    # see README before you have real creators uploading multi-GB 4K files.
    MAX_UPLOAD_MB: int = 2048

    # --- Lemon Squeezy ---
    LEMONSQUEEZY_API_KEY: str = ""
    LEMONSQUEEZY_STORE_ID: str = ""
    LEMONSQUEEZY_VARIANT_ID: str = ""  # the $40/mo subscription variant
    LEMONSQUEEZY_WEBHOOK_SECRET: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
