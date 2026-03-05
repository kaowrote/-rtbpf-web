# RTBPF V2.0 - Testing Checklist

This document tracks the status of the refactored Front-End and Back-End functionalities for the Website.

## 🟢 1. Database & Prisma (Backend)

- [x] Prisma Schema Defined (`schema.prisma`)
- [x] Database Configuration (Supabase + PostgreSQL)
- [x] Migrations generated successfully
- [x] Prisma Client Generated (`npx prisma generate`)
- [x] Seed Data Inserted successfully (`npx tsx prisma/seed.ts`) - Admin user, events, articles, and awards nominees injected.

## 🟢 2. Authentication (NextAuth)

- [x] Setup Admin Login Page (`/admin/login`)
- [x] Connect with Supabase Database
- [x] NextAuth APIs & Credentials Provider configured
- [x] Admin Role verification middleware active on `/admin/*` routes.
- [x] API Route protection configured (`requireEditor` guard mechanism works)

## 🟢 3. Public Frontend Interfaces

- [x] **Home Page (`/`)**: Connect sections mapping eventually to APIs.
- [x] **Articles List Page (`/articles`)**: Server component dynamically fetching and mapping Published Articles + Pagination.
- [x] **Article Detail Page (`/articles/[slug]`)**: Fetch single Article, tip-tap HTML injection working correctly.
- [x] **Events List Page (`/events`)**: Connect API, Filter logic (Event Statuses sorted properly), Status Badges Active.
- [x] **Event Detail Page (`/events/[slug]`)**: Fetch Event info, Maps iframe loaded successfully, dynamic registration availability.
- [x] **Awards Search Page (`/awards`)**: Client Side implementation fetching from Database APIs (/api/awards/nominees). Fuzzy search + Year Category sorting operational.

## 🟢 4. Website Admin System

- **Articles & News:**
  - [x] List view displaying articles correctly (`/admin/articles`)
  - [x] Create Article Form connected to POST API (`/admin/articles/create`)
  - [x] Edit Article Form connected to PUT API (`/admin/articles/edit/[slug]`)
- **Events:**
  - [x] List view displaying events correctly (`/admin/events`)
  - [x] Create Event Form connected to POST API (`/admin/events/create`)
  - [x] Edit Event Form connected to PUT API (`/admin/events/edit/[slug]`)
- **Awards (Nominees):**
  - [x] List view displaying nominees correctly (`/admin/awards`)
  - [x] Create Nominee Form connected to POST API (`/admin/awards/create`)
  - [x] Edit Nominee Form connected to PUT API (`/admin/awards/edit/[slug]`)
- **Users Settings:**
  - [x] User list and statuses available based on Role architecture (`/admin/users`)

## 🟡 5. Security & Build Stability

- [x] Full `npm run build` verified. Typescript mismatches (like events capacity parameters) mitigated.
- [ ] Implement `force-dynamic` rendering for admin tables to prevent prerender caching issues (Prisma connection timeouts).
- [ ] End-to-End Visual Testing - ensure TipTap images upload handles object storing via Cloudflare/S3 or preferred mechanism.

## 📝 Next Suggested Actions for Production Setup

1. **File Upload Verification:** Double check the API logic for the Tiptap file uploader to ensure pictures added through the editor are sent to Supabase Storage or an active CDN.
2. **Setup Vercel (or Preferred Server):** Prepare `.env.production` Environment variables and link the remote DB explicitly.
3. **SEO Tagging:** Add `next/head` metadata logic dynamically on the public `[slug]` pages (Articles/Events) so that Facebook/LINE share cards populate correctly.
