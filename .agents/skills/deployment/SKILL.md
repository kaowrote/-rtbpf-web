---
name: Deployment & Vercel
description: How to deploy the RTBPF website to Vercel — git push workflow, environment variables, build process, and common issues
---

# Deployment & Vercel

## Deployment Workflow

The site auto-deploys to Vercel on every `git push` to `main` branch.

### Quick Deploy Steps:

```bash
# 1. Stage changes
git add .

# 2. Commit
git commit -m "feat: description of change"

# 3. Push — triggers Vercel auto-deploy
git push

# 4. Wait ~1-2 minutes for build, then check:
# https://rtbpf-web.vercel.app
```

### URLs:

| Environment | URL |
|------------|-----|
| Production | `https://rtbpf-web.vercel.app` |
| Admin CMS | `https://rtbpf-web.vercel.app/admin` |
| Login | `https://rtbpf-web.vercel.app/admin/login` |

## Environment Variables

These must be set in Vercel dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `DIRECT_URL` | Supabase direct connection (for Prisma migrations) |
| `NEXTAUTH_URL` | Site base URL (e.g., `https://rtbpf-web.vercel.app`) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js session encryption |
| `GOOGLE_AI_API_KEY` | Google Gemini API key for AI translation |

## Build Process

```
Next.js Build → Prisma Client Generation → Static Pages → Server Components → Edge Functions
```

- Framework: Next.js 15 (App Router)
- Build command: `next build`
- Output: `.next/` directory

## Common Issues

### 1. CSS/Tailwind Not Rendering on Admin Pages

**Symptom**: Admin pages show completely unstyled HTML (no colors, no layout).

**Root Cause**: Admin route (`/admin`) is outside `[locale]` route group and doesn't inherit `globals.css`.

**Fix**: Admin layout must explicitly import CSS:

```tsx
// src/app/admin/layout.tsx
import "@/app/[locale]/globals.css";
```

### 2. Prisma Client Not Found

**Symptom**: `Can't find prisma client` error during build.

**Fix**: Add `prisma generate` to build script in `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### 3. Build Timeout

**Symptom**: Vercel build times out.

**Fix**: Reduce the number of statically generated pages or increase timeout in Vercel settings.

### 4. Database Connection Error

**Symptom**: Database queries fail in production.

**Fix**: Ensure `DATABASE_URL` is set correctly in Vercel environment variables with `?pgbouncer=true&connection_limit=1` for serverless.

## Git Workflow

```bash
# Standard commit message conventions:
git commit -m "feat: add new feature"           # New feature
git commit -m "fix: resolve login issue"         # Bug fix
git commit -m "style: update theme colors"       # Styling changes
git commit -m "docs: update SKILL.md"            # Documentation
git commit -m "refactor: restructure layout"     # Code restructure
```
