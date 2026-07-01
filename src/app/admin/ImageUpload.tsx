"use client";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "./ui";

export default function ImageUpload({
  token,
  value,
  onChange,
}: {
  token: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getUrlFromAdmin = useMutation(api.files.getUrlFromAdmin);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({ token });
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const { storageId } = (await res.json()) as { storageId: string };
      const url = await getUrlFromAdmin({ token, storageId });
      if (!url) throw new Error("Could not resolve URL");
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={value}
            alt="preview"
            className="w-16 h-16 rounded-lg object-cover border border-[#2a2a30]"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-[#2a2a30] flex items-center justify-center text-xs text-[#8B8B8B]">
            none
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange("")}
              disabled={uploading}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a path like /me.png"
        className="rounded-lg bg-[#0a0a0e] border border-[#2a2a30] px-3 py-2 outline-none focus:border-[#EDFF21]/50 text-xs font-mono"
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
