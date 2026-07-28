-- =============================================
-- Union Backend - 초기 목업 데이터
-- 개발/테스트 환경용
-- =============================================

-- =============================================
-- COMMON - 관리자 계정
-- =============================================

INSERT INTO common.admins (username, password, role, site) VALUES
('admin',    '$2a$10$dummyHashedPasswordForDevOnly000000000000000000', 'SUPER',  NULL),
('union_editor', '$2a$10$dummyHashedPasswordForDevOnly000000000000000000', 'EDITOR', 'UNION'),
('dw_editor',    '$2a$10$dummyHashedPasswordForDevOnly000000000000000000', 'EDITOR', 'DATAWARE'),
('viewer',       '$2a$10$dummyHashedPasswordForDevOnly000000000000000000', 'VIEWER', NULL);

-- =============================================
-- UNION_SCHEMA
-- =============================================

-- 배너
INSERT INTO union_schema.banners (title, image_url, link_url, position, is_active, sort_order) VALUES
('유니온시스템즈 메인 배너',      '/images/union/hero-1.jpg',  '/about',     'HERO',      true, 1),
('IT 인프라 솔루션 소개',          '/images/union/hero-2.jpg',  '/solutions', 'HERO',      true, 2),
('2026 하반기 프로모션',           '/images/union/promo-1.jpg', '/event',     'PROMOTION', true, 1),
('신규 고객 할인 이벤트',          '/images/union/popup-1.jpg', '/contact',   'POPUP',     true, 1);

-- 게시글
INSERT INTO union_schema.posts (title, content, excerpt, category, thumbnail_url, published, view_count) VALUES
('유니온시스템즈, 클라우드 전환 컨설팅 서비스 출시',
 '유니온시스템즈가 기업의 디지털 전환을 지원하는 클라우드 전환 컨설팅 서비스를 공식 출시했습니다. 온프레미스 환경에서 클라우드로의 안전한 마이그레이션을 지원합니다.',
 '클라우드 전환 컨설팅 서비스 출시 안내', 'NOTICE', '/images/union/post-1.jpg', true, 152),

('데이터 기반 의사결정의 중요성',
 '빅데이터 시대에 데이터 기반 의사결정이 왜 중요한지, 그리고 이를 위해 어떤 인프라가 필요한지 알아봅니다. 데이터 레이크, 데이터 웨어하우스, ETL 파이프라인 등 핵심 개념을 정리했습니다.',
 '데이터 기반 의사결정을 위한 인프라 가이드', 'INSIGHT', '/images/union/post-2.jpg', true, 89),

('2026 IT 트렌드 전망 리포트',
 'AI, 클라우드, 보안 등 2026년 주요 IT 트렌드를 분석한 리포트입니다. 기업이 주목해야 할 기술 변화와 대응 전략을 담았습니다.',
 '2026년 IT 트렌드 전망', 'INSIGHT', '/images/union/post-3.jpg', true, 210),

('유니온시스템즈 고객 감사 이벤트',
 '유니온시스템즈의 고객 여러분께 감사의 마음을 전합니다. 이벤트 기간 중 무료 인프라 점검 서비스를 제공합니다.',
 '고객 감사 이벤트 안내', 'EVENT', '/images/union/post-4.jpg', true, 67);

-- 문의
INSERT INTO union_schema.inquiries (name, company, phone, email, message, product, status, consent_privacy) VALUES
('김철수', '삼성전자',   '010-1234-5678', 'kim@samsung.com',  '클라우드 마이그레이션 관련 상담 요청합니다.',       '클라우드 컨설팅', 'NEW',         true),
('이영희', 'LG CNS',     '010-2345-6789', 'lee@lgcns.com',    '데이터 웨어하우스 구축 견적 문의드립니다.',          '데이터 솔루션',   'IN_PROGRESS', true),
('박민수', 'SK하이닉스',  '010-3456-7890', 'park@skhynix.com', 'IT 인프라 통합 관리 솔루션에 대해 알고 싶습니다.',   'IT 인프라',       'COMPLETED',   true);

-- 고객 사례
INSERT INTO union_schema.customer_stories (company, industry, title, content, thumbnail_url, logo_url, published) VALUES
('현대자동차', '제조', '현대자동차 데이터 인프라 혁신 사례',
 '현대자동차는 유니온시스템즈와 함께 레거시 데이터 인프라를 클라우드 기반으로 전환하여 데이터 처리 속도를 3배 향상시켰습니다.',
 '/images/union/story-1.jpg', '/images/union/logo-hyundai.png', true),
('KB금융그룹', '금융', 'KB금융 실시간 데이터 분석 플랫폼 구축',
 'KB금융그룹은 실시간 고객 데이터 분석을 위한 플랫폼을 유니온시스템즈와 함께 구축하여 마케팅 효율을 40% 개선했습니다.',
 '/images/union/story-2.jpg', '/images/union/logo-kb.png', true);

-- 클라이언트 로고
INSERT INTO union_schema.client_logos (name, logo_url, sort_order, is_active) VALUES
('삼성전자',   '/images/union/clients/samsung.png',  1, true),
('현대자동차', '/images/union/clients/hyundai.png',  2, true),
('LG CNS',     '/images/union/clients/lgcns.png',    3, true),
('SK하이닉스', '/images/union/clients/skhynix.png',  4, true),
('KB금융그룹', '/images/union/clients/kb.png',       5, true);

-- 다운로드 신청
INSERT INTO union_schema.downloads (name, company, phone, email, file_type, consent_privacy, consent_marketing) VALUES
('정수진', '카카오',     '010-4567-8901', 'jung@kakao.com',    '회사소개서',   true, true),
('최동현', '네이버',     '010-5678-9012', 'choi@naver.com',    '솔루션 브로슈어', true, false);

-- =============================================
-- DATAWARE_SCHEMA
-- =============================================

-- 배너
INSERT INTO dataware_schema.banners (title, image_url, link_url, position, is_active, sort_order) VALUES
('데이터웨어 메인 배너',          '/images/dw/hero-1.jpg',  '/products',  'HERO',      true, 1),
('DA# 데이터 모델링 도구',        '/images/dw/hero-2.jpg',  '/products/da-sharp', 'HERO', true, 2),
('MetaSharp 메타데이터 관리',      '/images/dw/promo-1.jpg', '/products/meta-sharp', 'PROMOTION', true, 1);

-- 제품
INSERT INTO dataware_schema.products (name, slug, category, subtitle, description, features, icon_url, thumbnail_url, certification, sort_order, published) VALUES
('DA#', 'da-sharp', 'DA_SHARP',
 '데이터 모델링 도구',
 'DA#은 데이터 아키텍처 설계 및 데이터 모델링을 위한 전문 도구입니다. 논리/물리 모델링, 표준 관리, 영향도 분석 등을 지원합니다.',
 '논리/물리 데이터 모델링, 표준 용어 관리, 영향도 분석, 리버스 엔지니어링',
 '/images/dw/icon-da.png', '/images/dw/thumb-da.jpg', 'GS인증 1등급', 1, true),

('Meta#', 'meta-sharp', 'META_SHARP',
 '메타데이터 관리 솔루션',
 'Meta#은 기업 내 산재된 메타데이터를 통합 관리하여 데이터 거버넌스를 실현하는 솔루션입니다.',
 '메타데이터 자동 수집, 데이터 리니지, 데이터 사전 관리, 영향도 분석',
 '/images/dw/icon-meta.png', '/images/dw/thumb-meta.jpg', 'GS인증 1등급', 2, true),

('DQ#', 'dq-sharp', 'DQ_SHARP',
 '데이터 품질 관리 솔루션',
 'DQ#은 데이터 품질 진단, 측정, 개선을 위한 통합 데이터 품질 관리 솔루션입니다.',
 '품질 규칙 정의, 자동 프로파일링, 품질 대시보드, 오류 데이터 추적',
 '/images/dw/icon-dq.png', '/images/dw/thumb-dq.jpg', NULL, 3, true),

('AP#', 'ap-sharp', 'AP_SHARP',
 '데이터 표준 관리 솔루션',
 'AP#은 전사 데이터 표준을 수립하고 관리하는 솔루션으로, 일관된 데이터 관리 체계를 지원합니다.',
 '표준 단어/도메인/용어 관리, 표준 준수율 점검, 변경 이력 관리',
 '/images/dw/icon-ap.png', '/images/dw/thumb-ap.jpg', NULL, 4, true),

('ETT#', 'ett-sharp', 'ETT_SHARP',
 'ETL/데이터 이관 도구',
 'ETT#은 대용량 데이터 추출, 변환, 적재를 위한 고성능 ETL 솔루션입니다.',
 '병렬 처리, 스케줄링, 데이터 변환 룰, 모니터링 대시보드',
 '/images/dw/icon-ett.png', '/images/dw/thumb-ett.jpg', NULL, 5, true),

('DF#', 'df-sharp', 'DF_SHARP',
 '데이터 플로우 관리',
 'DF#은 데이터 흐름을 시각화하고 관리하는 솔루션으로, 복잡한 데이터 파이프라인을 효율적으로 운영합니다.',
 '데이터 흐름 시각화, 파이프라인 모니터링, 장애 알림, 성능 분석',
 '/images/dw/icon-df.png', '/images/dw/thumb-df.jpg', NULL, 6, true),

('DP#', 'dp-sharp', 'DP_SHARP',
 '데이터 포털',
 'DP#은 기업 데이터를 쉽게 검색하고 활용할 수 있는 셀프서비스 데이터 포털입니다.',
 '데이터 카탈로그, 셀프서비스 분석, 데이터 마켓플레이스, 접근 권한 관리',
 '/images/dw/icon-dp.png', '/images/dw/thumb-dp.jpg', NULL, 7, true);

-- 게시글
INSERT INTO dataware_schema.posts (title, content, excerpt, category, thumbnail_url, published, view_count) VALUES
('DA# v5.0 업데이트 안내',
 'DA# v5.0에서는 클라우드 기반 협업 기능이 추가되었습니다. 실시간 동시 편집, 버전 관리, 댓글 기능을 통해 팀 협업이 더욱 편리해졌습니다.',
 'DA# v5.0 주요 업데이트 사항 안내', 'NOTICE', '/images/dw/post-1.jpg', true, 324),

('데이터 거버넌스 세미나 개최 안내',
 '데이터 거버넌스의 최신 트렌드와 실무 적용 사례를 공유하는 세미나를 개최합니다. 현업 전문가의 경험을 직접 들을 수 있는 기회입니다.',
 '데이터 거버넌스 세미나 안내', 'EVENT', '/images/dw/post-2.jpg', true, 178),

('데이터 모델링 베스트 프랙티스 영상',
 '데이터 모델링 시 자주 발생하는 실수와 이를 방지하기 위한 베스트 프랙티스를 영상으로 정리했습니다.',
 '데이터 모델링 베스트 프랙티스', 'VIDEO', '/images/dw/post-3.jpg', true, 456),

('DA# 사용자 매뉴얼 v5.0',
 'DA# v5.0의 전체 기능을 상세히 설명한 사용자 매뉴얼입니다. 신규 기능 가이드와 FAQ를 포함하고 있습니다.',
 'DA# v5.0 사용자 매뉴얼', 'DOCUMENTATION', '/images/dw/post-4.jpg', true, 89);

-- 문의
INSERT INTO dataware_schema.inquiries (name, company, phone, email, message, product, status, consent_privacy, consent_third_party) VALUES
('한지영', '우리은행',   '010-6789-0123', 'han@wooribank.com', 'DA# 도입 관련 데모 요청합니다.',                   'DA#',    'NEW',         true, true),
('오승환', '포스코',     '010-7890-1234', 'oh@posco.com',      'DQ# 데이터 품질 관리 솔루션 견적 문의합니다.',      'DQ#',    'IN_PROGRESS', true, false),
('윤서연', 'CJ대한통운', '010-8901-2345', 'yoon@cj.com',       'Meta# 메타데이터 관리 POC 진행 가능한지 문의합니다.', 'Meta#', 'COMPLETED',   true, true);

-- 고객 사례
INSERT INTO dataware_schema.customer_stories (company, industry, title, content, thumbnail_url, logo_url, published) VALUES
('신한은행', '금융', '신한은행 데이터 거버넌스 체계 구축',
 '신한은행은 DA#과 Meta#을 도입하여 전사 데이터 거버넌스 체계를 구축했으며, 데이터 표준 준수율을 95%까지 향상시켰습니다.',
 '/images/dw/story-1.jpg', '/images/dw/logo-shinhan.png', true),
('포스코', '제조', '포스코 데이터 품질 혁신 프로젝트',
 '포스코는 DQ#을 활용하여 제조 데이터 품질을 체계적으로 관리하고, 데이터 오류율을 80% 감소시켰습니다.',
 '/images/dw/story-2.jpg', '/images/dw/logo-posco.png', true);

-- 클라이언트 로고
INSERT INTO dataware_schema.client_logos (name, logo_url, sort_order, is_active) VALUES
('신한은행',   '/images/dw/clients/shinhan.png',  1, true),
('포스코',     '/images/dw/clients/posco.png',    2, true),
('우리은행',   '/images/dw/clients/woori.png',    3, true),
('CJ대한통운', '/images/dw/clients/cj.png',       4, true),
('한국전력',   '/images/dw/clients/kepco.png',    5, true);

-- 다운로드 신청
INSERT INTO dataware_schema.downloads (name, company, phone, email, file_type, consent_privacy, consent_third_party, consent_marketing) VALUES
('강민호', '롯데정보통신', '010-9012-3456', 'kang@lotte.com',   'DA# 브로슈어',    true, true,  true),
('임수빈', 'KT',           '010-0123-4567', 'lim@kt.com',       '제품 카탈로그',   true, false, false);

-- 교육 신청
INSERT INTO dataware_schema.educations (name, company, phone, email, position, preferred_date, note, consent_privacy, consent_third_party, status) VALUES
('서준혁', 'NH농협',     '010-1111-2222', 'seo@nh.com',     '과장',   '2026-08-15', 'DA# 기초 교육 희망합니다. 5명 참석 예정입니다.',  true, true, 'NEW'),
('장하은', '한화시스템', '010-3333-4444', 'jang@hanwha.com', '대리',   '2026-09-01', 'Meta# 실무 교육 요청합니다.',                    true, true, 'CONFIRMED');

-- 세미나 신청
INSERT INTO dataware_schema.seminars (name, company, phone, email, department, preferred_date, attendees, topic, note, consent_privacy, consent_third_party, status) VALUES
('배성민', '두산에너빌리티', '010-5555-6666', 'bae@doosan.com',  'IT기획팀',    '2026-08-20', 15, '데이터 거버넌스 구축 사례',  '사내 세미나로 진행 희망합니다.', true, true, 'NEW'),
('고은지', 'GS칼텍스',       '010-7777-8888', 'ko@gscaltex.com', '데이터팀',    '2026-09-10', 8,  '데이터 품질 관리 방법론',    NULL,                            true, true, 'CONFIRMED');
