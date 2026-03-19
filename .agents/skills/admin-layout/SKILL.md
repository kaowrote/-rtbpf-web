---
name: Admin CMS Layout & Design
description: How the RTBPF Admin CMS layout works — sidebar navigation, responsive design, theme colors, route structure, and common pitfalls
---

# Admin CMS Layout & Design

## 🎨 Theme Colors (Official)

| Color | Hex | Usage |
|-------|-----|-------|
| **Gold (Primary)** | `#cfb659` | Active sidebar items, accent, hover states |
| **Black (Background)** | `#000000` | Primary buttons, card backgrounds |
| **Navy Blue (Secondary)** | `#1b294b` | Sidebar background, Footer, Stay Connected section, hero sections |
| **Darker Gold** | `#bda348` | Gradient darker end |
| **Lighter Gold** | `#d9c26a` | Gradient lighter end |

> Previously Gold `#C9A84C` + Navy `#1B2A4A` — updated 2026-03-19.

## Architecture

### Route Structure

```
src/app/admin/
├── layout.tsx          ← Main admin layout (client component, sidebar + top bar)
├── page.tsx            ← Dashboard (server component, SSR stats)
├── login/
│   ├── layout.tsx      ← Login-specific layout (no sidebar)
│   └── page.tsx        ← Login form
├── logout/
│   └── page.tsx        ← Auto-logout + redirect to /admin/login
├── forgot-password/
│   └── page.tsx
├── reset-password/
│   └── page.tsx
├── articles/
│   ├── page.tsx        ← Article list
│   ├── create/page.tsx ← Create article
│   └── edit/[id]/page.tsx ← Edit article
├── events/             ← Same CRUD pattern
├── awards/             ← Same CRUD pattern
├── users/              ← User management (ADMIN+)
├── settings/           ← System settings (ADMIN+)
└── profile/            ← User profile
```

### Key Files

- **Layout**: `src/app/admin/layout.tsx`
  - Client component (`"use client"`)
  - Navy blue sidebar with gold accents
  - Collapsible sidebar (desktop)
  - Mobile responsive hamburger menu
  - Sticky breadcrumb top bar
  - User avatar + role display at bottom
  - Logout button + profile link

## ⚠️ Critical: CSS Import

The admin route is **outside** the `[locale]` route group, so it does NOT inherit `globals.css` from `[locale]/layout.tsx`.

**The admin layout MUST import CSS directly:**

```tsx
import "@/app/[locale]/globals.css";
```

Without this, **ALL Tailwind CSS classes will not render** and the page will appear completely unstyled (plain HTML).

## Sidebar Configuration

Navigation items are defined in `NAV_ITEMS` array with role-based access:

```tsx
const NAV_ITEMS: NavSection[] = [
    {
        section: "Content",
        items: [
            { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR", "JURY"] },
            { label: "Articles & News", href: "/admin/articles", icon: FileText, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR"] },
            { label: "Events", href: "/admin/events", icon: CalendarIcon, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
            { label: "Awards", href: "/admin/awards", icon: Trophy, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "JURY"] },
        ],
    },
    {
        section: "System",
        items: [
            { label: "Users", href: "/admin/users", icon: Users, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
            { label: "Settings", href: "/admin/settings", icon: Settings, 
              allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
        ],
    },
];
```

## Pages Without Sidebar

These pages render children only (no sidebar/topbar):

- `/admin/login`
- `/admin/logout`
- `/admin/forgot-password`
- `/admin/reset-password`

This is controlled by the early return check:

```tsx
if (isLoginPage || isForgotPasswordPage || isResetPasswordPage || isLogoutPage) {
    return <>{children}</>;
}
```

## Sidebar Design Tokens

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Sidebar bg | `bg-[#1b294b]` | Same |
| Active item | `bg-[#cfb659] text-[#1b294b]` | Same |
| Inactive item | `text-white/60` | Same |
| Hover item | `bg-white/[0.08] text-white` | Same |
| Icon hover | `text-[#cfb659]` | Same |
| Section label | `text-white/30` | Same |
| Brand logo | `bg-[#cfb659] text-[#1b294b]` | Same |
| User area | `bg-white/5 border-white/5` | Same |
| Dividers | `border-white/10` | Same |

## Responsive Behavior

- **Desktop (lg+)**: Fixed sidebar with collapse toggle button
- **Mobile (<lg)**: Hidden sidebar + hamburger menu button (fixed top-left)
- Mobile overlay: `bg-black/60 backdrop-blur-sm`

## Logout Flow

The `/admin/logout` page handles the signout flow:

1. Client-side page loads
2. Calls `POST /api/auth/signout`
3. Redirects to `/admin/login`
4. Shows a loading spinner during the process
