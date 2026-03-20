---
name: project-documentation
description: วิธีทำเอกสารประกอบโปรเจ็กต์ — Reference Docs, API Docs, User Guides, Architecture
---

# Project Documentation Skill

## เมื่อไหร่ควรสร้างเอกสาร
1. **หลังเพิ่มฟีเจอร์ใหม่** — บันทึกวิธีใช้งาน, API endpoints, ค่าใช้จ่าย
2. **หลังเปลี่ยน architecture** — อัปเดต system reference
3. **หลังเพิ่ม API key ใหม่** — เพิ่มใน API Keys Reference
4. **เมื่อ user ขอ** — สร้างเอกสาร reference ตามที่ร้องขอ

## โครงสร้างเอกสาร

### 1. System Reference (`docs/SYSTEM_REFERENCE.md`)
เอกสารกลางของโปรเจ็กต์ ประกอบด้วย:
- API Keys & Services — ตำแหน่งเก็บ key, หน้าตั้งค่า
- Feature Documentation — แต่ละฟีเจอร์ทำงานอย่างไร
- Cost Reference — ค่าใช้จ่ายต่อ unit, ประมาณการรายเดือน
- Tech Stack — เทคโนโลยีที่ใช้
- Database Schema — ตารางสำคัญ, columns, relations
- Folder Structure — โครงสร้างโฟลเดอร์

### 2. API Keys Reference (`docs/API_KEYS_REFERENCE.md`)
⚠️ **ห้าม commit ขึ้น Git** — เพิ่มใน `.gitignore` เสมอ!
- รวม API keys ทั้งหมดที่ใช้
- ระบุ service, key value, ตำแหน่งตั้งค่า, DB key
- ลิงก์ไป console/dashboard ของแต่ละ service

### 3. Feature Guides (`docs/AI_FEATURES_GUIDE.md`)
คู่มือผู้ใช้แต่ละฟีเจอร์:
- ตำแหน่งในระบบ (หน้าไหน, ปุ่มไหน)
- วิธีใช้งาน step-by-step
- เทคนิคที่ใช้ (API, library)
- ค่าใช้จ่ายต่อการใช้งาน 1 ครั้ง

## ขั้นตอนการสร้างเอกสาร

### Step 1: รวบรวมข้อมูล
```
1. Grep codebase หา API routes: grep -r "export async function" src/app/api/
2. ดู database schema: npx prisma studio หรือดู prisma/schema.prisma
3. ดู system_settings ใน DB สำหรับ API keys
4. ดู package.json สำหรับ dependencies
```

### Step 2: จัดโครงสร้าง
```markdown
# [Feature Name]

## Endpoint / ตำแหน่ง
## วิธีทำงาน (Architecture)
## วิธีใช้งาน (User Guide)
## ค่าใช้จ่าย (Cost)
## Technical Details
```

### Step 3: คำนวณค่าใช้จ่าย
ใช้ pricing จาก official docs:
- **Gemini 2.0 Flash**: $0.10/1M input tokens, $0.40/1M output tokens
- **Google Cloud TTS**: $4/1M characters (Standard), $16/1M (WaveNet)
- **Kie.ai**: ~$0.003/image (Nano Banana 2)
- คำนวณเป็น THB ด้วย rate ~34 THB/USD

### Step 4: Security Check
```
1. ตรวจว่า API_KEYS_REFERENCE.md อยู่ใน .gitignore
2. ไม่ hardcode key ในเอกสาร public
3. ระบุ "ดูใน .env.local" แทนการเขียน key จริง (สำหรับ keys ที่อยู่ใน env)
```

## ตำแหน่งเก็บเอกสาร
```
rtbpf-web/
├── docs/
│   ├── SYSTEM_REFERENCE.md    # เอกสารกลางระบบ
│   ├── API_KEYS_REFERENCE.md  # API Keys (gitignored)
│   └── AI_FEATURES_GUIDE.md   # คู่มือฟีเจอร์ AI
├── TESTING_CHECKLIST.md       # เช็คลิสต์ทดสอบ
└── README.md                  # ภาพรวมโปรเจ็กต์
```
