"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  site?: string;
}

async function uploadImage(file: File, site: string): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error("5MB 이하 파일만 업로드할 수 있습니다");
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 가능합니다");

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/admin/${site}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "업로드 실패");
  }

  const data = await res.json();
  return data.url.startsWith("http") ? data.url : `${API_URL}${data.url}`;
}

export default function RichEditor({ value, onChange, site = "union" }: RichEditorProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["left", "center", "right"] }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Ctrl+V 이미지 붙여넣기 + 드래그 앤 드롭 이미지
  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        handlePaste: ((_view: unknown, event: ClipboardEvent) => {
          const files = Array.from(event.clipboardData?.files || []);
          const imageFile = files.find(f => f.type.startsWith("image/"));
          if (!imageFile) return false;
          event.preventDefault();
          uploadImage(imageFile, site)
            .then(url => editor.chain().focus().setImage({ src: url }).run())
            .catch(err => alert(err.message));
          return true;
        }) as never,
        handleDrop: ((_view: unknown, event: DragEvent, _slice: unknown, moved: boolean) => {
          if (moved) return false;
          const files = Array.from(event.dataTransfer?.files || []);
          const imageFile = files.find(f => f.type.startsWith("image/"));
          if (!imageFile) return false;
          event.preventDefault();
          uploadImage(imageFile, site)
            .then(url => editor.chain().focus().setImage({ src: url }).run())
            .catch(err => alert(err.message));
          return true;
        }) as never,
      },
    });
  }, [editor, site]);

  /** 구분선 삽입 뒤 빈 문단 추가 (커서 이동용) */
  const appendTrailingParagraph = useCallback(() => {
    if (!editor) return;
    requestAnimationFrame(() => {
      if (editor.isDestroyed) return;
      const { doc } = editor.state;
      const lastNode = doc.lastChild;
      if (!lastNode || lastNode.type.name !== "paragraph" || lastNode.content.size > 0) {
        editor.commands.insertContentAt(doc.content.size, "<p></p>");
      }
    });
  }, [editor]);

  const toggleSource = useCallback(() => {
    if (sourceMode) {
      editor?.commands.setContent(sourceHtml, { emitUpdate: false });
      onChange(sourceHtml);
      setSourceMode(false);
    } else {
      setSourceHtml(editor?.getHTML() ?? "");
      setSourceMode(true);
    }
  }, [sourceMode, sourceHtml, editor, onChange]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (editor.isActive("link")) {
      const url = window.prompt("링크 URL을 입력하세요 (빈칸이면 링크 해제):", editor.getAttributes("link").href || "");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") { alert("http 또는 https URL만 허용됩니다"); return; }
      } catch { alert("올바른 URL을 입력하세요"); return; }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else if (hasSelection) {
      const url = window.prompt("링크 URL을 입력하세요:");
      if (!url) return;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") { alert("http 또는 https URL만 허용됩니다"); return; }
      } catch { alert("올바른 URL을 입력하세요"); return; }
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      const url = window.prompt("링크 URL을 입력하세요:");
      if (!url) return;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") { alert("http 또는 https URL만 허용됩니다"); return; }
      } catch { alert("올바른 URL을 입력하세요"); return; }
      const text = window.prompt("링크 텍스트를 입력하세요:", url) || url;
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    }
  }, [editor]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    uploadImage(file, site)
      .then(url => editor.chain().focus().setImage({ src: url }).run())
      .catch(err => alert(err.message));
    e.target.value = "";
  }, [editor, site]);

  if (!editor) return <div className="h-64 bg-gray-50 animate-pulse rounded-lg" />;

  const Btn = ({
    active,
    disabled,
    onClick,
    children,
    title,
    danger,
  }: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        disabled
          ? "bg-white text-gray-300 cursor-not-allowed"
          : danger
            ? "bg-white text-red-600 hover:bg-red-50 border border-red-200"
            : active
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  const isImageSelected = editor.isActive("image");

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-300">
        {/* Undo / Redo */}
        <Btn
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          title="실행취소 (Ctrl+Z)"
        >
          ↶ 실행취소
        </Btn>
        <Btn
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          title="다시실행 (Ctrl+Shift+Z)"
        >
          ↷ 다시실행
        </Btn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <Btn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="굵게"
        >
          <b>B</b>
        </Btn>
        <Btn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="기울임"
        >
          <i>I</i>
        </Btn>
        <Btn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="밑줄"
        >
          <u>U</u>
        </Btn>
        <Btn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="취소선"
        >
          <s>S</s>
        </Btn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <Btn
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="제목 1"
        >
          H1
        </Btn>
        <Btn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="제목 2"
        >
          H2
        </Btn>
        <Btn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="제목 3"
        >
          H3
        </Btn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <Btn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="글머리 목록"
        >
          &bull; 목록
        </Btn>
        <Btn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="번호 목록"
        >
          1. 목록
        </Btn>
        <Btn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="인용"
        >
          &ldquo; 인용
        </Btn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        {(["left", "center", "right"] as const).map(align => (
          <Btn key={align}
            active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            title={align === "left" ? "왼쪽 정렬" : align === "center" ? "가운데 정렬" : "오른쪽 정렬"}
          >
            <span style={{ display: "inline-flex", flexDirection: "column", gap: 1.5, width: 14 }}>
              {[0.9, 0.6, 0.75].map((w, i) => (
                <span key={i} style={{
                  height: 1.5, background: "currentColor", borderRadius: 1,
                  width: `${w * 100}%`,
                  marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : 0,
                  marginRight: align === "center" ? "auto" : 0,
                }} />
              ))}
            </span>
          </Btn>
        ))}

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <Btn onClick={addLink} active={editor.isActive("link")} title="링크">
          링크
        </Btn>
        <Btn onClick={() => fileInputRef.current?.click()} title="이미지 업로드">
          이미지
        </Btn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <Btn
          onClick={() => {
            editor.chain().focus().setHorizontalRule().run();
            appendTrailingParagraph();
          }}
          title="구분선"
        >
          ─
        </Btn>

        {/* 이미지 선택 시 삭제 버튼 */}
        {isImageSelected && (
          <>
            <span className="w-px h-5 bg-gray-300 mx-1" />
            <Btn
              danger
              onClick={() => editor.chain().focus().deleteSelection().run()}
              title="선택한 이미지 삭제"
            >
              이미지 삭제
            </Btn>
          </>
        )}

        <div className="ml-auto">
          <Btn active={sourceMode} onClick={toggleSource} title="소스보기(HTML)">
            &lt;/&gt; HTML
          </Btn>
        </div>
      </div>

      {/* Editor / Source */}
      {sourceMode ? (
        <textarea
          className="w-full h-80 p-4 font-mono text-sm text-gray-800 resize-y focus:outline-none"
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
        />
      ) : (
        <EditorContent editor={editor} className="rich-editor-content" />
      )}
    </div>
  );
}
