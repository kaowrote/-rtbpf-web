---
name: Social Share System
description: How the RTBPF social sharing works — ShareButtons component, ShareFAB for mobile, Web Share API, supported platforms
---

# Social Share System

## Overview
Every article page has social sharing functionality via two components: `ShareButtons` (desktop bar) and `ShareFAB` (mobile floating button). Supports Facebook, Twitter/X, LINE, and clipboard copy.

## Architecture

### Key Files
- `src/components/shared/ShareButtons.tsx` — Desktop share button bar
- `src/components/shared/ShareFAB.tsx` — Mobile floating action button

## ShareButtons Component
Displays a horizontal row of share buttons on desktop:

| Platform | Method | URL Pattern |
|----------|--------|-------------|
| 📋 Copy URL | `navigator.clipboard.writeText()` | Current page URL |
| 📘 Facebook | Window popup | `https://www.facebook.com/sharer/sharer.php?u={url}` |
| 🐦 Twitter/X | Window popup | `https://twitter.com/intent/tweet?url={url}&text={title}` |
| 💚 LINE | Window popup | `https://social-plugins.line.me/lineit/share?url={url}` |

### Props
```tsx
interface ShareButtonsProps {
  url: string;      // Full article URL
  title: string;    // Article title for share text
}
```

## ShareFAB Component (Mobile)
A floating action button (FAB) that appears at the bottom-right on mobile screens.

### Behavior
1. **If browser supports Web Share API** (`navigator.share`):
   - Uses native OS share dialog (includes all installed apps)
2. **Fallback** (older browsers):
   - Opens a popup menu with the same 4 share options
3. **Visual**: Circular button with share icon, animates on tap

### Props
```tsx
interface ShareFABProps {
  url: string;
  title: string;
  text?: string;     // Optional description for Web Share API
}
```

## Integration
Both components are used in the article detail page:
```tsx
// src/app/[locale]/articles/[id]/page.tsx
<ShareButtons url={articleUrl} title={article.title} />
<ShareFAB url={articleUrl} title={article.title} text={article.excerpt} />
```

## Adding a New Share Platform
1. Add a new button/icon in `ShareButtons.tsx`
2. Construct the share URL for the platform (most use query parameters)
3. Open via `window.open(url, '_blank', 'width=600,height=400')`
4. Add corresponding option to `ShareFAB.tsx` fallback menu
