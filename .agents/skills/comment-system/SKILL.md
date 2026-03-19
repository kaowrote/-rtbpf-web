---
name: Comment System
description: How the RTBPF threaded comment system works — posting, replying, liking, authentication-gated interactions
---

# Comment System

## Overview
The comment system allows authenticated users to post comments on articles, reply in threaded fashion, and like/unlike comments. Anonymous visitors can view comments but must log in to interact.

## Architecture

### Key Files
- `src/components/comments/CommentSection.tsx` — Main comment display component (threaded view, like toggle)
- `src/components/comments/CommentForm.tsx` — Comment input form
- `src/components/auth/AuthSessionProvider.tsx` — SessionProvider wrapper for checking login state
- `src/app/api/articles/[id]/comments/route.ts` — GET (list) & POST (create) comments
- `src/app/api/comments/[commentId]/like/route.ts` — POST toggle like/unlike
- `prisma/schema.prisma` — `Comment` and `CommentLike` models

### Database Schema
```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String    @db.Text
  articleId String
  authorId  String
  parentId  String?                // null = top-level, set = reply
  createdAt DateTime  @default(now())
  article   Article   @relation(fields: [articleId], references: [id])
  author    User      @relation(fields: [authorId], references: [id])
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  likes     CommentLike[]
}

model CommentLike {
  id        String  @id @default(cuid())
  commentId String
  userId    String
  comment   Comment @relation(fields: [commentId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  @@unique([commentId, userId])    // One like per user per comment
}
```

## API Endpoints

### GET `/api/articles/[id]/comments`
Returns all comments for an article with:
- Author info (name, image)
- Like count
- Whether current user has liked each comment
- Nested replies (threaded)

### POST `/api/articles/[id]/comments`
Creates a new comment. Requires authentication.
```json
{
  "content": "Great article!",
  "parentId": null           // or comment ID for reply
}
```
- Max content length: 2,000 characters
- Returns the created comment with author info

### POST `/api/comments/[commentId]/like`
Toggles like for the authenticated user:
- If not liked → creates `CommentLike` record
- If already liked → deletes `CommentLike` record
- Returns `{ liked: boolean, likeCount: number }`

## UI Components

### CommentSection.tsx
- Displays all comments in threaded tree structure
- Each comment shows: author avatar, name, timestamp (via `date-fns`), content, like button, reply button
- Replies are indented under parent comments
- Like button: heart icon with count, toggles on click
- Reply button: expands inline CommentForm

### CommentForm.tsx
- Textarea with character count (max 2,000)
- Submit button (disabled when empty or submitting)
- Shows user's avatar when logged in
- Shows "เข้าสู่ระบบเพื่อแสดงความคิดเห็น" (Login to comment) when not logged in

## Integration
The `CommentSection` component is embedded in the article detail page:
```tsx
// src/app/[locale]/articles/[id]/page.tsx
<CommentSection articleId={article.id} />
```

## Dependencies
- `date-fns` — Date formatting for comment timestamps
- `next-auth` — Session checking for authentication state
