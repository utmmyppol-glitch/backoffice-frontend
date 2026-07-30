#!/usr/bin/env node
/**
 * 페이지 빌더 초기 콘텐츠 시드 스크립트
 *
 * 사용법:
 *   node scripts/seed-page-layouts.mjs [--token <JWT>] [--api <base-url>]
 *
 * 환경변수로도 가능:
 *   SEED_TOKEN=<JWT> SEED_API=http://localhost:8080 node scripts/seed-page-layouts.mjs
 *
 * 대상 페이지:
 *   - dataware / seminar
 *   - union   / company
 */

const API_BASE = process.argv.includes("--api")
  ? process.argv[process.argv.indexOf("--api") + 1]
  : process.env.SEED_API || "http://localhost:8080";

const TOKEN = process.argv.includes("--token")
  ? process.argv[process.argv.indexOf("--token") + 1]
  : process.env.SEED_TOKEN || "";

/* ── helper: 고유 ID 생성 ── */
let _seq = 0;
const uid = () => `seed-${++_seq}-${Date.now().toString(36)}`;

/* ================================================================
   dataware / seminar  — Puck 블록
   ================================================================ */
const seminarContent = {
  content: [
    /* ── Hero ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "DATAWARE 맞춤형 방문 세미나",
        level: "h1",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 48,
        color: "#F9FAFB",
        backgroundColor: "#0b1220",
        paddingY: 80,
        paddingX: 56,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "전문 컨설턴트가 직접 방문하여 귀사의 데이터 환경에 맞는 최적의 솔루션을 제안해 드립니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "rgba(255,255,255,0.5)",
        backgroundColor: "#0f172a",
        paddingY: 12,
        paddingX: 56,
        borderRadius: 0,
      },
    },

    /* ── 세미나 진행 프로세스 ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "세미나 진행 프로세스",
        level: "h2",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 28,
        color: "#ffffff",
        backgroundColor: "#0f172a",
        paddingY: 48,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "신청부터 완료까지 3단계",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        color: "#94a3b8",
        backgroundColor: "#0f172a",
        paddingY: 4,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* Step 1 */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "STEP 1 — 제품 및 기능소개",
        level: "h3",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 22,
        color: "#36c88a",
        backgroundColor: "#0f172a",
        paddingY: 24,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "제품 및 기능소개",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 15,
        color: "#94a3b8",
        backgroundColor: "#0f172a",
        paddingY: 4,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* Step 2 */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "STEP 2 — 제품 시연",
        level: "h3",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 22,
        color: "#36c88a",
        backgroundColor: "#0f172a",
        paddingY: 24,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "제품 시연",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 15,
        color: "#94a3b8",
        backgroundColor: "#0f172a",
        paddingY: 4,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* Step 3 */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "STEP 3 — 질의응답",
        level: "h3",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 22,
        color: "#36c88a",
        backgroundColor: "#0f172a",
        paddingY: 24,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "질의응답",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 15,
        color: "#94a3b8",
        backgroundColor: "#0f172a",
        paddingY: 4,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* ── 세미나 신청 안내 ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "세미나 신청서 작성",
        level: "h2",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 28,
        color: "#0f172a",
        backgroundColor: "#f8fafc",
        paddingY: 48,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "아래 양식을 작성해 주시면 담당자가 확인 후 연락드립니다.\n\n세미나 신청은 dataware 홈페이지의 세미나 페이지에서 직접 진행해 주세요.",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#64748b",
        backgroundColor: "#f8fafc",
        paddingY: 12,
        paddingX: 24,
        borderRadius: 0,
      },
    },
  ],
  root: { props: {} },
};

/* ================================================================
   union / company  — Puck 블록
   ================================================================ */
const companyContent = {
  content: [
    /* ── Hero ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "복잡한 기업 IT를 하나로 연결합니다",
        level: "h1",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 48,
        color: "#ffffff",
        backgroundColor: "#1a1a2e",
        paddingY: 80,
        paddingX: 40,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "열정과 전문성을 바탕으로 소프트웨어 유통은 물론, 보안 및 데이터 사업까지 확대하며 제2의 도약을 실현해 가고 있습니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "rgba(255,255,255,0.5)",
        backgroundColor: "#1a1a2e",
        paddingY: 12,
        paddingX: 40,
        borderRadius: 0,
      },
    },

    /* ── Company Overview ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "IT Solution & Consulting 전문기업",
        level: "h2",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 48,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "주식회사 유니온시스템즈는 2010년 4월 유니온소프트를 시작으로 기업·공공기관을 대상으로 고객의 IT 환경에 필요한 SW, 솔루션을 공급하여 최적의 IT 인프라를 만들어 온 IT Solution & Consulting 전문기업입니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#6b7280",
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "16년 업력  |  200+ 고객사  |  4 전문 사업부  |  50+ 파트너사",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 32,
        paddingX: 0,
        borderRadius: 0,
      },
    },

    /* ── Strengths ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "유니온시스템즈가 선택받는 이유",
        level: "h2",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#111827",
        backgroundColor: "#f9fafb",
        paddingY: 48,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "보안 — 안랩, 이스트소프트, 오피스키퍼 등 기업용 PC 통합보안 전문 솔루션을 구축, 운영합니다.\n\n자산관리 — 넷클라이언트 등 기업 IT환경에 적합한 SW, HW 자산관리를 지원합니다.\n\n데이터 — 엔코아의 DA# 공인총판으로 데이터모델링 툴의 유통, 기술지원, 교육을 지원합니다.\n\n글로벌 파트너십 — Microsoft, Adobe, Autodesk 등 글로벌 소프트웨어 공식 파트너로서 정품 라이선스를 공급합니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        paddingY: 12,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* ── Core Values ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "핵심 가치",
        level: "h2",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#1a1a2e",
        paddingY: 48,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "01. 신뢰\n2010년부터 축적된 경험과 200여 개 고객사의 검증된 파트너십으로 변함없는 신뢰를 드립니다.\n\n02. 전문성\n소프트웨어, 보안, 데이터, 자산관리 각 분야 전문가로 구성된 소수정예 팀이 최적의 솔루션을 제공합니다.\n\n03. 파트너십\n단순 공급이 아닌 도입부터 운영, 유지보수까지 전 과정을 함께하는 진정한 IT 파트너가 되겠습니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "rgba(255,255,255,0.5)",
        backgroundColor: "#1a1a2e",
        paddingY: 12,
        paddingX: 24,
        borderRadius: 0,
      },
    },

    /* ── Organization ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "소수정예 전문가 조직",
        level: "h2",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 48,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "각 분야의 전문가들이 고객의 IT 환경을 책임집니다.",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#6b7280",
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Image",
      props: {
        id: uid(),
        src: "/images/crawl/unionsystems/about_organization_chart_30.jpg",
        alt: "유니온시스템즈 조직도",
        maxWidth: 1000,
        borderRadius: 0,
        paddingY: 24,
        backgroundColor: "transparent",
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          "솔루션사업부 — DATA / SW / SI 사업팀\n영업부 — 공공영업 / 기업영업 / 교육영업\n서비스사업부 — 기술지원 팀\n사업지원부 — 리뉴얼 / 마케팅 / 영업지원",
        align: "left",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#6b7280",
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
    },

    /* ── CI ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "기업 아이덴티티",
        level: "h2",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 48,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "UNION RED는 고객을 향한 열정을 담고 있습니다",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "#6b7280",
        backgroundColor: "transparent",
        paddingY: 12,
        paddingX: 0,
        borderRadius: 0,
      },
    },
    {
      type: "Image",
      props: {
        id: uid(),
        src: "/images/crawl/unionsystems/about_ci_31.jpg",
        alt: "유니온시스템즈 CI",
        maxWidth: 480,
        borderRadius: 0,
        paddingY: 24,
        backgroundColor: "transparent",
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content:
          '"고객과 신뢰로 만들어진 유니온시스템즈, 함께 구축하겠다는 열정을 담고 있습니다."\n\n— CEO 홍민석',
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 24,
        paddingX: 0,
        borderRadius: 0,
      },
    },

    /* ── CTA ── */
    {
      type: "Heading",
      props: {
        id: uid(),
        text: "유니온시스템즈와 함께 시작하세요",
        level: "h2",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#1a1a2e",
        paddingY: 48,
        paddingX: 24,
        borderRadius: 0,
      },
    },
    {
      type: "Text",
      props: {
        id: uid(),
        content: "귀사의 IT 환경에 최적화된 솔루션을 제안해 드립니다.",
        align: "center",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 16,
        color: "rgba(255,255,255,0.5)",
        backgroundColor: "#1a1a2e",
        paddingY: 12,
        paddingX: 24,
        borderRadius: 0,
      },
    },
  ],
  root: { props: {} },
};

/* ================================================================
   시드 실행
   ================================================================ */
const SEEDS = [
  { site: "dataware", pageKey: "seminar", data: seminarContent },
  { site: "union", pageKey: "company", data: companyContent },
];

async function seed() {
  const headers = { "Content-Type": "application/json" };
  if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;

  for (const { site, pageKey, data } of SEEDS) {
    const url = `${API_BASE}/api/admin/${site}/page-layout/${pageKey}`;
    console.log(`\n▶ PUT ${url}`);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: pageKey,
          layoutJson: JSON.stringify(data),
          status: "PUBLISHED",
        }),
      });

      if (res.ok) {
        console.log(`  ✔ ${site}/${pageKey} 시드 완료 (PUBLISHED)`);
      } else {
        const body = await res.text().catch(() => "");
        console.error(`  ✘ ${res.status} ${res.statusText}`, body);
      }
    } catch (err) {
      console.error(`  ✘ 네트워크 오류:`, err.message);
    }
  }

  console.log("\n완료. 각 사이트에서 새로고침하여 확인하세요.");
}

seed();
