#!/usr/bin/env python3
"""
Builds portal-data.js from the 10 Demo_*/REPORT_IT_RESPONSE.md files
so the presentation portal works seamlessly both online (http/https) and offline (file://).
"""

import json
import os
import re
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

SYSTEMS = [
    {
        "id": "21pass",
        "folder": "Demo_21PASS",
        "name": "21PASS (Central SSO)",
        "shortName": "21PASS SSO",
        "category": "access",
        "categoryLabel": "ประตูสู่ระบบ ยืนยันตัวตน & สื่อสารทีม",
        "icon": "🔐",
        "tagline": "ระบบยืนยันตัวตนรวมศูนย์ (Single Sign-On) และจัดการสิทธิ์ RBAC กลางของศูนย์ฯ 21",
        "entry": "Demo_21PASS/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "hhc-portal",
        "folder": "Demo_ระบบเยี่ยมบ้าน_ศบส21",
        "name": "ระบบเยี่ยมบ้าน ศบส.21 (HHC Spatial Workspace)",
        "shortName": "เยี่ยมบ้าน ศบส.21",
        "category": "access",
        "categoryLabel": "ประตูสู่ระบบ ยืนยันตัวตน & สื่อสารทีม",
        "icon": "🏠",
        "tagline": "ศูนย์รวมงานเยี่ยมบ้านแบบ Dual-UI (Classic & Bento), Quick Login 6 จุด, ปฏิทินนัด และตัวเชื่อมระบบทั้งหมด",
        "entry": "Demo_ระบบเยี่ยมบ้าน_ศบส21/index.html",
        "extraLinks": [
            {"label": "เปิด New UI (Bento Workspace)", "url": "Demo_ระบบเยี่ยมบ้าน_ศบส21/new-ui.html?role=admin"}
        ],
        "linkedFromHhc": False,
    },
    {
        "id": "sevana21",
        "folder": "Demo_SeVaNa21",
        "name": "SeVaNa21 / TeamConnect21",
        "shortName": "SeVaNa21 Chat",
        "category": "access",
        "categoryLabel": "ประตูสู่ระบบ ยืนยันตัวตน & สื่อสารทีม",
        "icon": "💬",
        "tagline": "ระบบแชตและประสานงานทีมสหวิชาชีพภายในหน่วยงาน (เชื่อมต่อฝังใน HHC Workspace ได้)",
        "entry": "Demo_SeVaNa21/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "mdt-home-visit",
        "folder": "Demo_MDT_Home_Visit",
        "name": "MDT Home Visit (ทีมสหวิชาชีพ)",
        "shortName": "MDT Home Visit",
        "category": "homecare",
        "categoryLabel": "ระบบบริการเยี่ยมบ้าน & ส่งต่อผู้ป่วย",
        "icon": "🩺",
        "tagline": "ระบบบันทึกและติดตามการเยี่ยมบ้านร่วมกันของทีมสหวิชาชีพ (แพทย์ พยาบาล กายภาพ เภสัช)",
        "entry": "Demo_MDT_Home_Visit/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "minihhc",
        "folder": "Demo_miniHHC",
        "name": "miniHHC (ประเมินและติดตามผู้ป่วยชุมชน)",
        "shortName": "miniHHC",
        "category": "homecare",
        "categoryLabel": "ระบบบริการเยี่ยมบ้าน & ส่งต่อผู้ป่วย",
        "icon": "📋",
        "tagline": "ระบบประเมินผู้ป่วยพึ่งพิง/ติดเตียง (Barthel Index / ADL) และสรุปรายงานการดูแล",
        "entry": "Demo_miniHHC/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "sentdm",
        "folder": "Demo_SentDM",
        "name": "SentDM (ส่งต่อผู้ป่วยคลินิกเบาหวาน)",
        "shortName": "SentDM Refer",
        "category": "homecare",
        "categoryLabel": "ระบบบริการเยี่ยมบ้าน & ส่งต่อผู้ป่วย",
        "icon": "🔄",
        "tagline": "ระบบส่งต่อผู้ป่วยสหวิชาชีพและแจ้งเตือนระหว่างคลินิกเบาหวานกับทีมเยี่ยมบ้าน",
        "entry": "Demo_SentDM/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "prohealthdata",
        "folder": "Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData",
        "name": "Pro-Health Data (ข้อมูลสุขภาพและคัดกรอง)",
        "shortName": "ProHealthData",
        "category": "population",
        "categoryLabel": "ระบบข้อมูลประชากร คัดกรอง & แผนที่ GIS",
        "icon": "📊",
        "tagline": "ระบบบันทึกข้อมูลสุขภาพชุมชน คัดกรองโรคเรื้อรัง (DM/HT/CVD) และวิเคราะห์กลุ่มเสี่ยง",
        "entry": "Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "population-pyramid",
        "folder": "Demo_ระบบพีระมิดประชากร",
        "name": "ระบบพีระมิดประชากร (Data Center)",
        "shortName": "พีระมิดประชากร",
        "category": "population",
        "categoryLabel": "ระบบข้อมูลประชากร คัดกรอง & แผนที่ GIS",
        "icon": "👥",
        "tagline": "ศูนย์ข้อมูลโครงสร้างประชากรแยกช่วงอายุ เพศ และชุมชน เพื่อวางแผนบริการสาธารณสุข",
        "entry": "Demo_ระบบพีระมิดประชากร/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "gis-map",
        "folder": "Demo_Digital_Community_Health_Map_GIS",
        "name": "Digital Community Health Map (GIS เขตวัฒนา)",
        "shortName": "Health Map GIS",
        "category": "population",
        "categoryLabel": "ระบบข้อมูลประชากร คัดกรอง & แผนที่ GIS",
        "icon": "🗺️",
        "tagline": "แผนที่สุขภาพชุมชนเชิงพื้นที่ (GIS) แสดงพิกัดหลังคาเรือน ผู้ป่วยเยี่ยมบ้าน และเส้นทางออกพื้นที่",
        "entry": "Demo_Digital_Community_Health_Map_GIS/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
    {
        "id": "community-inventory",
        "folder": "Demo_ระบบครุภัณฑ์อนามัยชุมชน",
        "name": "ระบบครุภัณฑ์และเวชภัณฑ์อนามัยชุมชน v2",
        "shortName": "คลังครุภัณฑ์ชุมชน",
        "category": "operations",
        "categoryLabel": "ระบบสนับสนุน & คลังเวชภัณฑ์",
        "icon": "📦",
        "tagline": "ระบบบริหารจัดการคลังอุปกรณ์ทางการแพทย์ เวชภัณฑ์ และการยืม-คืนสำหรับผู้ป่วยในชุมชน",
        "entry": "Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html",
        "extraLinks": [],
        "linkedFromHhc": True,
    },
]


def split_h2_sections(md_text):
    """Split markdown text into H2 sections while respecting fenced code blocks."""
    lines = md_text.splitlines()
    intro_lines = []
    sections = []
    current_heading = None
    current_lines = []
    in_fence = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence

        if not in_fence and line.startswith("## "):
            if current_heading is not None:
                sections.append((current_heading, "\n".join(current_lines).strip()))
            current_heading = line[3:].strip()
            current_lines = [line]
        else:
            if current_heading is None:
                intro_lines.append(line)
            else:
                current_lines.append(line)

    if current_heading is not None:
        sections.append((current_heading, "\n".join(current_lines).strip()))

    return "\n".join(intro_lines).strip(), sections


def classify_section(heading):
    if re.search(r"สารบัญ", heading):
        return "toc"
    if re.search(r"ข้อ(?:ที่)?\s*1\b", heading):
        return "q1"
    if re.search(r"ข้อ(?:ที่)?\s*2\b", heading):
        return "q2"
    if re.search(r"ข้อ(?:ที่)?\s*3\b", heading):
        return "q3"
    if re.search(r"ข้อ(?:ที่)?\s*4\b", heading):
        return "q4"
    if re.search(r"ข้อ(?:ที่)?\s*5\b", heading):
        return "q5"
    if re.search(r"(?:บทสรุป|จุดแข็ง|Innovation|Executive)", heading, re.IGNORECASE):
        return "highlights"
    if re.search(r"(?:ภาคผนวก|สรุปภาพรวม)", heading):
        return "appendix"
    return "other"


def extract_demo_credentials_preview(q2_md):
    """Extract concise credential hints (username/password/pin/note) from Q2 markdown."""
    hints = []
    for line in q2_md.splitlines():
        if any(k in line.lower() for k in ["username", "password", "pin", "demo_", "pass:", "รหัสผ่าน", "ชื่อผู้ใช้", "quickstart", "quick login"]):
            clean = re.sub(r"[|`*]", " ", line).strip()
            clean = re.sub(r"\s+", " ", clean)
            if 6 < len(clean) < 160 and not clean.startswith("---"):
                hints.append(clean)
        if len(hints) >= 4:
            break
    return hints


def build():
    enriched = []
    for item in SYSTEMS:
        report_path = os.path.join(ROOT_DIR, item["folder"], "REPORT_IT_RESPONSE.md")
        if not os.path.exists(report_path):
            raise FileNotFoundError(f"Missing report: {report_path}")

        with open(report_path, "r", encoding="utf-8") as f:
            raw_md = f.read()

        intro, h2_list = split_h2_sections(raw_md)
        buckets = {
            "intro": intro,
            "highlights": "",
            "q1": "",
            "q2": "",
            "q3": "",
            "q4": "",
            "q5": "",
            "appendix": "",
            "other": "",
        }

        for heading, content in h2_list:
            key = classify_section(heading)
            if key == "toc":
                continue
            if buckets[key]:
                buckets[key] += "\n\n" + content
            else:
                buckets[key] = content

        missing = [k for k in ("q1", "q2", "q3", "q4", "q5") if not buckets[k]]
        if missing:
            raise ValueError(f"{item['folder']} missing sections: {missing}")

        q1_combined = "\n\n---\n\n".join(p for p in [buckets["highlights"], buckets["q1"]] if p)
        q5_combined = "\n\n---\n\n".join(p for p in [buckets["q5"], buckets["appendix"]] if p)

        enriched.append(
            {
                **item,
                "reportPath": f"{item['folder']}/REPORT_IT_RESPONSE.md",
                "lineCount": len(raw_md.splitlines()),
                "demoHints": extract_demo_credentials_preview(buckets["q2"]),
                "sections": {
                    "intro": buckets["intro"],
                    "highlights": buckets["highlights"],
                    "q1": q1_combined,
                    "q2": buckets["q2"],
                    "q3": buckets["q3"],
                    "q4": buckets["q4"],
                    "q5": q5_combined,
                },
                "rawMd": raw_md,
            }
        )
        print(f"[OK] {item['folder']}: {len(raw_md.splitlines())} lines parsed (Q1-Q5 complete)")

    payload = {
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "projectTitle": "Pro-Health Data BKK South — นวัตกรรมระบบข้อมูลสุขภาพชุมชน (ศบส.21 วัดธาตุทอง)",
        "systems": enriched,
    }

    out_path = os.path.join(ROOT_DIR, "portal-data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated by build_portal.py from Demo folders REPORT_IT_RESPONSE.md\n")
        f.write("window.CITYLAB_PORTAL_DATA = ")
        json.dump(payload, f, ensure_ascii=False)
        f.write(";\n")

    print(f"\nGenerated {out_path} ({os.path.getsize(out_path):,} bytes) with {len(enriched)} systems.")


if __name__ == "__main__":
    build()
