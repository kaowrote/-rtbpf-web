# 📊 RTBPF V2.0 — Project Summary
> สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์  
> อัปเดต: 20 มีนาคม 2569

---

## 1. 🗺️ แผนทั้งหมด (Module Map)

| Module | ชื่อ | สถานะ | รายละเอียด |
|--------|------|--------|-----------|
| M01 | Project Setup | ✅ | Next.js 15, Prisma, Supabase, TailwindCSS |
| M02 | Design System | ✅ | Theme Navy (#1B2A4A) + Gold (#C9A84C), Typography |
| M03 | Authentication | ✅ | Login, Register, Forgot/Reset Password, Email Verify |
| M04 | Roles & Permissions | ✅ | Super Admin, Admin, Editor, User + RBAC |
| M05 | Articles & Content | ✅ | CRUD บทความ, Slug, Categories, Tags |
| M06 | TTS (ฟังข่าว) | ✅ | Google Cloud TTS + Browser fallback |
| M07 | Social Media Embeds | ✅ | Facebook, Twitter/X, Instagram, TikTok |
| M08 | Awards System | ✅ | AwardYear → Categories → Nominees + Voting |
| M09 | Events System | ✅ | CRUD Events, Gallery, Date/Location |
| M10 | CMS Dashboard | ✅ | Stats, Activity, Quick Actions, Personal Stats |
| M11 | Rich Text Editor | ✅ | TipTap — formatting, embeds, media, fullscreen |
| M12 | Media Library | ✅ | Upload, Gallery, Supabase Storage |
| M13 | CMS Embed Manager | ✅ | Facebook, Twitter embed in editor |
| M14 | i18n (Internationalization) | ✅ | 8 ภาษา: TH, EN, KO, JA, ZH, FR, DE, ES |
| M15 | AI Translation Pipeline | ✅ | Gemini 2.0 Flash — auto translate all languages |
| M16 | Translation CMS | ✅ | Translation Dashboard, batch translate, per-article |
| M17 | Voting System | ✅ | Award voting, ballot, results |
| M18 | Notifications | ✅ | Bell icon, real-time notifications |
| M19 | Comments | ✅ | Article comments, likes, moderation |
| M20 | Membership | ✅ | Membership page, user profile, activity center |
| M21 | AI Recommendation | ❌ ข้าม | (ข้ามไว้ — ไม่จำเป็นในเฟสนี้) |
| M22 | PWA | ✅ | Progressive Web App, manifest, icons |
| M23 | SEO | ✅ | Sitemap, robots.txt, structured data, meta tags |
| M24 | AI Image Generation | ✅ | Kie.ai (Nano Banana 2) — 8 สไตล์ |
| M25 | AI Watermark | ✅ | "Gen From AI" badge มุมล่างซ้ายทุกภาพ AI |

> **22/23 Modules เสร็จ** (M21 ข้ามตามแผน)

---

## 2. ✨ Feature ทั้งหมด

### 🔵 Public Website (หน้าบ้าน)
| Feature | รายละเอียด |
|---------|-----------|
| Homepage | Hero image, Latest news, Events, Awards showcase |
| Article Detail | Full article, TTS audio, social share, comments |
| Articles Listing | Category filter, pagination, search by tag |
| Events | Event listing + detail, gallery, location/date |
| Awards | Award years, categories, nominees, voting |
| Membership | User profile, activity center, credit ledger |
| Language Switcher | 8 ภาษา — สลับภาษาได้ทันที |
| Dark Mode | รองรับ Light/Dark mode |
| PWA | ติดตั้งเป็น app ได้ |
| SEO | Sitemap, structured data, meta tags |

### 🟢 Admin CMS (หลังบ้าน)
| Feature | รายละเอียด |
|---------|-----------|
| Dashboard | สถิติรวม, กราฟ, Personal activity stats |
| Article CRUD | สร้าง/แก้/ลบ/เผยแพร่ข่าว |
| Event CRUD | สร้าง/แก้/ลบ/เผยแพร่อีเวนต์ |
| Awards Management | จัดการปีรางวัล, สาขา, ผู้เข้าชิง |
| TipTap Rich Editor | Bold, italic, headings, links, images, embeds |
| Media Library | Upload, เลือกจาก library |
| Translation Dashboard | แปลภาษาทั้งหมด, batch translate |
| User Management | ดูสมาชิก, อนุมัติ, ระงับ, กำหนดบทบาท |
| Settings | General, API Keys, Branding |
| Notifications | แจ้งเตือนระบบ |

### 🤖 AI Features
| Feature | Provider | รายละเอียด |
|---------|----------|-----------|
| AI Translation | Gemini 2.0 Flash | แปลอัตโนมัติ 8 ภาษา |
| AI Image Generation | Kie.ai (Nano Banana 2) | สร้างภาพ 8 สไตล์, 3 aspect ratios |
| TTS Audio | Google Cloud TTS | ฟังบทความเป็นเสียง |
| AI Watermark | Custom Component | "Gen From AI" badge อัตโนมัติ |

---

## 3. 🛠️ Tech Stack & Code Stats

### Technology Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 15 (App Router) |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | 4 |
| UI Components | shadcn/ui | latest |
| Database | PostgreSQL | via Supabase |
| ORM | Prisma | latest |
| Auth | NextAuth.js | v5 |
| Rich Text | TipTap | latest |
| AI Translation | Google Gemini | 2.0 Flash |
| AI Image | Kie.ai | Nano Banana 2 |
| TTS | Google Cloud TTS | v1 |
| Storage | Supabase Storage | - |
| i18n | next-intl | latest |
| Hosting | Vercel | - |
| PWA | next-pwa | custom manifest |

### Code Statistics
| Metric | จำนวน |
|--------|-------|
| **Total Source Files** | **151 ไฟล์** |
| **Total Lines of Code** | **20,380 บรรทัด** |
| TSX Files (React Components) | 90 ไฟล์ |
| TS Files (Backend/Logic) | 60 ไฟล์ |
| CSS Files | 1 ไฟล์ |
| Components | 54 components |
| Admin Pages | 22 pages |
| Public Pages | 14 pages |
| API Routes | 40 endpoints |
| i18n Message Files | 8 ไฟล์ (8 ภาษา) |

### Database (PostgreSQL via Supabase)
| Metric | จำนวน |
|--------|-------|
| **Total Models** | **20 tables** |
| Schema Lines | 424 บรรทัด |

#### Database Tables
| Table | ใช้ทำอะไร |
|-------|----------|
| `User` | ข้อมูลผู้ใช้, role, credits |
| `Account` | OAuth accounts |
| `Session` | User sessions |
| `VerificationToken` | Email verification |
| `ActivityLog` | บันทึกกิจกรรม |
| `Category` | หมวดหมู่ข่าว |
| `Article` | บทความ/ข่าว |
| `AwardYear` | ปีรางวัล |
| `AwardCategory` | สาขารางวัล |
| `AwardNominee` | ผู้เข้าชิงรางวัล |
| `Event` | อีเวนต์/กิจกรรม |
| `Media` | ไฟล์สื่อ (ภาพ, วิดีโอ) |
| `SystemSetting` | ตั้งค่าระบบ (API keys, branding) |
| `Language` | ภาษาที่รองรับ |
| `Translation` | ข้อมูลแปลภาษา (article translations) |
| `Comment` | ความคิดเห็น |
| `CommentLike` | Like ความคิดเห็น |
| `AwardVote` | โหวตรางวัล |
| `AudioArticle` | เสียง TTS ที่สร้างแล้ว |
| `Notification` | แจ้งเตือน |

---

## 4. 📰 ระบบ CMS รองรับอะไรบ้าง

### Content Types
| ประเภท | CRUD | แปลภาษา | AI Image | TTS | Social Share |
|--------|------|---------|----------|-----|-------------|
| บทความ/ข่าว | ✅ | ✅ 8 ภาษา | ✅ | ✅ | ✅ |
| อีเวนต์ | ✅ | ✅ 8 ภาษา | ❌ | ❌ | ✅ |
| รางวัล | ✅ | ❌ | ❌ | ❌ | ❌ |

### Rich Text Editor (TipTap)
| ความสามารถ | รองรับ |
|-----------|--------|
| Text Formatting | ✅ Bold, Italic, Strikethrough, Underline |
| Headings | ✅ H1, H2, H3 |
| Lists | ✅ Ordered, Unordered |
| Alignment | ✅ Left, Center, Right, Justify |
| Links | ✅ URL linking |
| Images | ✅ Upload + embed |
| Blockquote | ✅ |
| Code Block | ✅ |
| Fullscreen | ✅ |
| Social Embeds | ✅ Facebook, Twitter/X, Instagram, TikTok, YouTube |

### User Roles
| Role | สิทธิ์ |
|------|--------|
| Super Admin | ทุกอย่าง + จัดการ users + settings |
| Admin | จัดการ content + users ในองค์กร |
| Editor | สร้าง/แก้ไข content |
| User | อ่าน, comment, vote |

### Media Management
| ความสามารถ | รองรับ |
|-----------|--------|
| Upload | ✅ JPEG, PNG, WebP, GIF (สูงสุด 5MB) |
| Media Library | ✅ เลือกจาก gallery |
| AI Image Gen | ✅ 8 สไตล์ × 3 aspect ratios |
| Storage | Supabase Storage (bucket: media) |

---

## 5. 💰 ค่าใช้จ่าย AI Features

### ราคาต่อ 1 ข่าว (ครบทุกฟีเจอร์)
| รายการ | Service | ราคา/หน่วย | USD | THB |
|--------|---------|-----------|-----|-----|
| 🎨 ภาพ AI (1 ภาพ) | Kie.ai Nano Banana 2 | ~$0.003/ภาพ | $0.003 | ~0.10 ฿ |
| 🌐 แปลภาษา (7 ภาษา) | Gemini 2.0 Flash | $0.10/1M tokens | $0.0001 | ~0.01 ฿ |
| 🔊 เสียง TTS (1 บทความ) | Google Cloud TTS | $4/1M chars | $0.002 | ~0.07 ฿ |
| **รวมทั้งหมด** | | | **~$0.005** | **~0.18 ฿** |

### ประมาณการรายเดือน
| จำนวนข่าว/เดือน | ภาพ AI | แปลภาษา | TTS | **รวม (THB)** |
|-----------------|--------|---------|-----|--------------|
| 10 ข่าว | 1 ฿ | 0.10 ฿ | 0.70 ฿ | **~2 ฿** |
| 50 ข่าว | 5 ฿ | 0.50 ฿ | 3.50 ฿ | **~9 ฿** |
| 100 ข่าว | 10 ฿ | 1 ฿ | 7 ฿ | **~18 ฿** |
| 500 ข่าว | 50 ฿ | 5 ฿ | 35 ฿ | **~90 ฿** |
| 1,000 ข่าว | 100 ฿ | 10 ฿ | 70 ฿ | **~180 ฿** |

> [!TIP]
> **สรุป: ผลิตข่าว 100 ข่าว/เดือน ครบภาพ AI + แปล 8 ภาษา + เสียง TTS → ไม่ถึง 20 บาท!**

### ค่าใช้จ่ายอื่นๆ
| รายการ | ราคา |
|--------|------|
| Supabase (Free Tier) | ฟรี (500MB DB, 1GB Storage) |
| Supabase (Pro) | $25/เดือน (~850 ฿) |
| Vercel Hosting (Free) | ฟรี |
| Vercel (Pro) | $20/เดือน (~680 ฿) |
| Domain (.ai, .com) | ~$10-50/ปี |

---

## 6. 🧠 Skills ในระบบ (15 Skills)

### Core Skills (เดิม 11 ชุด)
| Skill | คำอธิบาย |
|-------|---------|
| `project-setup` | วิธีตั้งค่าโปรเจ็กต์ตั้งแต่ต้น |
| `database-schema` | โครงสร้าง DB, Prisma models |
| `authentication` | ระบบ Auth — login, register, roles |
| `admin-layout` | Admin panel layout, sidebar, theme |
| `cms-management` | CMS article/event CRUD workflow |
| `ai-translation` | AI translation pipeline (Gemini) |
| `internationalization` | i18n setup, next-intl, 8 locales |
| `comment-system` | Comments, likes, moderation |
| `social-share` | Social share buttons, OG tags |
| `theme-colors` | Navy + Gold theme, dark mode |
| `deployment` | Build, deploy to Vercel |

### Process Skills (ใหม่ 4 ชุด)
| Skill | คำอธิบาย |
|-------|---------|
| `pre-project-planning` | วางแผนก่อนเขียนโค้ด — Implementation Plan, User Approval |
| `testing-verification` | Browser testing, checklists, screenshot evidence |
| `checkpoint-workflow` | Task tracking, PLANNING → EXECUTION → VERIFICATION |
| `project-documentation` | สร้าง Reference Docs, API Docs, User Guides |

---

## 7. 💡 แนะนำเพิ่มเติม

### 🔴 สำคัญ (ควรทำเร็ว)
| # | รายการ | เหตุผล |
|---|--------|--------|
| 1 | **Analytics Dashboard** | เพิ่ม Google Analytics / Plausible เพื่อดู traffic จริง |
| 2 | **Image Optimization** | ใช้ Next.js Image optimization + CDN สำหรับ production |
| 3 | **Backup Strategy** | ตั้ง automated DB backup ผ่าน Supabase |

### 🟡 น่าสนใจ (เฟสถัดไป)
| # | รายการ | เหตุผล |
|---|--------|--------|
| 4 | **AI Content Generation** | ให้ AI ช่วยเขียนข่าวจาก RSS feed / Google Trends |
| 5 | **Email Newsletter** | ส่งข่าวอัตโนมัติให้สมาชิกทุกสัปดาห์ |
| 6 | **Social Auto-Post** | โพสต์ข่าวอัตโนมัติไป Facebook/X เมื่อเผยแพร่ |
| 7 | **TTS Multi-Language** | สร้างเสียง TTS ในทุกภาษา ไม่ใช่แค่ภาษาต้นฉบับ |
| 8 | **Image Gallery per Article** | รองรับหลายภาพต่อบทความ (carousel) |

### 🟢 Nice-to-Have
| # | รายการ | เหตุผล |
|---|--------|--------|
| 9 | **Live Preview** | Preview บทความแบบ real-time ก่อน publish |
| 10 | **Scheduled Publishing** | ตั้งเวลาเผยแพร่ล่วงหน้า (มี UI แล้ว, ต้องเพิ่ม cron) |
| 11 | **Content Versioning** | เก็บ revision history ของบทความ |
| 12 | **AI Recommendation (M21)** | แนะนำข่าวที่เกี่ยวข้องด้วย AI |
| 13 | **Multi-tenant** | รองรับหลายองค์กรใน instance เดียว |
