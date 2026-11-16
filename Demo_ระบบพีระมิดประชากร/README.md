# Demo — ระบบพีระมิดประชากร (Pro-Health Data BKK South)

โฟลเดอร์นี้จัดทำขึ้นเพื่อใช้ประกอบการส่งมอบข้อมูลให้ทีม UX / ทีม IT / ผู้บริหาร ภายใต้โครงการ **Pro-Health Data BKK South** โดยจำลองการทำงานของระบบจริงให้อยู่ในรูปแบบ Standalone Demo (ไม่ต้องเชื่อมต่อ Google Sheets จริง และไม่มีข้อมูลลับ/รหัสผ่านจริง)

## ไฟล์ภายในโฟลเดอร์
- `index.html` — หน้าเว็บ Demo Mock-up แบบ Interactive ครบทั้ง 5 เมนู (คัดกรองสุขภาพ, พื้นที่รับผิดชอบ, เขตวัฒนา 17 ชุมชน, LTC-HHC, และจัดการข้อมูล Admin)
- `mock-backend.js` — ตัวจำลอง Backend และชุดข้อมูลสังเคราะห์ (Seed Data) พร้อมรองรับการบันทึกแก้ไขลง `localStorage` ในเบราว์เซอร์
- `REPORT_IT_RESPONSE.md` — รายงานคำตอบชุดคำถามทีม IT ทั้ง 5 ข้อ พร้อมแผนภาพสถาปัตยกรรม, Functional List, Data Dictionary, Form Fields, Pain Points และสถานะ API

## วิธีเปิดใช้งาน Demo
1. เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์โดยตรง หรือรันผ่าน Local Web Server:
   ```bash
   python3 -m http.server 8080
   ```
   แล้วเข้า `http://localhost:8080`
2. เลือกบทบาทสำหรับทดสอบ:
   - **ผู้เยี่ยมชม (Guest):** กดเข้าใช้งานได้ทันที
   - **ผู้ดูแลระบบ (Admin - Mock Credential):** รหัสผ่านจำลองคือ `demo-admin` *(ไม่ใช่รหัสผ่านใช้งานจริง)*
