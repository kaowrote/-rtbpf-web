---
name: Theme Colors & Branding
description: Official RTBPF theme color palette, branding system, dynamic accent color via SystemSetting, and where each color is applied
---

# Theme Colors & Branding

## 🎨 Official Color Palette

| Color | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| **Gold (Primary)** | `#cfb659` | `--accent` | Accent color, buttons, links, highlights, awards text, active sidebar items |
| **Black** | `#000000` | — | Primary buttons, admin sidebar active (previously), card backgrounds |
| **Navy Blue** | `#1b294b` | — | Admin sidebar, Footer, Stay Connected section, hero sections (About, Contact) |
| **Darker Gold** | `#bda348` | — | Gradient darker end for gold buttons |
| **Lighter Gold** | `#d9c26a` | — | Gradient lighter end for gold hover states |

### Color History

| Date | Change |
|------|--------|
| 2026-03-19 | Gold `#C9A84C` → `#cfb659`, Navy `#1B2A4A` → `#1b294b`, then Navy → Black `#000000` for most areas |
| 2026-03-19 | Navy Blue `#1b294b` kept for: Admin sidebar, Footer, Stay Connected section |

## Dynamic Accent Color

The accent color can be customized via the **System Settings** page in the admin panel.

### How it works:

1. `SystemSetting` table stores `primaryAccentColor` key
2. `[locale]/layout.tsx` reads it server-side
3. Injected as CSS custom property via `<style>` tag:

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  :root {
    --accent: ${accentColor};
    --accent-foreground: 210 40% 98%;
  }
  .text-accent { color: var(--accent) !important; }
  .bg-accent { background-color: var(--accent) !important; }
  .border-accent { border-color: var(--accent) !important; }
` }} />
```

### Default fallback:

```tsx
const accentColor = settingsMap["primaryAccentColor"] || "#cfb659";
```

## Where Colors Are Applied

### Public Website (Front-end)

| Section | Color Used |
|---------|-----------|
| Navbar text/links | Gold accent (`text-accent`) |
| Hero sections (About, Contact) | Navy blue `#1b294b` background |
| Stay Connected / Newsletter | Navy blue `#1b294b` background, white text |
| Footer | Navy blue `#1b294b` background |
| Buttons | Black `#000000` bg, gold hover |
| Article cards | White bg, gold accent text |
| Awards page | Gold accent highlights |

### Admin CMS

| Element | Color |
|---------|-------|
| Sidebar background | Navy `#1b294b` |
| Active menu item | Gold `#cfb659` bg, navy text |
| Menu hover icon | Gold `#cfb659` |
| Brand logo circle | Gold `#cfb659` bg |
| Dashboard buttons | Black `#000000` bg, gold hover |
| Dashboard accent links | Gold `#cfb659` |
| Timeline dots | Gold `#cfb659` |
| UserAvatar hover ring | Gold `#cfb659/50` |

## Tailwind Usage

For hardcoded colors, use arbitrary value syntax:

```tsx
// Navy blue background
className="bg-[#1b294b]"

// Gold text
className="text-[#cfb659]"

// Mixed: gold on navy
className="bg-[#cfb659] text-[#1b294b]"
```

For the dynamic accent color, use the utility classes:

```tsx
className="text-accent"
className="bg-accent"
className="border-accent"
```

## Changing Theme Colors

To change theme colors globally:

1. **Gold accent**: Update in Admin → Settings → `primaryAccentColor`
2. **Hardcoded colors**: Search and replace hex values in `src/` directory:

```bash
# Example: change navy blue
find src/ -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) \
  -exec sed -i '' 's/#1b294b/#NEW_COLOR/g' {} +
```

3. **Update SKILL.md** — record the new colors in this file and `project-setup/SKILL.md`
