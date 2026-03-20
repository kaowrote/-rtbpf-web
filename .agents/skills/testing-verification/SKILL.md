---
name: testing-verification
description: ขั้นตอนทดสอบและยืนยันความถูกต้อง — Browser Testing, Checklist, Verification Plan
---

# Testing & Verification Skill

## หลักการ: ทดสอบทุกครั้งหลังเขียนโค้ด
ทุกการเปลี่ยนแปลงต้องผ่านการทดสอบก่อนแจ้ง user

## ประเภทการทดสอบ

### 1. Browser Testing (Visual Verification)
ใช้ `browser_subagent` ทดสอบผ่าน browser จริง:

```
browser_subagent({
  Task: "ขั้นตอนทดสอบ...",
  RecordingName: "test_feature_name",
  TaskName: "Testing Feature Name"
})
```

#### Best Practices:
- ข้อ 1 ครั้ง: Navigate → Wait → Screenshot → Verify
- ถ่าย screenshot ทุก step สำคัญ
- Thai text พิมพ์ไม่ได้ใน Playwright → ใช้ภาษาอังกฤษ หรือ JS injection
- Wait 3-5 วินาทีหลังทุก action
- ตรวจ Network requests ถ้า test API calls

#### ตัวอย่าง Test Script:
```
Step 1: Navigate to http://localhost:3001/admin/articles
- Wait 3 seconds
- Take screenshot

Step 2: Click create button
- Wait 3 seconds
- Take screenshot

Step 3: Fill form and submit
- Verify success message appears
- Take screenshot

Return: description of results
```

### 2. API Testing
```bash
# Test API route
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"articleId": "xxx", "languageCode": "th"}'

# Check response status
curl -I http://localhost:3001/api/settings
```

### 3. Build Verification
```bash
# Check TypeScript errors
npx tsc --noEmit 2>&1 | head -50

# Check ESLint
npm run lint 2>&1 | head -50

# Test production build
npm run build
```

### 4. Database Verification
```bash
# Open Prisma Studio
npx prisma studio

# Or query directly
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM articles WHERE status='PUBLISHED'"
```

## Checklist Template

### Pre-Deploy Checklist
```markdown
## Pre-Deploy Checklist

### Core Functionality
- [ ] Admin Dashboard loads correctly
- [ ] Article CRUD (Create, Read, Update, Delete)
- [ ] Event CRUD
- [ ] Awards management
- [ ] User management (roles, approval)

### Admin Features
- [ ] Settings page (General, API Keys, Branding)
- [ ] Translation dashboard (batch translate)
- [ ] TipTap editor (all embed types)
- [ ] Media Library upload/select
- [ ] AI Image Generation (Kie.ai)

### Public Frontend
- [ ] Homepage renders all sections
- [ ] Article detail page + TTS
- [ ] Events listing and detail
- [ ] Awards page
- [ ] Membership page
- [ ] Language switcher (8 locales)

### SEO & PWA
- [ ] Sitemap.xml valid
- [ ] robots.txt valid
- [ ] PWA manifest valid
- [ ] Meta tags present

### Authentication
- [ ] Login works
- [ ] Registration works
- [ ] Password reset works
- [ ] Email verification works
- [ ] Role-based access control

### AI Features
- [ ] AI Translation (Gemini)
- [ ] AI Image Generation (Kie.ai)
- [ ] TTS Audio (Google Cloud TTS)
- [ ] "Gen From AI" watermark displays
```

### Feature-Specific Checklist
```markdown
## Feature: [Name]

### Functionality
- [ ] Core feature works
- [ ] Edge cases handled
- [ ] Error messages display

### UI/UX
- [ ] Desktop view
- [ ] Mobile responsive
- [ ] Dark mode compatible
- [ ] Loading states

### Data
- [ ] Data saves correctly
- [ ] Data loads correctly
- [ ] Validation works

### Integration
- [ ] Connected to other features
- [ ] API calls succeed
- [ ] No console errors
```

## Verification ผ่าน Screenshot

### วิธีเก็บหลักฐาน:
1. ถ่าย screenshot ทุก step สำคัญ
2. เก็บใน brain directory: `{brain_dir}/{feature}_{timestamp}.png`
3. embed ใน walkthrough.md:
```markdown
![Feature working](file:///path/to/screenshot.png)
```

### เมื่อพบ Bug:
1. ถ่าย screenshot ปัญหา
2. ดู console logs: `browser_console_logs`
3. ดู network requests: `browser_list_network_requests`
4. แก้ไขโค้ด
5. ทดสอบซ้ำ
6. ถ่าย screenshot ยืนยัน fix

## Walkthrough Document

หลัง verify เสร็จ สร้าง `walkthrough.md`:

```markdown
# [Feature Name] — Walkthrough

## สิ่งที่ทำ
- รายการเปลี่ยนแปลง

## ผลทดสอบ
| รายการ | ผล |
|--------|-----|
| Feature A | ✅ |
| Feature B | ✅ |

## หลักฐาน
![screenshot](file:///path/to/image.png)

## ไฟล์ที่แก้ไข
- [NEW] file.tsx
- [MODIFY] file.tsx
```
