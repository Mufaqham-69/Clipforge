import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import require_active_subscription
from app.db.database import get_db
from app.db.models import Clip, ClipRenderStatus, Episode, Show, User
from app.schemas.episode import ClipResponse
from app.workers.tasks import render_clip

router = APIRouter(prefix="/api/episodes/{episode_id}/clips", tags=["clips"])


def _get_clip(episode_id: str, clip_id: str, db: Session, user: User) -> Clip:
    clip = (
        db.query(Clip)
        .join(Episode)
        .join(Show)
        .filter(
            Clip.id == clip_id,
            Clip.episode_id == episode_id,
            Show.organization_id == user.organization_id,
        )
        .first()
    )
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return clip


@router.post("/{clip_id}/render", response_model=ClipResponse)
def trigger_render(
    episode_id: str, clip_id: str, db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    clip = _get_clip(episode_id, clip_id, db, user)
    if clip.render_status == ClipRenderStatus.rendering:
        raise HTTPException(status_code=409, detail="Clip is already rendering")

    clip.render_status = ClipRenderStatus.rendering
    db.commit()
    db.refresh(clip)

    render_clip.delay(clip.id)
    return clip


@router.get("/{clip_id}", response_model=ClipResponse)
def get_clip(
    episode_id: str, clip_id: str, db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    return _get_clip(episode_id, clip_id, db, user)


@router.get("/{clip_id}/download")
def download_clip(
    episode_id: str, clip_id: str, db: Session = Depends(get_db),
    user: User = Depends(require_active_subscription),
):
    clip = _get_clip(episode_id, clip_id, db, user)
    if clip.render_status != ClipRenderStatus.ready or not clip.rendered_file_path:
        raise HTTPException(status_code=409, detail="Clip has not been rendered yet")
    if not os.path.exists(clip.rendered_file_path):
        raise HTTPException(status_code=404, detail="Rendered file is missing on disk")
    return FileResponse(clip.rendered_file_path, filename=os.path.basename(clip.rendered_file_path))
