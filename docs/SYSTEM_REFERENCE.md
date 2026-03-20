# RTBPF CMS — System Reference Document
> อัปเดตล่าสุด: 20 มีนาคม 2569

---

## 📋 สารบัญ

1. [API Keys & Services](#api-keys--services)
2. [AI Image Generation (Kie.ai)](#ai-image-generation-kieai)
3. [Text-to-Speech (TTS)](#text-to-speech-tts)
4. [Multi-Language Translation](#multi-language-translation)
5. [AI Image Watermark](#ai-image-watermark)
6. [ค่าใช้จ่าย (Cost Reference)](#ค่าใช้จ่าย-cost-reference)
7. [Tech Stack](#tech-stack)
8. [Database Schema (Key Tables)](#database-schema-key-tables)

---

## API Keys & Services

| Service | ตำแหน่งเก็บ Key | หน้าตั้งค่า |
|---------|----------------|------------|
| Google AI Studio (Gemini) | Supabase `system_settings` → `apiKeyGoogleAI` | Admin > Settings > API Keys |
| Google Cloud TTS | Supabase `system_settings` → `apiKeyGoogleTTS` (fallback ใช้ `apiKeyGoogleAI`) | Admin > Settings > API Keys |
| Kie.ai (Image Gen) | Supabase `system_settings` → `apiKeyKieAi` | Admin > Settings > API Keys |
| Supabase | `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env.local |

### วิธีตั้งค่า API Key
1. ไปที่ **Admin Panel > Settings > API Keys**
2. กรอก Key ในช่องที่ต้องการ
3. กด **บันทึก** → ระบบจะเก็บใน Supabase `system_settings` table
4. Badge จะเปลี่ยนเป็น ✅ CONFIGURED

---

## AI Image Generation (Kie.ai)

### Endpoint
- **API Route:** `/api/ai-image` (POST)
- **Source:** `src/app/api/ai-image/route.ts`

### Provider
- **Kie.ai API** → Model: **Nano Banana 2**
- **API Endpoint:** `https://api.kie.ai/image/v1/generate`

### สไตล์ภาพที่รองรับ
| สไตล์ | คำอธิบาย | Prompt Prefix |
|-------|---------|---------------|
| ภาพข่าว (News Photo) | ภาพถ่ายข่าวสมจริง | Professional news photography |
| อินโฟกราฟิก | กราฟิก/ข้อมูล | Clean infographic |
| Illustration | ภาพวาดประกอบ | Editorial illustration |
| อะนิเมะ | สไตล์อนิเมะ | Anime style |
| Digital Art | ศิลปะดิจิทัล | Digital art |
| วาดมือ | สไตล์สเก็ตช์ | Hand-drawn sketch |
| Cinematic | ภาพยนตร์ | Cinematic film still |
| Minimal | มินิมัล | Minimalist design |

### Aspect Ratios
| อัตราส่วน | ใช้สำหรับ | ขนาด |
|----------|---------|------|
| 16:9 | ภาพปกข่าว | 1024×576 |
| 1:1 | โซเชียล | 1024×1024 |
| 4:3 | บทความ | 1024×768 |

### การเก็บภาพ
- อัปโหลดไป **Supabase Storage** → bucket `media` → folder `ai-generated/`
- URL Pattern: `{SUPABASE_URL}/storage/v1/object/public/media/ai-generated/{filename}`
- ระบบตรวจจับภาพ AI จาก path `ai-generated/` ใน URL

---

## Text-to-Speech (TTS)

### Endpoint
- **API Route:** `/api/tts` (POST)
- **Source:** `src/app/api/tts/route.ts`

### วิธีทำงาน
1. ผู้ใช้กดปุ่ม **"🔊 ฟังบทความ"** บนหน้าอ่านข่าว
2. Frontend ส่ง `POST /api/tts` พร้อม `{ articleId, languageCode }`
3. Backend ดึงเนื้อหาบทความ → strip HTML → ส่งไป Google Cloud TTS
4. Audio file อัปโหลดไป Supabase Storage → ส่ง URL กลับ
5. Frontend เปิด Audio Player ที่ก้นหน้าจอ

### Fallback
- **Primary:** Google Cloud Text-to-Speech API
- **Fallback:** Browser Web Speech API (ถ้า Google TTS ไม่พร้อม)

### Component
- `ArticlePlayer` → `src/components/shared/ArticlePlayer.tsx`
- แสดงบนหน้า `[locale]/articles/[id]/page.tsx`

---

## Multi-Language Translation

### Endpoint
- **API Route:** `/api/translate` (POST)
- **Source:** `src/app/api/translate/route.ts`

### ภาษาที่รองรับ (8 ภาษา)
| Code | ภาษา |
|------|------|
| th | ไทย (Source/ต้นฉบับ) |
| en | English |
| ko | 한국어 (Korean) |
| ja | 日本語 (Japanese) |
| zh | 简体中文 (Chinese Simplified) |
| fr | Français (French) |
| de | Deutsch (German) |
| es | Español (Spanish) |

### วิธีทำงาน
1. Admin กด **"Translate"** หรือ **"Translate All"** ที่ sidebar ขวา
2. ระบบส่งเนื้อหา title + excerpt + body ไป **Gemini 2.0 Flash**
3. Gemini แปลและคืนเป็น TipTap JSON format
4. บันทึกลง table `article_translations`
5. Frontend อ่าน translation ตาม locale URL → `/th/`, `/en/`, `/ja/` ฯลฯ

### Database
- Table: `article_translations`
- Columns: `articleId`, `languageCode`, `title`, `excerpt`, `content`

---

## AI Image Watermark

### Component
- `AiImageBadge` → `src/components/shared/AiImageBadge.tsx`

### วิธีทำงาน
- ตรวจ URL ของภาพ → ถ้ามี `ai-generated/` อยู่ใน path → แสดง badge
- Badge: **"★ GEN FROM AI"** — มุมล่างซ้าย
- สีพื้น: ดำโปร่งใส (backdrop-blur) + ขอบขาว

### แสดงบนหน้า
| หน้า | ไฟล์ |
|------|------|
| Article Detail (Hero) | `[locale]/articles/[id]/page.tsx` |
| Article Detail (Related) | `[locale]/articles/[id]/page.tsx` |
| Homepage (Hero + Featured) | `[locale]/page.tsx` |
| Articles Listing | `[locale]/articles/page.tsx` |

---

## ค่าใช้จ่าย (Cost Reference)

### ราคาต่อ 1 ข่าว (ครบ 8 ภาษา + ภาพ AI + เสียง TTS)

| ฟีเจอร์ | Service | ราคา/หน่วย | จำนวน | USD | THB |
|---------|---------|-----------|-------|-----|-----|
| 🎨 AI Image | Kie.ai Nano Banana 2 | ~$0.003/ภาพ | 1 | $0.003 | ~0.10 ฿ |
| 🌐 Translation | Gemini 2.0 Flash | $0.10/1M tokens | 7 ภาษา × ~200 tokens | $0.0001 | ~0.01 ฿ |
| 🔊 TTS Audio | Google Cloud TTS | $4/1M chars | ~500 chars | $0.002 | ~0.07 ฿ |
| **รวม** | | | | **~$0.005** | **~0.18 ฿** |

### ประมาณการรายเดือน

| ปริมาณข่าว/เดือน | AI Image | Translation | TTS | รวม (THB) |
|------------------|----------|-------------|-----|-----------|
| 10 ข่าว | ~1 ฿ | ~0.10 ฿ | ~0.70 ฿ | **~2 ฿** |
| 50 ข่าว | ~5 ฿ | ~0.50 ฿ | ~3.50 ฿ | **~9 ฿** |
| 100 ข่าว | ~10 ฿ | ~1 ฿ | ~7 ฿ | **~18 ฿** |
| 500 ข่าว | ~50 ฿ | ~5 ฿ | ~35 ฿ | **~90 ฿** |

> 💡 **สรุป:** ค่าใช้จ่ายต่ำมาก ไม่ถึง 1 บาทต่อข่าว!

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| AI Translation | Google Gemini 2.0 Flash |
| AI Image Gen | Kie.ai (Nano Banana 2) |
| TTS | Google Cloud TTS |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| i18n | next-intl (8 locales) |
| Rich Text Editor | TipTap |
| Hosting | Vercel |

---

## Database Schema (Key Tables)

### `articles`
| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| title | String | หัวข้อข่าว (ภาษาต้นฉบับ) |
| slug | String | URL-friendly identifier |
| content | JSON | TipTap editor content |
| excerpt | String? | สรุปย่อ |
| featuredImage | String? | URL ภาพปก |
| status | Enum | DRAFT / PUBLISHED / ARCHIVED |
| categoryId | String? | FK → categories |
| authorId | String? | FK → users |
| publishedAt | DateTime? | วันที่เผยแพร่ |

### `article_translations`
| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| articleId | String | FK → articles |
| languageCode | String | th, en, ko, ja, zh, fr, de, es |
| title | String | หัวข้อแปล |
| excerpt | String? | สรุปย่อแปล |
| content | JSON | เนื้อหาแปล (TipTap JSON) |

### `system_settings`
| Column | Type | Description |
|--------|------|-------------|
| id | String (cuid) | Primary key |
| key | String (unique) | ชื่อ setting |
| value | String? | ค่า setting |
| description | String? | คำอธิบาย |

### Key Settings
| Key | Description |
|-----|-------------|
| `apiKeyGoogleAI` | Google AI Studio API Key |
| `apiKeyGoogleTTS` | Google Cloud TTS API Key |
| `apiKeyKieAi` | Kie.ai API Key |
| `defaultNewsImageUrl` | URL ภาพข่าว default |
| `defaultEventImageUrl` | URL ภาพอีเวนต์ default |
| `siteName` | ชื่อเว็บไซต์ |

---

## โครงสร้างโฟลเดอร์สำคัญ

```
src/
├── app/
│   ├── [locale]/           # Public pages (th/en/ko/ja/zh/fr/de/es)
│   │   ├── page.tsx        # Homepage
│   │   ├── articles/       # Articles listing + detail
│   │   └── events/         # Events listing + detail
│   ├── admin/              # Admin CMS panel
│   │   ├── articles/       # Article CRUD
│   │   ├── events/         # Event CRUD
│   │   ├── awards/         # Awards management
│   │   ├── translations/   # Translation dashboard
│   │   └── settings/       # Settings (API Keys, General)
│   └── api/                # API Routes
│       ├── ai-image/       # Kie.ai image generation
│       ├── tts/            # Google Cloud TTS  
│       ├── translate/      # Gemini translation
│       └── ...
├── components/
│   ├── shared/             # Reusable components
│   │   ├── AiImageBadge.tsx    # "Gen From AI" watermark
│   │   ├── ArticlePlayer.tsx   # TTS audio player
│   │   └── ...
│   ├── admin/              # Admin-specific components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities, DB clients
└── i18n/                   # Internationalization config
```
