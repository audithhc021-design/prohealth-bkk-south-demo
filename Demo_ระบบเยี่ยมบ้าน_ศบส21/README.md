# 🧪 Demo Mock-up: ระบบบริการสาธารณสุข 21 วัดธาตุทอง (Home Health Care Spatial Workspace)
**ทีมพัฒนา:** Pro-Health Data BKK South (ศูนย์บริการสาธารณสุข 21 วัดธาตุทอง)

โฟลเดอร์นี้จัดทำขึ้นเพื่อใช้ประกอบการรวบรวมข้อมูลส่งทีม IT, ทีม UX Audit และผู้บริหาร โดยประกอบด้วย **ตัว Demo Mock-up แบบโต้ตอบได้จริง (Offline Sandbox)** และ **รายงานตอบชุดคำถามทีม IT 5 ข้อ (`REPORT_IT_RESPONSE.md`)**

---

## 📂 รายการไฟล์ภายในโฟลเดอร์

| ไฟล์ | คำอธิบาย |
| :--- | :--- |
| [`REPORT_IT_RESPONSE.md`](./REPORT_IT_RESPONSE.md) | **รายงานคำตอบชุดคำถามทีม IT ทั้ง 5 ข้อ** (System Architecture, Functional List, Demo Accounts, Data Dictionary, Form Fields, Technical Constraints และ API Integration Roadmap) |
| [`index.html`](./index.html) | **Demo Mock-up หน้า Login + Quick Login 6 จุด + Classic UI + Admin Panel** |
| [`new-ui.html`](./new-ui.html) | **Demo Mock-up หน้า New UI (Apple Pearl / Obsidian Bento Workspace)** |
| [`mock-data.js`](./mock-data.js) | ชุดข้อมูลจำลองและระบบจัดเก็บสถานะในเครื่อง (`localStorage`) |

---

## 🚀 วิธีเปิดใช้งาน Demo Mock-up

1. เปิดไฟล์ [`index.html`](./index.html) ด้วยเว็บเบราว์เซอร์ (Chrome / Safari / Edge) หรือรันผ่าน Local Server:
   ```bash
   python3 -m http.server 8080
   ```
2. ทดสอบเข้าสู่ระบบด้วย **บัญชีจำลอง (Mock Credentials)**:
   * **เจ้าหน้าที่ทั่วไป (`user`):** Username `demo_staff` / Password `DemoStaff@2026` *(หรือกดปุ่ม **"⚡ กรอก Staff"** บนหน้า Login)*
   * **ผู้ดูแลระบบ (`admin`):** Username `demo_admin` / Password `DemoAdmin@2026` *(หรือกดปุ่ม **"👑 กรอก Admin"** เพื่อเข้าทดสอบ Admin CMS และหมวด `Dev`)*
   * **Quick Login (6-Point Pattern):** กดปุ่ม **"⚡ เข้าสู่ระบบด่วนด้วยรหัสภาพ 6 จุด"** แล้วแตะไอคอน `1 → 2 → 3 → 4 → 5 → 6` ตามลำดับ
3. หลังเข้าสู่ระบบ สามารถเลือกทดลองได้ทั้ง **Classic UI** และ **New UI (Bento Workspace)** รวมถึงทดสอบเพิ่มนัดหมายจำลอง, สร้าง/แก้ไขปุ่มใน Admin Panel, ปักหมุด `⭐`, ค้นหาด้วย `⌘K` (`Ctrl+K`), สร้าง QR Code แบบ Offline และแชตจำลองใน Sevana
4. หากต้องการล้างค่าที่ทดสอบไว้กลับสู่ค่าเริ่มต้น กดปุ่ม **"🔄 รีเซ็ตข้อมูล Demo เริ่มต้น"** ที่แถบด้านบนสุด

---

## 🔒 หมายเหตุความปลอดภัย (Security Notice)
* **ไม่มี** API Key, Google Sheet ID, Google Drive Folder ID, Security Salt, URL Google Apps Script `/exec` จริง, Google Form/Calendar ID จริง หรือรหัสผ่านใช้งานจริงอยู่ในโฟลเดอร์นี้โดยเด็ดขาด
* ข้อมูล บัญชีผู้ใช้ และลิงก์ทั้งหมดในโฟลเดอร์นี้เป็น **ข้อมูลจำลอง (Mock Data)** เพื่อการสาธิตและ UX Audit เท่านั้น
