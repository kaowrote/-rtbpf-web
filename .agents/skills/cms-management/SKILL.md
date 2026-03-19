---
name: CMS Content Management
description: How the RTBPF Admin CMS works — articles, events, awards CRUD, Rich Text Editor (Tiptap), media upload, and content workflow
---

# CMS Content Management System

## Overview
The RTBPF Admin CMS is a full content management system accessible at `/admin`. It manages articles, events, awards, users, and site settings. Authentication is required (NextAuth.js v5). Role-based access controls which menu items and actions are available.

## Architecture

### Admin Layout & Navigation
- **File**: `src/app/admin/layout.tsx`
- **Sidebar**: 2 sections — Content (Dashboard, Articles, Events, Awards) and System (Users, Settings)
- **Role filtering**: Each nav item has `allowedRoles` array

### Roles & Permissions
| Role | Dashboard | Articles | Events | Awards | Users | Settings |
|------|-----------|----------|--------|--------|-------|----------|
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EDITOR | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| AUTHOR | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |
| TRANSLATOR | ✅ | ✅ (translate) | ❌ | ❌ | ❌ | ❌ |
| JURY | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## Articles Management

### Key Files
- `src/app/admin/articles/page.tsx` — Article listing
- `src/app/admin/articles/create/page.tsx` — Create article
- `src/app/admin/articles/[id]/edit/page.tsx` — Edit article
- `src/app/api/articles/route.ts` — CRUD API (GET list, POST create)
- `src/app/api/articles/[id]/route.ts` — Single article (GET, PUT, DELETE)

### Article Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | ✅ | Article headline |
| slug | String | ✅ | URL-friendly identifier (auto-generated) |
| excerpt | String | ❌ | Short summary for listing pages |
| content | String | ✅ | Rich HTML content from Tiptap editor |
| featuredImage | String | ❌ | Image URL for hero/thumbnail |
| categoryId | String | ✅ | Foreign key to Category |
| tags | String | ❌ | Comma-separated tags |
| status | Enum | ✅ | DRAFT / PUBLISHED / SCHEDULED / ARCHIVED |
| publishedAt | DateTime | ❌ | When to publish (for SCHEDULED) |

### Article Statuses
- **DRAFT** → Not visible on public site
- **PUBLISHED** → Visible on public site immediately
- **SCHEDULED** → Will become visible at `publishedAt` datetime
- **ARCHIVED** → Hidden from public site

### Rich Text Editor (Tiptap)
- **Based on**: ProseMirror → Tiptap v2
- **Features**: Bold, Italic, Underline, H1-H3, Lists, Blockquote, Code, Links, Images, Tables, Horizontal Rule
- **Media embeds**: YouTube, TikTok, Instagram, Twitter (paste URL)
- **Image upload**: Via `/api/upload` → Supabase Storage

---

## Events Management

### Key Files
- `src/app/admin/events/page.tsx` — Event listing
- `src/app/admin/events/create/page.tsx` — Create event
- `src/app/api/events/route.ts` — CRUD API

### Event Fields
| Field | Type | Description |
|-------|------|-------------|
| title | String | Event name |
| slug | String | URL identifier |
| description | String | Full description (Rich Text) |
| eventType | String | Seminar, Workshop, Ceremony, etc. |
| startDate | DateTime | Event start |
| endDate | DateTime | Event end |
| location | String | Venue name |
| mapUrl | String | Google Maps link |
| registrationUrl | String | Registration link |
| imageUrl | String | Cover image |
| status | Enum | UPCOMING / OPEN_FOR_REGISTRATION / ONGOING / COMPLETED / CANCELLED |

---

## Awards Management

### Key Files
- `src/app/admin/awards/page.tsx` — Awards listing
- `src/app/admin/awards/create/page.tsx` — Add nominee
- `src/app/api/awards/years/route.ts` — Award years API
- `src/app/api/awards/categories/route.ts` — Award categories API
- `src/app/api/awards/nominees/route.ts` — Nominees CRUD

### Data Hierarchy
```
AwardYear (ปีรางวัล)
  └── AwardCategory (สาขา: TV / Radio / Digital / Special)
       └── Nominee (ผู้เข้าชิง)
            - name, workTitle, channel, imageUrl, videoUrl
            - isWinner: Boolean
```

---

## Media Upload

### Key Files
- `src/app/api/upload/route.ts` — File upload endpoint
- Storage: **Supabase Storage** bucket

### How to Upload
1. POST multipart/form-data to `/api/upload`
2. File is uploaded to Supabase Storage
3. Returns public URL for use in articles/events/awards

---

## Site Settings

### Key Files
- `src/app/admin/settings/page.tsx` — Settings UI
- `src/app/api/settings/route.ts` — Settings API
- Database: `SystemSetting` table (key-value pairs)

### Configurable Settings
| Key | Description |
|-----|-------------|
| siteTitle | Website title |
| siteDescription | Meta description |
| primaryColor | Accent color (default: #C9A84C) |
| defaultNewsImageUrl | Fallback image for articles |
| defaultEventImageUrl | Fallback image for events |
| defaultHeroImageUrl | Fallback hero background |

## Common Workflows

### Publishing an Article
1. `/admin/articles/create` → Fill form → Set status to DRAFT → Save
2. Review content → Edit if needed
3. Change status to PUBLISHED → Save
4. Article appears on public site immediately

### Translating Content
1. Edit article → Click "🤖 AI Translate"
2. Select target language(s)
3. System calls Gemini API → saves translations
4. Translated content served when user switches locale
