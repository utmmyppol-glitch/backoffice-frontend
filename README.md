# Backoffice

유니온시스템즈 · 유니온데이터웨어 통합 백오피스 관리자 페이지.

두 사이트(union, dataware)의 콘텐츠, 메뉴, 문의, 고객 데이터를 하나의 관리 화면에서 다룬다. 백엔드(`union-backend`)의 `/api/admin/` 엔드포인트를 사용하며, JWT 인증이 필요하다.

## 기술 스택

- **Next.js 14** (App Router)
- **React 18** / TypeScript
- **Tailwind CSS**
- **Tiptap** (리치 텍스트 에디터 — 테이블, 이미지, 링크, 정렬, 밑줄 확장 포함)
- **DOMPurify** (HTML sanitize)
- **Husky + lint-staged** (커밋 시 ESLint 자동 실행)

## 관리 기능

### Union 사이트 관리 (`/union/...`)

| 경로 | 기능 |
|------|------|
| `/union/dashboard` | 대시보드 |
| `/union/menus` | 메뉴 관리 |
| `/union/company-about` | 페이지 편집 |
| `/union/posts` | 게시글 관리 |
| `/union/client-logos` | 고객사 로고 |
| `/union/customer-stories` | 고객 사례 |
| `/union/inquiries` | 문의 관리 |
| `/union/insights` | 인사이트 관리 |
| `/union/downloads` | 다운로드 조회 |
| `/union/site-config` | 사이트 설정 |

### Dataware 사이트 관리 (`/dataware/...`)

| 경로 | 기능 |
|------|------|
| `/dataware/dashboard` | 대시보드 |
| `/dataware/menus` | 메뉴 관리 |
| `/dataware/company-about` | 페이지 편집 |
| `/dataware/posts` | 게시글 관리 |
| `/dataware/client-logos` | 고객사 로고 |
| `/dataware/customer-stories` | 고객 사례 |
| `/dataware/products` | 제품 관리 |
| `/dataware/inquiries` | 문의 관리 |
| `/dataware/downloads` | 다운로드 조회 |
| `/dataware/educations` | 교육 신청 |
| `/dataware/seminars` | 세미나 신청 |
| `/dataware/site-config` | 사이트 설정 |

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> union-frontend, dataware-frontend와 달리 API prefix 없이 백엔드 루트 URL만 설정한다. 각 API 호출 시 `/api/admin/{site}/...` 경로를 직접 붙인다.

### 3. 개발 서버

```bash
npm run dev
```

`http://localhost:3002`에서 확인.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── login/                   # 로그인 페이지
│   ├── page.tsx                 # 루트 (로그인 리다이렉트)
│   ├── layout.tsx               # 루트 레이아웃
│   └── (admin)/                 # 인증 필요 영역 (라우트 그룹)
│       ├── layout.tsx           # 사이드바 포함 레이아웃
│       ├── union/               # 유니온 관리 페이지
│       │   ├── dashboard/
│       │   ├── menus/
│       │   ├── company-about/
│       │   ├── posts/
│       │   ├── client-logos/
│       │   ├── customer-stories/
│       │   ├── inquiries/
│       │   ├── insights/
│       │   ├── downloads/
│       │   └── site-config/
│       └── dataware/            # 데이터웨어 관리 페이지
│           ├── dashboard/
│           ├── menus/
│           ├── company-about/
│           ├── posts/
│           ├── client-logos/
│           ├── customer-stories/
│           ├── products/
│           ├── inquiries/
│           ├── downloads/
│           ├── educations/
│           ├── seminars/
│           └── site-config/
├── components/
│   ├── Sidebar.tsx              # 사이드바 (사이트 전환, 메뉴 네비게이션)
│   ├── RichEditor.tsx           # Tiptap 리치 에디터 (게시글, 콘텐츠 편집)
│   ├── DataTable.tsx            # 공통 데이터 테이블
│   ├── Modal.tsx                # 모달 다이얼로그
│   ├── Toast.tsx                # 토스트 알림
│   ├── StatusBadge.tsx          # 상태 배지 (NEW, IN_PROGRESS 등)
│   ├── ImageUploadField.tsx     # 이미지 업로드 필드
│   ├── PageEditor.tsx           # 페이지 레이아웃 편집기
│   ├── PostManager.tsx          # 게시글 관리 컴포넌트
│   ├── CustomerStoryManager.tsx # 고객사례 관리
│   ├── InquiryManager.tsx       # 문의 관리
│   ├── InsightManager.tsx       # 인사이트 관리 (수집/승인/거부)
│   ├── ProductManager.tsx       # 제품 관리 (dataware)
│   ├── ClientLogoManager.tsx    # 로고 관리
│   ├── ContentManager.tsx       # 콘텐츠 편집
│   ├── MenuManager.tsx          # 메뉴 관리
│   ├── SiteConfigManager.tsx    # 사이트 설정
│   ├── DownloadViewer.tsx       # 다운로드 이력
│   ├── EducationManager.tsx     # 교육 이력 (dataware)
│   └── SeminarManager.tsx       # 세미나 이력 (dataware)
└── lib/
    ├── api.ts                   # API 호출 (JWT 자동 첨부, 401 시 로그인 리다이렉트)
    ├── auth.ts                  # 인증 (JWT 토큰 관리, 사이트 접근 권한)
    ├── permissions.ts           # 역할별 권한 로직
    ├── types.ts                 # 타입 정의
    └── url.ts                   # URL 유틸
```

## 인증/권한

### 로그인 흐름

1. `/login` 페이지에서 `POST /api/admin/login` 호출
2. 응답의 JWT 토큰을 `localStorage`에 저장 (`token`, `user`)
3. 이후 모든 API 요청에 `Authorization: Bearer {token}` 헤더 자동 첨부
4. 401 응답 시 자동으로 토큰 삭제 후 `/login`으로 리다이렉트

### 역할별 접근 범위

| 역할 | 접근 가능 사이트 | 권한 |
|------|-----------------|------|
| `SUPER` | union + dataware | 전체 편집 |
| `ADMIN` | 자기 사이트만 | 전체 편집 |
| `EDITOR` | 자기 사이트만 | 전체 편집 |
| `VIEWER` | dataware만 | 다운로드 이력 조회만 가능 |

사이드바 메뉴는 로그인한 사용자의 역할에 따라 자동 필터링된다.

## API 호출 방식

`src/lib/api.ts`의 `apiFetch<T>(path, options)` 함수를 사용한다:

- JWT 토큰이 있으면 `Authorization` 헤더에 자동 첨부
- 모든 응답을 `ArrayBuffer → UTF-8 디코딩`으로 처리 (한글 깨짐 방지)
- `cache: 'no-store'`로 항상 최신 데이터를 가져온다
- 401: 토큰 삭제 후 로그인 페이지로 리다이렉트
- 403: 권한 없음 에러 메시지 표시

## 연관 프로젝트

| 프로젝트 | 포트 | 설명 |
|----------|------|------|
| union-backend | 8080 | 백엔드 API |
| union-frontend | 3000 | 유니온시스템즈 홈페이지 |
| dataware-frontend | 3001 | 유니온데이터웨어 홈페이지 |
