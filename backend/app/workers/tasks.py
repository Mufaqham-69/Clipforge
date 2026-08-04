"""
Async jobs. Thin wrappers around app/services/* so the actual pipeline logic
stays testable without spinning up Celery/Redis.
"""
import asyncio
import logging
from datetime import datetime

from app.db.database import SessionLocal
from app.db.models import Clip, ClipRenderStatus, Episode, EpisodeStatus
from app.services.media import cut_clip, has_video_stream, probe_duration_seconds
from app.services.storage import clip_output_path
from app.services.storyboard_engine import build_storyboard
from app.services.transcription import transcribe_episode
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


def _run_async(coro):
    """Celery workers are sync; the LLM router and media pipeline are async. Bridge the two."""
    return asyncio.run(coro)


@celery_app.task(name="process_episode", bind=True, max_retries=1)
def process_episode(self, episode_id: str):
    db = SessionLocal()
    try:
        episode = db.query(Episode).filter(Episode.id == episode_id).first()
        if not episode:
            logger.error("process_episode: episode %s not found", episode_id)
            return

        episode.duration_seconds = probe_duration_seconds(episode.storage_path)
        episode.status = EpisodeStatus.transcribing
        db.commit()

        transcript = _run_async(transcribe_episode(episode.storage_path))
        if not transcript["segments"]:
            raise ValueError("Transcription produced no segments - check the source audio")

        episode.transcript_text = transcript["text"]
        episode.transcript_segments = transcript["segments"]
        episode.status = EpisodeStatus.analyzing
        db.commit()

        storyboard = _run_async(build_storyboard(transcript["segments"]))

        episode.episode_summary = storyboard.episode_summary
        for candidate in storyboard.clips:
            db.add(Clip(
                episode_id=episode.id,
                start_seconds=candidate.start_seconds,
                end_seconds=candidate.end_seconds,
                title=candidate.title,
                caption=candidate.caption,
                hashtags=candidate.hashtags,
                hook_type=candidate.hook_type,
                platforms=candidate.platforms,
                virality_reasoning=candidate.virality_reasoning,
                confidence=candidate.confidence,
            ))

        episode.status = EpisodeStatus.ready
        episode.processed_at = datetime.utcnow()
        db.commit()

    except Exception as exc:  # noqa: BLE001
        logger.exception("process_episode failed for %s", episode_id)
        episode = db.query(Episode).filter(Episode.id == episode_id).first()
        if episode:
            episode.status = EpisodeStatus.failed
            episode.error_message = str(exc)
            db.commit()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()


@celery_app.task(name="render_clip", bind=True, max_retries=1)
def render_clip(self, clip_id: str):
    db = SessionLocal()
    try:
        clip = db.query(Clip).filter(Clip.id == clip_id).first()
        if not clip:
            logger.error("render_clip: clip %s not found", clip_id)
            return

        episode = clip.episode
        clip.render_status = ClipRenderStatus.rendering
        db.commit()

        video_present = has_video_stream(episode.storage_path)
        output_path = clip_output_path(episode.id, clip.id, video_present)
        cut_clip(episode.storage_path, output_path, clip.start_seconds, clip.end_seconds, video_present)

        clip.rendered_file_path = output_path
        clip.render_status = ClipRenderStatus.ready
        db.commit()

    except Exception as exc:  # noqa: BLE001
        logger.exception("render_clip failed for %s", clip_id)
        clip = db.query(Clip).filter(Clip.id == clip_id).first()
        if clip:
            clip.render_status = ClipRenderStatus.failed
            clip.render_error = str(exc)
            db.commit()
        raise self.retry(exc=exc, countdown=30)
    finally:
        db.close()
