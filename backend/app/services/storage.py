import os
import uuid

from app.core.config import get_settings

settings = get_settings()


def save_upload(file_bytes: bytes, original_filename: str) -> str:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(original_filename)[1]
    stored_name = f"{uuid.uuid4()}{ext}"
    path = os.path.join(settings.UPLOAD_DIR, stored_name)
    with open(path, "wb") as f:
        f.write(file_bytes)
    return path


def clip_output_path(episode_id: str, clip_id: str, has_video: bool) -> str:
    os.makedirs(settings.CLIPS_DIR, exist_ok=True)
    ext = "mp4" if has_video else "m4a"
    return os.path.join(settings.CLIPS_DIR, f"{episode_id}_{clip_id}.{ext}")
