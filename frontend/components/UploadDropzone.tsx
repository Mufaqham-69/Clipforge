"use client";

import { useRef, useState } from "react";

export function UploadDropzone({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      await onUpload(files[0]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-colors
        ${dragging ? "border-lime bg-lime/5" : "border-line bg-surface"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="font-display text-lg mb-1">{busy ? "Uploading…" : "Drop the full episode here"}</p>
      <p className="text-sm text-ink-dim">Audio or video, any length — we'll chunk and transcribe it automatically</p>
    </div>
  );
}
