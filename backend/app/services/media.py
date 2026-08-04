"""
Thin wrappers around ffmpeg/ffprobe. Shells out rather than using a Python
binding - ffmpeg's CLI is what's actually documented and debuggable, and we
only need three operations.
"""
import json
import logging
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)


class MediaError(RuntimeError):
    pass


def probe_duration_seconds(file_path: str) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", file_path],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise MediaError(f"ffprobe failed: {result.stderr}")
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def has_video_stream(file_path: str) -> bool:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
         "stream=codec_type", "-of", "json", file_path],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise MediaError(f"ffprobe failed: {result.stderr}")
    data = json.loads(result.stdout)
    return len(data.get("streams", [])) > 0


def extract_audio_chunks(source_path: str, output_dir: str, chunk_seconds: int) -> list[tuple[str, float]]:
    """
    Re-encodes the source's audio track to mono 16kHz MP3 at 64kbps (small,
    speech-optimized, and what Whisper expects internally anyway) and splits
    it into fixed-length chunks small enough to clear Groq's 25MB per-request
    limit. Returns [(chunk_file_path, start_offset_seconds), ...] in order.

    Note: chunks are cut on fixed time boundaries with no overlap, so a word
    can occasionally get split across a chunk boundary. Fine for a storyboard
    pass; if frame-perfect transcripts matter later, add a few seconds of
    overlap here and de-dupe the overlapping text downstream.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    duration = probe_duration_seconds(source_path)

    chunks: list[tuple[str, float]] = []
    offset = 0.0
    index = 0
    while offset < duration:
        chunk_path = str(Path(output_dir) / f"chunk_{index:03d}.mp3")
        cmd = [
            "ffmpeg", "-y", "-i", source_path,
            "-vn", "-ac", "1", "-ar", "16000", "-b:a", "64k",
            "-ss", str(offset), "-t", str(chunk_seconds),
            chunk_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise MediaError(f"ffmpeg chunk extraction failed: {result.stderr}")
        chunks.append((chunk_path, offset))
        offset += chunk_seconds
        index += 1

    return chunks


def cut_clip(source_path: str, output_path: str, start_seconds: float, end_seconds: float, has_video: bool) -> None:
    """
    Cuts [start_seconds, end_seconds] out of the original media file,
    re-encoding (not stream-copying) so the cut lands exactly on the
    requested timestamps rather than snapping to the nearest keyframe.
    """
    duration = max(0.1, end_seconds - start_seconds)
    cmd = ["ffmpeg", "-y", "-i", source_path, "-ss", str(start_seconds), "-t", str(duration)]
    if has_video:
        cmd += ["-c:v", "libx264", "-c:a", "aac"]
    else:
        cmd += ["-vn", "-c:a", "aac"]
    cmd.append(output_path)

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise MediaError(f"ffmpeg clip cut failed: {result.stderr}")
