# Demo_SeVaNa21 — TeamConnect21 (Pro-Health Data BKK South)

โฟลเดอร์นี้จัดทำขึ้นเพื่อใช้เป็นชุดสาธิต **Demo Mock-up (Offline Sandbox)** และรายงานข้อมูลทางเทคนิคสำหรับทีม IT / UX / ผู้บริหาร ของโครงการ **SeVaNa21 (TeamConnect21 - สาธารณสุข 21)**

## รายการไฟล์ภายในโฟลเดอร์

1. **`REPORT_IT_RESPONSE.md`** — รายงานภาษาไทยแบบเป็นทางการ ตอบชุดคำถามทั้ง 5 ข้อของทีม IT (User Manual & System Architecture, Demo Accounts, Database & Data Dictionary + Form Fields, Technical Pain Points & Constraints, และ API & Integration กับ กทม./สปสช.) พร้อมแผนภาพ Mermaid
2. **`index.html`** — ตัว Demo Mock-up แบบโต้ตอบได้จริง (Standalone Offline) จำลองหน้าจอ Login / 21PASS SSO / Register, ทำเนียบ 21 แผนก, ห้องแชท E2EE, ข้อความ Bot Webhook, ข้อความเสียง Voice Mini-Chat, คลังรูปภาพและไฟล์, สติกเกอร์, โหมดสมาธิ และ 6 ธีมสี
3. **`mock-data.js`** — ชุดข้อมูลจำลอง (Seed/Mock Data) สำหรับผู้ใช้งาน กลุ่ม และบทสนทนาตัวอย่าง

## วิธีเปิดใช้งาน Demo Mock-up

- **เปิดไฟล์โดยตรง:** ดับเบิลคลิกเปิด `index.html` บนเบราว์เซอร์ (Chrome / Safari / Edge)
- **หรือรันผ่าน Local Server:**
  ```bash
  cd Demo_SeVaNa21
  python3 -m http.server 8080
  ```
  แล้วเปิด `http://localhost:8080`

## นโยบายความปลอดภัย (Security Redaction)

- ไม่มีการรวม API Key, VAPID Key, Client Secret, URL จริงของระบบ, Google Drive/Sheet ID หรือรหัสผ่านจริงใดๆ ลงในโฟลเดอร์นี้
- บัญชีทดสอบทั้งหมด (`demo_opd`, `demo_nurse`, `demo_pharma`, `demo_admin` / PIN จำลอง `123456`) เป็นข้อมูลสมมติสำหรับโหมด Demo เท่านั้น
