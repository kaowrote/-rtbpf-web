---
name: checkpoint-workflow
description: ระบบ Checkpoint — บันทึก progress, task tracking, mode switching (Planning → Execution → Verification)
---

# Checkpoint & Task Tracking Skill

## หลักการ: Track ทุก Phase ของงาน
ทุกงานควรมี checkpoint ชัดเจนเพื่อ:
- ติดตาม progress
- กลับมาทำต่อได้ถ้าหยุดกลางทาง
- มีหลักฐานการทำงานทุก step

## 3 Modes ของการทำงาน

### 🔵 PLANNING Mode
**เมื่อไหร่:** เริ่มต้นงานใหม่ทุกครั้ง
**ทำอะไร:**
1. สร้าง `task.md` — checklist ของงาน
2. วิเคราะห์ codebase — grep, view_file
3. สร้าง `implementation_plan.md` — แผนงาน
4. ส่ง user review → รอ approval

**Checkpoint:**
```
task_boundary({
  Mode: "PLANNING",
  TaskName: "Planning [Feature Name]",
  TaskStatus: "Analyzing codebase and creating plan",
  TaskSummary: "..."
})
```

### 🟢 EXECUTION Mode
**เมื่อไหร่:** หลัง user approve plan
**ทำอะไร:**
1. เขียนโค้ดตาม plan
2. อัปเดต `task.md` ตามที่ทำเสร็จ
3. สร้างไฟล์ใหม่ / แก้ไขไฟล์เดิม

**Checkpoint:**
```
task_boundary({
  Mode: "EXECUTION",
  TaskName: "Implementing [Feature Name]",
  TaskStatus: "Creating component XYZ",
  TaskSummary: "Completed A, B. Now working on C."
})
```

### 🟡 VERIFICATION Mode
**เมื่อไหร่:** หลังเขียนโค้ดเสร็จ
**ทำอะไร:**
1. ทดสอบผ่าน browser
2. ตรวจ build errors
3. ถ่าย screenshots
4. สร้าง `walkthrough.md`

**Checkpoint:**
```
task_boundary({
  Mode: "VERIFICATION",
  TaskName: "Testing [Feature Name]",
  TaskStatus: "Running browser tests",
  TaskSummary: "Implementation complete. Verifying functionality."
})
```

## Task.md — Live Checklist

### Template:
```markdown
# [Task Name]

- [ ] Phase 1: Research & Planning
  - [ ] Analyze requirements
  - [ ] Check existing code
  - [ ] Create implementation plan
  - [ ] Get user approval

- [ ] Phase 2: Implementation
  - [ ] Create Component A
  - [ ] Modify Component B
  - [ ] Add API Route
  - [ ] Update database schema

- [ ] Phase 3: Verification
  - [ ] Browser testing
  - [ ] Screenshot evidence
  - [ ] Build verification
  - [ ] Documentation update
```

### Status Updates:
- อัปเดต task.md ทุกครั้งที่ทำ step เสร็จ
- ใช้ `[/]` สำหรับ step ที่กำลังทำ
- ใช้ `[x]` สำหรับ step ที่เสร็จ

## Mode Switching Rules

### Planning → Execution
✅ เมื่อ: User approve plan
```
task_boundary({ Mode: "EXECUTION", ... })
```

### Execution → Verification
✅ เมื่อ: โค้ดเสร็จ พร้อมทดสอบ
```
task_boundary({ Mode: "VERIFICATION", ... })
```

### Execution → Planning (Backtrack)
⚠️ เมื่อ: พบปัญหาที่ต้อง redesign
```
task_boundary({ Mode: "PLANNING", TaskName: "เดิม", ... })
```

### Verification → Execution (Fix bugs)
🔧 เมื่อ: พบ bug ระหว่าง test → แก้แล้วกลับ verify
```
# Fix inline ได้เลย ไม่ต้องเปลี่ยน mode
# เปลี่ยน TaskName ก็ต่อเมื่อต้อง redesign ใหม่ทั้งหมด
```

## TaskName Granularity

### ✅ Good Names:
- "Planning Authentication System"
- "Implementing AI Image Generation"
- "Testing TTS Feature"
- "Adding AI Image Watermark"
- "Creating Full Article with AI Features"

### ❌ Bad Names:
- "Working" (กว้างเกินไป)
- "Feature" (ไม่ descriptive)
- "Fix" (ไม่บอกว่าแก้อะไร)

## สรุป Flow ของ 1 Feature

```
1. PLANNING: Research → Plan → User Approve
   ├── task.md (checklist)
   └── implementation_plan.md

2. EXECUTION: Code → Update task.md
   ├── สร้าง/แก้ไขไฟล์
   └── อัปเดต task status

3. VERIFICATION: Test → Screenshot → Walkthrough
   ├── browser_subagent (test + screenshot)
   └── walkthrough.md (proof of work)

4. DONE: notify_user → สรุปผล
```

## Artifacts แต่ละ Phase

| Phase | Artifact | Purpose |
|-------|----------|---------|
| Planning | `task.md` | Checklist ติดตามงาน |
| Planning | `implementation_plan.md` | แผนงานให้ user review |
| Execution | Code files | ไฟล์โค้ดจริง |
| Verification | Screenshots | หลักฐานทดสอบ |
| Verification | `walkthrough.md` | สรุปงาน + ผล test |
| Documentation | `docs/*.md` | เอกสาร reference |
