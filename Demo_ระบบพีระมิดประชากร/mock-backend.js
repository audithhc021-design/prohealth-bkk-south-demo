/**
 * Mock Backend สำหรับระบบ Demo: ระบบพีระมิดประชากร (Pro-Health Data BKK South)
 * จำลองการทำงานของ Google Apps Script (Code.gs) และฐานข้อมูล Google Sheets ด้วยข้อมูลสังเคราะห์
 * หมายเหตุ: ไม่มีข้อมูลจริง, ไม่มี Google Sheet ID, ไม่มี API Key หรือรหัสผ่านจริงอยู่ในไฟล์นี้
 */
(function (global) {
    'use strict';

    const STORAGE_KEY_AREA_POP = 'demo_pyramid_area_pop_v1';
    const STORAGE_KEY_AREA_NOTES = 'demo_pyramid_area_notes_v1';
    const STORAGE_KEY_WATTHANA = 'demo_pyramid_watthana_v1';

    const WATTHANA_COMMUNITIES = [
        "1.ไม่กำหนดชุมชน", "2.เฉลิมอนุสรณ์", "3.รื่นฤดี", "4.สุเหร่าบ้านดอน", "5.แจ่มจันทร์",
        "6.คลองเป้ง(ลีลานุช)", "7.หลัง สน.ทองหล่อ", "8.นวลจิตร", "9.ชวาลา", "10.ข้างสะพานคลองตัน",
        "11.เกษมสำราญ", "12.พัฒนาบ้านสามอิน", "13.ศาลาลอย", "14.หมู่บ้านพิบูลเวศม์",
        "15.มีสุวรรณ 2", "16.มีสุวรรณ 3", "17.สุเหร่าบางมะเขือ"
    ];

    const ALL_RISKS = [
        'เบาหวาน', 'ความดัน', 'โรคเก๊าท์', 'ไตวายเรื้อรัง', 'หัวใจ',
        'เส้นเลือดสมอง', 'ถุงลมโป่งพอง', 'ไขมันในเลือด', 'โรคอ้วน', 'พฤติกรรม',
        'มะเร็ง', 'โลหิตจาง', 'เส้นเลือดหัวใจและหลอดเลือด', 'โรคเครียด'
    ];

    // Deterministic PRNG (Mulberry32) เพื่อให้ข้อมูลจำลองคงที่ทุกครั้งที่เปิดทดสอบ
    function createRng(seed) {
        let a = seed >>> 0;
        return function () {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function pick(rng, arr) {
        return arr[Math.floor(rng() * arr.length)];
    }

    function getAllAgeKeys() {
        const ages = ['<1'];
        for (let i = 1; i <= 105; i++) ages.push(String(i));
        return ages;
    }

    // สร้างรูปทรงประชากรเมืองแบบ Aging Society เพื่อความสมจริง
    function generateAgeCurveCounts(rng, scaleFactor) {
        const ages = getAllAgeKeys();
        const obj = {};
        ages.forEach(ageKey => {
            const age = ageKey === '<1' ? 0 : parseInt(ageKey, 10);
            let base = 0;
            if (age <= 14) base = 10 + age * 0.4;
            else if (age <= 24) base = 16 + (age - 14) * 0.8;
            else if (age <= 49) base = 24 + Math.sin(((age - 24) / 25) * Math.PI) * 14;
            else if (age <= 69) base = 26 - (age - 50) * 0.5;
            else if (age <= 89) base = Math.max(2, 16 - (age - 70) * 0.7);
            else base = Math.max(0, 2 - (age - 90) * 0.15);

            const male = Math.max(0, Math.round(base * scaleFactor * (0.85 + rng() * 0.3)));
            const femaleBoost = age >= 60 ? 1.18 : 1.04;
            const female = Math.max(0, Math.round(base * scaleFactor * femaleBoost * (0.85 + rng() * 0.3)));
            obj[ageKey] = { male, female };
        });
        return obj;
    }

    function buildSeedAreaData() {
        const rng = createRng(256901);
        const years = ['2567', '2568', '2569'];
        const zones = ['zone1', 'zone2', 'zone3'];
        const zoneScales = { zone1: 1.0, zone2: 1.25, zone3: 0.85 };
        const population = {};

        years.forEach((y, yIdx) => {
            population[y] = {};
            zones.forEach(z => {
                population[y][z] = generateAgeCurveCounts(rng, zoneScales[z] * (0.96 + yIdx * 0.03));
            });
        });

        const notes = {
            '2567': {
                zone1: '[Demo Note] ข้อมูลฐานประชากรจำลองเขตที่ 1 ปี 2567 สำหรับการทดสอบ UI',
                zone2: '[Demo Note] เขตที่ 2 มีสัดส่วนผู้สูงอายุเพิ่มขึ้นอย่างต่อเนื่อง',
                zone3: '[Demo Note] เขตที่ 3 รวมประชากรแฝงในชุมชนเมือง'
            },
            '2568': {
                zone1: '[Demo Note] อัปเดตประชากรจำลองเขตพระโขนงเหนือ ประจำปี 2568',
                zone2: '[Demo Note] เขตคลองตันเหนือ ปรับปรุงข้อมูลจากการสำรวจชุมชน',
                zone3: '[Demo Note] เขตคลองเตยเหนือ ข้อมูลจำลองสำหรับทดสอบ Print View'
            },
            '2569': {
                zone1: '[Demo Note] ข้อมูลจำลองปีปัจจุบัน (2569) เขตที่ 1 พระโขนงเหนือ',
                zone2: '[Demo Note] ข้อมูลจำลองปีปัจจุบัน (2569) เขตที่ 2 คลองตันเหนือ',
                zone3: '[Demo Note] ข้อมูลจำลองปีปัจจุบัน (2569) เขตที่ 3 คลองเตยเหนือ'
            }
        };

        return { population, notes };
    }

    function buildSeedWatthanaData() {
        const rng = createRng(256902);
        const years = ['2568', '2569'];
        const data = {};

        years.forEach((y, yIdx) => {
            data[y] = {};
            WATTHANA_COMMUNITIES.forEach((comm, cIdx) => {
                const scale = cIdx === 0 ? 0.15 : (0.25 + ((cIdx % 5) * 0.08)) * (1 + yIdx * 0.04);
                data[y][comm] = generateAgeCurveCounts(rng, scale);
            });
        });

        return data;
    }

    function buildSeedHealthData() {
        const rng = createRng(256903);
        const years = ['2567', '2568', '2569'];
        const communities = WATTHANA_COMMUNITIES.slice(1);
        const addressTypes = ['ตามทะเบียนบ้าน', 'อาศัยอยู่จริงนอกทะเบียน', 'ประชากรแฝง'];
        const diseaseStates = ['ไม่เป็น', 'ไม่เป็น', 'ไม่เป็น', 'รับการรักษาอยู่', 'รับการรักษาไม่สม่ำเสมอ', 'เคยรักษา / กินยาเอง'];
        const strokeStates = ['ไม่เป็น', 'ไม่เป็น', 'ไม่เป็น', 'ไม่เป็น', 'โรคหลอดเลือดสมอง', 'เส้นเลือดสมองตีบ'];

        const rows = [];
        for (let i = 0; i < 420; i++) {
            const rAge = rng();
            let ageNum;
            if (rAge < 0.03) ageNum = 0;
            else if (rAge < 0.15) ageNum = Math.floor(1 + rng() * 19);
            else if (rAge < 0.55) ageNum = Math.floor(20 + rng() * 39);
            else ageNum = Math.floor(60 + rng() * 36);

            const ageStr = ageNum === 0 ? '<1' : String(ageNum);
            const gender = rng() < 0.46 ? 'ชาย' : 'หญิง';
            const isOlder = ageNum >= 50;

            const dm = isOlder && rng() < 0.35 ? pick(rng, diseaseStates.slice(3)) : (rng() < 0.12 ? pick(rng, diseaseStates) : 'ไม่เป็น');
            const ht = isOlder && rng() < 0.42 ? pick(rng, diseaseStates.slice(3)) : (rng() < 0.15 ? pick(rng, diseaseStates) : 'ไม่เป็น');
            const heart = isOlder && rng() < 0.18 ? pick(rng, diseaseStates.slice(3)) : 'ไม่เป็น';
            const lipid = isOlder && rng() < 0.32 ? pick(rng, diseaseStates.slice(3)) : 'ไม่เป็น';
            const stroke = isOlder && rng() < 0.10 ? pick(rng, strokeStates.slice(4)) : 'ไม่เป็น';

            const pickedRisks = [];
            const riskCount = Math.floor(rng() * 4);
            for (let k = 0; k < riskCount; k++) {
                const candidate = pick(rng, ALL_RISKS);
                if (!pickedRisks.includes(candidate)) pickedRisks.push(candidate);
            }

            rows.push({
                year: pick(rng, years),
                community: pick(rng, communities),
                age: ageStr,
                gender,
                addressType: pick(rng, addressTypes),
                dm,
                ht,
                heart,
                lipid,
                stroke,
                risks: pickedRisks.join(', ')
            });
        }
        return rows;
    }

    function buildSeedLtcHhcData() {
        const rng = createRng(256904);
        const zones = ['เขต 1 พระโขนงเหนือ', 'เขต 2 คลองตันเหนือ', 'เขต 3 คลองเตยเหนือ'];
        const communities = WATTHANA_COMMUNITIES.slice(1, 13);
        const commStatuses = ['ชุมชนแออัด', 'ชุมชนเมือง', 'หมู่บ้านจัดสรร'];
        const standardPrefixes = ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];
        const edgePrefixes = ['ด.ช.', 'น.ส.', '']; // ทดสอบกรณีคำนำหน้าไม่ระบุเพศใน UI
        const hhcGroups = [
            '1.กลุ่มรักษาหายขาดได้',
            '2.กลุ่มโรคเรื้อรัง',
            '3.กลุ่มโรคเรื้อรังไร้ความสามารถเล็กน้อย',
            '4.กลุ่มโรคเรื้อรังพิการรุนแรง',
            '5.กลุ่มระยะสุดท้าย',
            '6.กลุ่มเฉพาะ'
        ];
        const patientStatuses = ['รายเก่า', 'รายใหม่'];
        const visitOutcomes = ['ดีขึ้น', 'คงเดิม', 'แย่ลง', 'เสียชีวิต', 'ย้ายที่อยู่', ''];

        const records = [];
        for (let i = 0; i < 120; i++) {
            const isUnspecifiedCase = i % 24 === 0; // 5 รายสำหรับแสดง Alert box ทดสอบ UX
            const prefix = isUnspecifiedCase ? pick(rng, edgePrefixes) : pick(rng, standardPrefixes);
            const isChildPrefix = prefix === 'เด็กชาย' || prefix === 'เด็กหญิง' || prefix === 'ด.ช.';
            const age = isChildPrefix ? String(Math.floor(2 + rng() * 12)) : String(Math.floor(55 + rng() * 42));
            const adl = String(Math.floor(rng() * 21));

            const hasMulti = rng() < 0.65;
            const multidisciplinaryRaw = hasMulti
                ? ['เยี่ยม', rng() < 0.5 ? 'กายภาพ' : '', rng() < 0.3 ? 'โภชนาการ' : '-', '', '', '']
                : ['', '-', '0', '', '', ''];

            const modeRoll = rng();
            let ltcBillable = '';
            let ltcNonBillable = '';
            let hhc = '';
            if (modeRoll < 0.38) {
                ltcBillable = String(Math.floor(1 + rng() * 4));
            } else if (modeRoll < 0.62) {
                ltcNonBillable = String(Math.floor(1 + rng() * 4));
            } else {
                hhc = pick(rng, hhcGroups);
            }

            const visitsRaw = [];
            for (let v = 0; v < 13; v++) {
                visitsRaw.push(v < 4 ? pick(rng, visitOutcomes) : '');
            }

            records.push({
                nurse: `พยาบาลจำลอง ${(i % 8) + 1}`,
                multidisciplinaryRaw,
                zone: pick(rng, zones),
                community: pick(rng, communities),
                communityStatus: pick(rng, commStatuses),
                prefix,
                age,
                adl,
                ltcBillable,
                ltcNonBillable,
                hhc,
                patientStatus: pick(rng, patientStatuses),
                visitsRaw
            });
        }
        return records;
    }

    function readJson(key, fallbackBuilder) {
        try {
            const raw = global.localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('localStorage read failed, using in-memory seed:', e);
        }
        const seed = fallbackBuilder();
        try {
            global.localStorage.setItem(key, JSON.stringify(seed));
        } catch (e) {
            // ignore quota errors
        }
        return seed;
    }

    function writeJson(key, value) {
        try {
            global.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage write failed:', e);
        }
    }

    const HEALTH_DATA_SEED = buildSeedHealthData();
    const LTC_HHC_DATA_SEED = buildSeedLtcHhcData();

    function simulateLatency(fn) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(fn()), 180);
        });
    }

    global.DemoBackend = {
        DEMO_ADMIN_PASS: 'demo-admin',

        getHealthData: function () {
            return simulateLatency(() => HEALTH_DATA_SEED);
        },

        getAreaData: function () {
            return simulateLatency(() => {
                const seed = buildSeedAreaData();
                const population = readJson(STORAGE_KEY_AREA_POP, () => seed.population);
                const notes = readJson(STORAGE_KEY_AREA_NOTES, () => seed.notes);
                return { population, notes };
            });
        },

        setupAreaSheet: function (year) {
            return simulateLatency(() => {
                const seed = buildSeedAreaData();
                const population = readJson(STORAGE_KEY_AREA_POP, () => seed.population);
                const notes = readJson(STORAGE_KEY_AREA_NOTES, () => seed.notes);
                const y = String(year);
                let created = false;
                if (!population[y]) {
                    population[y] = { zone1: {}, zone2: {}, zone3: {} };
                    created = true;
                }
                if (!notes[y]) notes[y] = {};
                const ages = getAllAgeKeys();
                ['zone1', 'zone2', 'zone3'].forEach(z => {
                    if (!population[y][z] || Object.keys(population[y][z]).length === 0) {
                        population[y][z] = {};
                        ages.forEach(a => { population[y][z][a] = { male: 0, female: 0 }; });
                        created = true;
                    }
                });
                writeJson(STORAGE_KEY_AREA_POP, population);
                writeJson(STORAGE_KEY_AREA_NOTES, notes);
                return created
                    ? `[Demo] สร้างโครงสร้างพื้นที่รับผิดชอบปี พ.ศ. ${y} เรียบร้อย (บันทึกในเบราว์เซอร์)`
                    : `[Demo] มีโครงสร้างพื้นที่รับผิดชอบปี พ.ศ. ${y} อยู่แล้ว`;
            });
        },

        saveAreaDataWithNote: function (year, zone, dataObj, noteText) {
            return simulateLatency(() => {
                const seed = buildSeedAreaData();
                const population = readJson(STORAGE_KEY_AREA_POP, () => seed.population);
                const notes = readJson(STORAGE_KEY_AREA_NOTES, () => seed.notes);
                const y = String(year);
                if (!population[y]) population[y] = { zone1: {}, zone2: {}, zone3: {} };
                if (!population[y][zone]) population[y][zone] = {};
                Object.keys(dataObj).forEach(age => {
                    population[y][zone][age] = {
                        male: parseInt(dataObj[age].male, 10) || 0,
                        female: parseInt(dataObj[age].female, 10) || 0
                    };
                });
                if (!notes[y]) notes[y] = {};
                notes[y][zone] = noteText || '';
                writeJson(STORAGE_KEY_AREA_POP, population);
                writeJson(STORAGE_KEY_AREA_NOTES, notes);
                return true;
            });
        },

        getWatthanaData: function () {
            return simulateLatency(() => readJson(STORAGE_KEY_WATTHANA, buildSeedWatthanaData));
        },

        setupWatthanaSheet: function (year) {
            return simulateLatency(() => {
                const watthana = readJson(STORAGE_KEY_WATTHANA, buildSeedWatthanaData);
                const y = String(year);
                let created = false;
                if (!watthana[y]) {
                    watthana[y] = {};
                    created = true;
                }
                const ages = getAllAgeKeys();
                WATTHANA_COMMUNITIES.forEach(comm => {
                    if (!watthana[y][comm] || Object.keys(watthana[y][comm]).length === 0) {
                        watthana[y][comm] = {};
                        ages.forEach(a => { watthana[y][comm][a] = { male: 0, female: 0 }; });
                        created = true;
                    }
                });
                writeJson(STORAGE_KEY_WATTHANA, watthana);
                return created
                    ? `[Demo] สร้างโครงสร้างเขตวัฒนาปี พ.ศ. ${y} เรียบร้อย (บันทึกในเบราว์เซอร์)`
                    : `[Demo] มีโครงสร้างเขตวัฒนาปี พ.ศ. ${y} อยู่แล้ว`;
            });
        },

        saveWatthanaData: function (year, comm, dataObj) {
            return simulateLatency(() => {
                const watthana = readJson(STORAGE_KEY_WATTHANA, buildSeedWatthanaData);
                const y = String(year);
                if (!watthana[y]) watthana[y] = {};
                if (!watthana[y][comm]) watthana[y][comm] = {};
                Object.keys(dataObj).forEach(age => {
                    watthana[y][comm][age] = {
                        male: parseInt(dataObj[age].male, 10) || 0,
                        female: parseInt(dataObj[age].female, 10) || 0
                    };
                });
                writeJson(STORAGE_KEY_WATTHANA, watthana);
                return true;
            });
        },

        getLtcHhcData: function () {
            return simulateLatency(() => LTC_HHC_DATA_SEED);
        },

        resetDemoData: function () {
            try {
                global.localStorage.removeItem(STORAGE_KEY_AREA_POP);
                global.localStorage.removeItem(STORAGE_KEY_AREA_NOTES);
                global.localStorage.removeItem(STORAGE_KEY_WATTHANA);
            } catch (e) {
                console.warn('localStorage clear failed:', e);
            }
            return true;
        }
    };
})(window);
