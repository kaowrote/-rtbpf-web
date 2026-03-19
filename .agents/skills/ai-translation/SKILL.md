---
name: AI Translation System
description: How the RTBPF website AI translation system works using Google Gemini 2.0 Flash to translate articles into 7 target languages
---

# AI Translation System

## Overview
The RTBPF website uses **Google Gemini 2.0 Flash API** to automatically translate articles from Thai (default language) into 7 other languages. Translations are stored in the `article_translations` table and served via `next-intl` locale routing.

## Architecture

### Key Files
- `src/lib/gemini.ts` — Gemini API client, translation function
- `src/app/api/admin/languages/route.ts` — API for managing supported languages
- `src/app/api/articles/route.ts` — Article API (includes translation data)
- `prisma/schema.prisma` — `ArticleTranslation` model definition
- `messages/*.json` — Static UI translation files (th.json, en.json, ko.json, ja.json, zh.json, fr.json, de.json, es.json)

### Database Schema
```
model ArticleTranslation {
  id           String   @id @default(cuid())
  articleId    String
  languageCode String   // en, ko, ja, zh, fr, de, es
  title        String
  excerpt      String?
  content      String   // Full HTML content
  article      Article  @relation(fields: [articleId], references: [id])
  @@unique([articleId, languageCode])
}
```

### Supported Languages
| Code | Language | Flag |
|------|----------|------|
| th   | ไทย (default, source) | 🇹🇭 |
| en   | English | 🇬🇧 |
| ko   | 한국어 | 🇰🇷 |
| ja   | 日本語 | 🇯🇵 |
| zh   | 中文 | 🇨🇳 |
| fr   | Français | 🇫🇷 |
| de   | Deutsch | 🇩🇪 |
| es   | Español | 🇪🇸 |

## How Translation Works

### 1. Gemini API Call (`src/lib/gemini.ts`)
```typescript
// Uses @google/generative-ai package
// Model: gemini-2.0-flash
// ENV: GEMINI_API_KEY
```
- Sends the Thai article (title, excerpt, content) to Gemini
- Instructs Gemini to preserve all HTML tags and structure
- Returns translated text for each field

### 2. Translation Trigger
- **Admin CMS** → Article Edit page → "🤖 AI Translate" button
- Can translate to a single language or all 7 at once
- Results saved to `article_translations` table with `@@unique([articleId, languageCode])`

### 3. Serving Translations
- When a user visits `/en/articles/[slug]`, the system:
  1. Fetches the article with `include: { translations: { where: { languageCode: locale } } }`
  2. Uses `translations[0]?.title` if available, falls back to original Thai title
  3. Same pattern for excerpt and content

## How to Add a New Language
1. Add language code to `src/i18n/routing.ts` → `locales` array
2. Create `messages/[code].json` with UI translations
3. Add the language to the admin settings language list
4. The AI translation will automatically support it via Gemini

## Environment Variables
```
GEMINI_API_KEY=your-google-ai-studio-api-key
```

## Common Issues
- **Translation fails**: Check `GEMINI_API_KEY` is valid and has quota
- **HTML broken after translation**: Gemini sometimes strips tags; the prompt instructs it to preserve HTML
- **Missing translation**: If no translation exists for a locale, the system falls back to the Thai original
