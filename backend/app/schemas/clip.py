from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

HookType = Literal[
    "shocking_stat", "emotional_story", "controversial_take",
    "actionable_insight", "punchline", "cliffhanger", "relatable_moment",
]
Platform = Literal["tiktok", "instagram_reels", "youtube_shorts"]

MIN_CLIP_SECONDS = 12
MAX_CLIP_SECONDS = 95


class ClipCandidate(BaseModel):
    start_seconds: float = Field(description="Exact clip start, in seconds from episode start")
    end_seconds: float = Field(description="Exact clip end, in seconds from episode start")
    title: str = Field(description="Short internal label for this clip, not the caption")
    caption: str = Field(description="Punchy, hook-first caption ready to post alongside the clip")
    hashtags: list[str] = Field(default_factory=list, max_length=8)
    hook_type: HookType
    platforms: list[Platform] = Field(
        default_factory=list, description="Which short-form platforms this clip fits best"
    )
    virality_reasoning: str = Field(description="One or two sentences on why this moment works as a clip")
    confidence: float = Field(ge=0.0, le=1.0)

    @model_validator(mode="after")
    def check_bounds(self) -> "ClipCandidate":
        duration = self.end_seconds - self.start_seconds
        if duration <= 0:
            raise ValueError("end_seconds must be after start_seconds")
        if not (MIN_CLIP_SECONDS <= duration <= MAX_CLIP_SECONDS):
            raise ValueError(
                f"clip duration {duration:.0f}s is outside the {MIN_CLIP_SECONDS}-{MAX_CLIP_SECONDS}s "
                f"short-form range - tighten or widen the [start_seconds, end_seconds] window"
            )
        return self


class StoryboardResult(BaseModel):
    episode_summary: str = Field(description="2-3 sentence summary of the episode's overall arc")
    clips: list[ClipCandidate] = Field(default_factory=list)

    @field_validator("clips")
    @classmethod
    def sort_by_start(cls, clips: list[ClipCandidate]) -> list[ClipCandidate]:
        return sorted(clips, key=lambda c: c.start_seconds)
