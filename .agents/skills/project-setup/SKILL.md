---
name: Project Setup & Deployment
description: How to set up, develop, and deploy the RTBPF website — tech stack, project structure, development workflow, Vercel deployment
---

# Project Setup & Deployment

## Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React framework (App Router) |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| shadcn/ui | Latest | UI component library |
| Prisma | 6 | Database ORM |
| PostgreSQL | 15 | Database (via Supabase) |
| NextAuth.js | v5 | Authentication |
| next-intl | Latest | Internationalization |
| Tiptap | v2 | Rich text editor |
| Framer Motion | Latest | Animations |
| Lucide React | Latest | Icon library |
| Google Gemini | 2.0 Flash | AI translation |
| Resend | Latest | Transactional email |
| Vercel | Latest | Deployment platform |

## Project Structure
```
rtbpf-web/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── messages/                  # i18n UI translations
│   ├── th.json, en.json, ko.json, ja.json
│   ├── zh.json, fr.json, de.json, es.json
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (with locale routing)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── articles/      # Articles listing & detail
│   │   │   ├── awards/        # Awards pages
│   │   │   ├── events/        # Events pages
│   │   │   ├── about/         # About page
│   │   │   └── contact/       # Contact page
│   │   ├── admin/             # Admin CMS (no locale routing)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── articles/      # Article CRUD
│   │   │   ├── events/        # Event CRUD
│   │   │   ├── awards/        # Awards CRUD
│   │   │   ├── users/         # User management
│   │   │   ├── settings/      # Site settings
│   │   │   ├── profile/       # User profile
│   │   │   └── login/         # Admin login
│   │   └── api/               # API routes
│   │       ├── articles/      # Article APIs
│   │       ├── events/        # Event APIs
│   │       ├── awards/        # Awards APIs
│   │       ├── comments/      # Comment APIs
│   │       ├── auth/          # Auth APIs
│   │       ├── users/         # User APIs
│   │       ├── upload/        # File upload
│   │       ├── settings/      # Settings APIs
│   │       └── admin/         # Admin-specific APIs
│   ├── components/
│   │   ├── admin/             # Admin-only components
│   │   ├── auth/              # Auth components
│   │   ├── comments/          # Comment system
│   │   ├── layout/            # Navbar, Footer
│   │   ├── shared/            # Reusable components
│   │   └── ui/                # shadcn/ui primitives
│   ├── i18n/                  # i18n config
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── gemini.ts          # Gemini AI client
│   │   ├── mail.ts            # Resend email client
│   │   ├── auth-guard.ts      # Role checking
│   │   └── utils.ts           # General utilities
│   └── middleware.ts          # Auth + locale middleware
├── .env                       # Environment variables
└── package.json
```

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, GEMINI_API_KEY

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to database (first time)
npx prisma db push

# 5. Seed database
npx prisma db seed

# 6. Start development server
npm run dev
# → http://localhost:3000
```

## Environment Variables
```
# Database (Supabase)
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# AI Translation
GEMINI_API_KEY=your-google-ai-key

# Email (Password Reset)
RESEND_API_KEY=your-resend-key

# Supabase (Storage for uploads)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment (Vercel)

### Auto-Deploy
- Push to `main` branch → Vercel auto-deploys
- Preview deployments for pull requests

### Vercel Settings
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npx prisma generate && next build`
- **Environment Variables**: Set all env vars in Vercel dashboard
- **Domain**: `rtbpf-web.vercel.app` (Vercel default)

### Important Notes
- `prisma generate` must run before `next build` (handles Prisma Client generation)
- If build fails with Resend error: ensure `RESEND_API_KEY` is set or mail.ts handles missing key gracefully
- After Prisma schema changes: push to DB first, then deploy

### Manual Deploy
```bash
npx vercel --prod
```

## URLs
| Environment | URL |
|-------------|-----|
| Production | https://rtbpf-web.vercel.app |
| Vercel Dashboard | https://vercel.com/kaowrote-gmailcoms-projects/rtbpf-web |
| Supabase | https://supabase.com/dashboard/project/dlajwlvlvqsqghhtmwwb |
