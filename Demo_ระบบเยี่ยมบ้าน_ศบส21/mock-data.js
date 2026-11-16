/**
 * DEMO MOCK DATA & SHARED SANDBOX STORE
 * Pro-Health Data BKK South — Home Health Care Spatial Workspace (Demo Mock-up)
 *
 * SECURITY NOTICE:
 * All credentials, tokens, URLs, and records in this file are 100% simulated
 * for UX Audit and Technical Evaluation purposes only.
 * No real API keys, Google Sheet IDs, Google Drive IDs, or production credentials exist here.
 */
(function (global) {
  "use strict";

  var DEMO_STORAGE_KEY = "hhc_demo_sandbox_v2";

  // Simulated demo accounts (NOT real production credentials)
  var DEMO_ACCOUNTS = [
    {
      username: "demo_admin",
      password: "DemoAdmin@2026",
      role: "admin",
      displayName: "ผู้ดูแลระบบสาธิต (Demo Admin)",
      avatar: "A"
    },
    {
      username: "demo_staff",
      password: "DemoStaff@2026",
      role: "user",
      displayName: "เจ้าหน้าที่เยี่ยมบ้าน (Demo Staff)",
      avatar: "S"
    }
  ];

  // Inline SVG Data URIs for offline-safe, zero-secret visual assets
  function makeSvgDataUri(svgContent) {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgContent.trim());
  }

  var DEMO_LOGO_1 = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">' +
      '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs>' +
      '<rect width="160" height="160" rx="34" fill="url(#g1)"/>' +
      '<circle cx="80" cy="80" r="54" fill="rgba(255,255,255,0.16)"/>' +
      '<path d="M70 46h20v24h24v20H90v24H70V90H46V70h24z" fill="#ffffff"/>' +
      '<text x="80" y="144" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ecfdf5">HHC DEMO 21</text>' +
    '</svg>'
  );

  var DEMO_LOGO_2 = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">' +
      '<defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#4f46e5"/></linearGradient></defs>' +
      '<rect width="160" height="160" rx="34" fill="url(#g2)"/>' +
      '<path d="M80 38L36 74v48h30V94h28v28h30V74z" fill="#ffffff"/>' +
      '<circle cx="80" cy="70" r="9" fill="#0284c7"/>' +
      '<text x="80" y="144" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e0f2fe">PRO-HEALTH BKK</text>' +
    '</svg>'
  );

  var DEMO_HEX_1 = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
      '<defs><linearGradient id="hx1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#0d9488"/></linearGradient></defs>' +
      '<rect width="300" height="300" fill="url(#hx1)"/>' +
      '<circle cx="150" cy="120" r="46" fill="rgba(255,255,255,0.22)"/>' +
      '<path d="M140 96h20v16h16v20h-16v16h-20v-16h-16v-20h16z" fill="#fff"/>' +
      '<text x="150" y="210" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#fff">Home Visit</text>' +
      '<text x="150" y="236" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#d1fae5">ทีมสหวิชาชีพ</text>' +
    '</svg>'
  );

  var DEMO_HEX_2 = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
      '<defs><linearGradient id="hx2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>' +
      '<rect width="300" height="300" fill="url(#hx2)"/>' +
      '<rect x="92" y="82" width="116" height="84" rx="14" fill="rgba(255,255,255,0.22)"/>' +
      '<path d="M114 112h72M114 132h52M114 150h36" stroke="#fff" stroke-width="8" stroke-linecap="round"/>' +
      '<text x="150" y="210" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#fff">Care Plan</text>' +
      '<text x="150" y="236" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#dbeafe">บันทึกเยี่ยมบ้าน</text>' +
    '</svg>'
  );

  var DEMO_HEX_3 = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
      '<defs><linearGradient id="hx3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>' +
      '<rect width="300" height="300" fill="url(#hx3)"/>' +
      '<circle cx="150" cy="122" r="44" fill="rgba(255,255,255,0.2)"/>' +
      '<path d="M132 122l12 12 26-28" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="150" y="210" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#fff">BKK South</text>' +
      '<text x="150" y="236" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#ede9fe">Pro-Health Data</text>' +
    '</svg>'
  );

  // Quick Login 6-point pattern demo image with clear numbered landmarks for UX testing
  var DEMO_QL_IMAGE = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">' +
      '<defs><linearGradient id="qlbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="50%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#eef2ff"/></linearGradient></defs>' +
      '<rect width="600" height="360" fill="url(#qlbg)"/>' +
      '<text x="300" y="34" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">ภาพจำลอง Quick Login (แตะ 6 จุดตามไอคอน 1 → 6)</text>' +
      // 6 Landmark icons positioned cleanly at known % coordinates
      // Point 1: (18%, 35%) -> (108, 126)
      '<g transform="translate(108,126)"><circle r="32" fill="#10b981" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">🏥</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46">1. ศูนย์ฯ</text></g>' +
      // Point 2: (50%, 35%) -> (300, 126)
      '<g transform="translate(300,126)"><circle r="32" fill="#0284c7" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">🩺</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#075985">2. ตรวจเยี่ยม</text></g>' +
      // Point 3: (82%, 35%) -> (492, 126)
      '<g transform="translate(492,126)"><circle r="32" fill="#6366f1" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">💊</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3730a3">3. เวชภัณฑ์</text></g>' +
      // Point 4: (18%, 74%) -> (108, 266)
      '<g transform="translate(108,266)"><circle r="32" fill="#f59e0b" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">🚑</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400e">4. รถเยี่ยม</text></g>' +
      // Point 5: (50%, 74%) -> (300, 266)
      '<g transform="translate(300,266)"><circle r="32" fill="#ec4899" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">📋</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9d174d">5. แบบฟอร์ม</text></g>' +
      // Point 6: (82%, 74%) -> (492, 266)
      '<g transform="translate(492,266)"><circle r="32" fill="#14b8a6" opacity="0.9"/><text y="8" text-anchor="middle" font-size="26">💬</text><text y="48" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#115e59">6. แชตทีม</text></g>' +
    '</svg>'
  );

  var DEMO_BANNER_HOME = makeSvgDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320">' +
      '<defs><linearGradient id="bh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#065f46"/><stop offset="55%" stop-color="#059669"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs>' +
      '<rect width="1200" height="320" fill="url(#bh)"/>' +
      '<circle cx="1040" cy="80" r="140" fill="rgba(255,255,255,0.08)"/>' +
      '<circle cx="960" cy="260" r="95" fill="rgba(255,255,255,0.06)"/>' +
      '<text x="56" y="135" font-family="sans-serif" font-size="38" font-weight="bold" fill="#ffffff">Pro-Health Data BKK South (Demo)</text>' +
      '<text x="56" y="182" font-family="sans-serif" font-size="22" fill="#d1fae5">ระบบบริการสาธารณสุข 21 • ศูนย์รวมงานเยี่ยมบ้านและสหวิชาชีพ</text>' +
    '</svg>'
  );

  var DEFAULT_WEB_DATA = {
    settings: {
      bg_login: "",
      banner_home: DEMO_BANNER_HOME,
      banner_magic: "",
      banner_edu: "",
      hex_image_1: DEMO_HEX_1,
      hex_image_2: DEMO_HEX_2,
      hex_image_3: DEMO_HEX_3,
      login_card_opacity: "0.88",
      quick_login_enabled: "true",
      quick_login_images: [DEMO_QL_IMAGE]
    },
    quickLoginSecretConfig: [
      {
        url: DEMO_QL_IMAGE,
        points: [
          { x: 18, y: 35 },
          { x: 50, y: 35 },
          { x: 82, y: 35 },
          { x: 18, y: 74 },
          { x: 50, y: 74 },
          { x: 82, y: 74 }
        ]
      },
      { url: "", points: [] },
      { url: "", points: [] }
    ],
    buttons: [
      { id: "btn_demo_1", category: "ระบบงาน", title: "ระบบยืนยันตัวตนรวมศูนย์ 21PASS (SSO)", url: "../Demo_21PASS/index.html", bgColor: "blue", textColor: "white", sortOrder: 1, targetPage: "magic" },
      { id: "btn_demo_2", category: "ระบบงาน", title: "ระบบบันทึกการเยี่ยมทีมสหวิชาชีพ (MDT Home Visit)", url: "../Demo_MDT_Home_Visit/index.html", bgColor: "green", textColor: "white", sortOrder: 2, targetPage: "magic" },
      { id: "btn_demo_3", category: "ระบบงาน", title: "ระบบคลังครุภัณฑ์และเวชภัณฑ์อนามัยชุมชน v2", url: "../Demo_ระบบครุภัณฑ์อนามัยชุมชน/index.html", bgColor: "orange", textColor: "white", sortOrder: 3, targetPage: "magic" },
      { id: "btn_demo_4", category: "ระบบงาน", title: "ระบบประเมินผู้ป่วยและเยี่ยมบ้าน (miniHHC)", url: "../Demo_miniHHC/index.html", bgColor: "blue", textColor: "white", sortOrder: 4, targetPage: "magic" },
      { id: "btn_demo_14", category: "ระบบงาน", title: "ระบบส่งต่อผู้ป่วยคลินิกเบาหวาน (SentDM)", url: "../Demo_SentDM/index.html", bgColor: "green", textColor: "white", sortOrder: 5, targetPage: "magic" },
      { id: "btn_demo_15", category: "ระบบงาน", title: "ระบบข้อมูลสุขภาพและคัดกรอง (ProHealthData)", url: "../Demo_ระบบข้อมูลสุขภาพและคัดกรอง_ProHealthData/index.html", bgColor: "green", textColor: "white", sortOrder: 6, targetPage: "magic" },
      { id: "btn_demo_16", category: "ระบบงาน", title: "แผนที่สุขภาพชุมชนดิจิทัล GIS เขตวัฒนา", url: "../Demo_Digital_Community_Health_Map_GIS/index.html", bgColor: "blue", textColor: "white", sortOrder: 7, targetPage: "magic" },
      { id: "btn_demo_17", category: "ระบบงาน", title: "ระบบพีระมิดประชากร (Data Center)", url: "../Demo_ระบบพีระมิดประชากร/index.html", bgColor: "orange", textColor: "white", sortOrder: 8, targetPage: "magic" },
      { id: "btn_demo_18", category: "ระบบงาน", title: "ระบบแชตประสานงานทีมสหวิชาชีพ (SeVaNa21)", url: "../Demo_SeVaNa21/index.html", bgColor: "blue", textColor: "white", sortOrder: 9, targetPage: "magic" },
      { id: "btn_demo_5", category: "Hyper link", title: "BKK Home Care Portal (Demo Link)", url: "https://example.com/demo/bkk-home-care", bgColor: "blue", textColor: "white", sortOrder: 1, targetPage: "magic" },
      { id: "btn_demo_6", category: "Hyper link", title: "ระบบฐานข้อมูล HDC กทม. (Demo Link)", url: "https://example.com/demo/hdc-bkk", bgColor: "green", textColor: "white", sortOrder: 2, targetPage: "magic" },
      { id: "btn_demo_7", category: "Hyper link", title: "แพลตฟอร์ม Health Link (Demo Link)", url: "https://example.com/demo/health-link", bgColor: "blue", textColor: "white", sortOrder: 3, targetPage: "magic" },
      { id: "btn_demo_8", category: "แบบฟอร์มต่างๆที่ใช้บ่อย", title: "แบบฟอร์มขอใช้รถส่วนกลาง (Demo)", url: "https://example.com/demo/form-vehicle", bgColor: "orange", textColor: "white", sortOrder: 1, targetPage: "magic" },
      { id: "btn_demo_9", category: "แบบฟอร์มต่างๆที่ใช้บ่อย", title: "แบบฟอร์มรายงานเยี่ยมบ้านประจำวัน (Demo)", url: "https://example.com/demo/form-daily-visit", bgColor: "green", textColor: "white", sortOrder: 2, targetPage: "magic" },
      { id: "btn_demo_10", category: "แบบฟอร์มต่างๆที่ใช้บ่อย", title: "แบบประเมิน Barthel Index / ADL (Demo)", url: "https://example.com/demo/form-adl", bgColor: "white", textColor: "green", sortOrder: 3, targetPage: "magic" },
      { id: "btn_demo_11", category: "ไฟล์อื่นๆ", title: "คู่มือแนวทางเยี่ยมบ้าน กทม. ฉบับย่อ (Demo)", url: "https://example.com/demo/files/hhc-guideline", bgColor: "white", textColor: "blue", sortOrder: 1, targetPage: "magic" },
      { id: "btn_demo_12", category: "ไฟล์อื่นๆ", title: "ตารางเวรแพทย์และพยาบาลเยี่ยมบ้าน (Demo)", url: "https://example.com/demo/files/duty-roster", bgColor: "orange", textColor: "white", sortOrder: 2, targetPage: "magic" },
      { id: "btn_demo_13", category: "Dev", title: "Sandbox API Inspector (Admin Demo)", url: "../index.html", bgColor: "red", textColor: "white", sortOrder: 1, targetPage: "magic" }
    ],
    logos: [
      { id: "logo_demo_1", fileId: "MOCK_LOGO_01", url: DEMO_LOGO_1, createdAt: "2026-11-01T09:00:00.000Z" },
      { id: "logo_demo_2", fileId: "MOCK_LOGO_02", url: DEMO_LOGO_2, createdAt: "2026-11-01T09:05:00.000Z" }
    ],
    mockAppointments: [
      {
        id: "APT-2026-001",
        date: "2026-11-17",
        timeSlot: "09:00 - 10:30 น.",
        patientAlias: "คุณสมชาย (ผู้ป่วยจำลอง #01)",
        hnMock: "HN-MOCK-1024",
        zone: "ชุมชนวัดธาตุทอง โซน A",
        team: "พยาบาล + นักกายภาพบำบัด",
        visitType: "IMC / ฟื้นฟูสมรรถภาพ",
        status: "ยืนยันนัดหมาย"
      },
      {
        id: "APT-2026-002",
        date: "2026-11-18",
        timeSlot: "13:30 - 15:00 น.",
        patientAlias: "คุณสมหญิง (ผู้ป่วยจำลอง #02)",
        hnMock: "HN-MOCK-1089",
        zone: "ชุมชนพระโขนง โซน B",
        team: "แพทย์ + เภสัชกร + พยาบาล",
        visitType: "ผู้ป่วยติดเตียง / ดูแลแผลกดทับ",
        status: "รอดำเนินการ"
      },
      {
        id: "APT-2026-003",
        date: "2026-11-20",
        timeSlot: "10:00 - 11:30 น.",
        patientAlias: "คุณวิชัย (ผู้ป่วยจำลอง #03)",
        hnMock: "HN-MOCK-1152",
        zone: "ชุมชนเอกมัย โซน C",
        team: "พยาบาลเวชปฏิบัติชุมชน",
        visitType: "ติดตามโรคเรื้อรัง (DM/HT)",
        status: "ยืนยันนัดหมาย"
      }
    ],
    mockChatMessages: [
      { sender: "พญ. อริสา (จำลอง)", role: "แพทย์", time: "08:45", text: "ทีมเยี่ยมบ้านโซน A เช้านี้พร้อมออกพื้นที่ 09:00 น. นะคะ เคส IMC-01 เตรียมชุดทำแผลไปด้วยค่ะ", self: false },
      { sender: "พว. นภา (จำลอง)", role: "พยาบาล", time: "08:48", text: "รับทราบค่ะ เตรียมเวชภัณฑ์จากคลังเรียบร้อยแล้ว กำลังลงนัดติดตามในปฏิทินค่ะ", self: false }
    ]
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadSandboxData() {
    try {
      var raw = localStorage.getItem(DEMO_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.buttons)) {
          return parsed;
        }
      }
    } catch (e) {}
    return clone(DEFAULT_WEB_DATA);
  }

  function saveSandboxData(data) {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function resetSandboxData() {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch (e) {}
    return clone(DEFAULT_WEB_DATA);
  }

  function authenticateDemoUser(username, password) {
    var u = String(username || "").toLowerCase().trim();
    var p = String(password || "").trim();
    for (var i = 0; i < DEMO_ACCOUNTS.length; i++) {
      if (DEMO_ACCOUNTS[i].username === u && DEMO_ACCOUNTS[i].password === p) {
        return {
          success: true,
          role: DEMO_ACCOUNTS[i].role,
          username: DEMO_ACCOUNTS[i].username,
          displayName: DEMO_ACCOUNTS[i].displayName,
          token: "DEMO_TOKEN_" + DEMO_ACCOUNTS[i].role.toUpperCase() + "_2026"
        };
      }
    }
    return {
      success: false,
      error: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (ใช้บัญชีจำลอง demo_staff / DemoStaff@2026 หรือ demo_admin / DemoAdmin@2026)"
    };
  }

  function verifyDemoQuickLogin(imageIndex, userPoints) {
    var data = loadSandboxData();
    var configs = (data.quickLoginSecretConfig || []).filter(function (c) {
      return c && c.url && Array.isArray(c.points) && c.points.length === 6;
    });
    var target = configs[imageIndex] || configs[0];
    if (!target) {
      return { success: false, error: "ยังไม่ได้ตั้งค่า Quick Login" };
    }
    if (!Array.isArray(userPoints) || userPoints.length !== 6) {
      return { success: false, error: "กรุณากดให้ครบ 6 จุด" };
    }
    var tolerance = 20.0;
    for (var i = 0; i < 6; i++) {
      var dx = userPoints[i].x - target.points[i].x;
      var dy = userPoints[i].y - target.points[i].y;
      if (Math.sqrt(dx * dx + dy * dy) > tolerance) {
        return { success: false, error: "จุดพิกัดที่ " + (i + 1) + " ไม่ตรงกับลำดับที่ตั้งค่าไว้!" };
      }
    }
    return {
      success: true,
      role: "user",
      username: "demo_staff",
      displayName: "เจ้าหน้าที่เยี่ยมบ้าน (Demo Staff)",
      token: "DEMO_QUICK_TOKEN_USER_2026"
    };
  }

  /**
   * Generates a deterministic offline SVG QR-like matrix code (zero external API calls).
   * Visually authentic for UX mockups and contains no external network dependency.
   */
  function generateOfflineDemoQrSvg(text) {
    var size = 21;
    var cell = 8;
    var pad = 16;
    var full = size * cell + pad * 2;
    var hash = 2166136261;
    var str = String(text || "DEMO");
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    function isFinder(r, c) {
      if (r < 7 && c < 7) return true;
      if (r < 7 && c >= size - 7) return true;
      if (r >= size - 7 && c < 7) return true;
      return false;
    }

    function finderFilled(r, c) {
      var lr = r < 7 ? r : r - (size - 7);
      var lc = c < 7 ? c : c - (size - 7);
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    }

    var rects = [];
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        var fill = false;
        if (isFinder(r, c)) {
          fill = finderFilled(r, c);
        } else if (r === 6 || c === 6) {
          fill = (r + c) % 2 === 0;
        } else {
          var v = Math.abs(Math.imul(hash ^ (r * 31 + c * 17), 2654435761)) % 11;
          fill = v < 5;
        }
        if (fill) {
          rects.push('<rect x="' + (pad + c * cell) + '" y="' + (pad + r * cell) + '" width="' + cell + '" height="' + cell + '" fill="#0f172a"/>');
        }
      }
    }

    return makeSvgDataUri(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + full + ' ' + full + '">' +
        '<rect width="' + full + '" height="' + full + '" fill="#ffffff"/>' +
        rects.join("") +
      '</svg>'
    );
  }

  global.HhcDemoStore = {
    DEMO_ACCOUNTS: DEMO_ACCOUNTS,
    DEFAULT_WEB_DATA: DEFAULT_WEB_DATA,
    DEMO_QL_IMAGE: DEMO_QL_IMAGE,
    loadSandboxData: loadSandboxData,
    saveSandboxData: saveSandboxData,
    resetSandboxData: resetSandboxData,
    authenticateDemoUser: authenticateDemoUser,
    verifyDemoQuickLogin: verifyDemoQuickLogin,
    generateOfflineDemoQrSvg: generateOfflineDemoQrSvg
  };
})(window);
