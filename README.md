# Pro-Health Data BKK South — Interactive Demo & Technical Architecture Portal

ศูนย์รวมระบบสาธิต (**10 โมดูล**) และเอกสารชี้แจงทางเทคนิคโครงการ **Pro-Health Data BKK South** (ศูนย์บริการสาธารณสุข 21 วัดธาตุทอง) สำหรับการทำ UX Audit, การทบทวนสถาปัตยกรรมระบบ และแผนบูรณาการข้อมูลระดับองค์กร (กทม. / สปสช.)

- **Live Demo Portal:** https://audithhc021-design.github.io/prohealth-bkk-south-demo/

> **Security & Data Privacy Notice:** ระบบสาธิตและเอกสารทั้งหมดใน Repository นี้ใช้ข้อมูลจำลอง (Simulated Mock / Seed Data) และบัญชีทดสอบจำลอง 100% ไม่มีการเก็บ API Key, Production URL, Google Sheet/Drive ID จริง หรือข้อมูลส่วนบุคคลของผู้ป่วย

---

## โครงสร้างพอร์ทัล (Portal Capabilities)

1. **Interactive Demo Environment:** ทดลองใช้งานหน้าจอจริงครบทั้ง 10 โมดูล พร้อมตัวสลับมุมมอง Desktop / Tablet / Mobile และบัญชีทดสอบจำลอง โดยโมดูลหลัก (`Demo_ระบบเยี่ยมบ้าน_ศบส21`) เชื่อมต่อเปิดข้ามไปยังระบบย่อยภายในชุดงานได้โดยตรง
2. **Technical Specifications (Q1–Q5):** เอกสารทางเทคนิคแยกตามรายระบบ ครอบคลุม System Architecture (Mermaid), Functional List, Demo Credentials, Data Dictionary & Form Fields, Technical Constraints และสถานะความพร้อมด้าน API Integration (กทม. / สปสช.)
3. **Cross-System Search & Export:** ค้นหาคำสำคัญข้ามเอกสารทั้ง 10 ระบบ และดาวน์โหลดไฟล์ `REPORT_IT_RESPONSE.md` รายระบบได้จากหน้าพอร์ทัล

---

## รายชื่อโมดูลทั้งหมด (10 ระบบ)

| กลุ่มงาน | ระบบย่อย | Demo Entry | เอกสารทางเทคนิค (Q1–Q5) |
| :--- | :--- | :--- | :--- |
| **Access & Communication** | 21PASS (Central SSO) | [`Demo_21PASS/index.html`](./Demo_21PASS/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_21PASS/REPORT_IT_RESPONSE.md) |
| **Access & Communication** | ระบบเยี่ยมบ้าน ศบส.21 (Main Hub) | [`Demo_ระบบเยี่ยมบ้าน_ศบส21/index.html`](./Demo_ระบบเยี่ยมบ้าน_ศบส21/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบเยี่ยมบ้าน_ศบส21/REPORT_IT_RESPONSE.md) |
| **Access & Communication** | SeVaNa21 / TeamConnect21 | [`Demo_SeVaNa21/index.html`](./Demo_SeVaNa21/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_SeVaNa21/REPORT_IT_RESPONSE.md) |
| **Home Care & Referral** | MDT Home Visit (ทีมสหวิชาชีพ) | [`Demo_MDT_Home_Visit/index.html`](./Demo_MDT_Home_Visit/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_MDT_Home_Visit/REPORT_IT_RESPONSE.md) |
| **Home Care & Referral** | miniHHC (ประเมิน/ติดตามผู้ป่วย) | [`Demo_miniHHC/index.html`](./Demo_miniHHC/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_miniHHC/REPORT_IT_RESPONSE.md) |
| **Home Care & Referral** | SentDM (ส่งต่อคลินิกเบาหวาน) | [`Demo_SentDM/index.html`](./Demo_SentDM/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_SentDM/REPORT_IT_RESPONSE.md) |
| **Population & Spatial GIS** | ProHealthData (คัดกรองสุขภาพ) | [`Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html`](./Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/REPORT_IT_RESPONSE.md) |
| **Population & Spatial GIS** | ระบบพีระมิดประชากร (Data Center) | [`Demo_ระบบพีระมิดประชากร/index.html`](./Demo_ระบบพีระมิดประชากร/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบพีระมิดประชากร/REPORT_IT_RESPONSE.md) |
| **Population & Spatial GIS** | Digital Community Health Map (GIS) | [`Demo_Digital_Community_Health_Map_GIS/index.html`](./Demo_Digital_Community_Health_Map_GIS/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_Digital_Community_Health_Map_GIS/REPORT_IT_RESPONSE.md) |
| **Operations & Logistics** | ระบบครุภัณฑ์อนามัยชุมชน v2 | [`Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html`](./Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html) | [`REPORT_IT_RESPONSE.md`](./Demo_ระบบครุภัณฑ์อนามัยชุมชน/REPORT_IT_RESPONSE.md) |

---

## Local Preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```
