# Demo: ระบบแผนที่ชุมชนเขตวัฒนา (Digital Community Health Map GIS)

โฟลเดอร์นี้จัดทำขึ้นในนามทีมพัฒนาและเจ้าของนวัตกรรม **Pro-Health Data BKK South** เพื่อใช้ส่งต่อให้โครงการรวบรวมข้อมูลกลาง, ทีม UX, ทีม IT และผู้บริหารสำหรับตรวจสอบหน้าจอ ทดลองใช้งาน และตอบคำถามทางเทคนิคทั้ง 5 ข้อ

> **หมายเหตุด้านความปลอดภัย:** ไฟล์ทั้งหมดในโฟลเดอร์นี้ **ไม่มี** API Key, URL จริง, Google Sheet ID, Google Drive ID หรือ ID/Password จริงแต่อย่างใด ข้อมูลผู้ใช้งานและข้อมูลสุขภาพทั้งหมดเป็นข้อมูลจำลอง (Mock Data)

## 📂 ไฟล์ภายในโฟลเดอร์
- [`index.html`](./index.html) — ตัว Demo Mock-up แบบ Interactive เปิดใช้งานได้ทันทีบนเบราว์เซอร์ (ทำงานผ่าน `localStorage`)
- [`REPORT_IT_RESPONSE.md`](./REPORT_IT_RESPONSE.md) — รายงานชี้แจงทางเทคนิคฉบับสมบูรณ์สำหรับตอบคำถาม 5 ข้อของทีม IT (System Architecture, Functional List, Demo Account, Data Dictionary, Form Fields, Technical Constraints, API & Integration)

## 🚀 วิธีเปิดทดสอบ Demo Mock-up
1. ดับเบิลคลิกเปิดไฟล์ `index.html` ด้วย Google Chrome / Safari / Edge (หรือรัน `python3 -m http.server 8080` ในโฟลเดอร์นี้แล้วเข้า `http://localhost:8080`)
2. เลือกเข้าสู่ระบบด้วยบัญชีจำลอง (Mock Credentials):
   - **Admin:** `demo_admin` / `DemoAdmin@2026` (ทดสอบได้ทุกฟังก์ชัน รวมถึงแก้ไขปีงบเก่า ถังขยะ และกู้คืนเวอร์ชัน)
   - **Officer:** `demo_officer` / `DemoOfficer@2026` (ทดสอบสิทธิ์เจ้าหน้าที่ ศบส.21 และกลไกล็อกผังปีงบเก่า 2568)
   - **Guest:** กดปุ่ม **"เข้าชมแผนที่ (Guest)"** เพื่อทดสอบการพรางข้อมูลส่วนบุคคลตาม PDPA
3. หากต้องการคืนค่าข้อมูลจำลองเริ่มต้น ให้กดปุ่ม **`รีเซ็ต Demo`** บนหน้า Portal
