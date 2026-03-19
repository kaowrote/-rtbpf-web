---
name: Authentication & Authorization
description: How the RTBPF authentication system works — NextAuth.js v5 (Auth.js), credential login, registration, password reset, role-based middleware
---

# Authentication & Authorization

## Overview
The RTBPF website uses **NextAuth.js v5 (Auth.js)** for authentication with credentials provider (email + password). Passwords are hashed with **bcryptjs**. Role-based access is enforced via middleware and API-level checks.

## Architecture

### Key Files
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- `src/app/api/auth/admin-login/route.ts` — Admin login API
- `src/app/actions/auth.ts` — Server actions for auth
- `src/lib/auth-guard.ts` — Role-checking utility functions
- `src/middleware.ts` — Route protection middleware
- `src/components/auth/LoginForm.tsx` — Login form component
- `src/components/auth/AuthSessionProvider.tsx` — SessionProvider wrapper

### Auth Pages
| Page | URL | Purpose |
|------|-----|---------|
| Admin Login | `/admin/login` | CMS login form |
| Sign In | `/auth/signin` | Public sign in |
| Register | `/auth/register` | New account |
| Forgot Password | `/admin/forgot-password` | Request reset email |
| Reset Password | `/admin/reset-password` | Set new password (from email link) |

## User Model (Prisma)
```prisma
model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  hashedPassword String?
  image          String?
  role           Role      @default(MEMBER)
  status         UserStatus @default(PENDING)
  // ... relations
}

enum Role {
  SUPER_ADMIN
  ADMIN
  EDITOR
  AUTHOR
  TRANSLATOR
  JURY
  MEMBER
}

enum UserStatus {
  ACTIVE
  PENDING
  SUSPENDED
}
```

## Authentication Flow

### Login
1. User submits email + password to `/api/auth/admin-login`
2. API looks up user by email
3. Compares password hash with `bcryptjs.compare()`
4. If success → `NextAuth.signIn("credentials", ...)` creates session
5. Session stored as JWT cookie
6. Redirect to `/admin`

### Registration
1. User submits email + password to register endpoint
2. Password hashed with `bcryptjs.hash(password, 10)`
3. User created with `role: MEMBER`, `status: PENDING`
4. Admin must activate the account (change status to `ACTIVE`)

### Password Reset
1. User enters email → POST to forgot-password API
2. System generates reset token (stored in DB with expiry)
3. Email sent via **Resend API** (`src/lib/mail.ts`) with reset link
4. User clicks link → `/admin/reset-password?token=xxx`
5. User enters new password → API verifies token → updates password hash

## Middleware (`src/middleware.ts`)
```typescript
// Protected routes: /admin/* (except /admin/login, /admin/forgot-password, /admin/reset-password)
// Public routes: /, /articles, /events, /awards, /about, /contact, etc.
// Locale routing: handled by next-intl middleware
```

### How Middleware Works:
1. Checks if route is public → allow through
2. Checks if route is auth page (login/register) → allow through
3. For `/admin/*` routes → check for valid session
4. If no session → redirect to `/admin/login`
5. Locale prefix handling: `/th/articles` → valid, `/articles` → redirect to `/th/articles`

## Role-Based Access (`src/lib/auth-guard.ts`)
```typescript
// Utility functions:
// - requireRole(session, ['SUPER_ADMIN', 'ADMIN']) — throws if not authorized
// - hasRole(session, role) — returns boolean
```

## Environment Variables
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://rtbpf-web.vercel.app
RESEND_API_KEY=your-resend-api-key  # For password reset emails
```

## Common Issues
- **"NEXTAUTH_SECRET missing"**: Set in `.env` and Vercel env vars
- **Login fails on Vercel**: Ensure `NEXTAUTH_URL` matches deployment URL
- **Password reset email not sent**: Check `RESEND_API_KEY` is set; skip in development
- **User can't access admin**: Check user `status` is `ACTIVE` and `role` has permission
