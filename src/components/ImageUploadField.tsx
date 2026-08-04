"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { USE_MOCK } from "@/lib/mock";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Props {
  value: string;
  onChange: (url: string) => void;
  site: string;
  previewBaseUrl?: string;
}

export default function ImageUploadField({ value, onChange, site, previewBaseUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);

      // 프론트 검증
      if (file.size > 5 * 1024 * 1024) {
        setError("5MB 이하 파일만 업로드할 수 있습니다");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("jpg, png, webp 이미지만 가능합니다");
        return;
      }

      setUploading(true);
      try {
        if (USE_MOCK) {
          // Simulate a brief upload delay
          await new Promise((r) => setTimeout(r, 300));
          onChange(`${API_URL}/uploads/mock-uploaded-image.jpg`);
          setUploading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${API_URL}/api/admin/${site}/upload`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "업로드 실패");
        }

        const data = await res.json();
        // /uploads/파일명 → 절대 URL로 변환
        const url = data.url.startsWith("http")
          ? data.url
          : `${API_URL}${data.url}`;
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "업로드에 실패했습니다");
      } finally {
        setUploading(false);
      }
    },
    [site, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      // 같은 파일 재선택 가능하게
      e.target.value = "";
    },
    [upload]
  );

  /* ── Ctrl+V 붙여넣기 업로드 ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [pasteActive, setPasteActive] = useState(false);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      if (!pasteActive) return;
      const file = Array.from(e.clipboardData?.files || []).find(f => f.type.startsWith("image/"));
      if (file) { e.preventDefault(); upload(file); }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [pasteActive, upload]);

  const previewSrc = value && !value.startsWith("http") && previewBaseUrl
    ? `${previewBaseUrl}${value}`
    : value;

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
      onFocus={() => setPasteActive(true)}
      onBlur={() => setPasteActive(false)}
      onMouseEnter={() => setPasteActive(true)}
      onMouseLeave={() => setPasteActive(false)}
    >
      {/* 미리보기 */}
      {value && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#f9fafb",
          }}
        >
          <img
            src={previewSrc}
            alt="미리보기"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 200,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}

      {/* 드래그 & 드롭 영역 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#36c88a" : "#d1d5db"}`,
          borderRadius: 8,
          padding: "16px 12px",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          backgroundColor: dragOver ? "#f0fdf4" : "#fafafa",
          transition: "all 0.15s",
        }}
      >
        {uploading ? (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid #d1d5db",
                borderTopColor: "#36c88a",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                marginRight: 8,
                verticalAlign: "middle",
              }}
            />
            업로드 중...
          </div>
        ) : (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📷</div>
            <div style={{ fontWeight: 500 }}>사진 올리기</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
              클릭하거나 이미지를 여기에 끌어다 놓으세요
            </div>
            <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 2 }}>
              jpg · png · webp / 5MB 이하 · Ctrl+V 붙여넣기
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* URL 직접 입력 (폴백) */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="또는 이미지 URL 직접 입력"
        style={{
          width: "100%",
          padding: "6px 10px",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          fontSize: 12,
          color: "#374151",
          backgroundColor: "#fff",
          boxSizing: "border-box",
        }}
      />

      {/* 에러 */}
      {error && (
        <div
          style={{
            color: "#dc2626",
            fontSize: 12,
            padding: "4px 8px",
            backgroundColor: "#fef2f2",
            borderRadius: 4,
          }}
        >
          {error}
        </div>
      )}

      {/* 이미지 제거 버튼 */}
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          style={{
            padding: "4px 8px",
            fontSize: 12,
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          이미지 제거
        </button>
      )}

      {/* spin 애니메이션 */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
