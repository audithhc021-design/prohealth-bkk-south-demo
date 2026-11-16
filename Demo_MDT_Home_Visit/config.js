// ==========================================================================
// DEMO MOCK-UP CONFIGURATION (Sanitized for UX Audit & Presentation)
// โหมดจำลอง (Mockup Mode) — ไม่มี API Key, URL จริง หรือ Credentials ของระบบ Production
// ระบบจะใช้ฐานข้อมูลจำลองในเครื่อง (LocalStorage) อัตโนมัติเพื่อให้ทดลองใช้งานได้ทันที
// ==========================================================================

const firebaseConfig = {
  apiKey: "",
  authDomain: "demo-mockup.example.invalid",
  databaseURL: "",
  projectId: "demo-mockup-project",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// ปิดการเชื่อมต่อ Firebase จริงในโหมด Demo เพื่อให้ทำงานแบบ Offline/LocalStorage Mock DB
const IS_FIREBASE_CONFIGURED = false;

// ปิดการเชื่อมต่อ Apps Script Uploader จริงในโหมด Demo (ภาพที่แนบจะจำลองเก็บเป็น Base64 ใน LocalStorage)
const DRIVE_UPLOADER_URL = "";
const IS_DRIVE_UPLOADER_CONFIGURED = false;

// Flag แจ้งสถานะโหมดสาธิต
const IS_DEMO_MODE = true;

// ส่งออก Config ออกไปใช้งาน
window.firebaseConfig = firebaseConfig;
window.IS_FIREBASE_CONFIGURED = IS_FIREBASE_CONFIGURED;
window.DRIVE_UPLOADER_URL = DRIVE_UPLOADER_URL;
window.IS_DRIVE_UPLOADER_CONFIGURED = IS_DRIVE_UPLOADER_CONFIGURED;
window.IS_DEMO_MODE = IS_DEMO_MODE;
