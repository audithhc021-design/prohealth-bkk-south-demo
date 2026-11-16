# Demo_SentDM — Pro-Health Data BKK South

โฟลเดอร์ชุดสาธิต (Demo Mock-up) และเอกสารตอบชุดคำถามทางเทคนิคสำหรับ **ระบบส่งต่อผู้ป่วยสหวิชาชีพ คลินิกเบาหวาน (SentDM / Refer system(DM))**

## ไฟล์ภายในโฟลเดอร์

- [`index.html`](./index.html) — ตัวอย่างระบบแบบ Interactive Demo Mock-up (ทำงานบนเบราว์เซอร์ได้ทันทีโดยไม่ต้องเชื่อมต่อ Google Apps Script หรือฐานข้อมูลจริง)
- [`REPORT_IT_RESPONSE.md`](./REPORT_IT_RESPONSE.md) — รายงานตอบชุดคำถามทีม IT ทั้ง 5 ข้อ (User Manual & Specs, Demo Account, Database & Data Dictionary, Pain Points/Tech Constraints, API & Integration)

## วิธีเปิดใช้งาน Demo Mock-up

1. ดับเบิลคลิกเปิดไฟล์ `index.html` ในเบราว์เซอร์ (Chrome / Edge / Safari) หรือรันผ่าน Local Server:
   ```bash
   python3 -m http.server 8080
   ```
   แล้วเปิด `http://localhost:8080/`
2. เลือกเข้าสู่ระบบด้วยบัญชีจำลองที่หน้าจอ Login (เช่น `demo_opd`, `demo_home`, `demo_admin` หรือ `Guest`)

> **หมายเหตุความปลอดภัย:** ข้อมูลผู้ป่วย ประวัติการแจ้งเตือน Token และบัญชีผู้ใช้ทั้งหมดในโฟลเดอร์นี้เป็น **ข้อมูลจำลอง (Mock Data)** เพื่อการสาธิตและการทำ UX Audit เท่านั้น ไม่มี API Key, Google Sheet ID, URL หรือรหัสผ่านจริงของระบบ Production
