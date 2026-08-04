from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Show, User
from app.schemas.episode import ShowCreate, ShowResponse

router = APIRouter(prefix="/api/shows", tags=["shows"])


@router.post("", response_model=ShowResponse)
def create_show(payload: ShowCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    show = Show(organization_id=user.organization_id, name=payload.name)
    db.add(show)
    db.commit()
    db.refresh(show)
    return show


@router.get("", response_model=list[ShowResponse])
def list_shows(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Show).filter(Show.organization_id == user.organization_id).order_by(Show.created_at.desc()).all()
