/**
 * ============================================================================
 * Pro-Health Data BKK South — Standalone Mock Backend (Demo Sandbox)
 * ----------------------------------------------------------------------------
 * จำลองการทำงานของ Google Apps Script (Code.gs), Google Sheets และ Google Drive
 * ทำงานแบบ 100% Client-side (localStorage) สำหรับให้ทีม UX / IT / ผู้บริหาร ทดลองใช้งาน
 * หมายเหตุ: ข้อมูลทั้งหมดในไฟล์นี้เป็นข้อมูลจำลอง (Synthetic Mock Data) ไม่มีข้อมูลจริง
 * ============================================================================
 */

(function (global) {
  const STORAGE_KEY = "prohealth_demo_db_v1";

  const DATA_HEADERS = [
    "id", "fiscalYear", "idCard", "recorder", "prefix", "firstName", "lastName",
    "screeningType", "community", "screeningDate", "birthDate", "age", "ageRange",
    "over60", "gender", "phone", "bloodGroup", "occupation", "religion",
    "addressType", "healthPrivilege", "treatmentHistory", "status", "address",
    "education", "houseType", "yearsLiving", "occupants", "residenceType",
    "income", "incomeRange", "financialStatus",
    "pet_dog", "pet_cat", "pet_squirrel", "pet_fish", "pet_bird", "pet_turtle", "pet_chicken", "pet_sterilized",
    "diseaseVector", "vector_rat", "vector_mos", "vector_cock", "vector_fly", "vector_snake",
    "weight", "height", "bmi", "bmiResult", "bp", "bpResult", "waist", "waistResult",
    "waistCount", "dtxNpo", "npoResult", "dtxPost", "postResult", "cvd", "cvdResult",
    "gm_heartDeath", "gm_history", "gm_dm", "gm_ht", "gm_gout", "gm_kidney", "gm_stroke",
    "gm_heart", "gm_lipid", "gm_emphysema", "gm_cancer", "gm_thalassemia", "gm_g6pd", "gm_colorBlind",
    "gm_other", "gm_otherDetail",
    "ud_dm", "ud_ht", "ud_liver", "ud_stroke", "ud_heart", "ud_lipid", "ud_foot", "ud_other", "ud_otherDetail",
    "symptom_birthWeight", "symptom_thirst", "symptom_nocturia", "symptom_weightLoss", "symptom_fatigue",
    "symptom_soreMouth", "symptom_itchy", "symptom_blurryVision", "symptom_numbness", "symptom_respiratory",
    "allergyMed", "allergyMedDetail", "allergyMedSymptom",
    "allergyFood", "allergyFoodDetail", "allergyFoodSymptom",
    "fluVaccine", "dentalCheck", "treatmentBehavior",
    "communityActivity", "activityDetail", "disabled", "disabledReg",
    "smoking", "drinking", "exercise",
    "tasteHasPreference", "taste_sweet", "taste_fat", "taste_salty", "breakfast",
    "cervicalCancer", "breastCancer", "annualCheck",
    "satisfaction", "suggestion",
    "cholesterolCheck", "cholesterolResult",
    "eval2Q", "eval9Q", "evalST5", "scoreADL", "evalADL",
    "selfReliance", "disabilityStatus", "hasDisabilityCard", "disabilityType", "caregiverStatus", "caregiverPhone",
    "riskSummary", "opinion", "updated_at"
  ];

  const DEFAULT_COMMUNITIES = [
    "มาชิม", "นวลจิตเหนือ", "ศาลาลอย", "ชวาลา", "เฉลิมอนุสรณ์", "แจ่มจันทร์", "แสงเงิน", "หลัง ส.น.ทองหล่อ",
    "มีสุวรรณ 2", "สุเหร่าบ้านดอน", "สุเหร่าบางมะเขือ", "สน.พระโขนง", "รื่นฤดี", "มีสุวรรณ 3", "นวลน้อย",
    "ข้างสะพานคลองตัน", "กองแก้ว", "นวลจิตใต้", "สุเหร่าสามอิน", "อสส.", "คลินิกสุขภาพจิต", "ตลาดพระโขนง",
    "เจ้าหน้าที่สำนักงานเขตวัฒนา", "วัดธาตุทอง", "ศูนย์นันทนาการวัดธาตุทอง", "บิ๊กซีอ่อนนุช", "บิ๊กซีเอกมัย",
    "โรงเรียนเกษมพิทยา", "ใต้สะพานพระโขนง", "หมู่บ้านเกษมสำราญ", "วินจักรยานยนต์"
  ];

  const DEFAULT_SCREENING_TYPES = ["คัดกรองล้านคน", "แสกน", "จุดคัดกรอง"];

  // บัญชีจำลองสำหรับทดสอบระบบ (Mock-up Demo Accounts Only — ไม่ใช่บัญชีใช้งานจริง)
  const MOCK_ACCOUNTS = [
    {
      id: "demo-usr-001",
      username: "admin_demo",
      password: "DemoPass@2026",
      role: "แอดมิน",
      name: "นายสมชาย ใจดี (Demo Admin)",
      position: "ผู้ดูแลระบบ (Admin Demo)",
      status: "Active"
    },
    {
      id: "demo-usr-002",
      username: "staff_demo",
      password: "Staff@2026",
      role: "user",
      name: "น.ส.สุภาวดี มีสุข (Demo Staff)",
      position: "เจ้าหน้าที่คัดกรอง (Demo)",
      status: "Active"
    },
    {
      id: "demo-usr-003",
      username: "nurse_demo",
      password: "Nurse@2026",
      role: "user",
      name: "นางวิไลลักษณ์ สุขภาพดี (Demo Nurse)",
      position: "พยาบาลวิชาชีพ (Demo)",
      status: "Active"
    }
  ];

  /**
   * สร้างภาพกราฟคลื่นหัวใจ EKG จำลองในรูปแบบ SVG Data URL (ทำงานออฟไลน์ 100%)
   */
  function generateMockEKGDataUrl(idCard, dateStr, topic, isAbnormal) {
    const strokeColor = isAbnormal ? "#b91c1c" : "#15803d";
    const statusText = isAbnormal ? "ABNORMAL RHYTHM (DEMO)" : "NORMAL SINUS RHYTHM (DEMO)";
    let pathD = "M 20 140";
    for (let x = 20; x < 740; x += 90) {
      if (isAbnormal && x % 180 === 20) {
        // จำลองจังหวะคลื่นผิดปกติ (ST elevation / irregular beat)
        pathD += ` L ${x + 12} 140 Q ${x + 18} 126 ${x + 24} 140 L ${x + 30} 140 L ${x + 34} 158 L ${x + 42} 45 L ${x + 50} 175 L ${x + 58} 112 Q ${x + 70} 102 ${x + 82} 140`;
      } else {
        // จำลอง P-QRS-T ปกติ
        pathD += ` L ${x + 14} 140 Q ${x + 20} 128 ${x + 26} 140 L ${x + 34} 140 L ${x + 38} 152 L ${x + 44} 58 L ${x + 50} 164 L ${x + 55} 140 Q ${x + 67} 120 ${x + 79} 140 L ${x + 90} 140`;
      }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="280" viewBox="0 0 780 280">
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fecaca" stroke-width="0.6"/>
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)"/>
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f87171" stroke-width="1.1"/>
        </pattern>
      </defs>
      <rect width="780" height="280" fill="#fff5f5"/>
      <rect width="780" height="280" fill="url(#grid)"/>
      <rect x="12" y="10" width="756" height="44" rx="6" fill="rgba(255,255,255,0.9)" stroke="#fca5a5"/>
      <text x="24" y="29" font-family="monospace" font-size="13" font-weight="bold" fill="#1e293b">MOCK EKG STRIP | ID: ${idCard} | DATE: ${dateStr}</text>
      <text x="24" y="46" font-family="sans-serif" font-size="11" fill="#475569">Topic: ${topic} — 25 mm/s | 10 mm/mV (Demo Simulation)</text>
      <text x="754" y="29" text-anchor="end" font-family="monospace" font-size="12" font-weight="bold" fill="${strokeColor}">${statusText}</text>
      <path d="${pathD}" fill="none" stroke="#0f172a" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M 20 220 L 40 220 L 48 205 L 54 240 L 60 190 L 66 225 L 85 220 L 120 220" fill="none" stroke="#334155" stroke-width="1.6" opacity="0.65"/>
      <text x="24" y="264" font-family="monospace" font-size="11" fill="#64748b">Lead II (Simulated Waveform for UX/IT Audit Only)</text>
    </svg>`;

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function makeBaseRecord(overrides) {
    const rec = {};
    DATA_HEADERS.forEach(h => { rec[h] = ""; });
    Object.assign(rec, {
      fiscalYear: "2569",
      recorder: "น.ส.สุภาวดี มีสุข (Demo Staff)",
      screeningType: "จุดคัดกรอง",
      bloodGroup: "ไม่ทราบ",
      religion: "พุทธ",
      addressType: "กทม.ในเขตวัฒนา",
      status: "สมรส/คู่",
      education: "มัธยมศึกษาตอนปลาย/ปวช.",
      houseType: "ทาวเฮ้าส์",
      residenceType: "ของตนเอง",
      financialStatus: "เพียงพอ",
      pet_dog: "0", pet_cat: "0", pet_squirrel: "0", pet_fish: "0",
      pet_bird: "0", pet_turtle: "0", pet_chicken: "0", pet_sterilized: "0",
      diseaseVector: "ไม่มี",
      gm_heartDeath: "ไม่ใช่",
      gm_history: "ไม่มีโรคประจำตัว/โรคที่ถ่ายทอดทางพันธุกรรม",
      gm_dm: "ไม่มี", gm_ht: "ไม่มี", gm_gout: "ไม่มี", gm_kidney: "ไม่มี",
      gm_stroke: "ไม่มี", gm_heart: "ไม่มี", gm_lipid: "ไม่มี", gm_emphysema: "ไม่มี",
      gm_cancer: "ไม่มี", gm_thalassemia: "ไม่มี", gm_g6pd: "ไม่มี", gm_colorBlind: "ไม่มี", gm_other: "ไม่มี",
      ud_dm: "ไม่มี", ud_ht: "ไม่มี", ud_liver: "ไม่มี", ud_stroke: "ไม่มี",
      ud_heart: "ไม่มี", ud_lipid: "ไม่มี", ud_foot: "ไม่มี", ud_other: "ไม่มี",
      symptom_birthWeight: "ไม่มี", symptom_thirst: "ไม่มี", symptom_nocturia: "ไม่มี",
      symptom_weightLoss: "ไม่มี", symptom_fatigue: "ไม่มี", symptom_soreMouth: "ไม่มี",
      symptom_itchy: "ไม่มี", symptom_blurryVision: "ไม่มี", symptom_numbness: "ไม่มี", symptom_respiratory: "ไม่มี",
      allergyMed: "ไม่แพ้", allergyFood: "ไม่แพ้",
      fluVaccine: "ฉีด", dentalCheck: "ตรวจ", treatmentBehavior: "รักษาที่ศูนย์บริการสาธารณสุข",
      communityActivity: "เคยเข้าร่วมกิจกรรม/แก้ไขปัญหาชุมชน",
      disabled: "ไม่เป็นผู้พิการ",
      smoking: "ไม่สูบบุหรี่", drinking: "ไม่ดื่ม", exercise: "ออกกำลังกายสัปดาห์ละ3ครั้ง",
      taste_sweet: "ไม่ชอบ", taste_fat: "ไม่ชอบ", taste_salty: "ไม่ชอบ", tasteHasPreference: "ไม่มี",
      breakfast: "กิน", cervicalCancer: "ไม่ตรวจ", breastCancer: "ไม่ตรวจ", annualCheck: "ตรวจ",
      satisfaction: "พึงพอใจมาก",
      cholesterolCheck: "ไม่ตรวจ", cholesterolResult: "",
      eval2Q: "ไม่เสี่ยง", eval9Q: "ไม่ตรวจ", evalST5: "0-4",
      scoreADL: "", evalADL: "",
      selfReliance: "ช่วยเหลือตนเองได้ดี",
      disabilityStatus: "ไม่มีความพิการ",
      hasDisabilityCard: "",
      disabilityType: "ไม่มีความพิการ",
      caregiverStatus: "ไม่มี",
      caregiverPhone: "",
      riskSummary: "",
      opinion: "ปกติ",
      updated_at: "2026-03-10"
    }, overrides);
    return rec;
  }

  const SEED_RECORDS = [
    // ผู้รับบริการรายที่ 1: มีประวัติคัดกรอง 2 รอบ + มี EKG (1100100000001)
    makeBaseRecord({
      id: "rec-demo-001",
      fiscalYear: "2568",
      idCard: "1100100000001",
      prefix: "นาย", firstName: "สมศักดิ์", lastName: "รักสุขภาพ",
      community: "วัดธาตุทอง", screeningType: "คัดกรองล้านคน",
      screeningDate: "2025-08-15", birthDate: "15/04/2518", age: "51", ageRange: "35-59 ปี", over60: "ไม่ใช่",
      gender: "ชาย", phone: "0811110001", bloodGroup: "O", occupation: "ค้าขาย",
      healthPrivilege: "UC/ศบส.21/ร.พ.ตำรวจ", address: "99/1 ซ.สุขุมวิท 63 (ข้อมูลจำลอง)",
      yearsLiving: "15", occupants: "4", income: "18000", incomeRange: "15,001-20,000บาท",
      pet_dog: "1",
      weight: "76", height: "170", bmi: "26.30", bmiResult: "อ้วน1",
      bp: "136/86", bpResult: "PreHT", waist: "92", waistResult: "เกิน", waistCount: "2",
      dtxNpo: "108", npoResult: "IFG", cvd: "8.5", cvdResult: "เสี่ยงน้อย",
      exercise: "ออกกำลังกายสัปดาห์ละน้อยกว่า3วัน",
      taste_salty: "ชอบ", tasteHasPreference: "มี",
      cholesterolCheck: "ตรวจ", cholesterolResult: "Cholesterrol สูง",
      riskSummary: "โรคอ้วน,ความดัน,เบาหวาน,พฤติกรรม,ไตวายเรื้อรัง",
      opinion: "เสี่ยง",
      updated_at: "2025-08-15"
    }),
    makeBaseRecord({
      id: "rec-demo-002",
      fiscalYear: "2569",
      idCard: "1100100000001",
      prefix: "นาย", firstName: "สมศักดิ์", lastName: "รักสุขภาพ",
      community: "วัดธาตุทอง", screeningType: "จุดคัดกรอง",
      screeningDate: "2026-03-10", birthDate: "15/04/2518", age: "51", ageRange: "35-59 ปี", over60: "ไม่ใช่",
      gender: "ชาย", phone: "0811110001", bloodGroup: "O", occupation: "ค้าขาย",
      healthPrivilege: "UC/ศบส.21/ร.พ.ตำรวจ", address: "99/1 ซ.สุขุมวิท 63 (ข้อมูลจำลอง)",
      yearsLiving: "16", occupants: "4", income: "19000", incomeRange: "15,001-20,000บาท",
      pet_dog: "1",
      weight: "70", height: "170", bmi: "24.22", bmiResult: "ท้วม",
      bp: "124/80", bpResult: "PreHT", waist: "88", waistResult: "ปกติ", waistCount: "1",
      dtxNpo: "96", npoResult: "ปกติ", cvd: "6.2", cvdResult: "เสี่ยงน้อย",
      exercise: "ออกกำลังกายสัปดาห์ละ3ครั้ง",
      taste_salty: "ไม่ชอบ", tasteHasPreference: "ไม่มี",
      cholesterolCheck: "ตรวจ", cholesterolResult: "ปกติ",
      riskSummary: "ความดัน",
      opinion: "เสี่ยง",
      updated_at: "2026-03-10"
    }),

    // ผู้รับบริการรายที่ 2: ผู้สูงอายุ >60 ปี มีโรคประจำตัว (ป่วย) + ADL + Immobility + มี 2 รอบ + EKG (1100100000002)
    makeBaseRecord({
      id: "rec-demo-003",
      fiscalYear: "2568",
      idCard: "1100100000002",
      prefix: "นาง", firstName: "สมหญิง", lastName: "ใจสะอาด",
      community: "สุเหร่าบ้านดอน", screeningType: "แสกน",
      screeningDate: "2025-07-20", birthDate: "10/06/2499", age: "70", ageRange: ">60 ปี", over60: "ใช่",
      gender: "หญิง", phone: "0822220002", bloodGroup: "A", occupation: "เกษียณ",
      healthPrivilege: "บัตรทอง/ผู้พิการ", address: "12/8 ชุมชนสุเหร่าบ้านดอน (ข้อมูลจำลอง)",
      yearsLiving: "30", occupants: "3", income: "8500", incomeRange: "5,000-10,000บาท",
      weight: "62", height: "155", bmi: "25.81", bmiResult: "อ้วน1",
      bp: "148/92", bpResult: "Stage1", waist: "85", waistResult: "เกิน", waistCount: "4",
      dtxNpo: "138", npoResult: "DM", cvd: "18.5", cvdResult: "ปานกลาง",
      gm_history: "มีโรคประจำตัว/โรคที่ถ่ายทอดทางพันธุกรรม", gm_dm: "มี", gm_ht: "มี",
      ud_dm: "รับการรักษาอยู่", ud_ht: "รับการรักษาอยู่",
      eval2Q: "เสี่ยง", eval9Q: "7-12", evalST5: "5-7",
      scoreADL: "10", evalADL: "กลุ่มติดบ้าน",
      selfReliance: "ช่วยเหลือตนเองได้บางส่วน",
      disabilityStatus: "มีความพิการ", hasDisabilityCard: "มีบัตรผู้พิการ",
      disabilityType: "ความพิการทางการเคลื่อนไหวหรือทางร่างกาย",
      disabled: "3. พิการทางการเคลื่อนไหวหรือทางร่างกาย", disabledReg: "ขึ้นทะเบียนเป็นผู้พิการ",
      caregiverStatus: "มีลูก/หลาน", caregiverPhone: "0899990002",
      riskSummary: "",
      opinion: "ป่วย",
      updated_at: "2025-07-20"
    }),
    makeBaseRecord({
      id: "rec-demo-004",
      fiscalYear: "2569",
      idCard: "1100100000002",
      prefix: "นาง", firstName: "สมหญิง", lastName: "ใจสะอาด",
      community: "สุเหร่าบ้านดอน", screeningType: "จุดคัดกรอง",
      screeningDate: "2026-02-18", birthDate: "10/06/2499", age: "70", ageRange: ">60 ปี", over60: "ใช่",
      gender: "หญิง", phone: "0822220002", bloodGroup: "A", occupation: "เกษียณ",
      healthPrivilege: "บัตรทอง/ผู้พิการ", address: "12/8 ชุมชนสุเหร่าบ้านดอน (ข้อมูลจำลอง)",
      yearsLiving: "31", occupants: "3", income: "8500", incomeRange: "5,000-10,000บาท",
      weight: "60", height: "155", bmi: "24.97", bmiResult: "ท้วม",
      bp: "138/88", bpResult: "PreHT", waist: "83", waistResult: "เกิน", waistCount: "4",
      dtxNpo: "124", npoResult: "IFG", cvd: "16.2", cvdResult: "ปานกลาง",
      gm_history: "มีโรคประจำตัว/โรคที่ถ่ายทอดทางพันธุกรรม", gm_dm: "มี", gm_ht: "มี",
      ud_dm: "รับการรักษาอยู่", ud_ht: "รับการรักษาอยู่",
      eval2Q: "ไม่เสี่ยง", eval9Q: "ไม่ตรวจ", evalST5: "0-4",
      scoreADL: "11", evalADL: "กลุ่มติดบ้าน",
      selfReliance: "ช่วยเหลือตนเองได้บางส่วน",
      disabilityStatus: "มีความพิการ", hasDisabilityCard: "มีบัตรผู้พิการ",
      disabilityType: "ความพิการทางการเคลื่อนไหวหรือทางร่างกาย",
      disabled: "3. พิการทางการเคลื่อนไหวหรือทางร่างกาย", disabledReg: "ขึ้นทะเบียนเป็นผู้พิการ",
      caregiverStatus: "มีลูก/หลาน", caregiverPhone: "0899990002",
      riskSummary: "",
      opinion: "ป่วย",
      updated_at: "2026-02-18"
    }),

    // ผู้รับบริการรายที่ 3: ปกติ (1100100000003)
    makeBaseRecord({
      id: "rec-demo-005",
      fiscalYear: "2569",
      idCard: "1100100000003",
      prefix: "นาย", firstName: "กิตติพงษ์", lastName: "แข็งแรง",
      community: "นวลจิตเหนือ", screeningType: "คัดกรองล้านคน",
      screeningDate: "2026-01-22", birthDate: "20/09/2535", age: "34", ageRange: "21-34 ปี", over60: "ไม่ใช่",
      gender: "ชาย", phone: "0833330003", bloodGroup: "B", occupation: "พนักงานเอกชน",
      healthPrivilege: "ประกันสังคม", address: "45/3 ซ.เอกมัย 12 (ข้อมูลจำลอง)",
      yearsLiving: "8", occupants: "2", income: "25000", incomeRange: "มากกว่า20,000บาท",
      financialStatus: "เหลือเก็บ",
      weight: "66", height: "173", bmi: "22.05", bmiResult: "ปกติ",
      bp: "114/74", bpResult: "ปกติ", waist: "80", waistResult: "ปกติ", waistCount: "1",
      dtxNpo: "88", npoResult: "ปกติ", cvd: "2.1", cvdResult: "เสี่ยงน้อย",
      exercise: "ออกกำลังกายทุกวัน",
      cholesterolCheck: "ตรวจ", cholesterolResult: "ปกติ",
      riskSummary: "",
      opinion: "ปกติ",
      updated_at: "2026-01-22"
    }),

    // ผู้รับบริการรายที่ 4: เสี่ยงหลายด้าน (1100100000004)
    makeBaseRecord({
      id: "rec-demo-006",
      fiscalYear: "2569",
      idCard: "1100100000004",
      prefix: "นางสาว", firstName: "นภาพร", lastName: "สุขใจ",
      community: "มีสุวรรณ 2", screeningType: "จุดคัดกรอง",
      screeningDate: "2026-03-01", birthDate: "05/11/2525", age: "44", ageRange: "35-59 ปี", over60: "ไม่ใช่",
      gender: "หญิง", phone: "0844440004", bloodGroup: "AB", occupation: "ธุรกิจส่วนตัว",
      healthPrivilege: "บัตรทอง", address: "78/2 ซ.ปรีดีพนมยงค์ (ข้อมูลจำลอง)",
      yearsLiving: "12", occupants: "5", income: "14000", incomeRange: "10,001-15,000บาท",
      pet_cat: "2", diseaseVector: "มี", vector_mos: "ยุง",
      weight: "72", height: "160", bmi: "28.13", bmiResult: "อ้วน1",
      bp: "132/86", bpResult: "PreHT", waist: "89", waistResult: "เกิน", waistCount: "4",
      dtxPost: "152", postResult: "IFG", cvd: "11.4", cvdResult: "ปานกลาง",
      symptom_fatigue: "มี",
      exercise: "ไม่ออกกำลังกาย",
      taste_sweet: "ชอบ", taste_fat: "ชอบ", tasteHasPreference: "มี",
      eval2Q: "เสี่ยง", evalST5: "8-9",
      riskSummary: "โรคอ้วน,ความดัน,เบาหวาน,หัวใจ,เส้นเลือดหัวใจและหลอดเลือด,พฤติกรรม,ไขมันในเลือด,โรคเครียด",
      opinion: "เสี่ยง",
      updated_at: "2026-03-01"
    }),

    // ผู้รับบริการรายที่ 5: ป่วย + มี EKG (1100100000005)
    makeBaseRecord({
      id: "rec-demo-007",
      fiscalYear: "2569",
      idCard: "1100100000005",
      prefix: "นาย", firstName: "วีระชัย", lastName: "มั่นคง",
      community: "ตลาดพระโขนง", screeningType: "คัดกรองล้านคน",
      screeningDate: "2026-03-12", birthDate: "12/02/2506", age: "63", ageRange: ">60 ปี", over60: "ใช่",
      gender: "ชาย", phone: "0855550005", bloodGroup: "O", occupation: "รับจ้าง/ลูกจ้าง",
      healthPrivilege: "UC/ศบส.21/ร.พ.กลาง", address: "21/4 ตลาดพระโขนง (ข้อมูลจำลอง)",
      yearsLiving: "22", occupants: "2", income: "9500", incomeRange: "5,000-10,000บาท",
      weight: "74", height: "168", bmi: "26.22", bmiResult: "อ้วน1",
      bp: "162/98", bpResult: "Stage2", waist: "94", waistResult: "เกิน", waistCount: "2",
      dtxNpo: "145", npoResult: "DM", cvd: "24.0", cvdResult: "สูง",
      ud_ht: "รับการรักษาไม่สม่ำเสมอ", ud_lipid: "รับการรักษาอยู่",
      smoking: "สูบเลิกแล้ว",
      scoreADL: "18", evalADL: "กลุ่มติดสังคม",
      riskSummary: "",
      opinion: "ป่วย",
      updated_at: "2026-03-12"
    })
  ];

  const SEED_EKG = [
    {
      id: "ekg-demo-001",
      idCard: "1100100000001",
      topic: "ตรวจหัวใจชุมชนวัดธาตุทอง 2568",
      fileName: "CM_1100100000001_20250815091500",
      fileId: "mock-ekg-1",
      date: "2025-08-15",
      time: "09:15:00",
      fiscalYear: "2568",
      status: "ปกติ",
      recorder: "น.ส.สุภาวดี มีสุข (Demo Staff)",
      created_at: "2025-08-15",
      isAbnormal: false
    },
    {
      id: "ekg-demo-002",
      idCard: "1100100000001",
      topic: "ติดตามผล EKG เชิงรุก 2569",
      fileName: "CM_1100100000001_20260310103020",
      fileId: "mock-ekg-2",
      date: "2026-03-10",
      time: "10:30:20",
      fiscalYear: "2569",
      status: "รอแปลผล",
      recorder: "น.ส.สุภาวดี มีสุข (Demo Staff)",
      created_at: "2026-03-10",
      isAbnormal: false
    },
    {
      id: "ekg-demo-003",
      idCard: "1100100000002",
      topic: "คัดกรองผู้สูงอายุสุเหร่าบ้านดอน 2568",
      fileName: "CM_1100100000002_20250720084510",
      fileId: "mock-ekg-3",
      date: "2025-07-20",
      time: "08:45:10",
      fiscalYear: "2568",
      status: "ผิดปกติ",
      recorder: "นางวิไลลักษณ์ สุขภาพดี (Demo Nurse)",
      created_at: "2025-07-20",
      isAbnormal: true
    },
    {
      id: "ekg-demo-004",
      idCard: "1100100000002",
      topic: "ติดตามผล EKG เชิงรุก 2569",
      fileName: "CM_1100100000002_20260218112000",
      fileId: "mock-ekg-4",
      date: "2026-02-18",
      time: "11:20:00",
      fiscalYear: "2569",
      status: "ผิดปกติ",
      recorder: "นางวิไลลักษณ์ สุขภาพดี (Demo Nurse)",
      created_at: "2026-02-18",
      isAbnormal: true
    },
    {
      id: "ekg-demo-005",
      idCard: "1100100000005",
      topic: "ตรวจหัวใจกลุ่มเสี่ยงตลาดพระโขนง 2569",
      fileName: "CM_1100100000005_20260312140533",
      fileId: "mock-ekg-5",
      date: "2026-03-12",
      time: "14:05:33",
      fiscalYear: "2569",
      status: "รอแปลผล",
      recorder: "น.ส.สุภาวดี มีสุข (Demo Staff)",
      created_at: "2026-03-12",
      isAbnormal: true
    }
  ];

  function createInitialDB() {
    return {
      users: JSON.parse(JSON.stringify(MOCK_ACCOUNTS)),
      userSSO: [
        {
          id: "sso-demo-1",
          username: "staff_demo",
          name: "น.ส.สุภาวดี มีสุข (Demo Staff)",
          position: "เจ้าหน้าที่คัดกรอง (Demo)",
          role: "user",
          lastLogin: "2026-03-12 08:30:00"
        }
      ],
      options: {
        community: [...DEFAULT_COMMUNITIES],
        screeningType: [...DEFAULT_SCREENING_TYPES]
      },
      data: JSON.parse(JSON.stringify(SEED_RECORDS)),
      ekg: JSON.parse(JSON.stringify(SEED_EKG))
    };
  }

  function loadDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.data) && Array.isArray(parsed.ekg)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("MockDB load fallback:", e);
    }
    const fresh = createInitialDB();
    saveDB(fresh);
    return fresh;
  }

  function saveDB(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn("MockDB save warning:", e);
    }
  }

  function resetDemoDB() {
    const fresh = createInitialDB();
    saveDB(fresh);
    return fresh;
  }

  function resolveRecordOpinion(rec) {
    const savedOp = String(rec.opinion || "").trim();
    if (savedOp === "ปกติ" || savedOp === "เสี่ยง" || savedOp === "ป่วย") return savedOp;

    const udKeys = ["ud_dm", "ud_ht", "ud_liver", "ud_stroke", "ud_heart", "ud_lipid", "ud_foot", "ud_other"];
    const hasUD = udKeys.some(k => {
      const v = String(rec[k] || "").trim();
      return v !== "" && v !== "ไม่มี" && v !== "ไม่เคยตรวจ";
    });
    if (hasUD) return "ป่วย";
    if (String(rec.riskSummary || "").trim()) return "เสี่ยง";
    return "ปกติ";
  }

  function matchesFilter(rec, filter) {
    if (!filter) return true;
    const val = (k) => String(rec[k] || "").trim().toLowerCase();

    if (filter.fiscalYear && val("fiscalYear") !== String(filter.fiscalYear).trim().toLowerCase()) return false;
    if (filter.idCard && !val("idCard").includes(String(filter.idCard).trim().toLowerCase())) return false;

    if (filter.dateStart || filter.dateEnd) {
      const dStr = val("screeningDate");
      if (dStr) {
        const d = new Date(dStr);
        if (filter.dateStart && d < new Date(filter.dateStart)) return false;
        if (filter.dateEnd && d > new Date(filter.dateEnd)) return false;
      }
    }

    const petFields = ["pet_dog", "pet_cat", "pet_squirrel", "pet_fish", "pet_bird", "pet_turtle", "pet_chicken", "pet_sterilized"];
    for (const pet of petFields) {
      if (filter[pet] === "มี") {
        if (parseFloat(val(pet)) <= 0 || isNaN(parseFloat(val(pet)))) return false;
      } else if (filter[pet] === "ไม่มี") {
        if (parseFloat(val(pet)) > 0) return false;
      }
    }

    const vecFields = ["vector_rat", "vector_mos", "vector_cock", "vector_fly", "vector_snake"];
    for (const vec of vecFields) {
      if (filter[vec] === "มี") { if (!val(vec)) return false; }
      else if (filter[vec] === "ไม่มี") { if (val(vec)) return false; }
    }

    const cholMap = {
      filter_chol_normal: "ปกติ",
      filter_chol_abnormal: "ผิดปกติ",
      filter_chol_wait: "รอผลlab",
      filter_chol_high: "cholester",
      filter_chol_tri_high: "triglyceride สูง",
      filter_chol_hdl_high: "hdl-chol สูง",
      filter_chol_tri_low: "triglyceride ต่ำ",
      filter_chol_hdl_low: "hdl-chol ต่ำ"
    };
    for (const [key, keyword] of Object.entries(cholMap)) {
      if (filter[key] === "มี") { if (!val("cholesterolResult").includes(keyword)) return false; }
      else if (filter[key] === "ไม่มี") { if (val("cholesterolResult").includes(keyword)) return false; }
    }

    if (filter.opinion && filter.opinion !== "ทั้งหมด" && filter.opinion !== "") {
      if (resolveRecordOpinion(rec) !== String(filter.opinion).trim()) return false;
    }

    if (filter.riskSummary) {
      const reqArr = filter.riskSummary.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const rowVal = val("riskSummary");
      if (reqArr.length > 0 && !reqArr.some(v => rowVal.includes(v))) return false;
    }

    const ignoreKeys = new Set([
      "countMode", "fiscalYear", "idCard", "dateStart", "dateEnd",
      ...petFields, ...vecFields, ...Object.keys(cholMap), "riskSummary", "opinion"
    ]);
    const partialKeys = new Set([
      "firstName", "lastName", "recorder", "activityDetail", "riskOther",
      "suggestion", "allergyMedDetail", "allergyFoodDetail", "gm_otherDetail", "ud_otherDetail"
    ]);

    for (const [key, filterVal] of Object.entries(filter)) {
      if (!filterVal || filterVal === "ทั้งหมด" || ignoreKeys.has(key)) continue;
      const cellVal = val(key);
      const target = String(filterVal).trim().toLowerCase();
      if (partialKeys.has(key)) {
        if (!cellVal.includes(target)) return false;
      } else {
        if (cellVal !== target) return false;
      }
    }
    return true;
  }

  // --- Mock Server Endpoints (1:1 mapping กับ Code.gs) ---
  const MockBackend = {
    MOCK_ACCOUNTS,
    DATA_HEADERS,
    resetDemoDB,
    generateMockEKGDataUrl,

    loginDemoAccount(username, password) {
      const db = loadDB();
      const found = db.users.find(
        u => u.username.toLowerCase() === String(username || "").trim().toLowerCase() &&
             u.password === String(password || "").trim() &&
             u.status === "Active"
      );
      if (!found) {
        return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านจำลองไม่ถูกต้อง (ลองใช้ admin_demo / DemoPass@2026)" };
      }
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
      const ssoIdx = db.userSSO.findIndex(x => x.username === found.username);
      if (ssoIdx >= 0) {
        db.userSSO[ssoIdx].lastLogin = nowStr;
      } else {
        db.userSSO.push({
          id: "sso-" + Date.now(),
          username: found.username,
          name: found.name,
          position: found.position,
          role: found.role,
          lastLogin: nowStr
        });
      }
      saveDB(db);
      return {
        success: true,
        user: {
          id: found.id,
          username: found.username,
          displayName: found.name,
          name: found.name,
          position: found.position,
          role: found.role
        }
      };
    },

    verifySSOCode(code) {
      // จำลองการแลก One-Time Code จาก 21PASS SSO
      const account = MOCK_ACCOUNTS.find(a => a.username === code) || MOCK_ACCOUNTS[1];
      return this.loginDemoAccount(account.username, account.password);
    },

    getOptions() {
      const db = loadDB();
      const recorders = [...new Set(db.data.map(r => r.recorder).filter(Boolean))];
      return {
        Communities: [...db.options.community],
        ScreeningTypes: [...db.options.screeningType],
        Recorders: recorders
      };
    },

    addOption(category, value) {
      const db = loadDB();
      const val = String(value || "").trim();
      const cat = String(category || "").trim();
      if (!cat || !val) return { success: false, msg: "กรุณาระบุข้อมูลให้ครบถ้วน" };
      if (!db.options[cat]) db.options[cat] = [];
      if (db.options[cat].some(x => x.toLowerCase() === val.toLowerCase())) {
        return { success: false, msg: '"' + val + '" มีอยู่ในรายการแล้ว' };
      }
      db.options[cat].push(val);
      saveDB(db);
      return { success: true, options: this.getOptions() };
    },

    deleteOption(category, value) {
      const db = loadDB();
      const val = String(value || "").trim();
      const cat = String(category || "").trim();
      if (!db.options[cat]) return { success: false, msg: "ไม่พบหมวดหมู่" };
      const idx = db.options[cat].indexOf(val);
      if (idx === -1) return { success: false, msg: 'ไม่พบ "' + val + '" ในระบบ' };
      db.options[cat].splice(idx, 1);
      saveDB(db);
      return { success: true, options: this.getOptions() };
    },

    getDashboardStats(filter) {
      const db = loadDB();
      let filtered = db.data.filter(rec => matchesFilter(rec, filter));

      if (filter && (filter.countMode === "unique" || filter.distinctPatient === true)) {
        const grouped = {};
        filtered.forEach(rec => {
          const cleanId = String(rec.idCard || "").replace(/[\s\-'"]/g, "").trim();
          const key = cleanId || rec.id;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(rec);
        });
        filtered = Object.values(grouped).map(rows => {
          if (rows.length === 1) return rows[0];
          rows.sort((a, b) => new Date(a.screeningDate || 0) - new Date(b.screeningDate || 0));
          return rows[rows.length - 1];
        });
      }

      const stats = { total: filtered.length, normal: 0, risk: 0, sick: 0, gender: {}, ageRange: {}, topRisk: {}, topUD: {} };
      const all15Risks = [
        "เบาหวาน", "ความดัน", "โรคเกาท์", "ไตวายเรื้อรัง", "หัวใจ",
        "เส้นเลือดสมอง", "ถุงลมโป่งพอง", "ไขมันในเลือด", "โรคอ้วน", "พฤติกรรม",
        "มะเร็ง", "โลหิตจาง", "เส้นเลือดหัวใจและหลอดเลือด", "โรคเครียด", "อื่นๆ"
      ];
      all15Risks.forEach(k => { stats.topRisk[k] = 0; });

      const udMap = {
        "เบาหวาน": "ud_dm", "ความดัน": "ud_ht", "โรคตับ": "ud_liver",
        "อัมพาต": "ud_stroke", "หัวใจ": "ud_heart", "ไขมัน": "ud_lipid",
        "แผลเท้า": "ud_foot", "อื่นๆ": "ud_other"
      };

      filtered.forEach(r => {
        const op = resolveRecordOpinion(r);
        if (op === "ปกติ") stats.normal++;
        else if (op === "เสี่ยง") stats.risk++;
        else if (op === "ป่วย") stats.sick++;

        const g = r.gender || "ไม่ระบุ";
        stats.gender[g] = (stats.gender[g] || 0) + 1;

        const a = r.ageRange || "ไม่ระบุ";
        stats.ageRange[a] = (stats.ageRange[a] || 0) + 1;

        if (r.riskSummary) {
          r.riskSummary.split(",").forEach(x => {
            const raw = x.trim();
            if (!raw) return;
            const k = raw.startsWith("อื่นๆ") ? "อื่นๆ" : raw;
            if (all15Risks.includes(k)) {
              stats.topRisk[k] = (stats.topRisk[k] || 0) + 1;
            }
          });
        }

        for (const [label, field] of Object.entries(udMap)) {
          const v = r[field];
          if (v && v !== "ไม่มี" && v !== "ไม่เคยตรวจ") {
            stats.topUD[label] = (stats.topUD[label] || 0) + 1;
          }
        }
      });

      stats.topRisk = Object.entries(stats.topRisk).sort((a, b) => b[1] - a[1]);
      stats.topUD = Object.entries(stats.topUD).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return stats;
    },

    searchData(filter) {
      const db = loadDB();
      const filtered = db.data.filter(rec => matchesFilter(rec, filter));
      return [...filtered].reverse().slice(0, 50).map(r => {
        const copy = Object.assign({}, r);
        copy.opinion = resolveRecordOpinion(copy);
        return copy;
      });
    },

    checkIdCard(id) {
      const db = loadDB();
      const clean = v => String(v || "").replace(/[\s\-'"]/g, "").trim();
      const targetId = clean(id);
      if (!targetId) return { found: false, hasEKG: false, records: [] };

      const matches = db.data.filter(r => clean(r.idCard) === targetId);
      const hasEKG = db.ekg.some(e => clean(e.idCard) === targetId);

      if (matches.length > 0) {
        matches.sort((a, b) => new Date(a.screeningDate || 0) - new Date(b.screeningDate || 0));
        const records = matches.map((r, idx) => {
          const obj = Object.assign({}, r);
          obj.opinion = resolveRecordOpinion(obj);
          obj.roundIndex = idx + 1;
          return obj;
        });
        const latest = records[records.length - 1];
        return { found: true, data: latest, latestData: latest, records, hasEKG };
      }
      return { found: false, hasEKG, records: [] };
    },

    saveData(form, userObj) {
      const db = loadDB();
      if (!form.fiscalYear || String(form.fiscalYear).trim() === "") {
        const d = form.screeningDate ? new Date(form.screeningDate) : new Date();
        const thaiYear = d.getFullYear() + 543;
        form.fiscalYear = (d.getMonth() >= 9 ? thaiYear + 1 : thaiYear).toString();
      }
      if (userObj && userObj.name) {
        form.recorder = userObj.name;
      }
      const nowDate = new Date().toISOString().substring(0, 10);
      const cleanRec = makeBaseRecord(Object.assign({}, form, { updated_at: nowDate }));

      if (form.id) {
        const idx = db.data.findIndex(r => r.id === form.id);
        if (idx > -1) {
          db.data[idx] = cleanRec;
          saveDB(db);
          return { success: true, msg: "[Demo Sandbox] อัปเดตข้อมูลสำเร็จ (ผู้บันทึกล่าสุด: " + cleanRec.recorder + ")" };
        }
      }
      cleanRec.id = "rec-demo-" + Date.now();
      db.data.push(cleanRec);
      saveDB(db);
      return { success: true, msg: "[Demo Sandbox] บันทึกข้อมูลจำลองสำเร็จ (ปีงบประมาณ " + cleanRec.fiscalYear + ")" };
    },

    deleteDataDirect(id, userObj) {
      if (!userObj || userObj.role === "guest" || userObj.isGuest) {
        return { success: false, msg: "คุณไม่มีสิทธิ์ลบข้อมูลนี้" };
      }
      const db = loadDB();
      const idx = db.data.findIndex(r => r.id === id);
      if (idx > -1) {
        db.data.splice(idx, 1);
        saveDB(db);
        return { success: true, msg: "[Demo Sandbox] ลบข้อมูลจำลองสำเร็จ" };
      }
      return { success: false, msg: "ไม่พบข้อมูล" };
    },

    getAdminData() {
      const db = loadDB();
      return {
        users: db.users.map(u => [u.id, u.username, "***", u.role, u.name, u.status]),
        ssoLogs: db.userSSO
      };
    },

    adminAction(pass, type, id, action) {
      const db = loadDB();
      const admin = db.users.find(u => u.role === "แอดมิน" && u.password === String(pass || "").trim());
      if (!admin) return { success: false, msg: "รหัสผ่านแอดมินจำลองไม่ถูกต้อง (ใช้ DemoPass@2026)" };
      if (type === "user") {
        const idx = db.users.findIndex(u => u.id === id);
        if (idx > -1) {
          if (action === "delete") {
            if (db.users[idx].username === "admin_demo") {
              return { success: false, msg: "ไม่สามารถลบบัญชี admin_demo หลักใน Sandbox ได้" };
            }
            db.users.splice(idx, 1);
          } else {
            db.users[idx].status = "Active";
          }
          saveDB(db);
        }
      }
      return { success: true };
    },

    getEKGTopics() {
      const db = loadDB();
      return [...new Set(db.ekg.map(r => r.topic).filter(Boolean))];
    },

    searchEKGRecords(filter) {
      const db = loadDB();
      const patientMap = {};
      db.data.forEach(r => {
        patientMap[r.idCard] = `${r.firstName} ${r.lastName}`;
      });

      const byPatient = {};
      db.ekg.forEach(r => {
        if (!byPatient[r.idCard]) byPatient[r.idCard] = [];
        byPatient[r.idCard].push(r);
      });
      const attemptMap = {};
      Object.values(byPatient).forEach(list => {
        list.sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time));
        list.forEach((r, i) => { attemptMap[r.id] = i + 1; });
      });

      const filtered = db.ekg.filter(r => {
        if (filter.idCard && !r.idCard.includes(filter.idCard)) return false;
        if (filter.topic && filter.topic !== "ทั้งหมด" && r.topic !== filter.topic) return false;
        if (filter.status && filter.status !== "ทั้งหมด" && r.status !== filter.status) return false;
        if (filter.dateStart && r.date < filter.dateStart) return false;
        if (filter.dateEnd && r.date > filter.dateEnd) return false;
        return true;
      });

      return [...filtered].reverse().map(r => ({
        id: r.id,
        idCard: r.idCard,
        name: patientMap[r.idCard] || "ไม่พบข้อมูลคัดกรองสุขภาพ",
        topic: r.topic,
        fileName: r.fileName,
        fileId: r.fileId,
        date: r.date,
        time: r.time,
        fiscalYear: r.fiscalYear,
        status: r.status,
        recorder: r.recorder,
        created_at: r.created_at,
        attempt: attemptMap[r.id] || 1,
        mockImageUrl: r.customDataUrl || generateMockEKGDataUrl(r.idCard, r.date, r.topic, r.status === "ผิดปกติ" || r.isAbnormal)
      }));
    },

    getEKGRecordsForPatient(idCard) {
      const db = loadDB();
      const filtered = db.ekg.filter(r => r.idCard === idCard);
      const foundPatient = db.data.find(r => r.idCard === idCard);
      const name = foundPatient ? `${foundPatient.firstName} ${foundPatient.lastName}` : "ไม่พบข้อมูลคัดกรองสุขภาพ";

      filtered.sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time));
      const recordsMapped = filtered.map((r, idx) => ({
        id: r.id,
        idCard: r.idCard,
        topic: r.topic,
        fileName: r.fileName,
        fileId: r.fileId,
        date: r.date,
        time: r.time,
        fiscalYear: r.fiscalYear,
        status: r.status,
        recorder: r.recorder,
        created_at: r.created_at,
        attempt: idx + 1,
        mockImageUrl: r.customDataUrl || generateMockEKGDataUrl(r.idCard, r.date, r.topic, r.status === "ผิดปกติ" || r.isAbnormal)
      }));

      return { name, records: recordsMapped.reverse() };
    },

    updateEKGStatus(id, status, userObj) {
      if (userObj && (userObj.role === "guest" || userObj.role === "ผู้เยี่ยมชม" || userObj.isGuest)) {
        return { success: false, msg: "สิทธิ์ผู้เยี่ยมชมไม่สามารถประเมินผลได้" };
      }
      const db = loadDB();
      const rec = db.ekg.find(r => r.id === id);
      if (!rec) return { success: false, msg: "ไม่พบข้อมูล EKG รายการนี้" };
      rec.status = status;
      rec.isAbnormal = (status === "ผิดปกติ");
      saveDB(db);
      return { success: true, msg: "[Demo Sandbox] ประเมินผล EKG สำเร็จ" };
    },

    uploadEKGFile(fileName, base64Data, topic, userObj) {
      const cleanedName = String(fileName || "").replace(/\s+/g, "");
      const match = cleanedName.match(/^CM_(\d{13})_(\d{14})(?:\.\w+)?$/i);
      if (!match) {
        return { success: false, msg: "ชื่อไฟล์ไม่ถูกต้องตามรูปแบบ CM_[เลขบัตร13หลัก]_[วันเวลา14หลัก]" };
      }
      const idCard = match[1];
      const ts = match[2];
      const yStr = ts.substring(0, 4), mStr = ts.substring(4, 6), dStr = ts.substring(6, 8);
      const hh = ts.substring(8, 10), mm = ts.substring(10, 12), ss = ts.substring(12, 14);
      const dateFormatted = `${yStr}-${mStr}-${dStr}`;
      const timeFormatted = `${hh}:${mm}:${ss}`;
      const y = parseInt(yStr, 10), m = parseInt(mStr, 10) - 1;
      const thaiYear = y + 543;
      const fiscalYear = (m >= 9 ? thaiYear + 1 : thaiYear).toString();

      const db = loadDB();
      const baseName = cleanedName.replace(/\.[^/.]+$/, "");
      if (db.ekg.some(r => r.fileName === baseName)) {
        return { success: false, duplicate: true, msg: "ไฟล์นี้ถูกอัปโหลดเข้าระบบแล้ว (ข้าม)" };
      }

      const newId = "ekg-demo-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const cleanedTopic = String(topic || "").trim() || "ทั่วไป";
      let resolvedDataUrl = null;
      if (base64Data) {
        if (base64Data.startsWith("data:")) {
          resolvedDataUrl = base64Data;
        } else {
          let isSvg = false;
          try { isSvg = atob(base64Data.slice(0, 40)).trim().startsWith("<svg"); } catch (e) {}
          resolvedDataUrl = (isSvg ? "data:image/svg+xml;base64," : "data:image/jpeg;base64,") + base64Data;
        }
      }
      db.ekg.push({
        id: newId,
        idCard,
        topic: cleanedTopic,
        fileName: baseName,
        fileId: "mock-upload-" + newId,
        date: dateFormatted,
        time: timeFormatted,
        fiscalYear,
        status: "รอแปลผล",
        recorder: userObj ? userObj.name : "Demo User",
        created_at: new Date().toISOString().substring(0, 10),
        isAbnormal: false,
        customDataUrl: resolvedDataUrl
      });
      saveDB(db);
      return { success: true, msg: "[Demo Sandbox] อัปโหลดจำลองสำเร็จ", data: { id: newId, idCard, date: dateFormatted, topic: cleanedTopic } };
    }
  };

  // --- Chainable google.script.run Shim ---
  function createRunner() {
    let successCb = null;
    let failureCb = null;

    const runner = {
      withSuccessHandler(fn) { successCb = fn; return proxy; },
      withFailureHandler(fn) { failureCb = fn; return proxy; }
    };

    const proxy = new Proxy(runner, {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (typeof MockBackend[prop] === "function") {
          return function (...args) {
            setTimeout(() => {
              try {
                const res = MockBackend[prop].apply(MockBackend, args);
                if (typeof successCb === "function") successCb(res);
              } catch (err) {
                if (typeof failureCb === "function") failureCb(err);
                else console.error("MockGasRunner error:", err);
              }
            }, 140);
          };
        }
        return undefined;
      }
    });
    return proxy;
  }

  global.MockBackend = MockBackend;
  global.google = {
    script: {
      get run() {
        return createRunner();
      }
    }
  };
})(window);
