---
name: pre-project-planning
description: ขั้นตอนวางแผนก่อนเริ่มทำฟีเจอร์ — Planning Phase, Implementation Plan, User Approval
---

# Pre-Project Planning Skill

## หลักการ: ทำแผนก่อนเขียนโค้ด
ทุกฟีเจอร์ที่มีความซับซ้อน (แก้ไข 3+ ไฟล์) ต้องผ่านขั้นตอน Planning ก่อน

## ขั้นตอน Planning Phase

### Phase 1: Research & Analysis (5-15 นาที)

1. **เข้าใจ Requirement**
   - อ่าน user request อย่างละเอียด
   - ถามกลับถ้าไม่ชัดเจน
   - ระบุ scope ให้ชัด (ทำอะไร, ไม่ทำอะไร)

2. **วิเคราะห์ Codebase**
   ```bash
   # หาไฟล์ที่เกี่ยวข้อง
   grep -r "keyword" src/ --include="*.tsx" --include="*.ts"
   
   # ดูโครงสร้าง
   ls -la src/app/api/
   ls -la src/components/
   
   # ดู DB schema
   cat prisma/schema.prisma | grep -A 10 "model ArticleName"
   ```

3. **ค้นหา Existing Patterns**
   - ดูว่ามีฟีเจอร์คล้ายกันหรือไม่
   - ใช้ pattern เดียวกันถ้ามี
   - ดู Knowledge Items (KIs) ที่เกี่ยวข้อง

### Phase 2: Implementation Plan (10-20 นาที)

สร้าง `implementation_plan.md` ใน brain directory:

```markdown
# [Goal Description]

Brief description of the problem and what the change accomplishes.

## User Review Required
- Breaking changes
- Design decisions ที่ต้องการ feedback

## Proposed Changes

### [Component 1]
#### [MODIFY] filename.tsx
- Change description

#### [NEW] new-file.tsx  
- What this file does

### [Component 2]
...

## Verification Plan

### Automated Tests
- Commands to run

### Manual Verification
- Browser tests
- Visual verification
```

### Phase 3: User Approval

1. สร้าง implementation plan
2. ส่งให้ user review ผ่าน `notify_user`
3. ถ้า user ให้ feedback → แก้ plan → ส่ง review อีกครั้ง
4. ถ้า user approve → เข้า Execution Phase

## Template: Task Checklist

สร้าง `task.md` ใน brain directory:
```markdown
# [Task Name]

- [ ] Step 1: Research & Planning
- [ ] Step 2: Create Component A
- [ ] Step 3: Modify Component B
- [ ] Step 4: Add API Route
- [ ] Step 5: Browser Testing
- [ ] Step 6: Documentation Update
```

### อัปเดตสถานะ:
- `[ ]` = ยังไม่ทำ
- `[/]` = กำลังทำ
- `[x]` = เสร็จแล้ว

## เมื่อไหร่ข้าม Planning ได้

✅ ข้ามได้ถ้า:
- แก้ไขไม่เกิน 2 ไฟล์
- เป็น bug fix ง่ายๆ
- เปลี่ยนแค่ text/style
- user บอกให้ทำเลย

❌ ต้องทำ Planning ถ้า:
- ฟีเจอร์ใหม่ (3+ ไฟล์)
- เปลี่ยน architecture
- เพิ่ม API/DB schema
- มี breaking changes
- ค่าใช้จ่ายเกิน 0

## Anti-Patterns (สิ่งที่ไม่ควรทำ)
1. ❌ เขียนโค้ดก่อนเข้าใจ requirement
2. ❌ แก้ไขหลายไฟล์โดยไม่มี plan
3. ❌ ลืม user approval ก่อนเริ่มงาน
4. ❌ ไม่ check existing patterns ก่อน implement ใหม่
5. ❌ ไม่ระบุ verification plan
