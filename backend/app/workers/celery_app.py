from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "clipforge",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    # A 2-hour episode chunked into 20-minute pieces plus a storyboard pass
    # needs real headroom - this is the long-runner in the whole codebase.
    task_time_limit=1800,
)

celery_app.autodiscover_tasks(["app.workers"])
