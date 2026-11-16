/**
 * TeamConnect21 (SeVaNa21) - Demo Mock-up Seed Data
 * -------------------------------------------------------------------------
 * ไฟล์นี้บรรจุข้อมูลจำลอง (Mock Data) สำหรับการทดสอบ UX/UI และนำเสนอระบบเท่านั้น
 * - ไม่มี API Key, Token, URL, Google Drive/Sheet ID หรือบัญชีผู้ใช้งานจริง
 * - รหัสผ่านและบัญชีทั้งหมดเป็นข้อมูลสมมติสำหรับโหมด Demo Offline Sandbox
 */

(function (global) {
    // สร้างรูปภาพ SVG Data URI จำลอง (ไม่ต้องเชื่อมต่ออินเทอร์เน็ตหรือ External URL)
    function makeSvgDataUrl(title, subtitle, bg1, bg2, emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${bg1}"/>
                    <stop offset="100%" stop-color="${bg2}"/>
                </linearGradient>
            </defs>
            <rect width="480" height="320" rx="18" fill="url(#g)"/>
            <circle cx="410" cy="60" r="70" fill="rgba(255,255,255,0.12)"/>
            <circle cx="70" cy="270" r="90" fill="rgba(255,255,255,0.10)"/>
            <text x="240" y="130" font-size="64" text-anchor="middle" font-family="sans-serif">${emoji}</text>
            <text x="240" y="200" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${title}</text>
            <text x="240" y="236" font-size="15" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="sans-serif">${subtitle}</text>
            <rect x="165" y="262" width="150" height="26" rx="13" fill="rgba(15,23,42,0.28)"/>
            <text x="240" y="280" font-size="12" fill="#ffffff" text-anchor="middle" font-family="sans-serif">DEMO MOCK IMAGE</text>
        </svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    function makeStickerDataUrl(label, bgColor, emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
            <rect x="8" y="8" width="144" height="144" rx="32" fill="${bgColor}" stroke="#ffffff" stroke-width="6"/>
            <text x="80" y="88" font-size="56" text-anchor="middle" font-family="sans-serif">${emoji}</text>
            <rect x="20" y="108" width="120" height="28" rx="14" fill="rgba(255,255,255,0.92)"/>
            <text x="80" y="127" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle" font-family="sans-serif">${label}</text>
        </svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // สร้างไฟล์เสียง WAV จำลองแบบสังเคราะห์ (4 วินาที ความถี่นุ่มนวล) เพื่อให้ปุ่มเล่นข้อความเสียงใช้งานได้จริงแบบ Offline
    function makeMockWavDataUrl(freq = 523.25, durationSec = 4) {
        const sampleRate = 8000;
        const numSamples = sampleRate * durationSec;
        const buffer = new ArrayBuffer(44 + numSamples);
        const view = new DataView(buffer);

        function writeStr(offset, str) {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        }

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + numSamples, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate, true);
        view.setUint16(32, 1, true);
        view.setUint16(34, 8, true);
        writeStr(36, 'data');
        view.setUint32(40, numSamples, true);

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const env = Math.sin(Math.PI * (t / durationSec));
            const tone = Math.sin(2 * Math.PI * freq * t) * 0.25 * env;
            const sample = Math.max(0, Math.min(255, Math.floor((tone + 1) * 127.5)));
            view.setUint8(44 + i, sample);
        }

        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return 'data:audio/wav;base64,' + btoa(binary);
    }

    const SEVANA_DEPARTMENTS = [
        "คลินิกOPD", "เวชระเบียน", "การเงิน", "แผนกเภสัช", "ธุรการศูนย์", "ธุรการภาค",
        "ผู้อำนวยการศูนย์", "คลินิกสัตวแพทย์", "ประชาสัมพันธ์", "คลินิกชันสูตรโรค",
        "คลินิกกายภาพบำบัด", "คลินิกวัณโรค", "คลินิกรักปลอดภัย", "สังคมสงเคราะห์",
        "คลินิกก้าวใหม่พลัส", "คลินิกทันตกรรม", "คลินิกสุขภาพจิต", "หัวหน้าพยาบาล",
        "อนามัยชุมชน", "อนามัยโรงเรียน", "ขนส่ง"
    ];

    // บัญชีทดสอบจำลอง (Mock Accounts สำหรับเข้าสู่ระบบ Demo เท่านั้น)
    const DEMO_ACCOUNTS = [
        {
            username: "demo_opd",
            pin: "123456",
            roleLabel: "พยาบาลคลินิก OPD (บัญชีหลักแนะนำ)",
            ssoDisplayName: "พว.สมใจ ใจดี (Demo)"
        },
        {
            username: "demo_nurse",
            pin: "123456",
            roleLabel: "หัวหน้าพยาบาล",
            ssoDisplayName: "พว.วิภา รักษาสุข (Demo)"
        },
        {
            username: "demo_pharma",
            pin: "123456",
            roleLabel: "เภสัชกรประจำศูนย์",
            ssoDisplayName: "ภก.ธนกร ปรุงยา (Demo)"
        },
        {
            username: "demo_admin",
            pin: "123456",
            roleLabel: "ธุรการศูนย์ / ผู้ประสานงาน IT",
            ssoDisplayName: "นายปิติ ธุรการ (Demo)"
        }
    ];

    const now = Date.now();
    const min = 60 * 1000;
    const hr = 60 * min;

    const MOCK_IMAGES = {
        opdQueue: makeSvgDataUrl("สรุปคิวตรวจ OPD เช้า", "ข้อมูลจำลอง: ผู้รับบริการ 42 ราย • รอตรวจ 6 ราย", "#059669", "#10b981", "🏥"),
        schoolVisit: makeSvgDataUrl("แผนลงพื้นที่อนามัยโรงเรียน", "กำหนดการตรวจสุขภาพนักเรียน ประจำสัปดาห์", "#2563eb", "#0ea5e9", "🏫"),
        drugStock: makeSvgDataUrl("รายงานคลังเวชภัณฑ์", "รายการยาคงคลังพร้อมจ่ายประจำวัน", "#7c3aed", "#6366f1", "💊")
    };

    const MOCK_AUDIO_1 = makeMockWavDataUrl(523.25, 4);
    const MOCK_AUDIO_2 = makeMockWavDataUrl(659.25, 3);

    function createInitialDemoState() {
        return {
            users: {
                demo_opd: {
                    uid: "mock-uid-opd-001",
                    username: "demo_opd",
                    pin: "123456",
                    fullname: "พว.สมใจ ใจดี (Demo)",
                    nickname: "สมใจ OPD",
                    department: "คลินิกOPD",
                    position: "พยาบาลวิชาชีพชำนาญการ",
                    lineid: "demo_opd_line",
                    mobile: "080-000-0001",
                    office_phone: "02-000-0101",
                    icon: "👩‍⚕️",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "green",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 30 * 24 * hr
                },
                demo_nurse: {
                    uid: "mock-uid-nurse-002",
                    username: "demo_nurse",
                    pin: "123456",
                    fullname: "พว.วิภา รักษาสุข (Demo)",
                    nickname: "หัวหน้าวิภา",
                    department: "หัวหน้าพยาบาล",
                    position: "หัวหน้ากลุ่มการพยาบาล",
                    lineid: "demo_nurse_line",
                    mobile: "080-000-0002",
                    office_phone: "02-000-0102",
                    icon: "🩺",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "blue",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "supervisor",
                    createdAt: now - 30 * 24 * hr
                },
                demo_pharma: {
                    uid: "mock-uid-pharma-003",
                    username: "demo_pharma",
                    pin: "123456",
                    fullname: "ภก.ธนกร ปรุงยา (Demo)",
                    nickname: "เภสัชธนกร",
                    department: "แผนกเภสัช",
                    position: "เภสัชกรปฏิบัติการ",
                    lineid: "demo_pharma_line",
                    mobile: "080-000-0003",
                    office_phone: "02-000-0103",
                    icon: "💊",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "green",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 25 * 24 * hr
                },
                demo_admin: {
                    uid: "mock-uid-admin-004",
                    username: "demo_admin",
                    pin: "123456",
                    fullname: "นายปิติ ธุรการ (Demo)",
                    nickname: "ปิติ ธุรการ",
                    department: "ธุรการศูนย์",
                    position: "นักจัดการงานทั่วไป",
                    lineid: "demo_admin_line",
                    mobile: "080-000-0004",
                    office_phone: "02-000-0104",
                    icon: "🗂️",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "black",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "admin",
                    createdAt: now - 40 * 24 * hr
                },
                demo_school: {
                    uid: "mock-uid-school-005",
                    username: "demo_school",
                    pin: "123456",
                    fullname: "นางสาวนภา อนามัย (Demo)",
                    nickname: "นภา โรงเรียน",
                    department: "อนามัยโรงเรียน",
                    position: "นักวิชาการสาธารณสุข",
                    lineid: "demo_school_line",
                    mobile: "080-000-0005",
                    office_phone: "02-000-0105",
                    icon: "🏫",
                    profile_url: "",
                    status: "ออกนอกศูนย์",
                    themeColor: "orange",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 20 * 24 * hr
                },
                demo_mrec: {
                    uid: "mock-uid-mrec-006",
                    username: "demo_mrec",
                    pin: "123456",
                    fullname: "นายเอก เวชระเบียน (Demo)",
                    nickname: "เอก เวชระเบียน",
                    department: "เวชระเบียน",
                    position: "เจ้าพนักงานเวชสถิติ",
                    lineid: "demo_mrec_line",
                    mobile: "080-000-0006",
                    office_phone: "02-000-0106",
                    icon: "📋",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "green",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 20 * 24 * hr
                },
                demo_lab: {
                    uid: "mock-uid-lab-007",
                    username: "demo_lab",
                    pin: "123456",
                    fullname: "ทนพ.กานดา ตรวจแล็บ (Demo)",
                    nickname: "กานดา ชันสูตร",
                    department: "คลินิกชันสูตรโรค",
                    position: "นักเทคนิคการแพทย์",
                    lineid: "demo_lab_line",
                    mobile: "080-000-0007",
                    office_phone: "02-000-0107",
                    icon: "🔬",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "blue",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 18 * 24 * hr
                },
                demo_dent: {
                    uid: "mock-uid-dent-008",
                    username: "demo_dent",
                    pin: "123456",
                    fullname: "ทพญ.ลลิตา ยิ้มสวย (Demo)",
                    nickname: "หมอลลิตา",
                    department: "คลินิกทันตกรรม",
                    position: "ทันตแพทย์ชำนาญการ",
                    lineid: "demo_dent_line",
                    mobile: "080-000-0008",
                    office_phone: "02-000-0108",
                    icon: "🦷",
                    profile_url: "",
                    status: "ลาหยุด",
                    themeColor: "pink",
                    focusMode: true,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 15 * 24 * hr
                },
                demo_comm: {
                    uid: "mock-uid-comm-009",
                    username: "demo_comm",
                    pin: "123456",
                    fullname: "นายวรุต ชุมชน (Demo)",
                    nickname: "วรุต ชุมชน",
                    department: "อนามัยชุมชน",
                    position: "พยาบาลเยี่ยมบ้าน",
                    lineid: "demo_comm_line",
                    mobile: "080-000-0009",
                    office_phone: "02-000-0109",
                    icon: "🚑",
                    profile_url: "",
                    status: "ออกนอกศูนย์",
                    themeColor: "green",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "user",
                    createdAt: now - 12 * 24 * hr
                },
                demo_dir: {
                    uid: "mock-uid-dir-010",
                    username: "demo_dir",
                    pin: "123456",
                    fullname: "พญ.อรุณี บริหาร (Demo)",
                    nickname: "ผอ.อรุณี",
                    department: "ผู้อำนวยการศูนย์",
                    position: "ผู้อำนวยการศูนย์บริการสาธารณสุข 21",
                    lineid: "demo_dir_line",
                    mobile: "080-000-0010",
                    office_phone: "02-000-0100",
                    icon: "⭐",
                    profile_url: "",
                    status: "ออนไลน์",
                    themeColor: "black",
                    focusMode: false,
                    e2eeEnabled: true,
                    role: "director",
                    createdAt: now - 60 * 24 * hr
                }
            },

            rooms: {
                Group_210101: {
                    name: "ประสานงานบริการประจำวัน ศบส.21",
                    code: "210101",
                    icon: "🏥",
                    groupImageUrl: "",
                    members: {
                        demo_opd: true,
                        demo_nurse: true,
                        demo_pharma: true,
                        demo_admin: true,
                        demo_mrec: true,
                        demo_lab: true,
                        demo_dir: true
                    }
                },
                school_health: {
                    name: "อนามัยโรงเรียน & แจ้งเตือนอัตโนมัติ",
                    code: "210202",
                    icon: "🏫",
                    groupImageUrl: "",
                    members: {
                        demo_opd: true,
                        demo_nurse: true,
                        demo_admin: true,
                        demo_school: true,
                        demo_comm: true
                    }
                },
                Group_210303: {
                    name: "คลินิกเภสัช & คลังยา",
                    code: "210303",
                    icon: "💊",
                    groupImageUrl: "",
                    members: {
                        demo_opd: true,
                        demo_pharma: true,
                        demo_nurse: true
                    }
                }
            },

            userChats: {
                demo_opd: {
                    Group_210101: {
                        roomId: "Group_210101",
                        type: "group",
                        roomName: "ประสานงานบริการประจำวัน ศบส.21",
                        lastMessage: "หัวหน้าวิภา: วันนี้คลินิก OPD ยอดผู้รับบริการช่วงเช้าเรียบร้อยดีค่ะ",
                        timestamp: now - 8 * min,
                        unread: false,
                        pinned: true,
                        muted: false,
                        hidden: false
                    },
                    school_health: {
                        roomId: "school_health",
                        type: "group",
                        roomName: "อนามัยโรงเรียน & แจ้งเตือนอัตโนมัติ",
                        lastMessage: "🤖 บอทอนามัยโรงเรียน: แจ้งเตือนแผนลงตรวจสุขภาพนักเรียนวันนี้",
                        timestamp: now - 22 * min,
                        unread: true,
                        pinned: false,
                        muted: false,
                        hidden: false
                    },
                    DM_demo_opd_demo_pharma: {
                        roomId: "DM_demo_opd_demo_pharma",
                        type: "dm",
                        targetUsername: "demo_pharma",
                        lastMessage: "🔒 ได้ส่งข้อความใหม่",
                        timestamp: now - 45 * min,
                        unread: true,
                        pinned: false,
                        muted: false,
                        hidden: false
                    },
                    Group_210303: {
                        roomId: "Group_210303",
                        type: "group",
                        roomName: "คลินิกเภสัช & คลังยา",
                        lastMessage: "เภสัชธนกร: [รูปภาพ] รายงานคลังเวชภัณฑ์ประจำวัน",
                        timestamp: now - 3 * hr,
                        unread: false,
                        pinned: false,
                        muted: false,
                        hidden: false
                    }
                }
            },

            messages: {
                Group_210101: {
                    msg_g1_01: {
                        text: "สวัสดีตอนเช้าทุกแผนกค่ะ วันนี้คลินิก OPD เปิดรับคิวตามปกติ 08:00 น. นะคะ",
                        senderUsername: "demo_nurse",
                        senderNickname: "หัวหน้าวิภา",
                        timestamp: now - 26 * hr,
                        e2ee: true
                    },
                    msg_g1_02: {
                        text: "รับทราบครับ เวชระเบียนเปิดระบบลงทะเบียนคิวแล้วครับ",
                        senderUsername: "demo_mrec",
                        senderNickname: "เอก เวชระเบียน",
                        timestamp: now - 25 * hr,
                        e2ee: true
                    },
                    msg_g1_03: {
                        text: "[รูปภาพ] สรุปคิวตรวจ OPD เช้า.png",
                        messageType: "image",
                        fileName: "สรุปคิวตรวจ_OPD_เช้า.png",
                        fileType: "image/png",
                        fileSize: 184320,
                        fileUrl: MOCK_IMAGES.opdQueue,
                        storageType: "drive",
                        senderUsername: "demo_opd",
                        senderNickname: "สมใจ OPD",
                        timestamp: now - 4 * hr,
                        e2ee: true
                    },
                    msg_g1_04: {
                        text: "[ไฟล์] แบบฟอร์มสรุปรายงานประจำวัน_ศบส21.pdf",
                        messageType: "file",
                        fileName: "แบบฟอร์มสรุปรายงานประจำวัน_ศบส21.pdf",
                        fileType: "application/pdf",
                        fileSize: 425984,
                        fileUrl: "#demo-file-opd-report",
                        storageType: "drive",
                        senderUsername: "demo_admin",
                        senderNickname: "ปิติ ธุรการ",
                        timestamp: now - 2 * hr,
                        e2ee: true
                    },
                    msg_g1_05: {
                        text: "ส่งข้อความเสียงสรุปเคสเร่งด่วนช่วงเช้าให้แล้วนะคะ",
                        messageType: "voice",
                        type: "voice",
                        audioUrl: MOCK_AUDIO_1,
                        duration: 4,
                        mimeType: "audio/wav",
                        senderUsername: "demo_nurse",
                        senderNickname: "หัวหน้าวิภา",
                        timestamp: now - 35 * min,
                        expiresAt: now + 7.5 * hr
                    },
                    msg_g1_06: {
                        text: "ขอบคุณค่ะหัวหน้า เช็กไฟล์และฟังเสียงเรียบร้อยแล้วค่ะ",
                        senderUsername: "demo_opd",
                        senderNickname: "สมใจ OPD",
                        timestamp: now - 12 * min,
                        e2ee: true,
                        replyTo: {
                            id: "msg_g1_05",
                            senderNickname: "หัวหน้าวิภา",
                            text: "🎙️ ข้อความเสียง (4 วิ)"
                        }
                    },
                    msg_g1_07: {
                        text: "วันนี้คลินิก OPD ยอดผู้รับบริการช่วงเช้าเรียบร้อยดีค่ะ",
                        senderUsername: "demo_nurse",
                        senderNickname: "หัวหน้าวิภา",
                        timestamp: now - 8 * min,
                        e2ee: true
                    }
                },

                school_health: {
                    msg_sh_01: {
                        text: "วันนี้ทีมอนามัยโรงเรียนออกหน่วยตรวจสุขภาพนักเรียนรอบเช้า 09:00 น. นะคะ",
                        senderUsername: "demo_school",
                        senderNickname: "นภา โรงเรียน",
                        timestamp: now - 3 * hr,
                        e2ee: true
                    },
                    msg_sh_02: {
                        text: "[รูปภาพ] แผนลงพื้นที่อนามัยโรงเรียน.png",
                        messageType: "image",
                        fileName: "แผนลงพื้นที่อนามัยโรงเรียน.png",
                        fileType: "image/png",
                        fileSize: 215040,
                        fileUrl: MOCK_IMAGES.schoolVisit,
                        storageType: "drive",
                        senderUsername: "demo_school",
                        senderNickname: "นภา โรงเรียน",
                        timestamp: now - 2.5 * hr,
                        e2ee: true
                    },
                    msg_sh_03: {
                        text: "📅 แจ้งเตือนปฏิทินงานประจำวัน (Sandbox Bot)\n• 09:00 น. ลงพื้นที่โรงเรียนตัวอย่าง A (ตรวจสายตา/ทันตกรรม)\n• 13:30 น. สรุปข้อมูลลงระบบรายงานภายใน",
                        senderUsername: "bot_school_health",
                        senderNickname: "🤖 บอทอนามัยโรงเรียน",
                        timestamp: now - 22 * min,
                        messageType: "bot",
                        isBot: true,
                        actionUrl: "https://demo-sandbox.local/school-health-calendar",
                        actionText: "เปิดดูปฏิทินงาน (Demo) 🔗"
                    }
                },

                DM_demo_opd_demo_pharma: {
                    msg_dm_01: {
                        text: "รบกวนสอบถามครับ เภสัชมีรายการยาแก้แพ้ล็อตใหม่เข้าคลังหรือยังครับ?",
                        senderUsername: "demo_opd",
                        senderNickname: "สมใจ OPD",
                        timestamp: now - 65 * min,
                        e2ee: true
                    },
                    msg_dm_02: {
                        text: "เข้าคลังเรียบร้อยแล้วครับ สามารถเบิกจ่ายที่ห้องยาได้เลย",
                        senderUsername: "demo_pharma",
                        senderNickname: "เภสัชธนกร",
                        timestamp: now - 50 * min,
                        e2ee: true
                    },
                    msg_dm_03: {
                        text: "หากมีเคสต้องการคำแนะนำการใช้ยา แจ้งในห้องนี้ได้เลยนะครับ",
                        senderUsername: "demo_pharma",
                        senderNickname: "เภสัชธนกร",
                        timestamp: now - 45 * min,
                        e2ee: true
                    }
                },

                Group_210303: {
                    msg_ph_01: {
                        text: "[รูปภาพ] รายงานคลังเวชภัณฑ์.png",
                        messageType: "image",
                        fileName: "รายงานคลังเวชภัณฑ์.png",
                        fileType: "image/png",
                        fileSize: 196608,
                        fileUrl: MOCK_IMAGES.drugStock,
                        storageType: "drive",
                        senderUsername: "demo_pharma",
                        senderNickname: "เภสัชธนกร",
                        timestamp: now - 3 * hr,
                        e2ee: true
                    }
                }
            },

            voiceMessages: {
                Group_210101: {
                    msg_g1_05: {
                        id: "msg_g1_05",
                        messageType: "voice",
                        type: "voice",
                        audioUrl: MOCK_AUDIO_1,
                        duration: 4,
                        mimeType: "audio/wav",
                        senderUsername: "demo_nurse",
                        senderNickname: "หัวหน้าวิภา",
                        senderAvatar: "",
                        timestamp: now - 35 * min,
                        expiresAt: now + 7.5 * hr
                    },
                    voice_g1_demo2: {
                        id: "voice_g1_demo2",
                        messageType: "voice",
                        type: "voice",
                        audioUrl: MOCK_AUDIO_2,
                        duration: 3,
                        mimeType: "audio/wav",
                        senderUsername: "demo_admin",
                        senderNickname: "ปิติ ธุรการ",
                        senderAvatar: "",
                        timestamp: now - 90 * min,
                        expiresAt: now + 6.5 * hr
                    }
                }
            },

            stickers: {
                stk_01: { name: "รับทราบ", url: makeStickerDataUrl("รับทราบค่ะ", "#10b981", "👍") },
                stk_02: { name: "ขอบคุณ", url: makeStickerDataUrl("ขอบคุณครับ", "#3b82f6", "🙏") },
                stk_03: { name: "สู้ๆ", url: makeStickerDataUrl("สู้ๆ นะคะ", "#f59e0b", "💪") },
                stk_04: { name: "เรียบร้อย", url: makeStickerDataUrl("เรียบร้อย!", "#059669", "✅") },
                stk_05: { name: "ด่วน", url: makeStickerDataUrl("เคสด่วน!", "#ef4444", "🚨") },
                stk_06: { name: "พักทานข้าว", url: makeStickerDataUrl("พักกลางวัน", "#8b5cf6", "🍱") }
            }
        };
    }

    global.SEVANA_DEMO_DATA = {
        DEPARTMENTS: SEVANA_DEPARTMENTS,
        ACCOUNTS: DEMO_ACCOUNTS,
        MOCK_CONFIG: {
            BOT_WEBHOOK_ENDPOINT: "https://<PROJECT_REGION>-<PROJECT_ID>.cloudfunctions.net/sendBotMessage",
            BOT_API_KEY_DEMO: "DEMO_MOCK_BOT_KEY_ONLY",
            BOT_ADMIN_PASS_DEMO: "demo_admin",
            STICKER_ADMIN_PASS_DEMO: "demo_sticker"
        },
        createInitialState: createInitialDemoState,
        makeStickerDataUrl: makeStickerDataUrl,
        makeMockWavDataUrl: makeMockWavDataUrl
    };
})(window);
