import type { Config } from "@measured/puck";

// dataware 사이트 실제 스타일 기준
const THEME = {
  font: "'Pretendard', -apple-system, sans-serif",
  primary: "#36c88a",
  ink: "#111827",
  ink2: "#6b7280",
  bg: "#ffffff",
};

export type BlockProps = {
  Heading: { text: string; level: "h1" | "h2" | "h3"; align: "left" | "center" };
  Text: { content: string; align: "left" | "center" };
  Image: { src: string; alt: string; maxWidth: number };
  ImageText: {
    src: string;
    alt: string;
    text: string;
    imagePosition: "left" | "right";
  };
};

export const puckConfig: Config<BlockProps> = {
  components: {
    Heading: {
      label: "제목",
      defaultProps: { text: "제목을 입력하세요", level: "h2", align: "left" },
      fields: {
        text: { type: "text", label: "제목 텍스트" },
        level: {
          type: "select",
          label: "크기",
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
          ],
        },
      },
      render: ({ text, level, align }) => {
        const Tag = level;
        const sizes = { h1: 36, h2: 28, h3: 22 };
        return (
          <Tag
            style={{
              fontFamily: THEME.font,
              fontSize: sizes[level],
              fontWeight: 700,
              color: THEME.ink,
              textAlign: align,
              lineHeight: 1.4,
              margin: "24px 0 12px",
            }}
          >
            {text}
          </Tag>
        );
      },
    },

    Text: {
      label: "문단",
      defaultProps: { content: "내용을 입력하세요.", align: "left" },
      fields: {
        content: { type: "textarea", label: "본문" },
        align: {
          type: "radio",
          label: "정렬",
          options: [
            { label: "왼쪽", value: "left" },
            { label: "가운데", value: "center" },
          ],
        },
      },
      render: ({ content, align }) => (
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: 16,
            lineHeight: 1.8,
            color: THEME.ink2,
            textAlign: align,
            margin: "12px 0",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </p>
      ),
    },

    Image: {
      label: "이미지",
      defaultProps: { src: "", alt: "이미지 설명", maxWidth: 800 },
      fields: {
        src: { type: "text", label: "이미지 URL" },
        alt: { type: "text", label: "대체 텍스트" },
        maxWidth: { type: "number", label: "최대 너비 (px)" },
      },
      render: ({ src, alt, maxWidth }) =>
        src ? (
          <div style={{ margin: "24px 0", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: `${maxWidth}px`,
                width: "100%",
                height: "auto",
                borderRadius: 8,
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

    ImageText: {
      label: "이미지 + 글",
      defaultProps: {
        src: "",
        alt: "이미지",
        text: "내용을 입력하세요.",
        imagePosition: "left",
      },
      fields: {
        src: { type: "text", label: "이미지 URL" },
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
      },
      render: ({ src, alt, text, imagePosition }) => (
        <div
          style={{
            display: "flex",
            flexDirection: imagePosition === "right" ? "row-reverse" : "row",
            gap: 32,
            alignItems: "center",
            margin: "32px 0",
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
                fontFamily: THEME.font,
                fontSize: 16,
                lineHeight: 1.8,
                color: THEME.ink2,
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
