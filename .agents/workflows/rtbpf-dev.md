---
description: How to develop and deploy the RTBPF V2.0 web application
---

# RTBPF V2.0 Development Workflow

## Project Overview
RTBPF V2.0 is a Thai broadcast news organization website built with Next.js 16 (App Router), Prisma, Supabase, and TailwindCSS. Theme: Navy (#1B2A4A) + Gold (#C9A84C).

## Quick Setup

// turbo-all

1. Navigate to the project directory:
```bash
cd "/Users/kaowrotesutapakdi/Documents/Anti Gravity/Nattaraj/rtbpf-web"
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Start dev server:
```bash
npm run dev -- -p 3001
```

5. Access the app:
- Public site: http://localhost:3001/th
- Admin CMS: http://localhost:3001/admin
- Admin Login: http://localhost:3001/admin/login

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: NextAuth.js v5 (credential-based)
- **Editor**: TipTap (rich text + social embeds)
- **Styling**: TailwindCSS 4
- **AI**: Google Gemini 2.0 Flash (translation + content)
- **i18n**: next-intl (8 languages: th, en, ko, ja, zh, fr, de, es)

## Key Directories
```
src/
├── app/
│   ├── [locale]/          # Public pages (i18n)
│   ├── admin/             # CMS admin pages
│   │   ├── articles/      # Article CRUD
│   │   ├── events/        # Event CRUD
│   │   ├── awards/        # Award management
│   │   ├── translations/  # Translation dashboard
│   │   ├── users/         # User management
│   │   └── settings/      # System settings + API keys
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin-specific components
│   │   ├── TipTapEditor   # Rich text editor
│   │   └── extensions/    # TipTap extensions (Instagram, TikTok, Facebook, Twitter)
│   ├── shared/            # Shared components (ArticlePlayer, NotificationBell)
│   └── layout/            # Navbar, Footer
├── lib/                   # Utilities (prisma, auth, gemini)
├── services/              # Business logic (ai-translation)
└── i18n/                  # Internationalization config
```

## Module Map (26 Modules)
| Module | Status | Description |
|--------|--------|-------------|
| M01-M04 | ✅ | Foundation (Setup, Design, Auth, Roles) |
| M05 | ✅ | Articles & Content |
| M06 | ✅ | TTS (ฟังข่าว) — Google TTS + Browser fallback |
| M07 | ✅ | Social Media Embeds |
| M08-M09 | ✅ | Awards + Events System |
| M10-M12 | ✅ | CMS Dashboard, Editor, Media Library |
| M13 | ✅ | CMS Embed Manager (Facebook, Twitter) |
| M14 | ✅ | i18n (8 languages) |
| M15-M16 | ✅ | AI Translation Pipeline + CMS Management |
| M17-M20 | ✅ | Voting, Notifications, Comments, Membership |
| M21 | ❌ | AI Recommendation (skipped) |
| M22-M23 | ✅ | PWA + SEO |

## Database Operations
```bash
# Push schema changes
npx prisma db push

# Generate client
npx prisma generate

# View database
npx prisma studio
```

## API Keys (Admin Settings)
Navigate to `/admin/settings` > "API Keys" tab:
- **Google AI Studio** (Required): For AI translation, TTS
- **Google Cloud TTS** (Optional): For high-quality TTS
- **Google Cloud Translation** (Optional): For translation fallback
- **OpenAI** (Optional): For AI recommendations

## Build & Deploy
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or push to GitHub and let Vercel auto-deploy
git add -A && git commit -m "release: v2.0" && git push
```

## Testing Checklist
1. Admin Dashboard loads with stats
2. Article CRUD works (create, edit, delete)
3. Event CRUD works
4. Awards management works
5. User management (roles, approval)
6. Settings page (all 5 tabs)
7. Translation dashboard with batch translate
8. TipTap editor (all embed types)
9. Public homepage renders
10. Membership page renders
11. PWA manifest valid
12. SEO sitemap valid
