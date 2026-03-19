---
name: Internationalization (i18n)
description: How the RTBPF multi-language system works — next-intl, locale routing, UI translations, content translations, language switching
---

# Internationalization (i18n) System

## Overview
The RTBPF website supports **8 languages** using **next-intl** for locale-based routing and UI translations. Content translations (articles, events) are stored in the database and served dynamically based on the active locale.

## Architecture

### Key Files
- `src/i18n/routing.ts` — Locale config, supported locales, default locale
- `src/i18n/request.ts` — Server-side locale detection
- `src/middleware.ts` — Locale routing middleware (rewrites `/articles` → `/th/articles`)
- `messages/th.json` — Thai UI translations (default)
- `messages/en.json` — English UI translations
- `messages/ko.json`, `ja.json`, `zh.json`, `fr.json`, `de.json`, `es.json` — Other languages
- `src/components/shared/LanguageSwitcher.tsx` — Language selector dropdown

### Locale Configuration (`src/i18n/routing.ts`)
```typescript
export const locales = ['th', 'en', 'ko', 'ja', 'zh', 'fr', 'de', 'es'] as const;
export const defaultLocale = 'th';
```

## Two Types of Translation

### 1. UI Translations (Static — `messages/*.json`)
These translate the website interface: navigation, buttons, labels, headings.

```json
// messages/th.json
{
  "Index": {
    "featureStory": "เรื่องเด่น",
    "latestNews": "ข่าวล่าสุด",
    "readMore": "อ่านต่อ"
  },
  "Categories": {
    "News": "ข่าว",
    "Press Release": "ข่าวประชาสัมพันธ์"
  }
}
```

**Usage in components:**
```tsx
import { getTranslations } from "next-intl/server";  // Server
import { useTranslations } from "next-intl";           // Client

const t = await getTranslations("Index");
<h1>{t("latestNews")}</h1>
```

### 2. Content Translations (Dynamic — Database)
Articles and events have translated versions stored in `ArticleTranslation` / `EventTranslation` tables.

```typescript
// Fetching with translations
const articles = await prisma.article.findMany({
  include: {
    translations: {
      where: { languageCode: locale }
    }
  }
});

// Using translation with fallback
const title = article.translations[0]?.title || article.title;
```

## URL Structure
```
/th/articles          → Thai (default)
/en/articles          → English
/ko/articles          → Korean
/ja/articles          → Japanese
/zh/articles          → Chinese
/fr/articles          → French
/de/articles          → German
/es/articles          → Spanish
```

- Default locale (th) prefix is optional: `/articles` → redirects to `/th/articles`
- Middleware handles locale detection from browser `Accept-Language` header
- Language preference stored in cookie `NEXT_LOCALE`

## Language Switcher (`LanguageSwitcher.tsx`)
- **Location**: Top-right corner of Navbar
- **Display**: Flag emoji + language name
- **Behavior**: Changes URL locale prefix, sets cookie, preserves current page path
- **Example**: On `/th/articles/my-post`, switching to English → `/en/articles/my-post`

## Adding a New Language

### Step 1: Add locale code
```typescript
// src/i18n/routing.ts
export const locales = ['th', 'en', 'ko', 'ja', 'zh', 'fr', 'de', 'es', 'NEW_CODE'] as const;
```

### Step 2: Create message file
Copy `messages/en.json` → `messages/NEW_CODE.json` and translate all strings.

### Step 3: Update LanguageSwitcher
Add the new language flag and label to the switcher component.

### Step 4: Add to admin language settings
So the AI translation system picks it up.

## Common Issues
- **404 on locale URLs**: Check `middleware.ts` isn't blocking the locale prefix
- **Translation not showing**: Ensure `ArticleTranslation` exists for that `articleId` + `languageCode`
- **Fallback to Thai**: Expected behavior when no translation exists for the requested locale
- **Cookie not persisting**: Check `NEXT_LOCALE` cookie settings
