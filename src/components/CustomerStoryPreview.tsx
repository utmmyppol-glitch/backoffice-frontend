"use client";

import type { ReactNode } from "react";
import type { StoryForm } from "./CustomerStoryManager";

const ACCENT = "#36c88a";

function Badge({ text }: { text: string }) {
  return (
    <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: ACCENT, border: `1px solid ${ACCENT}`, padding: "5px 14px", marginBottom: 12 }}>
      {text}
    </span>
  );
}

/** 클릭하면 왼쪽 폼의 해당 위치로 이동시키는 래퍼 */
function Zone({ field, onJump, children }: { field: string; onJump?: (f: string) => void; children: ReactNode }) {
  return (
    <div
      onClick={onJump ? () => onJump(field) : undefined}
      title={onJump ? "클릭하면 편집 위치로 이동" : undefined}
      style={{ cursor: onJump ? "pointer" : "default", borderRadius: 6, padding: 4, margin: -4, transition: "box-shadow 0.12s, background 0.12s" }}
      onMouseEnter={onJump ? (e) => { e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${ACCENT}66`; e.currentTarget.style.background = `${ACCENT}0d`; } : undefined}
      onMouseLeave={onJump ? (e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "transparent"; } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * 고객사례 편집 실시간 미리보기.
 * 공개 상세페이지(CustomerDetailClient) 레이아웃의 축소판. form state를 그대로 렌더 → 타이핑 즉시 반영.
 * onJump: 미리보기 영역 클릭 시 왼쪽 폼의 해당 필드로 이동.
 */
export default function CustomerStoryPreview({ form, onJump }: { form: StoryForm; onJump?: (field: string) => void }) {
  const bg = form.background.filter((s) => s.trim());
  const ft = form.features.filter((s) => s.trim());
  const ef = form.effects.filter((s) => s.trim());
  const industry = form.industry || form.metaIndustry;
  const heading = form.title || form.pageHeading;
  const mainImage = form.mainImage || form.thumbnailUrl;
  const hasDetail =
    !!(form.companyDesc || form.pageHeading || bg.length || ft.length || ef.length ||
      form.quote || form.quoteSource || form.mainImage || form.detailImage ||
      form.metaDate || form.metaIndustry || form.metaPurpose);

  return (
    <div style={{ backgroundColor: "#fff", color: "#101828", fontSize: 13, lineHeight: 1.7 }}>
      {/* ── 회사명 대제목 ── */}
      <Zone field="company" onJump={onJump}>
        <div style={{ borderBottom: "1px solid #e6e8ec", paddingBottom: 18, marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#98a2b3", marginBottom: 8 }}>← 고객사례 목록으로</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: form.company ? "#101828" : "#cbd5e1" }}>
            {form.company || "회사명"}
          </h1>
        </div>
      </Zone>

      {/* ── 메타 ── */}
      {(form.metaDate || industry || form.metaPurpose) && (
        <Zone field="detail" onJump={onJump}>
          <div style={{ marginBottom: 16 }}>
            {form.metaDate && (
              <span style={{ display: "inline-block", fontSize: 11, color: "#667085", border: "1px solid #e6e8ec", padding: "4px 10px", marginBottom: 12 }}>
                {form.metaDate}
              </span>
            )}
            {(industry || form.metaPurpose) && (
              <div style={{ fontSize: 12, color: "#667085" }}>
                {industry && <div><b style={{ color: "#101828" }}>업종:</b> {industry}</div>}
                {form.metaPurpose && <div><b style={{ color: "#101828" }}>목적·효과:</b> {form.metaPurpose}</div>}
              </div>
            )}
          </div>
        </Zone>
      )}

      {/* ── 대제목 ── */}
      <Zone field="title" onJump={onJump}>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.35, textAlign: "center", margin: "0 0 14px", color: heading ? "#101828" : "#cbd5e1" }}>
          {heading || "상세 대제목"}
        </h2>
      </Zone>

      {/* ── 메인 이미지 ── */}
      {mainImage && (
        <Zone field="detail" onJump={onJump}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mainImage} alt="" style={{ width: "100%", height: "auto", display: "block", borderRadius: 6, marginBottom: 20 }} />
        </Zone>
      )}

      {/* ── 상세 내용 (없으면 본문 폴백) ── */}
      {hasDetail ? (
        <>
          {form.companyDesc && (
            <Zone field="detail" onJump={onJump}>
              <div style={{ borderTop: "1px solid #e6e8ec", paddingTop: 20, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, paddingLeft: 12, borderLeft: `3px solid ${ACCENT}` }}>{form.company || "회사"}</h3>
                <p style={{ color: "#475467", margin: 0 }}>{form.companyDesc}</p>
              </div>
            </Zone>
          )}

          {bg.length > 0 && (
            <Zone field="detail" onJump={onJump}>
              <div style={{ marginBottom: 24 }}>
                <Badge text="도입 배경" />
                <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", color: "#475467" }}>
                  {bg.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}
                </ul>
              </div>
            </Zone>
          )}

          {ft.length > 0 && (
            <Zone field="detail" onJump={onJump}>
              <div style={{ marginBottom: 24 }}>
                <Badge text="적용 솔루션" />
                <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", color: "#475467" }}>
                  {ft.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}
                </ul>
              </div>
            </Zone>
          )}

          {form.detailImage && (
            <Zone field="detail" onJump={onJump}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.detailImage} alt="" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24, borderRadius: 6 }} />
            </Zone>
          )}

          {ef.length > 0 && (
            <Zone field="detail" onJump={onJump}>
              <div style={{ marginBottom: 24 }}>
                <Badge text="도입 효과" />
                <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", color: "#475467" }}>
                  {ef.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}
                </ul>
              </div>
            </Zone>
          )}

          {form.quote && (
            <Zone field="detail" onJump={onJump}>
              <div style={{ padding: 18, backgroundColor: "#f9fafb", borderLeft: `4px solid ${ACCENT}`, marginBottom: 8 }}>
                <p style={{ color: "#334155", margin: 0, whiteSpace: "pre-line" }}>{form.quote}</p>
                {form.quoteSource && (
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10, marginBottom: 0, textAlign: "right" }}>— {form.quoteSource}</p>
                )}
              </div>
            </Zone>
          )}
        </>
      ) : form.content ? (
        <Zone field="content" onJump={onJump}>
          <div className="rich-html" style={{ color: "#475467" }} dangerouslySetInnerHTML={{ __html: form.content }} />
        </Zone>
      ) : (
        <p style={{ color: "#98a2b3", textAlign: "center", padding: "24px 0" }}>
          여기에 상세 내용 미리보기가 표시됩니다.<br />왼쪽에서 입력해보세요.
        </p>
      )}
    </div>
  );
}
