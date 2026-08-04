import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class SubscriptionStatus(str, enum.Enum):
    trialing = "trialing"
    active = "active"
    past_due = "past_due"
    canceled = "canceled"


class EpisodeStatus(str, enum.Enum):
    uploaded = "uploaded"
    transcribing = "transcribing"
    analyzing = "analyzing"
    ready = "ready"
    failed = "failed"


class ClipRenderStatus(str, enum.Enum):
    not_rendered = "not_rendered"
    rendering = "rendering"
    ready = "ready"
    failed = "failed"


class Organization(Base):
    """A creator's or agency's account. One creator = one org; an agency
    handling multiple clients' shows is also one org, with multiple Shows."""
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    lemonsqueezy_customer_id = Column(String, nullable=True)
    lemonsqueezy_subscription_id = Column(String, nullable=True)
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.trialing)

    users = relationship("User", back_populates="organization")
    shows = relationship("Show", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")


class Show(Base):
    """A podcast/channel. Lets an agency org keep several clients' shows
    separate, and gives a solo creator a natural home for their episodes."""
    __tablename__ = "shows"

    id = Column(String, primary_key=True, default=gen_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="shows")
    episodes = relationship("Episode", back_populates="show", cascade="all, delete-orphan")


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(String, primary_key=True, default=gen_uuid)
    show_id = Column(String, ForeignKey("shows.id"), nullable=False)

    title = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    duration_seconds = Column(Float, nullable=True)

    status = Column(Enum(EpisodeStatus), default=EpisodeStatus.uploaded)
    transcript_text = Column(Text, nullable=True)
    transcript_segments = Column(JSON, nullable=True)  # [{"start","end","text"}, ...]
    episode_summary = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

    show = relationship("Show", back_populates="episodes")
    clips = relationship("Clip", back_populates="episode", cascade="all, delete-orphan")


class Clip(Base):
    __tablename__ = "clips"

    id = Column(String, primary_key=True, default=gen_uuid)
    episode_id = Column(String, ForeignKey("episodes.id"), nullable=False)

    start_seconds = Column(Float, nullable=False)
    end_seconds = Column(Float, nullable=False)
    title = Column(String, nullable=False)
    caption = Column(Text, nullable=False)
    hashtags = Column(JSON, nullable=False, default=list)
    hook_type = Column(String, nullable=False)
    platforms = Column(JSON, nullable=False, default=list)
    virality_reasoning = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)

    render_status = Column(Enum(ClipRenderStatus), default=ClipRenderStatus.not_rendered)
    rendered_file_path = Column(String, nullable=True)
    render_error = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    episode = relationship("Episode", back_populates="clips")
