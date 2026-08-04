from datetime import datetime

from pydantic import BaseModel

from app.schemas.clip import ClipCandidate


class ShowCreate(BaseModel):
    name: str


class ShowResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str


class ClipResponse(ClipCandidate):
    id: str
    render_status: str
    rendered_file_path: str | None = None

    class Config:
        from_attributes = True


class EpisodeResponse(BaseModel):
    id: str
    show_id: str
    title: str
    original_filename: str
    status: str
    duration_seconds: float | None = None
    episode_summary: str | None = None
    error_message: str | None = None
    uploaded_at: datetime
    clips: list[ClipResponse] = []

    class Config:
        from_attributes = True


class EpisodeDetail(EpisodeResponse):
    transcript_segments: list[TranscriptSegment] | None = None
