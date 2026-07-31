-- =============================================
-- V3: 백오피스 CMS용 테이블 추가
-- union_schema, dataware_schema 각각 동일 구조
-- 기존 테이블/데이터 변경 없음
-- =============================================

-- =============================================
-- UNION_SCHEMA
-- =============================================

CREATE TABLE union_schema.menu (
    id          BIGSERIAL PRIMARY KEY,
    parent_id   BIGINT REFERENCES union_schema.menu(id),
    name        VARCHAR(100) NOT NULL,
    url         VARCHAR(255),
    menu_type   VARCHAR(20) NOT NULL DEFAULT 'CONTENT'
                CHECK (menu_type IN ('CONTENT', 'BOARD', 'LINK')),
    sort_order  INTEGER DEFAULT 0,
    depth       INTEGER DEFAULT 0,
    is_exposed  BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE union_schema.content (
    id          BIGSERIAL PRIMARY KEY,
    menu_id     BIGINT REFERENCES union_schema.menu(id),
    region_key  VARCHAR(100) NOT NULL,
    title       VARCHAR(255),
    body_html   TEXT,
    updated_by  BIGINT,
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE (menu_id, region_key)
);

CREATE TABLE union_schema.content_history (
    id          BIGSERIAL PRIMARY KEY,
    content_id  BIGINT REFERENCES union_schema.content(id),
    body_html   TEXT,
    edited_by   BIGINT,
    edited_at   TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- DATAWARE_SCHEMA
-- =============================================

CREATE TABLE dataware_schema.menu (
    id          BIGSERIAL PRIMARY KEY,
    parent_id   BIGINT REFERENCES dataware_schema.menu(id),
    name        VARCHAR(100) NOT NULL,
    url         VARCHAR(255),
    menu_type   VARCHAR(20) NOT NULL DEFAULT 'CONTENT'
                CHECK (menu_type IN ('CONTENT', 'BOARD', 'LINK')),
    sort_order  INTEGER DEFAULT 0,
    depth       INTEGER DEFAULT 0,
    is_exposed  BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dataware_schema.content (
    id          BIGSERIAL PRIMARY KEY,
    menu_id     BIGINT REFERENCES dataware_schema.menu(id),
    region_key  VARCHAR(100) NOT NULL,
    title       VARCHAR(255),
    body_html   TEXT,
    updated_by  BIGINT,
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE (menu_id, region_key)
);

CREATE TABLE dataware_schema.content_history (
    id          BIGSERIAL PRIMARY KEY,
    content_id  BIGINT REFERENCES dataware_schema.content(id),
    body_html   TEXT,
    edited_by   BIGINT,
    edited_at   TIMESTAMP DEFAULT NOW()
);
