/**
 * Mock Backend API & Seed Data for Demo Mock-up
 * ระบบเวชภัณฑ์และอนามัยชุมชน v2 (Pro-Health Data BKK South)
 *
 * หมายเหตุความปลอดภัย:
 * ไฟล์นี้ใช้ข้อมูลจำลอง (Mock Data) ทั้งหมด 100%
 * ไม่มีการเชื่อมต่อ Google Sheet, Google Drive, Google Calendar หรือ 21PASS SSO จริง
 * และไม่มี API Key, Credential หรือ ID ของระบบจริงใดๆ
 */
(function (global) {
  const STORAGE_KEY = 'prohealth_bkk_south_supplies_demo_v2';

  function formatDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateTimeOffset(daysOffset, timeStr) {
    return `${formatDateOffset(daysOffset)} ${timeStr || '09:30:00'}`;
  }

  function genId(prefix, len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < (len || 6); i++) {
      out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + out;
  }

  // บัญชีจำลองสำหรับ Mock 21PASS SSO (ไม่ใช่บัญชีจริง)
  const MOCK_SSO_USERS = [
    {
      id: 'MOCK-ADMIN-01',
      userId: 'MOCK-ADMIN-01',
      displayName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)',
      name: 'พว.สมหญิง รักษ์ชุมชน (MOCK)',
      department: 'กลุ่มงานอนามัยชุมชน (จำลอง)',
      position: 'พยาบาลวิชาชีพชำนาญการ (ดูแลคลัง)',
      role: 'Admin',
      imageId: '👩‍⚕️',
      mockUsername: 'demo.admin@mock.local',
      note: 'เข้าถึงทุกเมนู: รับของเข้า, เบิกของออก, แดชบอร์ด, รายงาน, จัดการรายการและธุรกรรม'
    },
    {
      id: 'MOCK-STAFF-01',
      userId: 'MOCK-STAFF-01',
      displayName: 'นายสมชาย ใจดี (MOCK)',
      name: 'นายสมชาย ใจดี (MOCK)',
      department: 'ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง)',
      position: 'นักวิชาการสาธารณสุขปฏิบัติการ',
      role: 'user',
      imageId: '👨‍⚕️',
      mockUsername: 'demo.staff@mock.local',
      note: 'สิทธิ์เจ้าหน้าที่ทั่วไป: เบิกเวชภัณฑ์ออก (สามารถทดสอบ Admin Override ด้วย MOCK PIN: 999999)'
    }
  ];

  // รหัส PIN จำลองสำหรับทดสอบ Admin Override (ไม่ใช่รหัสจริงใน Production)
  const MOCK_ADMIN_OVERRIDE_PIN = '999999';

  function createInitialSeedData() {
    const supplies = [
      { supplyId: 'S-MOCK0001', name: 'Paracetamol 500 mg (แผง 10 เม็ด)', unit: 'แผง', imageId: '💊', tags: 'para ยาแก้ปวด ลดไข้ พาราเซตามอล', createdAt: formatDateTimeOffset(-90, '08:30:00') },
      { supplyId: 'S-MOCK0002', name: 'ชุดตรวจ ATK (SARS-CoV-2 Antigen)', unit: 'ชุด', imageId: '🧪', tags: 'atk covid ชุดตรวจ โควิด', createdAt: formatDateTimeOffset(-85, '09:00:00') },
      { supplyId: 'S-MOCK0003', name: 'หน้ากากอนามัยทางการแพทย์ (50 ชิ้น)', unit: 'กล่อง', imageId: '😷', tags: 'mask หน้ากาก ป้องกัน', createdAt: formatDateTimeOffset(-80, '10:15:00') },
      { supplyId: 'S-MOCK0004', name: 'แอลกอฮอล์ 70% (450 ml)', unit: 'ขวด', imageId: '🧴', tags: 'alcohol ล้างแผล ฆ่าเชื้อ', createdAt: formatDateTimeOffset(-75, '11:00:00') },
      { supplyId: 'S-MOCK0005', name: 'ผ้าก๊อซปลอดเชื้อ 3x3 นิ้ว', unit: 'ซอง', imageId: '🩹', tags: 'gauze ทำแผล ผ้าก๊อซ', createdAt: formatDateTimeOffset(-70, '13:20:00') },
      { supplyId: 'S-MOCK0006', name: 'ถุงมือตรวจโรคชนิดไม่มีแป้ง Size M', unit: 'กล่อง', imageId: '🧤', tags: 'gloves ถุงมือยาง', createdAt: formatDateTimeOffset(-60, '14:00:00') },
      { supplyId: 'S-MOCK0007', name: 'Povidone-Iodine 10% (30 ml)', unit: 'ขวด', imageId: '💉', tags: 'betadine เบตาดีน ใส่แผล', createdAt: formatDateTimeOffset(-55, '14:30:00') },
      { supplyId: 'S-MOCK0008', name: 'แผ่นตรวจระดับน้ำตาลในเลือด (Gluco Strips)', unit: 'กล่อง', imageId: '🩸', tags: 'dtx เบาหวาน น้ำตาล เจาะเลือด', createdAt: formatDateTimeOffset(-45, '15:00:00') },
      { supplyId: 'S-MOCK0009', name: 'น้ำเกลือล้างแผล NSS 0.9% (1000 ml)', unit: 'ขวด', imageId: '💧', tags: 'nss saline ล้างแผล น้ำเกลือ', createdAt: formatDateTimeOffset(-40, '09:45:00') },
      { supplyId: 'S-MOCK0010', name: 'ปรอทวัดไข้ดิจิทัล (Digital Thermometer)', unit: 'ชิ้น', imageId: '🌡️', tags: 'thermometer วัดไข้ อุณหภูมิ ครุภัณฑ์ย่อย', createdAt: formatDateTimeOffset(-35, '10:30:00') },
      { supplyId: 'S-MOCK0011', name: 'ผงเกลือแร่ ORS (Oral Rehydration Salts)', unit: 'ซอง', imageId: '📦', tags: 'ors เกลือแร่ ท้องเสีย', createdAt: formatDateTimeOffset(-30, '11:15:00') }
    ];

    const inventory = [
      // Paracetamol: ล็อตเก่าใกล้หมดอายุ (< 10 วัน) + ล็อตใหม่
      { lotId: 'LOT-M101', supplyId: 'S-MOCK0001', supplyName: 'Paracetamol 500 mg (แผง 10 เม็ด)', quantity: 25, originalQuantity: 100, unit: 'แผง', expiryDate: formatDateOffset(7), receiveDate: formatDateOffset(-60), imageId: '💊' },
      { lotId: 'LOT-M102', supplyId: 'S-MOCK0001', supplyName: 'Paracetamol 500 mg (แผง 10 เม็ด)', quantity: 120, originalQuantity: 120, unit: 'แผง', expiryDate: formatDateOffset(365), receiveDate: formatDateOffset(-10), imageId: '💊' },

      // ATK: ใกล้หมดอายุ (< 30 วัน) และเหลือน้อย
      { lotId: 'LOT-M201', supplyId: 'S-MOCK0002', supplyName: 'ชุดตรวจ ATK (SARS-CoV-2 Antigen)', quantity: 8, originalQuantity: 50, unit: 'ชุด', expiryDate: formatDateOffset(19), receiveDate: formatDateOffset(-50), imageId: '🧪' },

      // หน้ากากอนามัย: สต็อกปกติ ไม่มีวันหมดอายุ (ทดสอบ "ไม่ระบุ")
      { lotId: 'LOT-M301', supplyId: 'S-MOCK0003', supplyName: 'หน้ากากอนามัยทางการแพทย์ (50 ชิ้น)', quantity: 32, originalQuantity: 60, unit: 'กล่อง', expiryDate: '', receiveDate: formatDateOffset(-40), imageId: '😷' },

      // แอลกอฮอล์ 70%: สต็อกเหลือน้อย (< 10)
      { lotId: 'LOT-M401', supplyId: 'S-MOCK0004', supplyName: 'แอลกอฮอล์ 70% (450 ml)', quantity: 6, originalQuantity: 30, unit: 'ขวด', expiryDate: formatDateOffset(180), receiveDate: formatDateOffset(-35), imageId: '🧴' },

      // ผ้าก๊อซ: ปกติ
      { lotId: 'LOT-M501', supplyId: 'S-MOCK0005', supplyName: 'ผ้าก๊อซปลอดเชื้อ 3x3 นิ้ว', quantity: 65, originalQuantity: 100, unit: 'ซอง', expiryDate: formatDateOffset(240), receiveDate: formatDateOffset(-30), imageId: '🩹' },

      // ถุงมือ: สต็อกหมดเกลี้ยง (0)
      { lotId: 'LOT-M601', supplyId: 'S-MOCK0006', supplyName: 'ถุงมือตรวจโรคชนิดไม่มีแป้ง Size M', quantity: 0, originalQuantity: 20, unit: 'กล่อง', expiryDate: formatDateOffset(120), receiveDate: formatDateOffset(-45), imageId: '🧤' },

      // เบตาดีน: ใกล้หมดอายุ (< 10 วัน) และเหลือน้อย
      { lotId: 'LOT-M701', supplyId: 'S-MOCK0007', supplyName: 'Povidone-Iodine 10% (30 ml)', quantity: 5, originalQuantity: 25, unit: 'ขวด', expiryDate: formatDateOffset(5), receiveDate: formatDateOffset(-55), imageId: '💉' },

      // Gluco Strips: ใกล้หมดอายุ (< 30 วัน)
      { lotId: 'LOT-M801', supplyId: 'S-MOCK0008', supplyName: 'แผ่นตรวจระดับน้ำตาลในเลือด (Gluco Strips)', quantity: 14, originalQuantity: 20, unit: 'กล่อง', expiryDate: formatDateOffset(24), receiveDate: formatDateOffset(-25), imageId: '🩸' },

      // NSS 0.9%: ปกติ
      { lotId: 'LOT-M901', supplyId: 'S-MOCK0009', supplyName: 'น้ำเกลือล้างแผล NSS 0.9% (1000 ml)', quantity: 18, originalQuantity: 24, unit: 'ขวด', expiryDate: formatDateOffset(300), receiveDate: formatDateOffset(-20), imageId: '💧' },

      // ปรอทวัดไข้ดิจิทัล: เหลือน้อย (< 10), ไม่ระบุวันหมดอายุ
      { lotId: 'LOT-M1001', supplyId: 'S-MOCK0010', supplyName: 'ปรอทวัดไข้ดิจิทัล (Digital Thermometer)', quantity: 4, originalQuantity: 10, unit: 'ชิ้น', expiryDate: '', receiveDate: formatDateOffset(-35), imageId: '🌡️' },

      // ORS: ปกติ
      { lotId: 'LOT-M1101', supplyId: 'S-MOCK0011', supplyName: 'ผงเกลือแร่ ORS (Oral Rehydration Salts)', quantity: 45, originalQuantity: 80, unit: 'ซอง', expiryDate: formatDateOffset(150), receiveDate: formatDateOffset(-15), imageId: '📦' }
    ];

    const transactions = [
      { transactionId: 'T-MOCK001', type: 'Receive', date: formatDateTimeOffset(-60, '09:00:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)', supplyName: 'Paracetamol 500 mg (แผง 10 เม็ด)', quantity: 100, unit: 'แผง', expiryDate: formatDateOffset(7), lotId: 'LOT-M101' },
      { transactionId: 'T-MOCK002', type: 'Receive', date: formatDateTimeOffset(-50, '10:30:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)', supplyName: 'ชุดตรวจ ATK (SARS-CoV-2 Antigen)', quantity: 50, unit: 'ชุด', expiryDate: formatDateOffset(19), lotId: 'LOT-M201' },
      { transactionId: 'T-MOCK003', type: 'Receive', date: formatDateTimeOffset(-40, '11:00:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)', supplyName: 'หน้ากากอนามัยทางการแพทย์ (50 ชิ้น)', quantity: 60, unit: 'กล่อง', expiryDate: '', lotId: 'LOT-M301' },
      { transactionId: 'T-MOCK004', type: 'Receive', date: formatDateTimeOffset(-35, '14:00:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)', supplyName: 'แอลกอฮอล์ 70% (450 ml)', quantity: 30, unit: 'ขวด', expiryDate: formatDateOffset(180), lotId: 'LOT-M401' },
      { transactionId: 'T-MOCK005', type: 'Withdraw', date: formatDateTimeOffset(-18, '09:45:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'Paracetamol 500 mg (แผง 10 เม็ด)', quantity: 75, unit: 'แผง', expiryDate: '', lotId: 'LOT-M101' },
      { transactionId: 'T-MOCK006', type: 'Withdraw', date: formatDateTimeOffset(-14, '13:15:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'ชุดตรวจ ATK (SARS-CoV-2 Antigen)', quantity: 42, unit: 'ชุด', expiryDate: '', lotId: 'LOT-M201' },
      { transactionId: 'T-MOCK007', type: 'Withdraw', date: formatDateTimeOffset(-12, '10:20:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK) (กลุ่มงานอนามัยชุมชน (จำลอง) - พยาบาลวิชาชีพชำนาญการ (ดูแลคลัง))', supplyName: 'ผ้าก๊อซปลอดเชื้อ 3x3 นิ้ว', quantity: 35, unit: 'ซอง', expiryDate: '', lotId: 'LOT-M501' },
      { transactionId: 'T-MOCK008', type: 'Withdraw', date: formatDateTimeOffset(-9, '15:10:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'ผงเกลือแร่ ORS (Oral Rehydration Salts)', quantity: 35, unit: 'ซอง', expiryDate: '', lotId: 'LOT-M1101' },
      { transactionId: 'T-MOCK009', type: 'Withdraw', date: formatDateTimeOffset(-6, '11:05:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'หน้ากากอนามัยทางการแพทย์ (50 ชิ้น)', quantity: 28, unit: 'กล่อง', expiryDate: '', lotId: 'LOT-M301' },
      { transactionId: 'T-MOCK010', type: 'Withdraw', date: formatDateTimeOffset(-4, '14:40:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK) (กลุ่มงานอนามัยชุมชน (จำลอง) - พยาบาลวิชาชีพชำนาญการ (ดูแลคลัง))', supplyName: 'แอลกอฮอล์ 70% (450 ml)', quantity: 24, unit: 'ขวด', expiryDate: '', lotId: 'LOT-M401' },
      { transactionId: 'T-MOCK011', type: 'Withdraw', date: formatDateTimeOffset(-3, '09:30:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'ถุงมือตรวจโรคชนิดไม่มีแป้ง Size M', quantity: 20, unit: 'กล่อง', expiryDate: '', lotId: 'LOT-M601' },
      { transactionId: 'T-MOCK012', type: 'Withdraw', date: formatDateTimeOffset(-2, '16:00:00'), userName: 'นายสมชาย ใจดี (MOCK) (ศูนย์บริการสาธารณสุขโซนใต้ (จำลอง) - นักวิชาการสาธารณสุขปฏิบัติการ)', supplyName: 'Povidone-Iodine 10% (30 ml)', quantity: 20, unit: 'ขวด', expiryDate: '', lotId: 'LOT-M701' },
      { transactionId: 'T-MOCK013', type: 'Receive', date: formatDateTimeOffset(-10, '08:50:00'), userName: 'พว.สมหญิง รักษ์ชุมชน (MOCK)', supplyName: 'Paracetamol 500 mg (แผง 10 เม็ด)', quantity: 120, unit: 'แผง', expiryDate: formatDateOffset(365), lotId: 'LOT-M102' }
    ];

    const calendarLogs = [
      { createdAt: formatDateTimeOffset(-10, '08:50:00'), title: 'รับเข้า Paracetamol 500 mg (แผง 10 เม็ด) จำนวน 120 แผง', eventDate: formatDateOffset(-10) },
      { createdAt: formatDateTimeOffset(-4, '14:40:00'), title: 'แอลกอฮอล์ 70% (450 ml) ของเหลือน้อย (คงเหลือ 6 ขวด)', eventDate: formatDateOffset(-4) },
      { createdAt: formatDateTimeOffset(-3, '09:30:00'), title: 'ถุงมือตรวจโรคชนิดไม่มีแป้ง Size M ของเหลือน้อย (คงเหลือ 0 กล่อง)', eventDate: formatDateOffset(-3) }
    ];

    return {
      supplies: supplies,
      inventory: inventory,
      transactions: transactions,
      ssoUsers: MOCK_SSO_USERS,
      calendarLogs: calendarLogs
    };
  }

  function loadDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.supplies) && Array.isArray(parsed.inventory)) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    const seed = createInitialSeedData();
    saveDB(seed);
    return seed;
  }

  function saveDB(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      // ignore
    }
  }

  function getItemNamePriority(name) {
    if (!name) return 4;
    const trimmed = String(name).trim();
    if (!trimmed) return 4;
    const firstChar = trimmed.charAt(0);
    if (/[0-9]/.test(firstChar)) return 1;
    if (/[a-zA-Z]/.test(firstChar)) return 2;
    if (/[\u0E00-\u0E7F]/.test(firstChar)) return 3;
    return 4;
  }

  function sortItemsByName(list) {
    return list.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      const pA = getItemNamePriority(nameA);
      const pB = getItemNamePriority(nameB);
      if (pA !== pB) return pA - pB;
      return nameA.localeCompare(nameB, 'th', { numeric: true, sensitivity: 'base' });
    });
  }

  function parseDateBoundary(str, isEnd) {
    if (!str) return null;
    const d = new Date(str + (isEnd ? 'T23:59:59' : 'T00:00:00'));
    return isNaN(d.getTime()) ? null : d;
  }

  // Mock implementation of all server-side GAS functions in v2/Code.gs
  const ServerFunctions = {
    verifySSOCode: function (mockUserId) {
      const found = MOCK_SSO_USERS.find(u => u.id === mockUserId) || MOCK_SSO_USERS[0];
      return { success: true, user: Object.assign({}, found) };
    },

    getSSOUserProfile: function (userOrIdentifier) {
      if (!userOrIdentifier) return userOrIdentifier;
      if (userOrIdentifier.isGuest) return userOrIdentifier;
      const key = (
        typeof userOrIdentifier === 'object'
          ? (userOrIdentifier.id || userOrIdentifier.userId || userOrIdentifier.displayName || userOrIdentifier.name || '')
          : String(userOrIdentifier)
      ).trim().toLowerCase();

      const found = MOCK_SSO_USERS.find(
        u => u.id.toLowerCase() === key || u.displayName.toLowerCase() === key
      );
      return found ? Object.assign({}, found) : userOrIdentifier;
    },

    getSuppliesList: function () {
      const db = loadDB();
      return db.supplies.map(s => Object.assign({}, s));
    },

    getSuppliesWithStock: function () {
      const db = loadDB();
      const map = {};
      db.supplies.forEach(item => {
        if (item.name) {
          map[item.name.trim()] = {
            supplyId: item.supplyId,
            name: item.name.trim(),
            unit: item.unit,
            imageId: item.imageId,
            tags: item.tags || '',
            stock: 0
          };
        }
      });

      db.inventory.forEach(lot => {
        const sName = (lot.supplyName || '').trim();
        if (!sName) return;
        if (!map[sName]) {
          map[sName] = {
            supplyId: lot.supplyId || genId('S-MOCK', 4),
            name: sName,
            unit: lot.unit || '',
            imageId: lot.imageId || '💊',
            tags: '',
            stock: 0
          };
        }
        map[sName].stock += Number(lot.quantity) || 0;
        if (!map[sName].unit && lot.unit) map[sName].unit = lot.unit;
        if (!map[sName].imageId && lot.imageId) map[sName].imageId = lot.imageId;
      });

      return sortItemsByName(Object.values(map));
    },

    receiveSupply: function (name, quantity, unit, expiryDateStr, base64Image, imageName, userName) {
      const db = loadDB();
      const cleanName = (name || '').trim();
      const cleanUnit = (unit || '').trim();
      const qtyNum = Number(quantity) || 0;

      let existing = db.supplies.find(s => s.name.trim() === cleanName);
      let supplyId = existing ? existing.supplyId : genId('S-MOCK', 4);
      let imageId = existing ? existing.imageId : '💊';

      if (base64Image) {
        imageId = base64Image;
      }

      if (!existing) {
        existing = {
          supplyId: supplyId,
          name: cleanName,
          unit: cleanUnit,
          imageId: imageId || '💊',
          tags: cleanName,
          createdAt: formatDateTimeOffset(0, new Date().toTimeString().slice(0, 8))
        };
        db.supplies.push(existing);
      } else if (base64Image) {
        existing.imageId = imageId;
      }

      const todayStr = formatDateOffset(0);
      const lotId = genId('LOT-M', 4);
      const cleanExpiry = expiryDateStr && expiryDateStr !== 'ไม่ระบุ' ? expiryDateStr.trim() : '';

      db.inventory.push({
        lotId: lotId,
        supplyId: supplyId,
        supplyName: cleanName,
        quantity: qtyNum,
        originalQuantity: qtyNum,
        unit: cleanUnit,
        expiryDate: cleanExpiry,
        receiveDate: todayStr,
        imageId: imageId
      });

      const nowTime = new Date().toTimeString().slice(0, 8);
      db.transactions.push({
        transactionId: genId('T-MOCK', 4),
        type: 'Receive',
        date: `${todayStr} ${nowTime}`,
        userName: userName || 'MOCK Admin',
        supplyName: cleanName,
        quantity: qtyNum,
        unit: cleanUnit,
        expiryDate: cleanExpiry,
        lotId: lotId
      });

      // จำลองการบันทึก Google Calendar
      db.calendarLogs.unshift({
        createdAt: `${todayStr} ${nowTime}`,
        title: `รับเข้า ${cleanName} จำนวน ${qtyNum} ${cleanUnit}`,
        eventDate: todayStr
      });
      if (cleanExpiry) {
        db.calendarLogs.unshift({
          createdAt: `${todayStr} ${nowTime}`,
          title: `${cleanName} (แจ้งเตือนหมดอายุล่วงหน้า 30 วัน & วันหมดอายุ ${cleanExpiry})`,
          eventDate: cleanExpiry
        });
      }

      saveDB(db);
      return {
        success: true,
        message: `บันทึก ${cleanName} จำนวน ${qtyNum} ${cleanUnit} เข้าระบบจำลองเรียบร้อยแล้ว (จำลองแจ้งเตือนปฏิทินแล้ว)`
      };
    },

    withdrawSupplies: function (withdrawItems, userName) {
      const db = loadDB();
      const summary = [];
      const todayStr = formatDateOffset(0);
      const nowTime = new Date().toTimeString().slice(0, 8);

      for (const item of withdrawItems) {
        const name = (item.name || '').trim();
        let reqQty = Number(item.quantity) || 0;
        let totalWithdrawn = 0;

        // หลักการ FIFO: เรียงจาก ReceiveDate เก่าสุดไปใหม่สุด
        const matchingLots = db.inventory
          .filter(l => l.supplyName.trim() === name && Number(l.quantity) > 0)
          .sort((a, b) => new Date(a.receiveDate).getTime() - new Date(b.receiveDate).getTime());

        let itemUnit = matchingLots.length > 0 ? matchingLots[0].unit : (item.unit || 'ชิ้น');

        for (const lot of matchingLots) {
          if (reqQty <= 0) break;
          const deduct = Math.min(reqQty, Number(lot.quantity));
          lot.quantity = Number(lot.quantity) - deduct;

          db.transactions.push({
            transactionId: genId('T-MOCK', 4),
            type: 'Withdraw',
            date: `${todayStr} ${nowTime}`,
            userName: userName || 'MOCK User',
            supplyName: name,
            quantity: deduct,
            unit: lot.unit,
            expiryDate: '',
            lotId: lot.lotId
          });

          reqQty -= deduct;
          totalWithdrawn += deduct;
        }

        summary.push(`${name} ${totalWithdrawn} ${itemUnit}`);

        const remainingStock = db.inventory
          .filter(l => l.supplyName.trim() === name)
          .reduce((acc, l) => acc + (Number(l.quantity) || 0), 0);

        if (totalWithdrawn > 0) {
          db.calendarLogs.unshift({
            createdAt: `${todayStr} ${nowTime}`,
            title: `${userName} เบิก ${name} จำนวน ${totalWithdrawn} ${itemUnit}`,
            eventDate: todayStr
          });
        }
        if (remainingStock <= 10) {
          db.calendarLogs.unshift({
            createdAt: `${todayStr} ${nowTime}`,
            title: `${name} ของเหลือน้อย (คงเหลือ ${remainingStock} ${itemUnit})`,
            eventDate: todayStr
          });
        }
      }

      saveDB(db);
      return {
        success: true,
        summary: summary,
        calendarWarning: ''
      };
    },

    getAdminDashboardData: function (startDateStr, endDateStr) {
      const db = loadDB();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiringSoon = [];
      db.inventory.forEach(lot => {
        const qty = Number(lot.quantity) || 0;
        if (qty > 0 && lot.expiryDate && lot.expiryDate !== 'ไม่ระบุ') {
          const exp = new Date(lot.expiryDate);
          if (!isNaN(exp.getTime())) {
            const daysDiff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
            if (daysDiff < 30) {
              expiringSoon.push({
                name: lot.supplyName,
                lotId: lot.lotId,
                lotDate: lot.receiveDate,
                qty: qty,
                daysLeft: daysDiff,
                unit: lot.unit
              });
            }
          }
        }
      });
      expiringSoon.sort((a, b) => a.daysLeft - b.daysLeft);

      const stockMap = {};
      const unitMap = {};
      db.inventory.forEach(lot => {
        stockMap[lot.supplyName] = (stockMap[lot.supplyName] || 0) + (Number(lot.quantity) || 0);
        unitMap[lot.supplyName] = lot.unit;
      });

      const lowStock = [];
      for (const name in stockMap) {
        if (stockMap[name] < 10) {
          lowStock.push({ name: name, stock: stockMap[name], unit: unitMap[name] || 'ชิ้น' });
        }
      }
      lowStock.sort((a, b) => a.stock - b.stock);

      const filterStart = parseDateBoundary(startDateStr, false);
      const filterEnd = parseDateBoundary(endDateStr, true);
      const withdrawUsage = {};

      db.transactions.forEach(t => {
        if (t.type === 'Withdraw' && t.supplyName && Number(t.quantity) > 0) {
          const d = new Date(t.date.replace(' ', 'T'));
          if (filterStart && d < filterStart) return;
          if (filterEnd && d > filterEnd) return;
          withdrawUsage[t.supplyName] = (withdrawUsage[t.supplyName] || 0) + Number(t.quantity);
        }
      });

      const usageChartData = Object.keys(withdrawUsage).map(name => ({ name, value: withdrawUsage[name] }));
      usageChartData.sort((a, b) => b.value - a.value);

      return {
        expiringSoon: expiringSoon,
        lowStock: lowStock,
        topUsage: usageChartData.slice(0, 5)
      };
    },

    getOverviewSummary: function (startDateStr, endDateStr) {
      const db = loadDB();
      const supplies = ServerFunctions.getSuppliesWithStock();
      const filterStart = parseDateBoundary(startDateStr, false);
      const filterEnd = parseDateBoundary(endDateStr, true);

      const summaryList = supplies.map(supply => {
        let received = 0;
        let withdrawn = 0;
        let balance = 0;
        let earliestExpiry = null;

        db.transactions.forEach(t => {
          if (t.supplyName === supply.name) {
            const d = new Date(t.date.replace(' ', 'T'));
            if (filterStart && d < filterStart) return;
            if (filterEnd && d > filterEnd) return;
            if (t.type === 'Receive') received += Number(t.quantity) || 0;
            if (t.type === 'Withdraw') withdrawn += Number(t.quantity) || 0;
          }
        });

        db.inventory.forEach(lot => {
          if (lot.supplyName === supply.name) {
            const qty = Number(lot.quantity) || 0;
            balance += qty;
            if (qty > 0 && lot.expiryDate && lot.expiryDate !== 'ไม่ระบุ') {
              const exp = new Date(lot.expiryDate);
              if (!isNaN(exp.getTime())) {
                if (!earliestExpiry || exp < earliestExpiry) earliestExpiry = exp;
              }
            }
          }
        });

        return {
          name: supply.name,
          received: received,
          withdrawn: withdrawn,
          balance: balance,
          unit: supply.unit,
          earliestExpiry: earliestExpiry ? earliestExpiry.toISOString().slice(0, 10) : '-'
        };
      });

      sortItemsByName(summaryList);
      summaryList.forEach((item, idx) => { item.no = idx + 1; });
      return summaryList;
    },

    getWithdrawalSummary: function (startDateStr, endDateStr) {
      const db = loadDB();
      const filterStart = parseDateBoundary(startDateStr, false);
      const filterEnd = parseDateBoundary(endDateStr, true);
      const usageMap = {};
      const unitMap = {};

      db.transactions.forEach(t => {
        if (t.type === 'Withdraw' && t.supplyName && Number(t.quantity) > 0) {
          const d = new Date(t.date.replace(' ', 'T'));
          if (filterStart && d < filterStart) return;
          if (filterEnd && d > filterEnd) return;
          usageMap[t.supplyName] = (usageMap[t.supplyName] || 0) + Number(t.quantity);
          unitMap[t.supplyName] = t.unit;
        }
      });

      const result = Object.keys(usageMap).map(name => ({
        name: name,
        withdrawn: usageMap[name],
        unit: unitMap[name] || 'ชิ้น'
      }));
      result.sort((a, b) => b.withdrawn - a.withdrawn);
      result.forEach((item, idx) => { item.no = idx + 1; });
      return result;
    },

    updateSupplyUnit: function (supplyId, newUnit) {
      const db = loadDB();
      const supply = db.supplies.find(s => s.supplyId === supplyId);
      if (!supply) return { success: false, message: 'ไม่พบเวชภัณฑ์ที่ต้องการแก้ไข' };

      const oldName = supply.name.trim();
      const trimmedUnit = newUnit.trim();
      supply.unit = trimmedUnit;

      db.inventory.forEach(lot => {
        if (lot.supplyId === supplyId || lot.supplyName.trim() === oldName) {
          lot.unit = trimmedUnit;
        }
      });
      db.transactions.forEach(t => {
        if (t.supplyName.trim() === oldName) {
          t.unit = trimmedUnit;
        }
      });

      saveDB(db);
      return { success: true };
    },

    getSupplyLots: function (supplyName) {
      const db = loadDB();
      const target = (supplyName || '').trim().toLowerCase();
      return db.inventory
        .filter(l => l.supplyName.trim().toLowerCase() === target)
        .map(l => ({
          lotId: l.lotId,
          supplyId: l.supplyId,
          name: l.supplyName,
          quantity: Number(l.quantity) || 0,
          originalQuantity: Number(l.originalQuantity) || 0,
          unit: l.unit,
          expiryDate: l.expiryDate || '',
          receiveDate: l.receiveDate || '',
          imageId: l.imageId || '💊'
        }));
    },

    updateLotExpiry: function (lotId, newExpiryDateStr) {
      const db = loadDB();
      const lot = db.inventory.find(l => l.lotId === lotId);
      if (!lot) return { success: false, message: 'ไม่พบข้อมูลล็อต ' + lotId };

      const cleanExp = newExpiryDateStr && newExpiryDateStr !== 'ไม่ระบุ' ? newExpiryDateStr.trim() : '';
      lot.expiryDate = cleanExp;

      db.transactions.forEach(t => {
        if (t.lotId === lotId && t.type === 'Receive') {
          t.expiryDate = cleanExp;
        }
      });

      let calMsg = '';
      if (cleanExp) {
        db.calendarLogs.unshift({
          createdAt: formatDateTimeOffset(0, new Date().toTimeString().slice(0, 8)),
          title: `${lot.supplyName} lot ${lot.receiveDate} แจ้งเตือนหมดอายุ (${cleanExp})`,
          eventDate: cleanExp
        });
        calMsg = ' (พร้อมจำลองกิจกรรมแจ้งเตือนลง Google Calendar)';
      }

      saveDB(db);
      const actionText = cleanExp ? `อัปเดตวันหมดอายุเป็น ${cleanExp}` : 'ล้างวันหมดอายุเรียบร้อยแล้ว';
      return { success: true, message: `ล็อต ${lotId} (${lot.supplyName}) ${actionText}${calMsg}` };
    },

    clearAllLotsExpiryForSupply: function (supplyName) {
      const db = loadDB();
      const target = (supplyName || '').trim().toLowerCase();
      const modLots = new Set();
      let count = 0;

      db.inventory.forEach(l => {
        if (l.supplyName.trim().toLowerCase() === target) {
          l.expiryDate = '';
          modLots.add(l.lotId);
          count++;
        }
      });
      db.transactions.forEach(t => {
        if (modLots.has(t.lotId) && t.type === 'Receive') {
          t.expiryDate = '';
        }
      });

      saveDB(db);
      return { success: true, message: `ล้างวันหมดอายุของเวชภัณฑ์ "${supplyName}" ทั้งหมด ${count} ล็อตเรียบร้อยแล้ว` };
    },

    deleteSupply: function (supplyId) {
      const db = loadDB();
      const idx = db.supplies.findIndex(s => s.supplyId === supplyId);
      if (idx === -1) return { success: false, message: 'ไม่พบเวชภัณฑ์ที่ต้องการลบ' };
      db.supplies.splice(idx, 1);
      db.inventory = db.inventory.filter(l => l.supplyId !== supplyId);
      saveDB(db);
      return { success: true };
    },

    getTransactionsList: function () {
      const db = loadDB();
      return db.transactions.slice().reverse();
    },

    deleteTransaction: function (transactionId) {
      const db = loadDB();
      const idx = db.transactions.findIndex(t => t.transactionId === transactionId);
      if (idx === -1) return { success: false, message: 'ไม่พบรายการธุรกรรมนี้ในระบบ' };

      const transObj = db.transactions[idx];
      const lotIdx = db.inventory.findIndex(l => l.lotId === transObj.lotId);
      let msg = '';

      if (transObj.type === 'Receive') {
        if (lotIdx !== -1) {
          const lot = db.inventory[lotIdx];
          if (lot.quantity === lot.originalQuantity) {
            msg = `ลบประวัติการรับเข้า และถอนล็อต "${transObj.supplyName}" จำนวน ${transObj.quantity} ${transObj.unit} ออกจากคลังเรียบร้อยแล้ว`;
          } else if (lot.quantity > 0) {
            const used = lot.originalQuantity - lot.quantity;
            msg = `คำเตือน: ล็อตนี้เคยมีการเบิกไปแล้ว ${used} ${transObj.unit}! ลบยอดค้าง ${lot.quantity} ${transObj.unit} ออกจากคลังเรียบร้อยแล้ว`;
          } else {
            msg = `ล็อตนี้ถูกเบิกหมดแล้ว ทำการลบแถวล็อตและประวัติรับเข้าเรียบร้อยแล้ว`;
          }
          db.inventory.splice(lotIdx, 1);
        } else {
          msg = 'ลบประวัติการรับเข้าเรียบร้อยแล้ว';
        }
      } else if (transObj.type === 'Withdraw') {
        if (lotIdx !== -1) {
          db.inventory[lotIdx].quantity += Number(transObj.quantity);
          msg = `ยกเลิกประวัติการเบิกใช้ และคืนยอดสต็อกจำนวน ${transObj.quantity} ${transObj.unit} กลับเข้าคลังเรียบร้อยแล้ว`;
        } else {
          msg = 'ลบประวัติการเบิกใช้เรียบร้อยแล้ว (ไม่พบล็อตเดิมเพื่อคืนสต็อก)';
        }
      }

      db.transactions.splice(idx, 1);
      saveDB(db);
      return { success: true, message: msg };
    },

    updateSupplyTags: function (supplyId, tags) {
      const db = loadDB();
      const supply = db.supplies.find(s => s.supplyId === supplyId);
      if (!supply) return { success: false, message: 'ไม่พบเวชภัณฑ์ที่ต้องการแก้ไข' };
      supply.tags = (tags || '').trim();
      saveDB(db);
      return { success: true };
    },

    updateSupplyImage: function (supplyId, base64Image) {
      const db = loadDB();
      const supply = db.supplies.find(s => s.supplyId === supplyId);
      if (!supply) return { success: false, message: 'ไม่พบเวชภัณฑ์ที่ต้องการแก้ไข' };
      const newImg = (base64Image || '').trim() || '💊';
      supply.imageId = newImg;
      db.inventory.forEach(l => {
        if (l.supplyId === supplyId || l.supplyName.trim().toLowerCase() === supply.name.trim().toLowerCase()) {
          l.imageId = newImg;
        }
      });
      saveDB(db);
      return { success: true, imageId: newImg, message: `อัปเดตรูปภาพของ "${supply.name}" เรียบร้อยแล้ว` };
    }
  };

  // จำลอง google.script.run สำหรับรันแบบ Standalone Local Demo
  function createRunProxy() {
    let successHandler = null;
    let failureHandler = null;

    const proxy = {
      withSuccessHandler: function (fn) {
        successHandler = fn;
        return proxy;
      },
      withFailureHandler: function (fn) {
        failureHandler = fn;
        return proxy;
      }
    };

    Object.keys(ServerFunctions).forEach(fnName => {
      proxy[fnName] = function () {
        const args = Array.prototype.slice.call(arguments);
        setTimeout(() => {
          try {
            const result = ServerFunctions[fnName].apply(null, args);
            if (typeof successHandler === 'function') {
              successHandler(result);
            }
          } catch (err) {
            if (typeof failureHandler === 'function') {
              failureHandler(err);
            }
          }
        }, 180);
      };
    });

    return proxy;
  }

  global.google = {
    script: {
      run: new Proxy({}, {
        get: function (_target, prop) {
          const p = createRunProxy();
          return p[prop];
        }
      })
    }
  };

  global.DemoControls = {
    MOCK_SSO_USERS: MOCK_SSO_USERS,
    MOCK_ADMIN_OVERRIDE_PIN: MOCK_ADMIN_OVERRIDE_PIN,
    resetDemoData: function () {
      const seed = createInitialSeedData();
      saveDB(seed);
      return seed;
    },
    getCalendarLogs: function () {
      return loadDB().calendarLogs || [];
    }
  };
})(window);
