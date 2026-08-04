from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import require_active_subscription
from app.core.config import get_settings
from app.db.database import get_db
from app.db.models import Episode, EpisodeStatus, Show, User
from app.schemas.episode import EpisodeDetail, EpisodeResponse
from app.services.storage import save_upload
from app.workers.tasks import process_episode

router = APIRouter(prefix="/api/shows/{show_id}/episodes", tags=["episodes"])
settings = get_settings()

ALLOWED_MIME_TYPES = {
    "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/x-wav",
    "video/mp4", "video/quicktime", "video/x-matroska",
}


def _get_show(show_id: str, db: Session, user: User) -> Show:
    show = db.query(Show).filter(Show.id == show_id, Show.organization_id == user.organization_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show


@router.post("", response_model=EpisodeResponse)
async def upload_episode(
    show_id: str,
    file: UploadFile,
    db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    show = _get_show(show_id, db, user)

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type {file.content_type}. Upload the episode's audio or video file.",
        )

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_UPLOAD_MB}MB limit")

    storage_path = save_upload(contents, file.filename)

    episode = Episode(
        show_id=show.id,
        title=file.filename,
        original_filename=file.filename,
        storage_path=storage_path,
        mime_type=file.content_type,
        status=EpisodeStatus.uploaded,
    )
    db.add(episode)
    db.commit()
    db.refresh(episode)

    process_episode.delay(episode.id)

    return episode


@router.get("", response_model=list[EpisodeResponse])
def list_episodes(show_id: str, db: Session = Depends(get_db), user: User = Depends(require_active_subscription)):
    show = _get_show(show_id, db, user)
    return show.episodes


@router.get("/{episode_id}", response_model=EpisodeDetail)
def get_episode(
    show_id: str, episode_id: str, db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    show = _get_show(show_id, db, user)
    episode = db.query(Episode).filter(Episode.id == episode_id, Episode.show_id == show.id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    return episode


@router.get("/{episode_id}/media")
def stream_episode_media(
    show_id: str, episode_id: str, db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    """
    Serves the original uploaded file for in-browser preview/seeking. The
    frontend fetches this with an auth header and plays it from a blob URL,
    since native <audio>/<video> elements can't send Authorization headers.
    Fine for typical podcast-length files; swap for S3 range-request
    streaming before this needs to handle multi-GB video comfortably.
    """
    show = _get_show(show_id, db, user)
    episode = db.query(Episode).filter(Episode.id == episode_id, Episode.show_id == show.id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    return FileResponse(episode.storage_path, media_type=episode.mime_type)
