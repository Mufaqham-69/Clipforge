"use client";

import { useRef, useState } from "react";

export function UploadDropzone({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setUploadProgress("Reading file metadata...");
    try {
      const file = files[0];
      setUploadProgress(`Uploading: ${file.name} (${Math.round(file.size / (1024 * 1024))} MB)...`);
      await onUpload(file);
      setUploadProgress(null);
    } catch (err) {
      setUploadProgress("Upload failed, try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !busy && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 relative overflow-hidden ${
        busy ? "border-lime/30 bg-surface/50 cursor-not-allowed" :
        dragging ? "border-lime bg-lime/5 scale-[0.99] shadow-[0_0_20px_rgba(212,255,63,0.05)] cursor-pointer" : 
        "border-line bg-surface-raised hover:border-line/80 hover:bg-surface cursor-pointer"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="space-y-4 max-w-sm mx-auto">
        {/* Upload icon visual */}
        <div className="mx-auto w-12 h-12 rounded-full bg-void border border-line flex items-center justify-center text-ink-dim/80">
          {busy ? (
            <svg className="animate-spin h-5 w-5 text-lime" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        <div className="space-y-1">
          <p className="font-display font-bold text-base text-ink">
            {busy ? uploadProgress : "Drop your episode media here"}
          </p>
          <p className="text-xs text-ink-dim leading-relaxed">
            {busy
              ? "Your raw episode is uploading directly to our stitch engine."
              : "Supports MP3, WAV, MP4, MKV — Audio or Video, any file size"}
          </p>
        </div>

        {!busy && (
          <span className="inline-block text-[10px] font-mono text-lime bg-lime/10 border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Browse local files
          </span>
        )}
      </div>
    </div>
  );
}
