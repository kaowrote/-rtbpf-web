---
name: Database & Prisma Schema
description: Complete database architecture for RTBPF — all Prisma models, relationships, Supabase setup, and migration workflow
---

# Database & Prisma Schema

## Overview
The RTBPF website uses **PostgreSQL** hosted on **Supabase** with **Prisma 6** as the ORM. The database stores all content (articles, events, awards), user accounts, translations, comments, and system settings.

## Connection

### Environment Variables
```
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```
- `DATABASE_URL` — Pooled connection (PgBouncer, port 6543) for runtime
- `DIRECT_URL` — Direct connection (port 5432) for migrations

### Supabase Project
- **Project ID**: `dlajwlvlvqsqghhtmwwb`
- **Region**: `ap-southeast-1` (Singapore)

## Data Models

### Core Content Models

#### Article
```
- id, title, slug (unique), excerpt, content (HTML), featuredImage
- status: DRAFT | PUBLISHED | SCHEDULED | ARCHIVED
- categoryId → Category, authorId → User
- tags: String
- publishedAt, createdAt, updatedAt
- Relations: translations[], comments[], category, author
```

#### Event
```
- id, title, slug, description (HTML), eventType
- startDate, endDate, location, mapUrl, registrationUrl
- imageUrl, status: UPCOMING | OPEN_FOR_REGISTRATION | ONGOING | COMPLETED | CANCELLED
- agenda (JSON), speakers (JSON), resources (JSON)
- Relations: translations[]
```

#### Category
```
- id, name, slug, description
- Relations: articles[], translations[]
```

### Awards Models

#### AwardYear
```
- id, year (Int, unique), edition, theme, ceremonyDate, venue, description
```

#### AwardCategory
```
- id, name, slug, type: TELEVISION | RADIO | DIGITAL | SPECIAL
- awardYearId → AwardYear
- Relations: nominees[]
```

#### Nominee
```
- id, name, workTitle, channel, imageUrl, videoUrl
- isWinner: Boolean (default false)
- awardCategoryId → AwardCategory
```

### User & Auth Models

#### User
```
- id, name, email (unique), hashedPassword, image
- role: SUPER_ADMIN | ADMIN | EDITOR | AUTHOR | TRANSLATOR | JURY | MEMBER
- status: ACTIVE | PENDING | SUSPENDED
- Relations: articles[], comments[], commentLikes[]
```

#### PasswordResetToken
```
- id, token (unique), userId, expiresAt, used: Boolean
```

### Translation Models

#### ArticleTranslation
```
- id, articleId, languageCode, title, excerpt, content
- @@unique([articleId, languageCode])
```

#### EventTranslation
```
- id, eventId, languageCode, title, excerpt
- @@unique([eventId, languageCode])
```

#### CategoryTranslation
```
- id, categoryId, languageCode, name
- @@unique([categoryId, languageCode])
```

### Interaction Models

#### Comment
```
- id, content, articleId, authorId, parentId (nullable for threading)
- Relations: replies[] (self-referencing), likes[], author, article, parent
```

#### CommentLike
```
- id, commentId, userId
- @@unique([commentId, userId])
```

### System Models

#### SystemSetting
```
- id, key (unique), value, description
```

#### Language
```
- id, code (unique), name, nativeName, flag, isActive
```

## Key Relationships Diagram
```
User ──< Article ──< ArticleTranslation
  │         │
  │         ├──< Comment ──< CommentLike
  │         │       └── (self: parent/replies)
  │         └── Category ──< CategoryTranslation
  │
  └──< CommentLike

AwardYear ──< AwardCategory ──< Nominee

Event ──< EventTranslation
```

## Prisma Commands
```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```

## Seed Data (`prisma/seed.ts`)
Seeds the database with:
- Admin user: `admin@rtbpf.org` / `admin123` (SUPER_ADMIN)
- Default categories: News, Press Release, Feature, Interview, Opinion
- Default languages: th, en, ko, ja, zh, fr, de, es
- Default system settings
