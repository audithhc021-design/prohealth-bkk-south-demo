# Pro-Health Data BKK South — Interactive Demo & IT/UX Audit Portal

ศูนย์รวมระบบสาธิต (**10 ระบบย่อย**) และเอกสารชี้แจงทางเทคนิคตอบชุดคำถามทีม IT / UX Audit / ผู้บริหาร ของโครงการ **Pro-Health Data BKK South** (ศูนย์บริการสาธารณสุข 21 วัดธาตุทอง)

> **Security Notice:** ชุด Demo และเอกสารทั้งหมดใน Repository นี้ใช้ **ข้อมูลจำลอง (Mock / Seed Data)** และ **บัญชีทดสอบจำลอง** 100% ไม่มีการเก็บ API Key, รหัสผ่านจริง, Google Sheet/Drive ID จริง หรือข้อมูลผู้ป่วยจริง

---

## 🌐 เปิดใช้งานผ่านหน้าเว็บ Portal กลาง

เปิดไฟล์ [`index.html`](./index.html) (หรือเปิดผ่าน **GitHub Pages** หลัง Deploy) เพื่อเข้าสู่หน้า Portal กลาง ซึ่งรวม:
- **Live Demo ครบทั้ง 10 ระบบ** (พร้อมตัวสลับขนาดหน้าจอ Desktop / Tablet / Mobile และบัญชีทดสอบข้อ 2)
- **คำตอบชุดคำถาม IT ครบทั้ง 5 ข้อ** สำหรับทุกระบบ (คู่มือ & ผังสถาปัตยกรรม Mermaid, บัญชีทดสอบ, Data Dictionary & Form Fields, ข้อจำกัดทางเทคนิค, และแผนเชื่อมต่อ API กทม./สปสช.)
- **ระบบค้นหาข้ามทั้ง 10 เอกสาร** และปุ่มดาวน์โหลดไฟล์ `REPORT_IT_RESPONSE.md` รายระบบ
- **การเชื่อมโยงข้ามระบบจริง** จาก `Demo_ระบบเยี่ยมบ้าน_ศบส21` ไปยังระบบเพื่อนบ้านในชุด Demo ทั้ง 9 ระบบ

---

## 📦 รายชื่อระบบทั้งหมด (10 โมดูล)

| กลุ่มงาน | ระบบย่อย | หน้า Demo | เอกสารตอบทีม IT (ข้อ 1–5) |
| :--- | :--- | :--- | :--- |
| **ประตูสู่ระบบ & สื่อสารทีม** | 21PASS (Central SSO) | [`Demo_21PASS/index.html`](./Demo_21PASS/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_21PASS/REPORT_IT_RESPONSE.md) |
| **ประตูสู่ระบบ & สื่อสารทีม** | ระบบเยี่ยมบ้าน ศบส.21 (Main Hub) | [`Demo_ระบบเยี่ยมบ้าน_ศบส21/index.html`](./Demo_ระบบเยี่ยมบ้าน_ศบส21/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบเยี่ยมบ้าน_ศบส21/REPORT_IT_RESPONSE.md) |
| **ประตูสู่ระบบ & สื่อสารทีม** | SeVaNa21 / TeamConnect21 | [`Demo_SeVaNa21/index.html`](./Demo_SeVaNa21/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_SeVaNa21/REPORT_IT_RESPONSE.md) |
| **เยี่ยมบ้าน & ส่งต่อผู้ป่วย** | MDT Home Visit (ทีมสหวิชาชีพ) | [`Demo_MDT_Home_Visit/index.html`](./Demo_MDT_Home_Visit/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_MDT_Home_Visit/REPORT_IT_RESPONSE.md) |
| **เยี่ยมบ้าน & ส่งต่อผู้ป่วย** | miniHHC (ประเมิน/ติดตามผู้ป่วย) | [`Demo_miniHHC/index.html`](./Demo_miniHHC/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_miniHHC/REPORT_IT_RESPONSE.md) |
| **เยี่ยมบ้าน & ส่งต่อผู้ป่วย** | SentDM (ส่งต่อคลินิกเบาหวาน) | [`Demo_SentDM/index.html`](./Demo_SentDM/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_SentDM/REPORT_IT_RESPONSE.md) |
| **ข้อมูลประชากร คัดกรอง & GIS** | ProHealthData (คัดกรองสุขภาพ) | [`Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html`](./Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/REPORT_IT_RESPONSE.md) |
| **ข้อมูลประชากร คัดกรอง & GIS** | ระบบพีระมิดประชากร (Data Center) | [`Demo_ระบบพีระมิดประชากร/index.html`](./Demo_ระบบพีระมิดประชากร/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบพีระมิดประชากร/REPORT_IT_RESPONSE.md) |
| **ข้อมูลประชากร คัดกรอง & GIS** | Digital Community Health Map (GIS) | [`Demo_Digital_Community_Health_Map_GIS/index.html`](./Demo_Digital_Community_Health_Map_GIS/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_Digital_Community_Health_Map_GIS/REPORT_IT_RESPONSE.md) |
| **คลังเวชภัณฑ์ & สนับสนุน** | ระบบครุภัณฑ์อนามัยชุมชน v2 | [`Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html`](./Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบครุภัณฑ์อนามัยชุมชน/REPORT_IT_RESPONSE.md) |

---

## 🔄 การอัปเดตเอกสารบน Portal

หากมีการแก้ไขข้อมูลในไฟล์ `Demo_*/REPORT_IT_RESPONSE.md` ให้รันคำสั่งด้านล่างเพื่อซิงค์ข้อมูลเข้าสู่ `portal-data.js` ก่อน commit/push ขึ้น GitHub:

```bash
python3 build_portal.py
```

## 🚀 การเปิดใช้งาน GitHub Pages

1. Push โค้ดขึ้น GitHub Repository (Branch `main`)
2. ไปที่ **Settings → Pages**
3. เลือก **Source:** `Deploy from a branch` → **Branch:** `main` / `/ (root)` → กด **Save**
4. รอประมาณ 1–2 นาที จะได้ลิงก์ `https://<username>.github.io/<repo-name>/` สำหรับส่งให้ทีม Citylab / IT / UX ใช้งานได้ทันที
