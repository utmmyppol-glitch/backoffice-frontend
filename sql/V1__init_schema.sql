-- =============================================
-- Union Backend - Initial Schema Migration
-- Database: PostgreSQL (union_integrated)
-- =============================================

-- 1. Create Schemas
CREATE SCHEMA IF NOT EXISTS common;
CREATE SCHEMA IF NOT EXISTS union_schema;
CREATE SCHEMA IF NOT EXISTS dataware_schema;

-- =============================================
-- COMMON SCHEMA
-- =============================================

CREATE TABLE common.admins (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL DEFAULT 'VIEWER',
    site        VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- UNION_SCHEMA
-- =============================================

CREATE TABLE union_schema.banners (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    image_url   VARCHAR(255),
    link_url    VARCHAR(255),
    position    VARCHAR(255) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE union_schema.posts (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    excerpt         VARCHAR(255),
    category        VARCHAR(255) NOT NULL,
    thumbnail_url   VARCHAR(255),
    published       BOOLEAN DEFAULT FALSE,
    view_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE union_schema.inquiries (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    company         VARCHAR(255) NOT NULL,
    phone           VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    message         TEXT,
    product         VARCHAR(255),
    status          VARCHAR(255) NOT NULL DEFAULT 'NEW',
    assignee        VARCHAR(255),
    consent_privacy BOOLEAN,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE union_schema.customer_stories (
    id              BIGSERIAL PRIMARY KEY,
    company         VARCHAR(255) NOT NULL,
    industry        VARCHAR(255),
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    thumbnail_url   VARCHAR(255),
    logo_url        VARCHAR(255),
    published       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE union_schema.client_logos (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(255),
    sort_order  INTEGER,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE union_schema.downloads (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    company             VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    file_type           VARCHAR(255),
    consent_privacy     BOOLEAN,
    consent_marketing   BOOLEAN,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- DATAWARE_SCHEMA
-- =============================================

CREATE TABLE dataware_schema.banners (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    image_url   VARCHAR(255),
    link_url    VARCHAR(255),
    position    VARCHAR(255) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    category        VARCHAR(255) NOT NULL,
    subtitle        TEXT,
    description     TEXT,
    features        TEXT,
    icon_url        VARCHAR(255),
    thumbnail_url   VARCHAR(255),
    certification   VARCHAR(255),
    sort_order      INTEGER,
    published       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.posts (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    excerpt         VARCHAR(255),
    category        VARCHAR(255) NOT NULL,
    thumbnail_url   VARCHAR(255),
    published       BOOLEAN DEFAULT FALSE,
    view_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.inquiries (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    company             VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    message             TEXT,
    product             VARCHAR(255),
    status              VARCHAR(255) NOT NULL DEFAULT 'NEW',
    assignee            VARCHAR(255),
    consent_privacy     BOOLEAN,
    consent_third_party BOOLEAN,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.customer_stories (
    id              BIGSERIAL PRIMARY KEY,
    company         VARCHAR(255) NOT NULL,
    industry        VARCHAR(255),
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    thumbnail_url   VARCHAR(255),
    logo_url        VARCHAR(255),
    published       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.client_logos (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(255),
    sort_order  INTEGER,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.downloads (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    company             VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    file_type           VARCHAR(255),
    consent_privacy     BOOLEAN,
    consent_third_party BOOLEAN,
    consent_marketing   BOOLEAN,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.educations (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    company             VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    position            VARCHAR(255),
    preferred_date      VARCHAR(255),
    note                TEXT,
    consent_privacy     BOOLEAN,
    consent_third_party BOOLEAN,
    status              VARCHAR(255) NOT NULL DEFAULT 'NEW',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataware_schema.seminars (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    company             VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    department          VARCHAR(255),
    preferred_date      VARCHAR(255),
    attendees           INTEGER,
    topic               TEXT,
    note                TEXT,
    consent_privacy     BOOLEAN,
    consent_third_party BOOLEAN,
    status              VARCHAR(255) NOT NULL DEFAULT 'NEW',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
