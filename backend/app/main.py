import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, billing, clips, episodes, shows
from app.core.config import get_settings
from app.db.database import Base, engine

logging.basicConfig(level=logging.INFO)
settings = get_settings()

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(shows.router)
app.include_router(episodes.router)
app.include_router(clips.router)
app.include_router(billing.router)


@app.on_event("startup")
def on_startup():
    # MVP: create tables directly. Switch to Alembic migrations before you
    # have real user data you can't afford to lose on a schema change.
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.APP_NAME}
