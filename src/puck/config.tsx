import type { Config } from "@measured/puck";
import ImageUploadField from "./ImageUploadField";

/* ── 공통 테마 ── */
const THEME = {
  font: "'Pretendard', -apple-system, sans-serif",
  primary: "#36c88a",
  ink: "#111827",
  ink2: "#6b7280",
  bg: "#ffffff",
};

/* ── 글꼴 옵션 ── */
const FONT_OPTIONS = [
  { label: "프리텐다드 (기본)", value: "'Pretendard', sans-serif" },
  { label: "노토 산스", value: "'Noto Sans KR', sans-serif" },
  { label: "나눔고딕", value: "'NanumGothic', sans-serif" },
  { label: "본고딕", value: "'Source Han Sans', sans-serif" },
  { label: "시스템 기본", value: "-apple-system, BlinkMacSystemFont, sans-serif" },
];

/* ── 블록 타입 ── */
export type BlockProps = {
  Heading: {
    text: string;
    level: "h1" | "h2" | "h3";
    align: "left" | "center" | "right";
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    paddingY: number;
    paddingX: number;
    borderRadius: number;
  };
  Text: {
    content: string;
    align: "left" | "center" | "right";
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    paddingY: number;
    paddingX: number;
    borderRadius: number;
  };
  Image: {
    src: string;
    alt: string;
    maxWidth: number;
    borderRadius: number;
    paddingY: number;
    backgroundColor: string;
  };
  ImageText: {
    src: string;
    alt: string;
    text: string;
    imagePosition: "left" | "right";
    fontFamily: string;
    fontSize: number;
    color: string;
    gap: number;
    backgroundColor: string;
    paddingY: number;
    paddingX: number;
    borderRadius: number;
  };
};

export const puckConfig: Config<BlockProps> = {
  components: {
    /* ────────── 제목 ────────── */
    Heading: {
      label: "제목",
      defaultProps: {
        text: "제목을 입력하세요",
        level: "h2",
        align: "left",
        fontFamily: FONT_OPTIONS[0].value,
        fontSize: 28,
        color: THEME.ink,
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
      fields: {
        text: { type: "textarea", label: "제목 텍스트" },
        level: {
          type: "select",
          label: "태그 (SEO용)",
          options: [
            { label: "대제목 (H1)", value: "h1" },
            { label: "중제목 (H2)", value: "h2" },
            { label: "소제목 (H3)", value: "h3" },
          ],
        },
        align: {
          type: "radio",
          label: "정렬",
          options: [
            { label: "왼쪽", value: "left" },
            { label: "가운데", value: "center" },
            { label: "오른쪽", value: "right" },
          ],
        },
        fontFamily: {
          type: "select",
          label: "글꼴",
          options: FONT_OPTIONS,
        },
        fontSize: { type: "number", label: "글자 크기 (px)", min: 12, max: 120 },
        color: { type: "text", label: "글자 색 (#hex)" },
        backgroundColor: { type: "text", label: "배경색 (#hex 또는 transparent)" },
        paddingY: { type: "number", label: "위아래 여백 (px)", min: 0, max: 200 },
        paddingX: { type: "number", label: "좌우 여백 (px)", min: 0, max: 200 },
        borderRadius: { type: "number", label: "모서리 둥글기 (px)", min: 0, max: 100 },
      },
      render: ({
        text, level, align, fontFamily, fontSize, color,
        backgroundColor, paddingY, paddingX, borderRadius,
      }) => {
        const Tag = level;
        return (
          <Tag
            style={{
              fontFamily: fontFamily || THEME.font,
              fontSize: fontSize || 28,
              fontWeight: 700,
              color: color || THEME.ink,
              textAlign: align,
              lineHeight: 1.4,
              margin: 0,
              padding: `${paddingY ?? 12}px ${paddingX ?? 0}px`,
              backgroundColor: backgroundColor || "transparent",
              borderRadius: borderRadius ?? 0,
            }}
          >
            {text}
          </Tag>
        );
      },
    },

    /* ────────── 문단 ────────── */
    Text: {
      label: "문단",
      defaultProps: {
        content: "내용을 입력하세요.",
        align: "left",
        fontFamily: FONT_OPTIONS[0].value,
        fontSize: 16,
        color: THEME.ink2,
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
      fields: {
        content: { type: "textarea", label: "본문" },
        align: {
          type: "radio",
          label: "정렬",
          options: [
            { label: "왼쪽", value: "left" },
            { label: "가운데", value: "center" },
            { label: "오른쪽", value: "right" },
          ],
        },
        fontFamily: {
          type: "select",
          label: "글꼴",
          options: FONT_OPTIONS,
        },
        fontSize: { type: "number", label: "글자 크기 (px)", min: 10, max: 80 },
        color: { type: "text", label: "글자 색 (#hex)" },
        backgroundColor: { type: "text", label: "배경색 (#hex 또는 transparent)" },
        paddingY: { type: "number", label: "위아래 여백 (px)", min: 0, max: 200 },
        paddingX: { type: "number", label: "좌우 여백 (px)", min: 0, max: 200 },
        borderRadius: { type: "number", label: "모서리 둥글기 (px)", min: 0, max: 100 },
      },
      render: ({
        content, align, fontFamily, fontSize, color,
        backgroundColor, paddingY, paddingX, borderRadius,
      }) => (
        <p
          style={{
            fontFamily: fontFamily || THEME.font,
            fontSize: fontSize || 16,
            lineHeight: 1.8,
            color: color || THEME.ink2,
            textAlign: align,
            margin: 0,
            padding: `${paddingY ?? 12}px ${paddingX ?? 0}px`,
            whiteSpace: "pre-wrap",
            backgroundColor: backgroundColor || "transparent",
            borderRadius: borderRadius ?? 0,
          }}
        >
          {content}
        </p>
      ),
    },

    /* ────────── 이미지 ────────── */
    Image: {
      label: "이미지",
      defaultProps: {
        src: "",
        alt: "이미지 설명",
        maxWidth: 800,
        borderRadius: 8,
        paddingY: 24,
        backgroundColor: "transparent",
      },
      fields: {
        src: {
          type: "custom",
          label: "이미지",
          render: ({ value, onChange }) => (
            <ImageUploadField value={value} onChange={onChange} />
          ),
        },
        alt: { type: "text", label: "대체 텍스트" },
        maxWidth: { type: "number", label: "최대 너비 (px)", min: 100, max: 2000 },
        borderRadius: { type: "number", label: "모서리 둥글기 (px)", min: 0, max: 100 },
        paddingY: { type: "number", label: "위아래 여백 (px)", min: 0, max: 200 },
        backgroundColor: { type: "text", label: "배경색 (#hex 또는 transparent)" },
      },
      render: ({ src, alt, maxWidth, borderRadius, paddingY, backgroundColor }) =>
        src ? (
          <div
            style={{
              padding: `${paddingY ?? 24}px 0`,
              textAlign: "center",
              backgroundColor: backgroundColor || "transparent",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: `${maxWidth}px`,
                width: "100%",
                height: "auto",
                borderRadius: borderRadius ?? 8,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              margin: "24px 0",
              padding: "48px",
              background: "#f3f4f6",
              borderRadius: 8,
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            이미지 URL을 입력하세요
          </div>
        ),
    },

    /* ────────── 이미지 + 글 ────────── */
    ImageText: {
      label: "이미지 + 글",
      defaultProps: {
        src: "",
        alt: "이미지",
        text: "내용을 입력하세요.",
        imagePosition: "left",
        fontFamily: FONT_OPTIONS[0].value,
        fontSize: 16,
        color: THEME.ink2,
        gap: 32,
        backgroundColor: "transparent",
        paddingY: 24,
        paddingX: 0,
        borderRadius: 0,
      },
      fields: {
        src: {
          type: "custom",
          label: "이미지",
          render: ({ value, onChange }) => (
            <ImageUploadField value={value} onChange={onChange} />
          ),
        },
        alt: { type: "text", label: "대체 텍스트" },
        text: { type: "textarea", label: "본문" },
        imagePosition: {
          type: "radio",
          label: "이미지 위치",
          options: [
            { label: "왼쪽", value: "left" },
            { label: "오른쪽", value: "right" },
          ],
        },
        fontFamily: {
          type: "select",
          label: "글꼴",
          options: FONT_OPTIONS,
        },
        fontSize: { type: "number", label: "글자 크기 (px)", min: 10, max: 80 },
        color: { type: "text", label: "글자 색 (#hex)" },
        gap: { type: "number", label: "이미지-글 간격 (px)", min: 0, max: 100 },
        backgroundColor: { type: "text", label: "배경색 (#hex 또는 transparent)" },
        paddingY: { type: "number", label: "위아래 여백 (px)", min: 0, max: 200 },
        paddingX: { type: "number", label: "좌우 여백 (px)", min: 0, max: 200 },
        borderRadius: { type: "number", label: "모서리 둥글기 (px)", min: 0, max: 100 },
      },
      render: ({
        src, alt, text, imagePosition, fontFamily, fontSize, color,
        gap, backgroundColor, paddingY, paddingX, borderRadius,
      }) => (
        <div
          style={{
            display: "flex",
            flexDirection: imagePosition === "right" ? "row-reverse" : "row",
            gap: gap ?? 32,
            alignItems: "center",
            padding: `${paddingY ?? 24}px ${paddingX ?? 0}px`,
            backgroundColor: backgroundColor || "transparent",
            borderRadius: borderRadius ?? 0,
          }}
        >
          <div style={{ flex: "0 0 45%" }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
            ) : (
              <div
                style={{
                  padding: "60px 24px",
                  background: "#f3f4f6",
                  borderRadius: 8,
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 14,
                }}
              >
                이미지 URL
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: fontFamily || THEME.font,
                fontSize: fontSize || 16,
                lineHeight: 1.8,
                color: color || THEME.ink2,
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {text}
            </p>
          </div>
        </div>
      ),
    },
  },
};
