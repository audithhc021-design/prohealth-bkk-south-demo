/* ==========================================================================
   MDT Home Visit Application Logic
   Includes: Real-time Firebase integration & Offline Mockup DB fallback
   ========================================================================== */

// --- DUMMY DATA FOR INITIAL MOCKUP ---
const DEFAULT_USERS = [
  { uid: "u1", username: "somchai@2155.com", demoPin: "123456", name: "สมชาย", lastname: "ใจดี", position: "พยาบาลวิชาชีพ", dept: "แผนกอนามัยชุมชน" },
  { uid: "u2", username: "nurse_ying@2155.com", demoPin: "123456", name: "นารี", lastname: "รักการดี", position: "พยาบาลวิชาชีพชำนาญการ", dept: "อนามัยโรงเรียน" },
  { uid: "u3", username: "physio_tum@2155.com", demoPin: "123456", name: "ปกรณ์", lastname: "สมบัติ", position: "นักกายภาพบำบัด", dept: "นักกายภาพบำบัด" }
];

const DEFAULT_PATIENTS = [
  { id: "P-882711", name: "นายสมศักดิ์ รักสงบ", visitor: "สมชาย ใจดี", careGroup: "กลุ่ม 2", weight: 65, height: 170, bmi: "22.49 (ปกติ)" },
  { id: "P-399102", name: "นางสมศรี สุขเกษม", visitor: "นารี รักการดี", careGroup: "กลุ่ม 3", weight: 48, height: 155, bmi: "19.98 (ปกติ)" },
  { id: "P-112093", name: "นายบุญมี มั่งมี", visitor: "ปกรณ์ สมบัติ", careGroup: "กลุ่ม 1", weight: 78, height: 168, bmi: "27.64 (อ้วน 1)" }
];

const DEFAULT_VISITS = [
  {
    timestamp: "2026-05-10",
    date: "2026-05-10",
    dept: "แผนกอนามัยชุมชน",
    visitor: "สมชาย ใจดี",
    patientId: "P-882711",
    patientName: "นายสมศักดิ์ รักสงบ",
    consciousness: "รู้สึกตัวดี",
    temp: "36.6",
    pulse: "78",
    resp: "18",
    bp: "120/80",
    adl: "8",
    symptoms: "รู้สึกอ่อนแรงเล็กน้อยตอนเช้า นอนหลับได้ดีขึ้น",
    drugAllergy: "ไม่มีประวัติแพ้ยา",
    foodAllergy: "ไม่มีประวัติแพ้อาหาร",
    docAppt: "2026-06-15",
    nextVisit: "2026-05-24",
    visitNote: "คนไข้อาการคงที่ แนะนำให้ออกกำลังกายเบาๆ เพิ่มเติม",
    evaluation: "ฟื้นตัวได้ดี คะแนน ADL ดีขึ้นจากเดิม",
    followUp: "ติดตามการบริหารกล้ามเนื้อขา",
    others: "ญาติช่วยดูแลดีมาก",
    imageUrl: "",
    waist: "85", arm: "30", calf: "34", weight: "65", height: "170", bmi: "22.49 (ปกติ)",
    motorRA: "Grade 4", motorLA: "Grade 4", motorRL: "Grade 3", motorLL: "Grade 3",
    careGroup: "กลุ่ม 2",
    taiMobility: "ความสามารถในการเคลื่อนไหวลดลง", taiActivity: "ทำกิจกรรมและทำงานได้ตามปกติ มีอาการของโรคบางอาการ", taiSelfCare: "ต้องการความช่วยเหลือบางอย่าง", taiEating: "ปกติ", taiConscious: "รู้สึกตัวดี",
    ppsMobility: "เดินไปมาบนพื้นราบได้โดยต้องใช้เครื่องช่วย", ppsMental: "จิตใจและสติปัญญาปกติ", ppsEating: "รับประทานอาหารเองได้ไม่ต้องมีคนช่วย", ppsExcretion: "เดินไปห้องน้ำเองได้ ไม่หกเลอะเทอะ"
  },
  {
    timestamp: "2026-05-24",
    date: "2026-05-24",
    dept: "แผนกอนามัยชุมชน",
    visitor: "สมชาย ใจดี",
    patientId: "P-882711",
    patientName: "นายสมศักดิ์ รักสงบ",
    consciousness: "รู้สึกตัวดี",
    temp: "36.4",
    pulse: "72",
    resp: "16",
    bp: "118/76",
    adl: "9",
    symptoms: "กระฉับกระเฉงมากขึ้น เริ่มเดินโดยใช้ walker ได้มั่นคงขึ้น",
    drugAllergy: "ไม่มีประวัติแพ้ยา",
    foodAllergy: "ไม่มีประวัติแพ้อาหาร",
    docAppt: "2026-06-15",
    nextVisit: "2026-06-08",
    visitNote: "คนไข้มีพัฒนาการที่ดีมาก ฝึกเดินได้ดี",
    evaluation: "ADL เพิ่มขึ้นเป็น 9 สุขภาพกายดีขึ้นชัดเจน",
    followUp: "ฝึกเดินต่อเนื่องและสังเกตอาการเหนื่อยหอบ",
    others: "-",
    imageUrl: "",
    waist: "84", arm: "30", calf: "34", weight: "65", height: "170", bmi: "22.49 (ปกติ)",
    motorRA: "Grade 4", motorLA: "Grade 4", motorRL: "Grade 4", motorLL: "Grade 4",
    careGroup: "กลุ่ม 2",
    taiMobility: "ความสามารถในการเคลื่อนไหวลดลง", taiActivity: "ทำกิจกรรมและทำงานได้ตามปกติ มีอาการของโรคบางอาการ", taiSelfCare: "ทำได้เอง", taiEating: "ปกติ", taiConscious: "รู้สึกตัวดี",
    ppsMobility: "เดินไปมาบนพื้นราบได้โดยต้องใช้เครื่องช่วย", ppsMental: "จิตใจและสติปัญญาปกติ", ppsEating: "รับประทานอาหารเองได้ไม่ต้องมีคนช่วย", ppsExcretion: "เดินไปห้องน้ำเองได้ ไม่หกเลอะเทอะ"
  },
  {
    timestamp: "2026-05-15",
    date: "2026-05-15",
    dept: "อนามัยโรงเรียน",
    visitor: "นารี รักการดี",
    patientId: "P-399102",
    patientName: "นางสมศรี สุขเกษม",
    consciousness: "รู้สึกตัวดี",
    temp: "37.2",
    pulse: "84",
    resp: "20",
    bp: "135/85",
    adl: "5",
    symptoms: "มีอาการมึนศีรษะตอนเย็น ความดันค่อนข้างสูง",
    drugAllergy: "ไม่มีประวัติแพ้ยา",
    foodAllergy: "ไม่มีประวัติแพ้อาหาร",
    docAppt: "2026-05-30",
    nextVisit: "2026-05-26",
    visitNote: "เน้นย้ำการทานยาลดความดันให้ตรงเวลา และหลีกเลี่ยงของเค็ม",
    evaluation: "มีความดันโลหิตสูงระดับเฝ้าระวัง ADL ระดับ 5 พึ่งพิงปานกลาง",
    followUp: "วัดความดันเช้า-เย็น และเช็คประวัติการทานยา",
    others: "นัดพบแพทย์โรงพยาบาลชุมชนสัปดาห์หน้า",
    imageUrl: "",
    waist: "78", arm: "25", calf: "28", weight: "48", height: "155", bmi: "19.98 (ปกติ)",
    motorRA: "Grade 3", motorLA: "Grade 3", motorRL: "Grade 3", motorLL: "Grade 3",
    careGroup: "กลุ่ม 3",
    taiMobility: "นั่ง/นอนเป็นส่วนใหญ่", taiActivity: "ต้องออกแรงอย่างมากในการทำกิจกรรมตามปกติมีอาการของโรคบางอาการ", taiSelfCare: "ต้องการความช่วยเหลือเป็นส่วนใหญ่", taiEating: "ปกติ หรือ ลดลง", taiConscious: "รู้สึกตัวดี",
    ppsMobility: "ต้องการความช่วยเหลือเวลาลุกนั่งบนเตียง", ppsMental: "จิตใจและสติปัญญาปกติ", ppsEating: "ต้องมีคนป้อนอาหาร แต่ไม่มีปัญหาการกลืน", ppsExcretion: "ต้องการคนช่วยพาไปห้องน้ำ ไม่จำเป็นต้องใส่ผ้าอ้อมตลอดเวลา"
  }
];

const DEFAULT_SCHEDULES = [
  { id: "S-1", patientName: "นายสมศักดิ์ รักสงบ", patientId: "P-882711", date: "2026-05-28", visitorName: "สมชาย ใจดี", status: "pending" },
  { id: "S-2", patientName: "นางสมศรี สุขเกษม", patientId: "P-399102", date: "2026-05-26", visitorName: "นารี รักการดี", status: "pending" },
  { id: "S-3", patientName: "นายบุญมี มั่งมี", patientId: "P-112093", date: "2026-05-20", visitorName: "ปกรณ์ สมบัติ", status: "done" }
];

const FORM_CHECKLISTS = {
  nursingDiagnosis: [
    { id: "1", text: "1. มีแผลกดทับบริเวณ สะโพก ก้นกบ และตาตุ่มขาขวา เนื่องจากนอนท่าเดียวเป็นเวลานาน" },
    { id: "2", text: "2. มีภาวะท้องผูก เนื่องจากเคลื่อนไหวร่างกายน้อย ไม่ชอบดื่มน้ำและรับประทานอาหารกากใยน้อย" },
    { id: "3", text: "3. มีโอกาสเกิดอุบัติเหตุในบ้าน เนื่องจากการจัดสิ่งของภายในบ้านไม่เหมาะสม และแสงสว่างไม่เพียงพอ" },
    { id: "4", text: "4. เสี่ยงต่อการเกิดแผลกดทับและข้อยึดติด เนื่องจากเคลื่อนไหวร่างกายได้น้อย" },
    { id: "5", text: "5. เสี่ยงต่อการสูญหาย เนื่องจากชอบออกนอกบ้านแล้วกลับบ้านไม่ถูก" },
    { id: "6", text: "6. เสี่ยงต่อการไม่ได้รับการช่วยเหลือเมื่อเกิดเหตุฉุกเฉิน เนื่องจากอยู่ตามลำพังและขาดทักษะในการขอความช่วยเหลือ" },
    { id: "7", text: "7. ดูแลสุขภาพตนเองได้ดี เนื่องจากมีพฤติกรรมการรับประทานอาหาร การออกกำลังกายและการจัดการกับความเครียดเหมาะสม" },
    { id: "8", text: "8. ผู้ดูแล/ครอบครัวมีความวิตกกังวล เนื่องจากไม่มีความรู้เกี่ยวกับโรค แนวทางการรักษาและการดูแลผู้ที่มีภาวะพึ่งพิงอย่างถูกต้อง" },
    { id: "9", text: "9. ผู้ดูแล/ครอบครัว มีภาวะ Burden Stress and Stigma" },
    { id: "10", text: "10. ผู้ดูแลขาดทักษะในการใช้อุปกรณ์ทางการแพทย์ที่จำเป็นต้องใช้สำหรับผู้ที่มีภาวะพึ่งพิง" },
    { id: "11", text: "11. ผู้ที่มีภาวะพึ่งพิงและญาติมีความเชื่อทางไสยศาสตร์เกี่ยวกับการรักษาพยาบาล" },
    { id: "12", text: "12. เสี่ยงต่อการเกิดโรคหลอดเลือดสมอง เนื่องจากมีภาวะความดันโลหิตสูง" },
    { id: "13", text: "13. เสี่ยงต่อการได้รับอันตรายจากความดันโลหิตสูง เนื่องจากขาดความรู้ในการดูแลตนเอง เมื่อเป็นโรคความดันโลหิตสูง" },
    { id: "14", text: "14. มีความวิตกกังวลเกี่ยวกับภาวะความดันโลหิตสูง" },
    { id: "15", text: "15. มีภาวะน้ำตาลในเลือดสูง เนื่องจากพฤติกรรมการรับประทานอาหารไม่เหมาะสม" },
    { id: "16", text: "16. เสี่ยงต่อการเกิดภาวะแทรกซ้อนที่ตาจากโรคเบาหวาน เนื่องจากควบคุมระดับน้ำตาลในเลือดไม่ได้" },
    { id: "17", text: "17. เสี่ยงต่อการเกิดอุบัติเหตุพลัดตกหกล้มเนื่องจากเวียนศีรษะ ตามัว เท้าชา ทั้ง 2 ข้าง" },
    { id: "18", text: "18. เสี่ยงต่อการเกิดแผลที่เท้า เนื่องจากสูญเสียความรู้สึกของเส้นประสาทส่วนปลายบริเวณเท้า ทั้ง 2 ข้างและขาดความรู้ในการดูแลเท้า" },
    { id: "19", text: "19. การเคลื่อนไหวลำบากเนื่องจาก แขน ขา ข้างซ้าย อ่อนแรง" },
    { id: "20", text: "20. เสี่ยงต่อการสำลัก เนื่องจากกลืนลำบาก" },
    { id: "21", text: "21. เสี่ยงต่อการพลัดตกหกล้ม เนื่องจากแขน ขา ด้านขวา อ่อนแรง" },
    { id: "22", text: "22. มีภาวะเครียด เนื่องจากการสื่อสารทางวาจา พูดได้ช้า สื่อสารได้ไม่ชัดเจนเหมือนเดิม" },
    { id: "23", text: "23. เสี่ยงต่อการเกิดRecurrent stroke เนื่องจากไม่สามารถควบคุมระดับความดันโลหิตและการรับประทานอาหารที่เหมาะสมกับโรคได้" },
    { id: "24", text: "24. เสี่ยงต่อการได้รับสารอาหารและน้ำไม่เพียงพอ เนื่องจากรับประทานอาหารเองไม่ได้ ต้องใส่ NG Tube" },
    { id: "25", text: "25. มีความพร่องในการทำกิจวัตรประจำวัน เนื่องจากภาวะสมองเสื่อม" },
    { id: "26", text: "26. มีอาการอ่อนเพลีย เนื่องจากนอนหลับพักผ่อนไม่เพียงพอ" },
    { id: "27", text: "27. เสี่ยงต่อการเกิดปอดอักเสบ เนื่องจากสำลักอาหารและน้ำดื่ม" },
    { id: "28", text: "28. เสี่ยงต่อการถูกทอดทิ้ง / ถูกทารุณกรรม เนื่องจากการสื่อสารไม่มีประสิทธิภาพ" },
    { id: "29", text: "29. มีโอกาสเกิดของเสียคั่งในร่างกาย เนื่องจากไตเสื่อมสภาพ / ประสิทธิภาพการทำงานของไตลดลง" },
    { id: "30", text: "30. เสี่ยงต่อการเกิดภาวะพร่องโภชนาการ เนื่องจากเบื่ออาหาร / รับประทานอาหารได้น้อย" },
    { id: "31", text: "31. ปฏิบัติกิจวัตรประจำวันได้น้อยลง เนื่องจากเหนื่อยง่ายเพราะภาวะพร่องออกซิเจน" },
    { id: "32", text: "32. เสี่ยงต่อการติดเชื้อในระบบทางเดินปัสสาวะ เนื่องจากใส่คาสายสวนปัสสาวะเป็นเวลานาน" },
    { id: "33", text: "33. มีอาการอ่อนเพลีย เนื่องจากมีภาวะซีด" },
    { id: "34", text: "34. มีภาวะซึมเศร้า เนื่องจากการเจ็บป่วยเรื้อรัง" },
    { id: "35", text: "35. เสี่ยงต่อการเกิดภาวะหัวใจล้มเหลว เนื่องจากเหนื่อยมากขึ้น" },
    { id: "36", text: "36. ความภาคภูมิใจในตนเองลดลง เนื่องจากต้องพึ่งพิงผู้อื่นเพราะการเจ็บป่วยเรื้อรัง" },
    { id: "37", text: "37. ความรู้สึกมีคุณค่าในตนเองลดลง เนื่องจากความสามารถและภาพลักษณ์ เปลี่ยนแปลง" },
    { id: "38", text: "38. เสี่ยงต่อการติดเชื้อในระบบทางเดินหายใจ เนื่องจากบริเวณหลอดคอไม่สะอาดและมีเสมหะอุดกั้นทางเดินหายใจ" },
    { id: "39", text: "39. เสี่ยงต่อการติดเชื้อของผิวหนังหน้าท้องบริเวณรูเปิดของทวารเทียม เนื่องจากมีการรั่วซึมของอุจจาระ" },
    { id: "40", text: "40. ผู้ดูแลมีความกังวล เนื่องจากการดูแลผู้ที่มีภาวะพึ่งพิงมีความซับซ้อน" },
    { id: "41", text: "41. อื่นๆ (ระบุ)" }
  ],
  servicePrecautions: [
    { id: "1", text: "1. การกลับเป็นซ้ำของโรค (ระบุ)" },
    { id: "2", text: "2. การขาดสารอาหาร" },
    { id: "3", text: "3. การติดเชื้อในระบบทางเดินปัสสาวะ" },
    { id: "4", text: "4. การติดเชื้อในระบบทางเดินหายใจ" },
    { id: "5", text: "5. การถูกทำร้าย / การถูกทารุณกรรม" },
    { id: "6", text: "6. การทำร้ายตนเอง / ผู้อื่น" },
    { id: "7", text: "7. การพลัดตกหกล้ม" },
    { id: "8", text: "8. การรับประทานยาผิด" },
    { id: "9", text: "9. การสำลักอาหาร" },
    { id: "10", text: "10. การหลงทาง" },
    { id: "11", text: "11. การเกิดข้อยึดติด / ข้อติดแข็ง" },
    { id: "12", text: "12. การเกิดภาวะซึมเศร้า" },
    { id: "13", text: "13. การเกิดอุบัติเหตุ เช่น ถูกไฟไหม้ น้ำร้อนลวก" },
    { id: "14", text: "14. การเกิดแผลกดทับ" },
    { id: "15", text: "15. การแพ้ยา" },
    { id: "16", text: "16. ความเครียดของผู้ดูแล" },
    { id: "17", text: "17. ติดตามประเมินการเปลี่ยนแปลงของระดับความดันโลหิต" },
    { id: "18", text: "18. ติดตามประเมินการเปลี่ยนแปลงของระดับน้ำตาลในเลือด" },
    { id: "19", text: "19. ประสานการเข้าให้การดูแลล่วงหน้าทุกครั้ง" },
    { id: "20", text: "20. ป้องกันภาวะแทรกซ้อน เรื่อง (ระบุ)" },
    { id: "21", text: "21. ผลข้างเคียงจากการใช้ยา" },
    { id: "22", text: "22. ภาวะแทรกซ้อนจากระดับความดันโลหิตสูง เช่น ปวดศีรษะรุนแรง แขนขาอ่อนแรง ฯลฯ" },
    { id: "23", text: "23. ภาวะแทรกซ้อนจากระดับน้ำตาลในเลือดสูง/ต่ำ เช่น ตามัว ชาปลายมือปลายเท้า ฯลฯ" },
    { id: "24", text: "24. สื่อสารอย่างชัดเจน ให้เกียรติ เคารพในศักดิ์ศรีของผู้ป่วย/ผู้ที่มีภาวะพึ่งพิง/ครอบครัว" },
    { id: "25", text: "25. อาการกำเริบของโรคทางจิตเวช" },
    { id: "26", text: "26. อื่นๆ (ระบุ)" }
  ],
  shortTermGoals: [
    { id: "1", text: "1. สภาพภายในบ้านเรียบร้อยช่วยให้ผู้ที่มีภาวะพึ่งพิงไม่เกิดอุบัติเหตุภายใน 1 เดือน" },
    { id: "2", text: "2. ที่พักอาศัยได้รับการปรับสภาพให้แข็งแรงไม่ก่อให้เกิดอันตรายต่อผู้ที่มีภาวะพึ่งพิงภายใน 3 เดือน" },
    { id: "3", text: "3. ได้รับการช่วยเหลือด้านอาชีพ/รายได้ภายใน 4 เดือน" },
    { id: "4", text: "4. ผู้ดูแลสามารถทำความสะอาดผิวหนังบริเวณที่เจาะคอและท่อหลอดคอถูกต้องภายใน 1 สัปดาห์" },
    { id: "5", text: "5. ดูแลความสะอาดของสายสวนปัสสาวะที่ใส่คาไว้และถุงใส่น้ำปัสสาวะได้ถูกต้องภายใน 1 สัปดาห์" },
    { id: "6", text: "6. ได้รับน้ำและสารอาหารที่เพียงพอกับความต้องการของร่างกายภายใน 2 เดือน" },
    { id: "7", text: "7. ไม่เกิดการพลัดตกหกล้มภายใน 3 เดือน" },
    { id: "8", text: "8. ความเครียดอยู่ในระดับปกติภายใน 2 สัปดาห์" },
    { id: "9", text: "9. ผู้ดูแล/ครอบครัวมีความรู้เกี่ยวกับโรค การรักษาและให้การดูแลผู้ที่มีภาวะพึ่งพิงได้ถูกต้องภายใน 3 เดือน" },
    { id: "10", text: "10. ผู้ดูแล/ครอบครัวสามารถจัดการกับความเครียดได้เหมาะสมภายใน 2 เดือน" },
    { id: "11", text: "11. กล้ามเนื้อแขน ขา ข้างซ้าย มีกำลังต้านแรงโน้มถ่วงได้ ภายใน 5 เดือน" },
    { id: "12", text: "12. ช่วยเหลือตนเองในการรับประทานอาหารที่มีผู้เตรียมให้ได้ภายใน 3 เดือน" },
    { id: "13", text: "13. เดินได้เองโดยใช้ไม้เท้าภายใน 2 เดือน" },
    { id: "14", text: "14. ขับถ่ายอุจจาระเป็นปกติภายใน 2 สัปดาห์" },
    { id: "15", text: "15. ลุกนั่งบนเตียงได้เองภายใน 2 เดือน" },
    { id: "16", text: "16. สื่อสารกับผู้อื่นเข้าใจชัดเจนมากขึ้นภายใน 3 เดือน" },
    { id: "17", text: "17. นอนหลับพักผ่อนได้ 6-8 ชั่วโมง / คืน ภายใน 2 สัปดาห์" },
    { id: "18", text: "18. ควบคุมระดับความดันโลหิตให้ไม่เกิน 130/90 mm Hg ภายใน 3 เดือน" },
    { id: "19", text: "19. บอกอันตรายที่เกิดจากความดันโลหิตสูง ได้ภายหลังได้รับการสอน / คำแนะนำ" },
    { id: "20", text: "20. ความวิตกก่ังวล ลดลง สีหน้าสดชื่นภายใน 1 เดือน" },
    { id: "21", text: "21. ควบคุมระดับน้ำตาลในเลือดก่อนอาหารอยู่ระหว่าง 80-120 mg / dl ภายใน 3 เดือน" },
    { id: "22", text: "22. ไม่มีรอยช้ำ / บาดแผลจากการถูกทำร้าย / ทารุณกรรมภายใน 3 เดือน" },
    { id: "23", text: "23. ได้รับประทานอาหารที่มีลักษณะเหมาะสมและกลืนอาหารได้ถูกต้องภายใน 1 เดือน" },
    { id: "24", text: "24. ไม่ได้รับยาที่ไม่ใช่ยาตามแผนการรักษาภายหลังการได้รับคำแนะนำ" },
    { id: "25", text: "25. ไม่มีการนำสิ่งที่จะก่อให้เกิดอันตรายมาไว้ใกล้ผู้ที่มีภาวะพึ่งพิงภายหลังการได้รับคำแนะนำ" },
    { id: "26", text: "26. เป้าหมายระยะสั้นอื่นๆ (ระบุ)" }
  ],
  longTermGoals: [
    { id: "1", text: "1. ช่วยเหลือตนเองในการปฏิบัติกิจวัตรประจำวันได้เพิ่มขึ้นโดยคะแนน Barthel ADL Index ไม่ต่ำกว่า 10 คะแนนภายใน 1 ปี" },
    { id: "2", text: "2. ไม่เกิดปอดอักเสบจากการสำลักอาหาร ภายใน 1 ปี" },
    { id: "3", text: "3. ภาวะโภชนาการอยู่ในเกณฑ์ปกติ BMI = 18.5-24.9 กิโลกรัม /ตารางเมตร ภายใน 1 ปี" },
    { id: "4", text: "4. ไม่เกิดอาการอ่อนเพลียจากการนอนพักผ่อนไม่เพียงพอภายใน 1 ปี" },
    { id: "5", text: "5. ไม่เกิดการสำลักจากการรับประทานอาหารและดื่มน้ำภายใน 1 ปี" },
    { id: "6", text: "6. ไม่เกิดการกลับเป็นซ้ำของโรคหลอดเลือดสมองภายใน 1 ปี" },
    { id: "7", text: "7. ไม่เกิดแผลกดทับ ข้อยึดติดตลอดระยะเวลา 1 ปี" },
    { id: "8", text: "8. มีสัมพันธภาพกับบุคคลอื่นเพิ่มมากขึ้นสื่อสารได้เข้าใจชัดเจนภายใน 8 เดือน" },
    { id: "9", text: "9. เดินได้โดยไม่ต้องใช้ไม้เท้าบนทางราบได้ภายใน 8 เดือน" },
    { id: "10", text: "10. ดูแลตนเองเรื่อง อาหาร การออกกำลังกาย และการจัดการความเครียดได้เหมาะสมภายใน 6 เดือน" },
    { id: "11", text: "11. ไม่มีความวิตกกังวล ปรับตัวกับการเจ็บป่วยได้ภายใน 6 เดือน" },
    { id: "12", text: "12. รับประทานอาหารตรงเวลา สารอาหารเหมาะสมกับภาวะสุขภาพ ออกกำลังกาย 30 นาที 5 วัน ต่อสัปดาห์ ภายใน 8 เดือน" },
    { id: "13", text: "13. ไม่เกิดอุบัติเหตุพลัดตกหกล้มภายใน 1 ปี" },
    { id: "14", text: "14. ไม่เกิดภาวะท้องผูกภายใน 1 ปี" },
    { id: "15", text: "15. ไม่มีอาการของโรคหลอดเลือดสมองตลอดระยะเวลา 1 ปี" },
    { id: "16", text: "16. สภาพที่อยู่อาศัยเหมาะสมไม่เกิดความเสี่ยงต่อผู้ที่มีภาวะพึ่งพิงตลอดระยะเวลา 1 ปี" },
    { id: "17", text: "17. ไม่เกิดอาการลุกลามของโรคจากความเชื่อและการปฏิบัติที่เป็นอันตรายภายใน 1 ปี" },
    { id: "18", text: "18. เมื่อถึงเวลาจากไป จากไปอย่างสงบ" },
    { id: "19", text: "19. เป้าหมายระยะยาวอื่นๆ (ระบุ)" },
    { id: "20", text: "20. ไม่กลับเข้ารับการรักษาในโรงพยาบาลด้วยโรคเดิมภายใน 1 ปี" },
    { id: "21", text: "21. ได้รับยาครบถ้วน พบแพทย์ตามนัดทุกครั้ง ตลอดระยะเวลา 1 ปี" },
    { id: "22", text: "22. พึงพอใจในภาพลักษณ์และศักยภาพของตนเองภายใน 6 เดือน" },
    { id: "23", text: "23. ไม่เกิดการพลัดหลง/สูญหายภายใน 1 ปี" },
    { id: "24", text: "24. ครอบครัวสามารถดูแลผู้ที่มีภาวะพึ่งพิงได้อย่างอิสระภายใน 8 เดือน" },
    { id: "25", text: "25. ขอความช่วยเหลือกรณีเกิดเหตุฉุกเฉินได้ภายใน 6 เดือน" },
    { id: "26", text: "26. ประสิทธิภาพของไตไม่ลดลงภายใน 1 ปี" },
    { id: "27", text: "27. ไม่เกิดการถูกทำร้าย/ถูกทารุณกรรม ตลอดระยะเวลา 1 ปี" }
  ],
  patientProblems: [
    { id: "1", text: "กลั้นปัสสาวะไม่ได้" },
    { id: "2", text: "กล้ามเนื้อแขนขาอ่อนแรง" },
    { id: "3", text: "ขาดความรู้ที่ถูกต้องในการดูแลอุปกรณ์ทางการแพทย์ที่ใช้" },
    { id: "4", text: "ขาดความรู้ในการทำแผลที่ถูกต้อง" },
    { id: "5", text: "ขาดความรู้ในการบริหารเพิ่มความแข็งแรงของกล้ามเนื้อ" },
    { id: "6", text: "ขาดความรู้ในการรับประทานอาหารที่เหมาะสมกับภาวะสุขภาพ" },
    { id: "7", text: "ถ่ายอุจจาระลำบาก" },
    { id: "8", text: "ผู้ดูแลในครอบครัวไม่สามารถดูแลได้ตลอดเวลา" },
    { id: "9", text: "มีข้อยึดติด/ข้อติดแข็ง" },
    { id: "10", text: "มีปัญหา ความจำ หลงลืม" },
    { id: "11", text: "มีปัญหาด้านเศรษฐกิจ" },
    { id: "12", text: "สภาพที่อยู่อาศัยไม่แข็งแรง / ไม่ปลอดภัย" },
    { id: "13", text: "สภาพแวดล้อมในชุมชนไม่ปลอดภัย" },
    { id: "14", text: "สำลักอาหารบ่อย" },
    { id: "15", text: "สื่อสารกับผู้อื่นลำบาก" },
    { id: "16", text: "อื่นๆ (ระบุ)" },
    { id: "17", text: "เดินเองไม่ได้ต้องมีผู้ช่วยพยุง" },
    { id: "18", text: "เบื่ออาหาร" },
    { id: "19", text: "ใส่ผ้าอ้อมสำเร็จรูปผู้ใหญ่" },
    { id: "20", text: "ใส่สายสวนคาปัสสาวะ" },
    { id: "21", text: "ไม่มีความรู้เกี่ยวกับโรคและการปฏิบัติ / การดูแลตนเองที่เหมาะสมกับโรค" },
    { id: "22", text: "ไม่สามารถทำกิจวัตรประจำวันด้วยตนเองได้" },
    { id: "23", text: "ไม่สามารถรับประทานอาหารเองได้" },
    { id: "24", text: "ไม่สามารถไปพบแพทย์ตามนัดได้" }
  ],
  patientNeeds: [
    { id: "1", text: "การช่วยเหลือในการทำกิจวัตรประจำวัน" },
    { id: "2", text: "คำแนะนำและการดูแลช่วยเหลือเรื่องโภชนาการ" },
    { id: "3", text: "คำแนะนำและการดูแลเรื่องสายสวนคาปัสสาวะ" },
    { id: "4", text: "คำแนะนำแก้ไขอาการท้องผูก" },
    { id: "5", text: "การดูแลเรื่องการทำแผลกดทับ" },
    { id: "6", text: "คำแนะนำและการดูแลเรื่องการดูดเสมหะ" },
    { id: "7", text: "คำแนะนำในการดูแลสายยางให้อาหารที่ถูกต้อง" },
    { id: "8", text: "คำแนะนำเรื่องการดูแลความสะอาดของผิวหนัง / การป้องกันความอับชื่น" },
    { id: "9", text: "คำแนะนำวิธีการจัดการกับความเครียด" },
    { id: "10", text: "การเยี่ยมให้การดูแลที่บ้านโดยทีมสหวิชาชีพ" },
    { id: "11", text: "การได้รับการส่งต่อตามปัญหา" },
    { id: "12", text: "การสนับสนุนวัสดุ อุปกรณ์ทางการแพทย์ที่จำเป็นได้แก่ ระบุ" },
    { id: "13", text: "การช่วยเหลือตนเองได้เพิ่มมากขึ้น" },
    { id: "14", text: "คำแนะนำเรื่องโรคและการปฏิบัติตัวที่ถูกต้อง" },
    { id: "15", text: "การช่วยเหลือปรับปรุงสภาพที่พักอาศัย" },
    { id: "16", text: "คำแนะนำเรื่อง (ระบุ)" },
    { id: "17", text: "การดูแลเรื่อง (ระบุ)" },
    { id: "18", text: "อื่นๆ (ระบุ)" }
  ]
};

// --- INITIALIZE STORAGE IF EMPTY (MOCK DB) ---
function initLocalStorage() {
  if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  if (!localStorage.getItem("patients")) localStorage.setItem("patients", JSON.stringify(DEFAULT_PATIENTS));
  if (!localStorage.getItem("visits")) {
    const visitsWithId = DEFAULT_VISITS.map((v, i) => ({ id: `V-${i + 1}`, ...v }));
    localStorage.setItem("visits", JSON.stringify(visitsWithId));
  }
  if (!localStorage.getItem("schedules")) localStorage.setItem("schedules", JSON.stringify(DEFAULT_SCHEDULES));
}
initLocalStorage();
renderDynamicFormChecklists();
initPatientSearch();

function initPatientSearch() {
  const patInput = document.getElementById("f-patient");
  const patDropdown = document.getElementById("f-patient-dropdown");
  if (!patInput || !patDropdown) return;

  function showDropdown() {
    const query = patInput.value.trim().toLowerCase();
    
    // Sort patients alphabetically
    const sortedPatients = [...(AppState.patients || [])].sort((a, b) => a.name.localeCompare(b.name, 'th'));
    
    let filtered = sortedPatients;
    if (query) {
      filtered = sortedPatients.filter(p => p.name.toLowerCase().includes(query));
    }
    
    if (filtered.length === 0) {
      patDropdown.innerHTML = '<div class="dropdown-item disabled">ไม่พบข้อมูลคนไข้ (กรุณาเพิ่มในฐานข้อมูล)</div>';
    } else {
      patDropdown.innerHTML = filtered.map(p => `
        <div class="dropdown-item" data-value="${p.name}">${p.name}</div>
      `).join('');
    }
    patDropdown.classList.remove("hidden");
  }

  patInput.addEventListener("focus", showDropdown);
  patInput.addEventListener("input", showDropdown);

  // Click on dropdown item
  patDropdown.addEventListener("click", function(e) {
    const item = e.target.closest(".dropdown-item");
    if (item && !item.classList.contains("disabled")) {
      patInput.value = item.getAttribute("data-value");
      patDropdown.classList.add("hidden");
      const dateVal = document.getElementById("f-date").value;
      updateAutoCalculatedRoundName(patInput.value, dateVal);
      if (!AppState.currentEditingVisitId) {
        handlePatientChangeInherit(patInput.value);
      }
    }
  });

  patInput.addEventListener("blur", function() {
    setTimeout(() => {
      const dateVal = document.getElementById("f-date").value;
      updateAutoCalculatedRoundName(patInput.value, dateVal);
      if (!AppState.currentEditingVisitId) {
        handlePatientChangeInherit(patInput.value);
      }
    }, 200);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function(e) {
    if (!patInput.contains(e.target) && !patDropdown.contains(e.target)) {
      patDropdown.classList.add("hidden");
    }
  });
}
window.initPatientSearch = initPatientSearch;

// --- DATABASE SERVICE WRAPPER ---
class DbService {
  constructor() {
    this.isReal = window.IS_FIREBASE_CONFIGURED;
    if (this.isReal) {
      this.initFirebase();
    } else {
      console.log("⚠️ ทำงานในโหมดจำลอง (Mockup Mode) - จัดเก็บข้อมูลใน LocalStorage");
    }
  }

  initFirebase() {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
        // Enable offline persistence
        firebase.firestore().enablePersistence().catch(err => {
          if (err.code == 'failed-precondition') {
            console.warn("Firestore offline persistence failed: Multiple tabs open.");
          } else if (err.code == 'unimplemented') {
            console.warn("Firestore offline persistence: Browser not supported.");
          }
        });
      }
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.storage = firebase.storage();
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
      this.isReal = false;
    }
  }

  // Helper to wrap Firestore operations in a timeout to prevent infinite spinning
  withTimeout(promise, timeoutMs = 12000, errorMsg = "หมดเวลาเชื่อมต่อฐานข้อมูล (Firestore Timeout) กรุณาตรวจสอบอินเทอร์เน็ต และตรวจสอบว่าได้สร้างฐานข้อมูล Firestore Database ใน Firebase Console และตั้งค่า Rules เรียบร้อยแล้ว") {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), timeoutMs))
    ]);
  }

  // --- Auth Functions ---
  async login(username, password) {
    const fullEmail = username.includes("@") ? username : `${username}@2155.com`;
    
    if (this.isReal) {
      try {
        const cred = await this.auth.signInWithEmailAndPassword(fullEmail, password);
        const userDoc = await this.withTimeout(this.db.collection("users").doc(cred.user.uid).get());
        if (userDoc.exists) {
          const udata = userDoc.data();
          return { success: true, user: { uid: cred.user.uid, email: fullEmail, ...udata } };
        } else {
          // User exists in Auth but not in Users collection (need Profile Setup)
          return { success: true, user: { uid: cred.user.uid, email: fullEmail, needProfile: true } };
        }
      } catch (err) {
        return { success: false, message: this.translateAuthError(err.code || err.message) };
      }
    } else {
      // Mock Login (Demo Mode - validates against simulated demoPin only)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === fullEmail);
      if (user && String(user.demoPin || "123456") === String(password)) {
        localStorage.setItem("session_user", JSON.stringify(user));
        return { success: true, user: user };
      } else {
        return { success: false, message: "ไม่พบชื่อผู้ใช้งาน หรือรหัสผ่านจำลองไม่ถูกต้อง (รหัสผ่านจำลองคือ 123456)" };
      }
    }
  }

  async register(username, password) {
    const fullEmail = username.includes("@") ? username : `${username}@2155.com`;
    
    if (this.isReal) {
      try {
        const cred = await this.auth.createUserWithEmailAndPassword(fullEmail, password);
        return { success: true, user: { uid: cred.user.uid, email: fullEmail, needProfile: true } };
      } catch (err) {
        return { success: false, message: this.translateAuthError(err.code) };
      }
    } else {
      // Mock Register
      const users = JSON.parse(localStorage.getItem("users"));
      if (users.find(u => u.username === fullEmail)) {
        return { success: false, message: "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว" };
      }
      const newUid = "u_" + Date.now();
      const newUser = { uid: newUid, username: fullEmail, demoPin: String(password), needProfile: true };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("session_user", JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  }

  async saveProfile(uid, profileData) {
    if (this.isReal) {
      try {
        await this.withTimeout(this.db.collection("users").doc(uid).set(profileData, { merge: true }));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const users = JSON.parse(localStorage.getItem("users"));
      const idx = users.findIndex(u => u.uid === uid);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...profileData };
        delete users[idx].needProfile;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("session_user", JSON.stringify(users[idx]));
        return { success: true, user: users[idx] };
      }
      return { success: false, message: "User not found" };
    }
  }

  async changePassword(uid, newPassword) {
    if (this.isReal) {
      const user = this.auth.currentUser;
      if (user) {
        await user.updatePassword(newPassword);
        return { success: true };
      }
      return { success: false, message: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง" };
    } else {
      // Mock change password (updates simulated demoPin in localStorage)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const idx = users.findIndex(u => u.uid === uid);
      if (idx !== -1) {
        users[idx].demoPin = String(newPassword);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("session_user", JSON.stringify(users[idx]));
      }
      return { success: true };
    }
  }

  // --- Patients Functions ---
  async getPatients() {
    if (this.isReal) {
      const snapshot = await this.withTimeout(this.db.collection("patients").get());
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      return JSON.parse(localStorage.getItem("patients"));
    }
  }

  async getOrCreatePatient(patientName, visitorName) {
    const trimmed = patientName.trim();
    if (this.isReal) {
      const ref = this.db.collection("patients");
      const q = await this.withTimeout(ref.where("name", "==", trimmed).get());
      if (!q.empty) {
        return { id: q.docs[0].id, data: q.docs[0].data() };
      } else {
        const newId = "P-" + Math.floor(100000 + Math.random() * 900000);
        const pdata = { name: trimmed, visitor: visitorName, careGroup: "กลุ่ม 1", status: "อยู่ในระหว่างการดูแล" };
        await this.withTimeout(ref.doc(newId).set(pdata));
        return { id: newId, data: pdata };
      }
    } else {
      const patients = JSON.parse(localStorage.getItem("patients"));
      const p = patients.find(pat => pat.name === trimmed);
      if (p) {
        return p;
      } else {
        const newId = "P-" + Math.floor(100000 + Math.random() * 900000);
        const newP = { id: newId, name: trimmed, visitor: visitorName, careGroup: "กลุ่ม 1", status: "อยู่ในระหว่างการดูแล" };
        patients.push(newP);
        localStorage.setItem("patients", JSON.stringify(patients));
        return newP;
      }
    }
  }

  async updatePatientCareGroup(patientId, careGroup) {
    if (this.isReal) {
      await this.withTimeout(this.db.collection("patients").doc(patientId).update({ careGroup: careGroup }));
    } else {
      const patients = JSON.parse(localStorage.getItem("patients"));
      const idx = patients.findIndex(p => p.id === patientId);
      if (idx !== -1) {
        patients[idx].careGroup = careGroup;
        localStorage.setItem("patients", JSON.stringify(patients));
      }
    }
  }

  async updatePatientInfo(patientId, name, careGroup, status) {
    if (this.isReal) {
      await this.withTimeout(this.db.collection("patients").doc(patientId).update({ name: name, careGroup: careGroup, status: status || "อยู่ในระหว่างการดูแล" }));
    } else {
      const patients = JSON.parse(localStorage.getItem("patients"));
      const idx = patients.findIndex(p => p.id === patientId);
      if (idx !== -1) {
        patients[idx].name = name;
        patients[idx].careGroup = careGroup;
        patients[idx].status = status || "อยู่ในระหว่างการดูแล";
        localStorage.setItem("patients", JSON.stringify(patients));
      }
    }
  }

  // --- Visits Functions ---
  async saveVisit(formData) {
    if (this.isReal) {
      let imageUrl = "";
      if (formData.imageBlob) {
        if (window.IS_DRIVE_UPLOADER_CONFIGURED) {
          try {
            const response = await fetch(window.DRIVE_UPLOADER_URL, {
              method: 'POST',
              body: JSON.stringify({
                imageBlob: formData.imageBlob,
                patientId: formData.patientId,
                patientName: formData.patientName,
                date: formData.date
              })
            });
            const result = await response.json();
            if (result.success) {
              imageUrl = result.url;
            } else {
              console.error("Google Drive Upload Failed:", result.error);
            }
          } catch (e) {
            console.error("Google Drive Upload API Network Error:", e);
          }
        } else {
          // Fallback to Firebase Storage
          try {
            const ref = this.storage.ref().child(`visits/${formData.patientId}_${Date.now()}.jpg`);
            const snapshot = await ref.putString(formData.imageBlob, 'data_url');
            imageUrl = await snapshot.ref.getDownloadURL();
          } catch (e) {
            console.error("Firebase Storage Upload Error:", e);
            alert("คำเตือน: บันทึกภาพลง Firebase Storage ล้มเหลว (อาจยังไม่ได้ผูกบัตรเครดิตเพื่อขยายสิทธิ์)");
          }
        }
      }
      const dataToSave = { ...formData, imageUrl };
      delete dataToSave.imageBlob;
      
      await this.withTimeout(this.db.collection("visits").add(dataToSave));
      
      // Update patient careGroup & last metrics
      await this.updatePatientCareGroup(formData.patientId, formData.careGroup);
      
      return { success: true };
    } else {
      // Mock Save Visit
      const visits = JSON.parse(localStorage.getItem("visits"));
      const newVisit = { id: "V-" + Date.now(), ...formData, timestamp: new Date().toISOString().split('T')[0] };
      // Save Base64 mock image or placeholder
      if (newVisit.imageBlob) {
        newVisit.imageUrl = newVisit.imageBlob;
        delete newVisit.imageBlob;
      }
      visits.push(newVisit);
      localStorage.setItem("visits", JSON.stringify(visits));
      
      // Update patient careGroup
      this.updatePatientCareGroup(formData.patientId, formData.careGroup);
      
      return { success: true };
    }
  }

  async updateVisit(visitId, formData) {
    if (this.isReal) {
      let imageUrl = formData.imageUrl || "";
      if (formData.imageBlob) {
        if (window.IS_DRIVE_UPLOADER_CONFIGURED) {
          try {
            const response = await fetch(window.DRIVE_UPLOADER_URL, {
              method: 'POST',
              body: JSON.stringify({
                imageBlob: formData.imageBlob,
                patientId: formData.patientId,
                patientName: formData.patientName,
                date: formData.date
              })
            });
            const result = await response.json();
            if (result.success) {
              imageUrl = result.url;
            } else {
              console.error("Google Drive Upload Failed:", result.error);
            }
          } catch (e) {
            console.error("Google Drive Upload API Network Error:", e);
          }
        } else {
          // Fallback to Firebase Storage
          try {
            const ref = this.storage.ref().child(`visits/${formData.patientId}_${Date.now()}.jpg`);
            const snapshot = await ref.putString(formData.imageBlob, 'data_url');
            imageUrl = await snapshot.ref.getDownloadURL();
          } catch (e) {
            console.error("Firebase Storage Upload Error:", e);
            alert("คำเตือน: บันทึกภาพลง Firebase Storage ล้มเหลว (อาจยังไม่ได้ผูกบัตรเครดิตเพื่อขยายสิทธิ์)");
          }
        }
      }
      const dataToSave = { ...formData };
      if (imageUrl) {
        dataToSave.imageUrl = imageUrl;
      }
      delete dataToSave.imageBlob;
      
      await this.withTimeout(this.db.collection("visits").doc(visitId).update(dataToSave));
      
      // Update patient careGroup & last metrics
      await this.updatePatientCareGroup(formData.patientId, formData.careGroup);
      
      return { success: true };
    } else {
      // Mock Update Visit
      const visits = JSON.parse(localStorage.getItem("visits"));
      const idx = visits.findIndex(v => v.id === visitId);
      if (idx !== -1) {
        const existing = visits[idx];
        let imageUrl = formData.imageUrl || existing.imageUrl || "";
        if (formData.imageBlob) {
          imageUrl = formData.imageBlob;
        }
        const updatedVisit = { ...existing, ...formData, imageUrl };
        delete updatedVisit.imageBlob;
        visits[idx] = updatedVisit;
        localStorage.setItem("visits", JSON.stringify(visits));
        
        // Update patient careGroup
        this.updatePatientCareGroup(formData.patientId, formData.careGroup);
        return { success: true };
      }
      return { success: false, message: "Visit not found" };
    }
  }

  async getVisitHistory() {
    if (this.isReal) {
      const snapshot = await this.withTimeout(this.db.collection("visits").orderBy("date", "desc").get());
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      const visits = JSON.parse(localStorage.getItem("visits"));
      return [...visits].sort((a,b) => b.date.localeCompare(a.date));
    }
  }

  // --- Schedules Functions ---
  async getSchedules() {
    if (this.isReal) {
      const snapshot = await this.withTimeout(this.db.collection("schedules").get());
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      return JSON.parse(localStorage.getItem("schedules"));
    }
  }

  async saveSchedule(scheduleData) {
    if (this.isReal) {
      try {
        const ref = await this.withTimeout(this.db.collection("schedules").add(scheduleData));
        return { success: true, id: ref.id };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const schedules = JSON.parse(localStorage.getItem("schedules"));
      const newSched = { id: "S-" + Date.now(), ...scheduleData };
      schedules.push(newSched);
      localStorage.setItem("schedules", JSON.stringify(schedules));
      return { success: true, id: newSched.id };
    }
  }

  async updateScheduleStatus(scheduleId, status) {
    if (this.isReal) {
      try {
        await this.withTimeout(this.db.collection("schedules").doc(scheduleId).update({ status: status }));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const schedules = JSON.parse(localStorage.getItem("schedules"));
      const idx = schedules.findIndex(s => s.id === scheduleId);
      if (idx !== -1) {
        schedules[idx].status = status;
        localStorage.setItem("schedules", JSON.stringify(schedules));
        return { success: true };
      }
    }
  }

  async deleteSchedule(scheduleId) {
    if (this.isReal) {
      try {
        await this.withTimeout(this.db.collection("schedules").doc(scheduleId).delete());
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const schedules = JSON.parse(localStorage.getItem("schedules"));
      const filtered = schedules.filter(s => s.id !== scheduleId);
      localStorage.setItem("schedules", JSON.stringify(filtered));
      return { success: true };
    }
  }

  async deleteVisit(visitId) {
    if (this.isReal) {
      try {
        await this.withTimeout(this.db.collection("visits").doc(visitId).delete());
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const visits = JSON.parse(localStorage.getItem("visits"));
      const filtered = visits.filter(v => v.id !== visitId);
      localStorage.setItem("visits", JSON.stringify(filtered));
      return { success: true };
    }
  }

  // Translate Auth errors to readable Thai
  translateAuthError(code) {
    if (code && code.includes("Timeout")) {
      return code;
    }
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "รหัสผ่านไม่ถูกต้อง หรือไม่พบผู้ใช้งานนี้";
      case "auth/email-already-in-use":
        return "ชื่อผู้ใช้งานนี้ถูกสมัครใช้งานแล้ว";
      case "auth/invalid-email":
        return "รูปแบบชื่อผู้ใช้งานไม่ถูกต้อง";
      case "auth/weak-password":
        return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 หลัก";
      default:
        return code || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ กรุณาลองใหม่อีกครั้ง";
    }
  }

  async deleteUser(uid) {
    if (this.isReal) {
      await this.withTimeout(this.db.collection("users").doc(uid).delete());
      return { success: true };
    } else {
      const users = JSON.parse(localStorage.getItem("users"));
      const filtered = users.filter(u => u.uid !== uid);
      localStorage.setItem("users", JSON.stringify(filtered));
      return { success: true };
    }
  }

  async deletePatient(patientId) {
    if (this.isReal) {
      await this.withTimeout(this.db.collection("patients").doc(patientId).delete());
      
      const visitsRef = this.db.collection("visits").where("patientId", "==", patientId);
      const snapshot = await this.withTimeout(visitsRef.get());
      const batch = this.db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await this.withTimeout(batch.commit());
      
      const schedRef = this.db.collection("schedules").where("patientId", "==", patientId);
      const schedSnapshot = await this.withTimeout(schedRef.get());
      const batch2 = this.db.batch();
      schedSnapshot.docs.forEach(doc => batch2.delete(doc.ref));
      await this.withTimeout(batch2.commit());
      
      return { success: true };
    } else {
      const patients = JSON.parse(localStorage.getItem("patients"));
      const filteredP = patients.filter(p => p.id !== patientId);
      localStorage.setItem("patients", JSON.stringify(filteredP));
      
      const visits = JSON.parse(localStorage.getItem("visits"));
      const filteredV = visits.filter(v => v.patientId !== patientId);
      localStorage.setItem("visits", JSON.stringify(filteredV));

      const schedules = JSON.parse(localStorage.getItem("schedules"));
      const filteredS = schedules.filter(s => s.patientId !== patientId);
      localStorage.setItem("schedules", JSON.stringify(filteredS));
      return { success: true };
    }
  }

  async joinVisit(visitId, visitorName, visitorPosition, visitorDept) {
    const normName = normalizeName(visitorName);
    if (this.isReal) {
      const docRef = this.db.collection("visits").doc(visitId);
      const docSnap = await this.withTimeout(docRef.get());
      if (!docSnap.exists) return { success: false, message: "ไม่พบข้อมูลการเยี่ยม" };
      
      const vData = docSnap.data();
      const coVisitors = vData.coVisitors || [];
      
      if (normalizeName(vData.visitor) === normName || coVisitors.some(cv => normalizeName(cv.name) === normName)) {
        return { success: false, message: "คุณอยู่ในรายชื่อผู้เยี่ยมอยู่แล้ว" };
      }
      
      coVisitors.push({
        name: visitorName,
        position: visitorPosition,
        dept: visitorDept
      });
      
      await this.withTimeout(docRef.update({ coVisitors: coVisitors }));
      return { success: true };
    } else {
      const visits = JSON.parse(localStorage.getItem("visits"));
      const idx = visits.findIndex(v => v.id === visitId);
      if (idx === -1) return { success: false, message: "ไม่พบข้อมูลการเยี่ยม" };
      
      const vData = visits[idx];
      const coVisitors = vData.coVisitors || [];
      
      if (normalizeName(vData.visitor) === normName || coVisitors.some(cv => normalizeName(cv.name) === normName)) {
        return { success: false, message: "คุณอยู่ในรายชื่อผู้เยี่ยมอยู่แล้ว" };
      }
      
      coVisitors.push({
        name: visitorName,
        position: visitorPosition,
        dept: visitorDept
      });
      
      visits[idx].coVisitors = coVisitors;
      localStorage.setItem("visits", JSON.stringify(visits));
      return { success: true };
    }
  }
}

// Instantiate dbService
const dbService = new DbService();
window.dbService = dbService;

// --- APP UI STATE CONTROLLER ---
const AppState = {
  currentUser: null,
  allHistory: [],
  patients: [],
  schedules: [],
  selectedDate: new Date(),
  adlChartInstance: null,
  currentEditingVisitId: null,
  filterOnlyVisited: false,
  filterOnlyDeceased: false,

  async loadInitialData() {
    try {
      this.allHistory = await dbService.getVisitHistory();
      this.patients = await dbService.getPatients();
      this.schedules = await dbService.getSchedules();
    } catch (e) {
      console.error("Error loading data:", e);
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem("session_user");
    showPage("page-login");
    // Clear values
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
  }
};
window.AppState = AppState;

// --- ROUTING / SHOW PAGE CONTROLLER ---
function showPage(pageId) {
  // Hide all screens
  const screens = document.querySelectorAll(".app-screen");
  screens.forEach(s => s.classList.add("hidden"));
  
  // Show target screen
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove("hidden");
  }
  
  // Handle sidebar navigation highlight
  const navLinks = document.querySelectorAll(".menu-item");
  navLinks.forEach(link => {
    link.classList.remove("active");
    const linkPage = link.getAttribute("data-page");
    if (linkPage === pageId) {
      link.classList.add("active");
    }
  });

  // Handle bottom navigation highlight
  const bottomNavs = document.querySelectorAll(".bottom-nav-item");
  bottomNavs.forEach(nav => {
    nav.classList.remove("active");
    const navPage = nav.getAttribute("data-page");
    if (navPage === pageId) {
      nav.classList.add("active");
    }
  });

  // Auto trigger screen initializations
  if (pageId === "page-calendar") {
    renderCalendar();
  } else if (pageId === "page-history") {
    renderHistoryList();
  } else if (pageId === "page-eval-list") {
    renderEvalPatientList();
  } else if (pageId === "page-my-visits") {
    renderMyVisits();
  } else if (pageId === "page-admin-users") {
    renderAdminUsersList();
  } else if (pageId === "page-admin-patients") {
    renderAdminPatientsList();
  } else if (pageId === "page-patients") {
    renderPatientsList();
  } else if (pageId === "page-overview") {
    renderOverviewDashboard();
  }

  // Update sidebar and bottom nav visibility based on login state and page
  updateNavVisibility();

  // Scroll to top
  window.scrollTo(0, 0);
}
window.showPage = showPage;

function updateNavVisibility() {
  const sidebar = document.querySelector(".sidebar");
  const bottomNav = document.querySelector(".bottom-nav");
  const mainContent = document.querySelector(".main-content");
  
  const currentScreen = Array.from(document.querySelectorAll(".app-screen")).find(s => !s.classList.contains("hidden"));
  const screenId = currentScreen ? currentScreen.id : "";
  
  const isAuthPage = screenId === "page-login" || screenId === "page-register" || screenId === "page-profile-setup";
  
  if (isAuthPage) {
    if (sidebar) sidebar.classList.add("hidden");
    if (bottomNav) bottomNav.style.display = "none";
    if (mainContent) {
      mainContent.style.marginLeft = "0";
      mainContent.style.width = "100%";
      mainContent.style.paddingBottom = "2rem";
    }
  } else {
    const isAdmin = AppState.currentUser && AppState.currentUser.uid === "admin";
    
    document.querySelectorAll(".admin-item").forEach(el => {
      if (isAdmin) el.classList.remove("hidden");
      else el.classList.add("hidden");
    });
    document.querySelectorAll(".normal-user-item").forEach(el => {
      if (isAdmin) el.classList.add("hidden");
      else el.classList.remove("hidden");
    });

    const isMobile = window.innerWidth <= 768;
    if (sidebar) {
      if (isMobile) {
        sidebar.classList.add("hidden");
      } else {
        sidebar.classList.remove("hidden");
      }
    }
    if (bottomNav) {
      bottomNav.style.display = isMobile ? "flex" : "none";
    }
    if (mainContent) {
      if (isMobile) {
        mainContent.style.marginLeft = "0";
        mainContent.style.width = "100%";
        mainContent.style.paddingBottom = "5.5rem";
      } else {
        mainContent.style.marginLeft = "260px";
        mainContent.style.width = "calc(100% - 260px)";
        mainContent.style.paddingBottom = "2rem";
      }
    }
  }
}
window.updateNavVisibility = updateNavVisibility;
window.addEventListener("resize", updateNavVisibility);

function toggleLoading(show, text = "กำลังประมวลผล...") {
  const loader = document.getElementById("loading-screen");
  const loaderText = document.getElementById("loading-text");
  if (loader) {
    loaderText.innerText = text;
    if (show) {
      loader.classList.remove("hidden");
    } else {
      loader.classList.add("hidden");
    }
  }
}
window.toggleLoading = toggleLoading;

// --- BUSINESS LOGIC FUNCTIONS ---

// BMI auto-calculation
function calculateBMI() {
  const w = parseFloat(document.getElementById("f-weight").value);
  const h = parseFloat(document.getElementById("f-height").value);
  const bmiBox = document.getElementById("f-bmi");
  
  if (w > 0 && h > 0) {
    const hm = h / 100;
    const bmi = w / (hm * hm);
    let result = "";
    
    if (bmi < 18.5) result = "ผอม";
    else if (bmi < 23) result = "ปกติ";
    else if (bmi < 25) result = "ท้วม";
    else if (bmi < 30) result = "อ้วน 1";
    else result = "อ้วน 2";
    
    bmiBox.value = `${bmi.toFixed(2)} (${result})`;
  } else {
    bmiBox.value = "";
  }
}
window.calculateBMI = calculateBMI;

// Register form handler
async function handleRegister() {
  const user = document.getElementById("reg-username").value.trim();
  const pass = document.getElementById("reg-password").value.trim();
  
  if (!user || pass.length !== 6 || isNaN(pass)) {
    return alert("กรุณากรอกรหัสผู้ใช้งาน และรหัสผ่านเป็นตัวเลข 6 หลัก");
  }
  
  toggleLoading(true, "กำลังลงทะเบียน...");
  const res = await dbService.register(user, pass);
  toggleLoading(false);
  
  if (res.success) {
    AppState.currentUser = res.user;
    // Show Profile Setup
    document.getElementById("prof-uid").value = res.user.uid;
    showPage("page-profile-setup");
  } else {
    alert(res.message);
  }
}
window.handleRegister = handleRegister;

// Profile Setup Form handler
async function handleProfileSetup() {
  const uid = document.getElementById("prof-uid").value;
  const name = document.getElementById("prof-name").value.trim();
  const lastname = document.getElementById("prof-lastname").value.trim();
  const position = document.getElementById("prof-position").value.trim();
  const dept = document.getElementById("prof-dept").value;
  
  if (!name || !lastname || !position || !dept) {
    return alert("กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน");
  }
  
  toggleLoading(true, "กำลังบันทึกข้อมูลส่วนตัว...");
  const profileData = { name, lastname, position, dept };
  
  try {
    const res = await dbService.saveProfile(uid, profileData);
    toggleLoading(false);
    
    if (res.success) {
      alert("ข้อมูลโปรไฟล์บันทึกเรียบร้อย!");
      AppState.currentUser = { ...AppState.currentUser, ...profileData };
      updateUserSidebarUI();
      
      // Show PDPA Modal next
      openPdpaModal();
    } else {
      alert("ไม่สามารถบันทึกได้: " + res.message);
    }
  } catch (err) {
    toggleLoading(false);
    alert("ข้อผิดพลาดของระบบ: " + err.message);
  }
}
window.handleProfileSetup = handleProfileSetup;

// Login form handler
async function handleLogin() {
  const user = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value.trim();
  
  if (!user || !pass) {
    return alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
  }
  
  toggleLoading(true, "กำลังเข้าสู่ระบบ...");
  try {
    const res = await dbService.login(user, pass);
    toggleLoading(false);
    
    if (res.success) {
      AppState.currentUser = res.user;
      if (res.user.needProfile) {
        document.getElementById("prof-uid").value = res.user.uid;
        showPage("page-profile-setup");
      } else {
        updateUserSidebarUI();
        
        // Show PDPA Modal next
        openPdpaModal();
      }
    } else {
      alert(res.message);
    }
  } catch (err) {
    toggleLoading(false);
    alert("ข้อผิดพลาดของระบบ: " + err.message);
  }
}
window.handleLogin = handleLogin;

function updateUserSidebarUI() {
  const u = AppState.currentUser;
  if (u) {
    document.querySelectorAll(".user-name").forEach(el => el.innerText = `${u.name} ${u.lastname}`);
    document.querySelectorAll(".user-role").forEach(el => el.innerText = `${u.position} (${u.dept})`);
    document.querySelectorAll(".user-avatar").forEach(el => el.innerText = u.name.charAt(0));
    
    // Prefill form visitor/dept details
    document.getElementById("f-dept").value = u.dept;
    document.getElementById("f-visitor").value = `${u.name} ${u.lastname}`;
  }
}

// Change PIN handler
async function handleChangePin() {
  const pass = document.getElementById("new-pin").value.trim();
  if (pass.length !== 6 || isNaN(pass)) {
    return alert("รหัสผ่านต้องเป็นตัวเลข 6 หลัก");
  }
  toggleLoading(true, "กำลังบันทึกรหัสผ่านใหม่...");
  try {
    const res = await dbService.changePassword(AppState.currentUser.uid, pass);
    toggleLoading(false);
    if (res.success) {
      alert("แก้ไขรหัสผ่านสำเร็จ!");
      showPage("page-patients");
    } else {
      alert(res.message);
    }
  } catch (err) {
    toggleLoading(false);
    alert("ข้อผิดพลาดของระบบ: " + err.message);
  }
}
window.handleChangePin = handleChangePin;

// Automatic round name calculation helper
function updateAutoCalculatedRoundName(patientName, dateStr) {
  const roundInput = document.getElementById("f-visit-round");
  const roundInfoEl = document.getElementById("form-patient-round-info");
  
  if (!roundInput) return;

  if (!patientName || !dateStr) {
    roundInput.value = "";
    if (roundInfoEl) {
      roundInfoEl.style.display = "none";
      roundInfoEl.innerText = "";
    }
    return;
  }

  // Calculate Thai year (Christian Year + 543)
  const d = new Date(dateStr);
  const yearBE = d.getFullYear() + 543;
  const year2Digits = String(yearBE).slice(-2);

  // Find patient
  const patObj = AppState.patients.find(p => p.name === patientName);
  
  // Calculate and update the overall total visit round banner (e.g. รอบที่ 1, รอบที่ 2...)
  if (roundInfoEl) {
    const totalVisits = patObj ? AppState.allHistory.filter(h => h.patientId === patObj.id).length : 0;
    roundInfoEl.innerText = `การเยี่ยมรอบที่: ${totalVisits + 1} (คนไข้: ${patientName})`;
    roundInfoEl.style.display = "inline-block";
  }

  if (!patObj) {
    roundInput.value = `1/${year2Digits}`;
    return;
  }

  // Count visits for this patient in this Thai year
  const patientVisits = AppState.allHistory.filter(v => 
    v.patientId === patObj.id && 
    v.visitRound && 
    (v.visitRound.split("/")[1] === year2Digits || v.visitRound.endsWith("/" + year2Digits))
  );

  const nextRoundNum = patientVisits.length + 1;
  roundInput.value = `${nextRoundNum}/${year2Digits}`;
}
window.updateAutoCalculatedRoundName = updateAutoCalculatedRoundName;

// Visit Form opener
function openVisitForm(prefillPatient = "", scheduleId = "", isEdit = false) {
  AppState.currentEditingVisitId = null;
  
  const formTitle = document.getElementById("form-title");
  if (formTitle) {
    formTitle.innerText = "ฟอร์มบันทึกการเยี่ยมบ้าน";
  }
  const saveBtn = document.querySelector("#page-form button[onclick='handleSaveVisit()']");
  if (saveBtn) {
    saveBtn.innerHTML = `<i class="fas fa-floppy-disk"></i> บันทึกข้อมูลและประวัติการเยี่ยมบ้าน`;
  }
  
  // Reset all fields
  document.getElementById("f-date").valueAsDate = new Date();
  const patInput = document.getElementById("f-patient");
  if (patInput) {
    patInput.value = prefillPatient;
    patInput.removeAttribute("data-sched-id");
    const patDropdown = document.getElementById("f-patient-dropdown");
    if (patDropdown) patDropdown.classList.add("hidden");
  }
  
  let targetRound = "";
  if (scheduleId) {
    patInput.setAttribute("data-sched-id", scheduleId);
    const sched = AppState.schedules.find(s => s.id === scheduleId);
    if (sched) {
      if (sched.date) {
        document.getElementById("f-date").value = sched.date;
      }
      if (sched.targetRound) {
        targetRound = sched.targetRound;
      }
    }
  }
  
  // Load round (and inherit previous if targetRound is specified)
  if (targetRound) {
    document.getElementById("f-visit-round").value = targetRound;
  } else {
    updateAutoCalculatedRoundName(prefillPatient, document.getElementById("f-date").value);
  }
  
  // Reset remaining inputs
  document.getElementById("f-consc").value = "รู้สึกตัวดี";
  document.getElementById("f-adl").value = "0";
  document.getElementById("f-temp").value = "";
  document.getElementById("f-pulse").value = "";
  document.getElementById("f-resp").value = "";
  document.getElementById("f-bp").value = "";
  document.getElementById("f-waist").value = "";
  document.getElementById("f-arm").value = "";
  document.getElementById("f-calf").value = "";
  document.getElementById("f-weight").value = "";
  document.getElementById("f-height").value = "";
  document.getElementById("f-bmi").value = "";
  document.getElementById("f-motor-ra").value = "";
  document.getElementById("f-motor-la").value = "";
  document.getElementById("f-motor-rl").value = "";
  document.getElementById("f-motor-ll").value = "";
  document.getElementById("f-care-group").value = "";
  
  document.getElementById("f-tai-mob").value = "";
  document.getElementById("f-tai-act").value = "";
  document.getElementById("f-tai-self").value = "";
  document.getElementById("f-tai-eat").value = "";
  document.getElementById("f-tai-consc").value = "";
  
  document.getElementById("f-pps-mob").value = "";
  document.getElementById("f-pps-ment").value = "";
  document.getElementById("f-pps-eat").value = "";
  document.getElementById("f-pps-exc").value = "";
  
  document.getElementById("f-symptoms").value = "";
  document.getElementById("f-drug").value = "ไม่มีประวัติแพ้ยา";
  document.getElementById("f-food").value = "ไม่มีประวัติแพ้อาหาร";
  
  document.getElementById("f-note").value = "";
  document.getElementById("f-eval").value = "";
  document.getElementById("f-follow").value = "";
  document.getElementById("f-others").value = "";
  
  document.getElementById("f-docappt").value = "";
  document.getElementById("f-nextvisit").value = "";
  
  const unspecifiedCb = document.getElementById("f-nextvisit-unspecified");
  if (unspecifiedCb) {
    unspecifiedCb.checked = false;
  }
  document.getElementById("f-nextvisit").disabled = false;
  
  // Clear checklists
  const allCbs = document.querySelectorAll(".f-nursing-diag-cb, .f-service-pre-cb, .f-short-goal-cb, .f-long-goal-cb, .f-patient-prob-cb, .f-patient-need-cb");
  allCbs.forEach(cb => {
    cb.checked = false;
    const textId = cb.getAttribute("data-text-id");
    if (textId) {
      const txtInput = document.getElementById(textId);
      if (txtInput) {
        txtInput.value = "";
        txtInput.classList.add("hidden");
      }
    }
  });
  
  const imgPreview = document.getElementById("form-image-preview");
  if (imgPreview) {
    imgPreview.src = "";
    imgPreview.style.display = "none";
  }
  
  document.getElementById("f-image").value = "";
  // Patient select dropdown is populated at the start of openVisitForm
  
  // Re-fill visitor/dept details from currentUser
  const u = AppState.currentUser;
  if (u) {
    document.getElementById("f-dept").value = u.dept;
    document.getElementById("f-visitor").value = `${u.name} ${u.lastname}`;
  }

  // Pull latest previous visit data to prefill if this is a new visit
  if (!isEdit && prefillPatient) {
    handlePatientChangeInherit(prefillPatient);
  }
  
  showPage("page-form");
}
window.openVisitForm = openVisitForm;

// Visit Form Submission
async function handleSaveVisit() {
  const patientName = document.getElementById("f-patient").value.trim();
  if (!patientName) return alert("กรุณากรอกชื่อคนไข้");
  
  const visitRound = document.getElementById("f-visit-round").value;
  if (!visitRound) {
    return alert("กรุณาเลือกหรือเพิ่มรอบการเยี่ยมก่อนทำการบันทึก");
  }
  
  toggleLoading(true, "กำลังส่งข้อมูล...");
  
  try {
    // Handle image upload from file input
    const fileInput = document.getElementById("f-image");
    let imageBlob = "";
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      imageBlob = await new Promise(resolve => {
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      });
    }
    
    const visitorName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`;
    const patObj = await dbService.getOrCreatePatient(patientName, visitorName);
    
    const data = {
      date: document.getElementById("f-date").value,
      visitRound: visitRound,
      dept: AppState.currentUser.dept,
      visitor: visitorName,
      visitorPosition: AppState.currentUser.position || "",
      patientId: patObj.id,
      patientName: patientName,
      consciousness: document.getElementById("f-consc").value,
      temp: document.getElementById("f-temp").value,
      pulse: document.getElementById("f-pulse").value,
      resp: document.getElementById("f-resp").value,
      bp: document.getElementById("f-bp").value,
      adl: document.getElementById("f-adl").value,
      symptoms: document.getElementById("f-symptoms").value,
      drugAllergy: document.getElementById("f-drug").value,
      foodAllergy: document.getElementById("f-food").value,
      docAppt: document.getElementById("f-docappt").value,
      nextVisit: document.getElementById("f-nextvisit").value,
      visitNote: document.getElementById("f-note").value,
      evaluation: document.getElementById("f-eval").value,
      followUp: document.getElementById("f-follow").value,
      others: document.getElementById("f-others").value,
      imageBlob: imageBlob,
      
      // Measurements
      waist: document.getElementById("f-waist").value,
      arm: document.getElementById("f-arm").value,
      calf: document.getElementById("f-calf").value,
      weight: document.getElementById("f-weight").value,
      height: document.getElementById("f-height").value,
      bmi: document.getElementById("f-bmi").value,
      
      // Motor Power
      motorRA: document.getElementById("f-motor-ra").value,
      motorLA: document.getElementById("f-motor-la").value,
      motorRL: document.getElementById("f-motor-rl").value,
      motorLL: document.getElementById("f-motor-ll").value,
      
      // Care Group
      careGroup: document.getElementById("f-care-group").value,
      
      // TAI (5 items)
      taiMobility: document.getElementById("f-tai-mob").value,
      taiActivity: document.getElementById("f-tai-act").value,
      taiSelfCare: document.getElementById("f-tai-self").value,
      taiEating: document.getElementById("f-tai-eat").value,
      taiConscious: document.getElementById("f-tai-consc").value,
      
      // PPS (4 items)
      ppsMobility: document.getElementById("f-pps-mob").value,
      ppsMental: document.getElementById("f-pps-ment").value,
      ppsEating: document.getElementById("f-pps-eat").value,
      ppsExcretion: document.getElementById("f-pps-exc").value,
      
      // Checklists
      nursingDiagnosis: collectCheckboxSection("f-nursing-diag-cb"),
      servicePrecautions: collectCheckboxSection("f-service-pre-cb"),
      shortTermGoals: collectCheckboxSection("f-short-goal-cb"),
      longTermGoals: collectCheckboxSection("f-long-goal-cb"),
      patientProblems: collectCheckboxSection("f-patient-prob-cb"),
      patientNeeds: collectCheckboxSection("f-patient-need-cb")
    };
    
    let res;
    if (AppState.currentEditingVisitId) {
      const existingVisit = AppState.allHistory.find(v => v.id === AppState.currentEditingVisitId);
      data.imageUrl = existingVisit ? existingVisit.imageUrl : "";
      data.coVisitors = existingVisit ? (existingVisit.coVisitors || []) : [];
      res = await dbService.updateVisit(AppState.currentEditingVisitId, data);
    } else {
      res = await dbService.saveVisit(data);
    }
    
    // If visit was launched from a scheduled event, check it off as 'done'
    const schedId = document.getElementById("f-patient").getAttribute("data-sched-id");
    if (schedId) {
      await dbService.updateScheduleStatus(schedId, "done");
    }

    // Auto create calendar schedule for next visit if date is set
    if (data.nextVisit) {
      // Calculate target round for next visit: current round + 1
      const nextRoundStr = (parseInt(visitRound.split("/")[0]) + 1) + "/" + visitRound.split("/")[1];
      const nextSched = {
        patientId: patObj.id,
        patientName: patientName,
        date: data.nextVisit,
        visitorName: visitorName,
        status: "pending",
        targetRound: nextRoundStr
      };
      await dbService.saveSchedule(nextSched);
    }
    
    toggleLoading(false);
    if (res.success) {
      alert(AppState.currentEditingVisitId ? "แก้ไขข้อมูลการเยี่ยมบ้านเรียบร้อยแล้ว!" : "บันทึกการเยี่ยมบ้านเรียบร้อยแล้ว!");
      // Clear form inputs
      document.getElementById("f-patient").value = "";
      document.getElementById("f-temp").value = "";
      document.getElementById("f-pulse").value = "";
      document.getElementById("f-resp").value = "";
      document.getElementById("f-bp").value = "";
      document.getElementById("f-adl").value = "0";
      document.getElementById("f-symptoms").value = "";
      document.getElementById("f-drug").value = "ไม่มีประวัติแพ้ยา";
      document.getElementById("f-food").value = "ไม่มีประวัติแพ้อาหาร";
      document.getElementById("f-docappt").value = "";
      document.getElementById("f-nextvisit").value = "";
      document.getElementById("f-note").value = "";
      document.getElementById("f-eval").value = "";
      document.getElementById("f-follow").value = "";
      document.getElementById("f-others").value = "";
      document.getElementById("f-image").value = "";
      
      document.getElementById("f-waist").value = "";
      document.getElementById("f-arm").value = "";
      document.getElementById("f-calf").value = "";
      document.getElementById("f-weight").value = "";
      document.getElementById("f-height").value = "";
      document.getElementById("f-bmi").value = "";
      
      document.getElementById("f-motor-ra").value = "";
      document.getElementById("f-motor-la").value = "";
      document.getElementById("f-motor-rl").value = "";
      document.getElementById("f-motor-ll").value = "";
      document.getElementById("f-care-group").value = "";
      
      document.getElementById("f-tai-mob").value = "";
      document.getElementById("f-tai-act").value = "";
      document.getElementById("f-tai-self").value = "";
      document.getElementById("f-tai-eat").value = "";
      document.getElementById("f-tai-consc").value = "";
      
      document.getElementById("f-pps-mob").value = "";
      document.getElementById("f-pps-ment").value = "";
      document.getElementById("f-pps-eat").value = "";
      document.getElementById("f-pps-exc").value = "";
      
      // Clear checklists
      const allSectionCbs = document.querySelectorAll(".f-nursing-diag-cb, .f-service-pre-cb, .f-short-goal-cb, .f-long-goal-cb, .f-patient-prob-cb, .f-patient-need-cb");
      allSectionCbs.forEach(cb => {
        cb.checked = false;
        const textId = cb.getAttribute("data-text-id");
        if (textId) {
          const txtInput = document.getElementById(textId);
          if (txtInput) {
            txtInput.value = "";
            txtInput.classList.add("hidden");
          }
        }
      });
      const nextVisitUnspec = document.getElementById("f-nextvisit-unspecified");
      if (nextVisitUnspec) {
        nextVisitUnspec.checked = false;
        document.getElementById("f-nextvisit").disabled = false;
      }
      
      const imgPreview = document.getElementById("form-image-preview");
      if (imgPreview) {
        imgPreview.src = "";
        imgPreview.style.display = "none";
      }
      
      const savedPatientId = data.patientId;
      await AppState.loadInitialData();
      viewPatientDashboard(savedPatientId);
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + res.message);
    }
  } catch (err) {
    toggleLoading(false);
    alert("ข้อผิดพลาดของระบบ: " + err.message);
  }
}
window.handleSaveVisit = handleSaveVisit;

// --- RENDER VISITS HISTORY ---
function renderHistoryList() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const listDiv = document.getElementById("history-list");
  listDiv.innerHTML = "";
  
  const filterVal = document.getElementById("history-filter-patient") ? document.getElementById("history-filter-patient").value : "all";
  let myName = "";
  if (AppState.currentUser) {
    myName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`.trim();
  }
  
  let filtered = AppState.allHistory.filter(v => v.patientName.toLowerCase().includes(search));
  if (filterVal === "my" && myName) {
    const normMyName = normalizeName(myName);
    filtered = filtered.filter(v => {
      const isVisitVisitor = normalizeName(v.visitor) === normMyName;
      const patient = AppState.patients.find(p => p.id === v.patientId);
      const isPatientVisitor = patient && normalizeName(patient.visitor) === normMyName;
      return isVisitVisitor || isPatientVisitor;
    });
  }
  
  if (filtered.length === 0) {
    listDiv.innerHTML = '<p class="text-center text-muted py-8">ไม่พบรายชื่อคนไข้ที่มีประวัติการเยี่ยม</p>';
    return;
  }
  
  filtered.forEach(v => {
    const card = document.createElement("div");
    card.className = "card d-flex justify-between align-center";
    card.style.cursor = "pointer";
    card.style.padding = "1.25rem";
    card.style.marginBottom = "0.75rem";
    
    const dStr = new Date(v.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    
    // Check alarm status on vitals
    const bpSystolic = parseInt(v.bp.split('/')[0]) || 0;
    const isBpHigh = bpSystolic > 140;
    const isTempHigh = parseFloat(v.temp) > 37.5;
    
    let alertBadge = "";
    if (isBpHigh || isTempHigh) {
      alertBadge = `<span class="alert-pill alert-high"><i class="fas fa-exclamation-triangle"></i> เฝ้าระวัง</span>`;
    }
    
    card.innerHTML = `
      <div>
        <h4 style="font-weight:600; color:var(--text-dark);">${v.patientName}</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
          <i class="far fa-calendar-alt"></i> วันที่เยี่ยม: ${dStr} | รอบ: ${v.visitRound || '-'} | ผู้เยี่ยม: ${v.visitor} ${alertBadge}
        </p>
      </div>
      <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
        ดูรายละเอียด <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    card.onclick = () => viewDetailReport(v);
    listDiv.appendChild(card);
  });
}
window.renderHistoryList = renderHistoryList;

// --- VISIT DETAIL REPORT (PRINTABLE) ---
function viewDetailReport(v) {
  const backBtn = document.querySelector("#page-detail button[onclick^='showPage']");
  if (backBtn) {
    backBtn.setAttribute("onclick", `viewPatientDashboard('${v.patientId}')`);
    backBtn.innerHTML = `<i class="fas fa-chevron-left"></i> ย้อนกลับหน้าแรกคนไข้`;
  }

  const content = document.getElementById("detail-content");
  const dateStr = new Date(v.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const nextVisitDate = v.nextVisit ? new Date(v.nextVisit).toLocaleDateString('th-TH') : '-';
  
  let visitorPos = v.visitorPosition || "";
  if (!visitorPos) {
    const du = DEFAULT_USERS.find(u => normalizeName(`${u.name} ${u.lastname}`) === normalizeName(v.visitor));
    if (du) visitorPos = du.position;
  }
  let visitorDisplay = visitorPos ? `${v.visitor} (${visitorPos})` : v.visitor;
  visitorDisplay += ` (${v.dept || "-"})`;

  if (v.coVisitors && v.coVisitors.length > 0) {
    v.coVisitors.forEach(cv => {
      const posStr = cv.position ? ` (${cv.position})` : "";
      const deptStr = cv.dept ? ` (${cv.dept})` : " (-)";
      visitorDisplay += `, ${cv.name}${posStr}${deptStr}`;
    });
  }

  const patientVisitsAsc = AppState.allHistory
    .filter(h => h.patientId === v.patientId)
    .sort((a, b) => a.date.localeCompare(b.date));
  const chronologicalIndex = patientVisitsAsc.findIndex(h => h.id === v.id);
  const roundSequenceNumber = chronologicalIndex !== -1 ? chronologicalIndex + 1 : 1;

  content.innerHTML = `
    <div class="print-report-header text-center mb-6 border-b pb-4">
      <h2 style="font-size:1.6rem; font-weight:700; color:var(--accent-blue);">สรุปรายงานการเยี่ยมบ้านทีมสหวิชาชีพ</h2>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">รหัสคนไข้: ${v.patientId} | รหัสผู้ใช้ที่บันทึกข้อมูล: ${v.visitor}</p>
    </div>
    
    <div class="space-y-6">
      <!-- ข้อมูลทั่วไป -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--accent-blue); border-left:4px solid var(--accent-blue); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้อข้อมูลทั่วไป</h3>
        <div class="print-grid grid-2" style="font-size:0.9rem;">
          <p><b>วันที่ลงพื้นที่เยี่ยมบ้าน:</b> ${dateStr}</p>
          <p><b>ชื่อคนไข้ (ผู้รับการประเมิน):</b> ${v.patientName}</p>
          <p><b>หน่วยงาน / แผนกที่เยี่ยม:</b> ${v.dept}</p>
          <p><b>ชื่อเจ้าหน้าที่ผู้เข้าเยี่ยม:</b> ${visitorDisplay}</p>
          <p><b>การเยี่ยมรอบที่:</b> ${roundSequenceNumber}</p>
          <p><b>ชื่อวงรอบการเยี่ยม:</b> ${v.visitRound || '-'}</p>
        </div>
      </section>

      <!-- สัญญาณชีพและการประเมิน -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--accent-green); border-left:4px solid var(--accent-green); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้อสัญญาณชีพและการประเมิน</h3>
        <div class="print-grid grid-3" style="font-size:0.9rem; margin-bottom:10px;">
          <p><b>ความรู้สึกตัว:</b> ${v.consciousness}</p>
          <p><b>อุณหภูมิร่างกาย:</b> ${v.temp} °C</p>
          <p><b>ชีพจร (ครั้ง/นาที):</b> ${v.pulse}</p>
          <p><b>หายใจ (ครั้ง/นาที):</b> ${v.resp}</p>
          <p><b>ความดันโลหิต:</b> ${v.bp} mmHg</p>
          <p><b>ADL Score (0-20):</b> ${v.adl}</p>
        </div>
      </section>

      <!-- อาการและประวัติ -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--text-dark); border-left:4px solid var(--text-dark); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้ออาการและประวัติโรค</h3>
        <div style="font-size:0.9rem;" class="space-y-2">
          <p><b>อาการ/อาการแสดงขณะลงเยี่ยม:</b> ${v.symptoms || '-'}</p>
          <div class="print-grid grid-2" style="margin-top:0.5rem;">
            <p><b>ประวัติการแพ้ยา:</b> ${v.drugAllergy || 'ไม่มีประวัติแพ้ยา'}</p>
            <p><b>ประวัติการแพ้อาหาร:</b> ${v.foodAllergy || 'ไม่มีประวัติแพ้อาหาร'}</p>
          </div>
        </div>
      </section>

      <!-- การประเมินทางคลินิกเพิ่มเติม -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--accent-purple); border-left:4px solid var(--accent-purple); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้อการประเมินทางคลินิกเพิ่มเติม</h3>
        <div class="space-y-3" style="font-size:0.9rem;">
          <div class="print-grid grid-3" style="border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            <p><b>รอบเอว:</b> ${v.waist || '-'} ซม.</p>
            <p><b>รอบแขน:</b> ${v.arm || '-'} ซม.</p>
            <p><b>รอบน่อง:</b> ${v.calf || '-'} ซม.</p>
          </div>
          <div class="print-grid grid-3" style="border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            <p><b>น้ำหนัก:</b> ${v.weight || '-'} กก.</p>
            <p><b>ส่วนสูง:</b> ${v.height || '-'} ซม.</p>
            <p><b>BMI (ดัชนีมวลกาย):</b> ${v.bmi || '-'}</p>
          </div>
          
          <div style="border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            <p style="font-weight:600; margin-bottom:0.25rem;">กำลังของกล้ามเนื้อ (Motor Power)</p>
            <div class="print-grid grid-2">
              <p>แขนขวา: ${v.motorRA || '-'} | แขนซ้าย: ${v.motorLA || '-'}</p>
              <p>ขาขวา: ${v.motorRL || '-'} | ขาซ้าย: ${v.motorLL || '-'}</p>
            </div>
          </div>

          <div class="print-grid grid-2">
            <div>
              <p style="font-weight:600; margin-bottom:0.25rem;">ผลการคัดกรอง TAI Assessment</p>
              <p>• การเคลื่อนไหว: ${v.taiMobility || '-'}</p>
              <p>• การปฏิบัติกิจกรรม: ${v.taiActivity || '-'}</p>
              <p>• การดูแลตนเอง: ${v.taiSelfCare || '-'}</p>
              <p>• การกินอาหาร: ${v.taiEating || '-'}</p>
              <p>• สติสัมปชัญญะ: ${v.taiConscious || '-'}</p>
            </div>
            <div>
              <p style="font-weight:600; margin-bottom:0.25rem;">ผลการคัดกรอง PPS Assessment</p>
              <p>• การเคลื่อนที่: ${v.ppsMobility || '-'}</p>
              <p>• จิตใจ/ปัญญา: ${v.ppsMental || '-'}</p>
              <p>• การรับประทาน: ${v.ppsEating || '-'}</p>
              <p>• การขับถ่าย: ${v.ppsExcretion || '-'}</p>
            </div>
          </div>
          <div style="margin-top:0.5rem; font-weight:700;">กลุ่มการดูแลคนไข้ (Care Group): ${v.careGroup || '-'}</div>
        </div>
      </section>

      <!-- บันทึกและผลประเมิน -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--accent-teal); border-left:4px solid var(--accent-teal); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้อบันทึกและผลการประเมิน</h3>
        <div style="font-size:0.9rem;" class="space-y-3">
          <p><b>บันทึกข้อความเยี่ยมบ้าน:</b> ${v.visitNote || '-'}</p>
          <p><b>ผลการประเมินสุขภาพสะสม:</b> ${v.evaluation || '-'}</p>
          <p style="color:var(--accent-red); font-weight:600;"><b>ประเด็นเร่งด่วนที่ต้องติดตาม (Follow-Up):</b> ${v.followUp || '-'}</p>
          <p style="font-size:0.8rem; color:var(--text-muted);"><b>บันทึกข้อความอื่นๆ เพิ่มเติม:</b> ${v.others || '-'}</p>
          
          ${renderCheckboxSectionReport("การวินิจฉัยการพยาบาล", v.nursingDiagnosis, FORM_CHECKLISTS.nursingDiagnosis)}
          ${renderCheckboxSectionReport("ข้อควรระวังในการให้บริการ", v.servicePrecautions, FORM_CHECKLISTS.servicePrecautions)}
          ${renderCheckboxSectionReport("เป้าหมายระยะสั้น", v.shortTermGoals, FORM_CHECKLISTS.shortTermGoals)}
          ${renderCheckboxSectionReport("เป้าหมายระยะยาว", v.longTermGoals, FORM_CHECKLISTS.longTermGoals)}
          ${renderCheckboxSectionReport("ปัญหาของผู้ที่มีภาวะพึ่งพิง/ญาติ/ครอบครัว", v.patientProblems, FORM_CHECKLISTS.patientProblems)}
          ${renderCheckboxSectionReport("ความต้องการของผู้มีภาวะพึ่งพิง/ญาติ/ครอบครัว", v.patientNeeds, FORM_CHECKLISTS.patientNeeds)}
        </div>
      </section>

      <!-- การนัดหมายแพทย์ -->
      <section class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600; color:var(--accent-red); border-left:4px solid var(--accent-red); padding-left:0.5rem; margin-bottom:1rem; font-size:1.15rem;">หัวข้อการนัดหมายและแผนการเยี่ยมครั้งถัดไป</h3>
        <div class="print-grid grid-2" style="font-size:0.9rem;">
          <p><b>วันที่นัดพบแพทย์ ณ โรงพยาบาล:</b> ${v.docAppt || '-'}</p>
          <p><b>วันที่กำหนดนัดเยี่ยมครั้งต่อไป:</b> ${nextVisitDate}</p>
        </div>
      </section>
      
      <!-- รูปภาพแนบ (แสดงเฉพาะถ้ามี) -->
      ${v.imageUrl ? `
      <div class="text-center no-print" style="margin-top:1.5rem;">
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">ภาพประกอบการเยี่ยมบ้าน</p>
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.75rem;">
          <img src="${v.imageUrl}" style="max-width:100%; max-height:300px; border-radius:12px; border:1px solid #ccc; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          ${v.imageUrl.includes('id=') ? `
            <a href="https://drive.google.com/file/d/${v.imageUrl.split('id=')[1].split('&')[0]}/view" target="_blank" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px; text-decoration:none; color:inherit; border:1px solid #ccc; background:#f8fafc;">
              <i class="fa-solid fa-folder-open"></i> เปิดดูรูปภาพขนาดใหญ่ใน Google Drive
            </a>
          ` : ''}
        </div>
      </div>` : ''}
    </div>
  `;
  showPage("page-detail");
}
window.viewDetailReport = viewDetailReport;

function triggerSystemPrint(orientation) {
  const existing = document.getElementById("print-orientation-style");
  if (existing) existing.remove();
  
  const style = document.createElement("style");
  style.id = "print-orientation-style";
  style.innerHTML = `@page { size: ${orientation}; margin: 12mm; }`;
  document.head.appendChild(style);
  
  window.print();
}
window.triggerSystemPrint = triggerSystemPrint;

// Print Report action
function printCurrentReport(selectId) {
  const select = document.getElementById(selectId);
  const orientation = select ? select.value : "portrait";
  triggerSystemPrint(orientation);
}
window.printCurrentReport = printCurrentReport;

// --- VISIT CALENDAR CONTROLLER ---
function changeMonth(offset) {
  AppState.selectedDate.setMonth(AppState.selectedDate.getMonth() + offset);
  renderCalendar();
}
window.changeMonth = changeMonth;

function renderCalendar() {
  const grid = document.getElementById("calendar-grid-days");
  const monthTitle = document.getElementById("calendar-month-year");
  
  if (!grid || !monthTitle) return;
  
  grid.innerHTML = "";
  
  const date = AppState.selectedDate;
  const year = date.getFullYear();
  const month = date.getMonth();
  
  monthTitle.innerText = date.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
  
  // Calculate total days and offset weekday
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Empty blocks prior to 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    grid.appendChild(emptyCell);
  }
  
  const today = new Date();
  
  // Populate days of month
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    
    // Check if cell represents 'today'
    if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
      dayCell.classList.add("today");
    }
    
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check scheduled items for this date
    const filterVal = document.getElementById("cal-filter-visitor") ? document.getElementById("cal-filter-visitor").value : "all";
    let myName = "";
    if (AppState.currentUser) {
      myName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`.trim();
    }
    
    let daySchedules = AppState.schedules.filter(s => s.date === dayStr);
    if (filterVal === "my" && myName) {
      const normMyName = normalizeName(myName);
      daySchedules = daySchedules.filter(s => normalizeName(s.visitorName) === normMyName);
    }
    
    dayCell.innerHTML = `<span class="calendar-day-num">${day}</span>`;
    
    if (daySchedules.length > 0) {
      const badgeContainer = document.createElement("div");
      badgeContainer.className = "calendar-badge-container";
      
      daySchedules.forEach(s => {
        const badge = document.createElement("span");
        badge.className = `calendar-badge ${s.status}`;
        badge.title = `${s.patientName} (${s.status === 'done' ? 'เยี่ยมแล้ว' : 'รอดำเนินการ'})`;
        badgeContainer.appendChild(badge);
      });
      dayCell.appendChild(badgeContainer);
    }
    
    dayCell.onclick = () => selectCalendarDay(dayStr, daySchedules);
    grid.appendChild(dayCell);
  }
}
window.renderCalendar = renderCalendar;

// Show schedules detailed list under the calendar
function selectCalendarDay(dayStr, daySchedules) {
  const detailTitle = document.getElementById("calendar-day-title");
  const listDiv = document.getElementById("calendar-day-schedules");
  
  if (!detailTitle || !listDiv) return;
  
  const dObj = new Date(dayStr);
  detailTitle.innerText = `กำหนดนัดวันที่: ${dObj.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}`;
  listDiv.innerHTML = "";
  
  // Store selected date for 'Add event' modal pre-fill
  document.getElementById("sched-form-date").value = dayStr;
  
  if (daySchedules.length === 0) {
    listDiv.innerHTML = '<p class="text-center text-muted py-4">ไม่มีกำหนดการนัดหมายเยี่ยมบ้านในวันนี้</p>';
    return;
  }
  
  daySchedules.forEach(s => {
    const card = document.createElement("div");
    card.className = `schedule-card ${s.status}`;
    
    const statusText = s.status === 'done' ? 'เยี่ยมแล้ว' : 'รอดำเนินการ';
    const actionBtn = s.status === 'pending' ? 
      `<button onclick="openVisitForm('${s.patientName}', '${s.id}')" class="btn btn-primary" style="padding:0.35rem 0.75rem; font-size:0.75rem;"><i class="fas fa-check"></i> บันทึกการเยี่ยม</button>` : 
      `<span style="font-size:0.8rem; color:var(--accent-green);"><i class="fas fa-check-circle"></i> เรียบร้อย</span>`;
      
    const myName = AppState.currentUser ? `${AppState.currentUser.name} ${AppState.currentUser.lastname}`.trim() : "";
    const canDelete = normalizeName(s.visitorName) === normalizeName(myName) || (AppState.currentUser && AppState.currentUser.uid === 'admin');
    const deleteBtn = canDelete ? 
      `<button onclick="handleDeleteSchedule('${s.id}', '${dayStr}')" class="btn btn-danger" style="padding:0.35rem 0.75rem; font-size:0.75rem; background: var(--accent-red); color: white; border: none; margin-left: 0.25rem;" title="ลบกำหนดการ"><i class="fas fa-trash-can"></i></button>` : 
      '';
      
    card.innerHTML = `
      <div>
        <h4 style="font-weight:600; font-size:0.95rem;">${s.patientName}</h4>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">
          ผู้นัดหมาย: ${s.visitorName}
        </p>
      </div>
      <div class="d-flex align-center gap-2">
        <span class="schedule-status ${s.status}">${statusText}</span>
        ${actionBtn}
        ${deleteBtn}
      </div>
    `;
    listDiv.appendChild(card);
  });
}

function renderDynamicFormChecklists() {
  const container = document.getElementById("dynamic-checklist-sections");
  if (!container) return;
  
  let html = "";
  
  const sections = [
    {
      key: "nursingDiagnosis",
      title: "การวินิจฉัยการพยาบาล",
      className: "f-nursing-diag-cb",
      options: FORM_CHECKLISTS.nursingDiagnosis,
      themeColor: "var(--accent-blue)"
    },
    {
      key: "servicePrecautions",
      title: "ข้อควรระวังในการให้บริการ",
      className: "f-service-pre-cb",
      options: FORM_CHECKLISTS.servicePrecautions,
      themeColor: "var(--accent-red)"
    },
    {
      key: "shortTermGoals",
      title: "เป้าหมายระยะสั้น",
      className: "f-short-goal-cb",
      options: FORM_CHECKLISTS.shortTermGoals,
      themeColor: "var(--accent-teal)"
    },
    {
      key: "longTermGoals",
      title: "เป้าหมายระยะยาว",
      className: "f-long-goal-cb",
      options: FORM_CHECKLISTS.longTermGoals,
      themeColor: "var(--accent-purple)"
    },
    {
      key: "patientProblems",
      title: "ปัญหาของผู้ที่มีภาวะพึ่งพิง/ญาติ/ครอบครัว",
      className: "f-patient-prob-cb",
      options: FORM_CHECKLISTS.patientProblems,
      themeColor: "var(--text-dark)"
    },
    {
      key: "patientNeeds",
      title: "ความต้องการของผู้มีภาวะพึ่งพิง/ญาติ/ครอบครัว",
      className: "f-patient-need-cb",
      options: FORM_CHECKLISTS.patientNeeds,
      themeColor: "var(--accent-green)"
    }
  ];
  
  sections.forEach(sec => {
    html += `
      <div class="card" id="section-${sec.key}" style="border-left: 5px solid ${sec.themeColor}; margin-top: 1.5rem;">
        <div class="collapsible-header" onclick="toggleSectionCollapse('${sec.key}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
          <h3 style="font-weight:600; color:${sec.themeColor}; margin-bottom:0; font-size: 1.1rem;">
            <i class="fas fa-list-check"></i> ${sec.title}
          </h3>
          <span class="collapse-icon" id="icon-${sec.key}" style="color: ${sec.themeColor}; font-size: 1.1rem;"><i class="fas fa-chevron-down"></i></span>
        </div>
        <div class="collapsible-content hidden" id="content-${sec.key}" style="margin-top: 1.25rem;">
          <div class="checkbox-grid">
    `;
    
    sec.options.forEach(opt => {
      const hasText = opt.text.includes("ระบุ");
      const textId = hasText ? `${sec.className}-txt-${opt.id}` : "";
      const textAttr = hasText ? `data-text-id="${textId}" onchange="toggleCheckboxText(this)"` : "";
      
      html += `
        <div class="checkbox-item-wrapper">
          <label class="checkbox-item">
            <input type="checkbox" class="${sec.className}" value="${opt.id}" ${textAttr}>
            <span>${opt.text}</span>
          </label>
      `;
      if (hasText) {
        html += `
          <input type="text" id="${textId}" class="form-control mt-1 hidden" style="font-size:0.8rem; padding:0.4rem 0.75rem;" placeholder="ระบุรายละเอียดเพิ่มเติม...">
        `;
      }
      html += `</div>`;
    });
    
    html += `
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}
window.renderDynamicFormChecklists = renderDynamicFormChecklists;

function toggleSectionCollapse(key) {
  const contentDiv = document.getElementById(`content-${key}`);
  const iconSpan = document.getElementById(`icon-${key}`);
  if (contentDiv && iconSpan) {
    const isHidden = contentDiv.classList.contains("hidden");
    if (isHidden) {
      contentDiv.classList.remove("hidden");
      iconSpan.style.transform = "rotate(180deg)";
    } else {
      contentDiv.classList.add("hidden");
      iconSpan.style.transform = "rotate(0deg)";
    }
  }
}
window.toggleSectionCollapse = toggleSectionCollapse;

function updateSectionCollapseStates() {
  const sections = [
    { key: "nursingDiagnosis", className: "f-nursing-diag-cb" },
    { key: "servicePrecautions", className: "f-service-pre-cb" },
    { key: "shortTermGoals", className: "f-short-goal-cb" },
    { key: "longTermGoals", className: "f-long-goal-cb" },
    { key: "patientProblems", className: "f-patient-prob-cb" },
    { key: "patientNeeds", className: "f-patient-need-cb" }
  ];

  sections.forEach(sec => {
    const hasChecked = document.querySelectorAll(`.${sec.className}:checked`).length > 0;
    const contentDiv = document.getElementById(`content-${sec.key}`);
    const iconSpan = document.getElementById(`icon-${sec.key}`);
    
    if (contentDiv && iconSpan) {
      if (hasChecked) {
        contentDiv.classList.remove("hidden");
        iconSpan.style.transform = "rotate(180deg)";
      } else {
        contentDiv.classList.add("hidden");
        iconSpan.style.transform = "rotate(0deg)";
      }
    }
  });
}
window.updateSectionCollapseStates = updateSectionCollapseStates;

// Add visit schedule modal triggers
function openAddScheduleModal() {
  const modal = document.getElementById("modal-schedule");
  if (modal) {
    modal.classList.remove("hidden");
    
    const selectEl = document.getElementById("sched-form-patient");
    selectEl.innerHTML = '<option value="">-- กรุณาเลือกคนไข้ --</option>';
    const sortedPatients = [...AppState.patients].sort((a, b) => a.name.localeCompare(b.name, 'th'));
    sortedPatients.forEach(p => {
      selectEl.innerHTML += `<option value="${p.name}">${p.name}</option>`;
    });
  }
}
window.openAddScheduleModal = openAddScheduleModal;

function closeAddScheduleModal() {
  const modal = document.getElementById("modal-schedule");
  if (modal) modal.classList.add("hidden");
}
window.closeAddScheduleModal = closeAddScheduleModal;

async function handleSaveSchedule() {
  const patientName = document.getElementById("sched-form-patient").value;
  const visitDate = document.getElementById("sched-form-date").value;
  
  if (!patientName || !visitDate) {
    return alert("กรุณาเลือกคนไข้ และระบุวันนัดเยี่ยม");
  }
  
  toggleLoading(true, "กำลังบันทึกนัดหมาย...");
  try {
    const creatorName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`;
    const patObj = await dbService.getOrCreatePatient(patientName, creatorName);
    
    const scheduleData = {
      patientId: patObj.id,
      patientName: patientName,
      date: visitDate,
      visitorName: creatorName,
      status: "pending"
    };
    
    const res = await dbService.saveSchedule(scheduleData);
    toggleLoading(false);
    
    if (res.success) {
      alert("บันทึกนัดหมายสำเร็จแล้ว!");
      closeAddScheduleModal();
      await AppState.loadInitialData();
      renderCalendar();
      
      // Refresh selected day view
      const daySchedules = AppState.schedules.filter(s => s.date === visitDate);
      selectCalendarDay(visitDate, daySchedules);
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกนัดหมาย: " + res.message);
    }
  } catch (err) {
    toggleLoading(false);
    alert("ข้อผิดพลาดของระบบ: " + err.message);
  }
}
window.handleSaveSchedule = handleSaveSchedule;

// --- MY VISITS & VISIT STATISTICS PAGE ---
function renderMyVisits() {
  const myName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`;
  const normMyName = normalizeName(myName);
  
  // Filter schedules where current user is visitor
  const mySchedules = AppState.schedules.filter(s => normalizeName(s.visitorName) === normMyName);
  
  // Calculations
  const total = mySchedules.length;
  const completed = mySchedules.filter(s => s.status === 'done').length;
  const pending = total - completed;
  
  document.getElementById("my-stat-total").innerText = total;
  document.getElementById("my-stat-done").innerText = completed;
  document.getElementById("my-stat-pending").innerText = pending;
  
  // Render list of patients assigned to current user with visit statistics
  const patientGrid = document.getElementById("my-patients-list");
  patientGrid.innerHTML = "";
  
  // Group patients visited or scheduled by this user
  const myVisitLogs = AppState.allHistory.filter(v => 
    normalizeName(v.visitor) === normMyName || 
    (v.coVisitors && v.coVisitors.some(cv => normalizeName(cv.name) === normMyName))
  );
  
  const patientMap = new Map();
  
  // Seed from visit logs
  myVisitLogs.forEach(v => {
    if (!patientMap.has(v.patientId)) {
      patientMap.set(v.patientId, { id: v.patientId, name: v.patientName, count: 0, lastDate: null, maxAdl: 0 });
    }
    const pInfo = patientMap.get(v.patientId);
    pInfo.count++;
    if (!pInfo.lastDate || v.date > pInfo.lastDate) {
      pInfo.lastDate = v.date;
    }
    const valAdl = parseInt(v.adl) || 0;
    if (valAdl > pInfo.maxAdl) {
      pInfo.maxAdl = valAdl;
    }
  });
  
  // Seed from schedules
  mySchedules.forEach(s => {
    if (!patientMap.has(s.patientId)) {
      patientMap.set(s.patientId, { id: s.patientId, name: s.patientName, count: 0, lastDate: null, maxAdl: 0 });
    }
  });
  
  if (patientMap.size === 0) {
    patientGrid.innerHTML = '<p class="text-center text-muted py-6">คุณยังไม่มีตารางนัดหมาย หรือประวัติการบันทึกเยี่ยม</p>';
    return;
  }
  
  patientMap.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.padding = "1.25rem";
    card.style.marginBottom = "0.75rem";
    
    const lastDateStr = p.lastDate ? new Date(p.lastDate).toLocaleDateString("th-TH") : "ยังไม่เคยเข้าเยี่ยม";
    
    card.innerHTML = `
      <div class="d-flex justify-between align-center">
        <div>
          <h4 style="font-weight:600; color:var(--text-dark);">${p.name}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">
            รหัส: ${p.id} | เยี่ยมแล้วทั้งหมด: <span style="font-weight:600; color:var(--accent-blue);">${p.count} ครั้ง</span>
          </p>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.1rem;">
            เยี่ยมครั้งล่าสุดเมื่อ: ${lastDateStr} | คะแนน ADL สูงสุด: ${p.maxAdl}/20
          </p>
        </div>
        <button onclick="viewPatientDashboard('${p.id}')" class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.75rem;">
          <i class="fas fa-chart-line"></i> แดชบอร์ดคนไข้
        </button>
      </div>
    `;
    patientGrid.appendChild(card);
  });
}
window.renderMyVisits = renderMyVisits;

function printMyVisits(selectId) {
  const select = document.getElementById(selectId);
  const orientation = select ? select.value : "portrait";
  triggerSystemPrint(orientation);
}
window.printMyVisits = printMyVisits;

function printDashboard(selectId) {
  const select = document.getElementById(selectId);
  const orientation = select ? select.value : "landscape";
  triggerSystemPrint(orientation);
}
window.printDashboard = printDashboard;

function printCalendar(selectId) {
  const select = document.getElementById(selectId);
  const orientation = select ? select.value : "landscape";
  triggerSystemPrint(orientation);
}
window.printCalendar = printCalendar;

// --- INDIVIDUAL PATIENT EVALUATION LIST ---
function renderEvalPatientList() {
  const search = document.getElementById("search-eval-input").value.toLowerCase();
  const listDiv = document.getElementById("eval-patient-list");
  listDiv.innerHTML = "";
  
  const filterVal = document.getElementById("eval-filter-patient") ? document.getElementById("eval-filter-patient").value : "all";
  let myName = "";
  if (AppState.currentUser) {
    myName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`.trim();
  }
  
  let filtered = AppState.patients.filter(p => p.name.toLowerCase().includes(search));
  if (filterVal === "my" && myName) {
    const normMyName = normalizeName(myName);
    filtered = filtered.filter(p => normalizeName(p.visitor) === normMyName);
  }
  
  if (filtered.length === 0) {
    listDiv.innerHTML = '<p class="text-center text-muted py-8">ไม่พบรายชื่อคนไข้</p>';
    return;
  }
  
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card d-flex justify-between align-center";
    card.style.cursor = "pointer";
    card.style.padding = "1.25rem";
    card.style.marginBottom = "0.75rem";
    
    card.innerHTML = `
      <div>
        <h4 style="font-weight:600; color:var(--text-dark);">${p.name}</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
          รหัสคนไข้: ${p.id} | ผู้ดูแลหลัก: ${p.visitor || '-'}
        </p>
      </div>
      <button class="btn btn-primary" style="padding:0.4rem 0.8rem; font-size:0.75rem;">
        ดูวิเคราะห์กราฟ <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    card.onclick = () => viewPatientDashboard(p.id);
    listDiv.appendChild(card);
  });
}
window.renderEvalPatientList = renderEvalPatientList;

// --- VISITS TREND DASHBOARD ---
function viewPatientDashboard(patientId) {
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) {
    alert("ไม่พบข้อมูลคนไข้รายนี้");
    return;
  }

  const patientVisits = AppState.allHistory.filter(h => h.patientId === patientId);
  const sortedVisitsAsc = [...patientVisits].sort((a, b) => a.date.localeCompare(b.date));

  const isDeceased = patient.status === "เสียชีวิต";
  const statusSuffix = isDeceased ? " (เสียชีวิต)" : "";
  document.getElementById("dash-patient-name").innerText = patient.name + statusSuffix;
  document.getElementById("dash-patient-id").innerText = "รหัสคนไข้: " + patientId;
  document.getElementById("dash-patient-care-group").innerText = "กลุ่มการดูแล: " + (patient.careGroup || "กลุ่ม 1");

  // Change card color based on patient status
  const dashHeaderCard = document.getElementById("dash-header-card");
  if (dashHeaderCard) {
    if (isDeceased) {
      dashHeaderCard.style.background = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";
    } else {
      dashHeaderCard.style.background = "var(--primary-gradient)";
    }
  }

  // Disable new visit and schedule buttons if deceased
  const btnNewVisit = document.getElementById("btn-patient-new-visit");
  const btnSchedule = document.getElementById("btn-patient-schedule");
  if (isDeceased) {
    if (btnNewVisit) {
      btnNewVisit.disabled = true;
      btnNewVisit.style.opacity = "0.5";
      btnNewVisit.style.cursor = "not-allowed";
      btnNewVisit.title = "ไม่สามารถบันทึกการเยี่ยมได้เนื่องจากคนไข้เสียชีวิตแล้ว";
      btnNewVisit.onclick = null;
    }
    if (btnSchedule) {
      btnSchedule.disabled = true;
      btnSchedule.style.opacity = "0.5";
      btnSchedule.style.cursor = "not-allowed";
      btnSchedule.title = "ไม่สามารถนัดหมายการเยี่ยมได้เนื่องจากคนไข้เสียชีวิตแล้ว";
      btnSchedule.onclick = null;
    }
  } else {
    if (btnNewVisit) {
      btnNewVisit.disabled = false;
      btnNewVisit.style.opacity = "";
      btnNewVisit.style.cursor = "";
      btnNewVisit.title = "";
      btnNewVisit.onclick = () => openNewVisitForm(patient.name);
    }
    if (btnSchedule) {
      btnSchedule.disabled = false;
      btnSchedule.style.opacity = "";
      btnSchedule.style.cursor = "";
      btnSchedule.title = "";
      btnSchedule.onclick = () => openAddScheduleModalForPatient(patient.name);
    }
  }

  // Caregivers list (unique visitors)
  const caregiversMap = new Map();
  sortedVisitsAsc.forEach(v => {
    if (v.visitor) {
      let position = v.visitorPosition || "";
      if (!position) {
        // Fallback to DEFAULT_USERS
        const du = DEFAULT_USERS.find(u => normalizeName(`${u.name} ${u.lastname}`) === normalizeName(v.visitor));
        if (du) position = du.position;
      }
      caregiversMap.set(normalizeName(v.visitor), {
        name: v.visitor,
        dept: v.dept || "ไม่ระบุแผนก",
        position: position
      });
    }
    if (v.coVisitors && v.coVisitors.length > 0) {
      v.coVisitors.forEach(cv => {
        if (cv.name) {
          caregiversMap.set(normalizeName(cv.name), {
            name: cv.name,
            dept: cv.dept || "ไม่ระบุแผนก",
            position: cv.position || ""
          });
        }
      });
    }
  });
  let caregiversText = "";
  if (caregiversMap.size > 0) {
    caregiversText = Array.from(caregiversMap.values()).map(info => {
      const posDept = info.position ? `${info.position}, ${info.dept}` : info.dept;
      return `${info.name} (${posDept})`;
    }).join(", ");
  } else {
    caregiversText = "ไม่มีประวัติการเยี่ยม";
  }
  document.getElementById("dash-caregivers-list").innerText = caregiversText;

  // Next scheduled visit
  const nextSched = AppState.schedules.find(s => s.patientId === patientId && s.status === 'pending');
  if (nextSched) {
    const dStr = new Date(nextSched.date).toLocaleDateString("th-TH");
    document.getElementById("dash-next-visit-plan").innerText = `${dStr} (โดย ${nextSched.visitorName})`;
  } else {
    document.getElementById("dash-next-visit-plan").innerText = "ไม่มีกำหนดการนัดเยี่ยม";
  }

  const tableBody = document.getElementById("dash-table-body");
  tableBody.innerHTML = "";

  if (sortedVisitsAsc.length === 0) {
    // Empty state
    document.getElementById("dash-patient-weight").innerText = "-";
    document.getElementById("dash-patient-height").innerText = "-";
    document.getElementById("dash-patient-bmi").innerText = "-";
    document.getElementById("dash-adl-latest").innerText = "-";
    
    const deltaText = document.getElementById("dash-adl-delta");
    deltaText.innerText = "ยังไม่มีประวัติการประเมิน";
    deltaText.className = "text-xs text-gray-400";

    document.getElementById("dash-adl-avg").innerText = "-";
    document.getElementById("dash-visit-count").innerText = "จากทั้งหมด 0 ครั้ง";

    const trendBox = document.getElementById("dash-trend-box");
    trendBox.style.borderColor = "#cbd5e1";
    trendBox.style.backgroundColor = "#f8fafc";
    document.getElementById("dash-trend-text").innerHTML = "ไม่มีข้อมูลแนวโน้มสุขภาพ";

    if (AppState.adlChartInstance) {
      AppState.adlChartInstance.destroy();
      AppState.adlChartInstance = null;
    }

    tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-muted">ยังไม่มีประวัติการประเมินรอบการเยี่ยม</td></tr>`;
  } else {
    // Populate data
    const latestVisit = sortedVisitsAsc[sortedVisitsAsc.length - 1];
    const previousVisit = sortedVisitsAsc.length > 1 ? sortedVisitsAsc[sortedVisitsAsc.length - 2] : null;

    document.getElementById("dash-patient-weight").innerText = latestVisit.weight || "-";
    document.getElementById("dash-patient-height").innerText = latestVisit.height || "-";
    document.getElementById("dash-patient-bmi").innerText = latestVisit.bmi || "-";

    const adlLatest = parseInt(latestVisit.adl) || 0;
    document.getElementById("dash-adl-latest").innerText = adlLatest;

    const deltaText = document.getElementById("dash-adl-delta");
    if (previousVisit) {
      const diff = adlLatest - (parseInt(previousVisit.adl) || 0);
      deltaText.innerText = (diff >= 0 ? "+" : "") + diff + " จากครั้งก่อน";
      deltaText.className = "text-xs font-bold " + (diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-400");
    } else {
      deltaText.innerText = "บันทึกครั้งแรก";
      deltaText.className = "text-xs text-gray-400";
    }

    const adlSum = sortedVisitsAsc.reduce((acc, curr) => acc + (parseInt(curr.adl) || 0), 0);
    const adlAvg = (adlSum / sortedVisitsAsc.length).toFixed(1);
    document.getElementById("dash-adl-avg").innerText = adlAvg;
    document.getElementById("dash-visit-count").innerText = `จากทั้งหมด ${sortedVisitsAsc.length} ครั้ง`;

    const trendBox = document.getElementById("dash-trend-box");
    const trendText = document.getElementById("dash-trend-text");
    const firstAdl = parseInt(sortedVisitsAsc[0].adl) || 0;
    const healthDiff = adlLatest - firstAdl;

    if (healthDiff > 0) {
      trendBox.style.borderColor = "var(--accent-green)";
      trendBox.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
      trendText.innerHTML = `<span style="color:var(--accent-green); font-weight:700;"><i class="fas fa-arrow-up"></i> มีพัฒนาการที่ดีขึ้น (+${healthDiff} คะแนน)</span>`;
    } else if (healthDiff < 0) {
      trendBox.style.borderColor = "var(--accent-red)";
      trendBox.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
      trendText.innerHTML = `<span style="color:var(--accent-red); font-weight:700;"><i class="fas fa-arrow-down"></i> ร่างกายมีภาวะอ่อนแรงลง (${healthDiff} คะแนน)</span>`;
    } else {
      trendBox.style.borderColor = "#cbd5e1";
      trendBox.style.backgroundColor = "#f8fafc";
      trendText.innerHTML = `<span style="color:var(--text-muted); font-weight:700;"><i class="fas fa-minus"></i> สุขภาพร่างกายคงที่</span>`;
    }

    // Chart.js
    const chartData = sortedVisitsAsc.slice(-10);
    const labels = chartData.map(v => new Date(v.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }));
    const scores = chartData.map(v => parseInt(v.adl) || 0);

    if (AppState.adlChartInstance) AppState.adlChartInstance.destroy();
    const ctx = document.getElementById('adlChart').getContext('2d');
    AppState.adlChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'คะแนน ADL',
          data: scores,
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: '#7c3aed'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 20,
            ticks: { stepSize: 1 }
          }
        },
        plugins: { legend: { display: false } }
      }
    });

    // Populate table rows (descending order)
    const sortedVisitsDesc = [...sortedVisitsAsc].reverse();
    sortedVisitsDesc.forEach(v => {
      const chronoIndex = sortedVisitsAsc.findIndex(h => h.id === v.id);
      const seqNum = chronoIndex !== -1 ? chronoIndex + 1 : 1;

      let visitorPos = v.visitorPosition || "";
      if (!visitorPos) {
        const du = DEFAULT_USERS.find(u => normalizeName(`${u.name} ${u.lastname}`) === normalizeName(v.visitor));
        if (du) visitorPos = du.position;
      }
      let visitorDisplay = visitorPos ? `${v.visitor} (${visitorPos})` : v.visitor;
      visitorDisplay += ` (${v.dept || "-"})`;

      // Append co-visitors
      if (v.coVisitors && v.coVisitors.length > 0) {
        v.coVisitors.forEach(cv => {
          const posStr = cv.position ? ` (${cv.position})` : "";
          const deptStr = cv.dept ? ` (${cv.dept})` : " (-)";
          visitorDisplay += `, ${cv.name}${posStr}${deptStr}`;
        });
      }

      const currentUserFullName = AppState.currentUser ? `${AppState.currentUser.name} ${AppState.currentUser.lastname}` : "";
      const currentNorm = normalizeName(currentUserFullName);
      const isAlreadyVisitor = normalizeName(v.visitor) === currentNorm || (v.coVisitors && v.coVisitors.some(cv => normalizeName(cv.name) === currentNorm));
      
      const isAdmin = AppState.currentUser && AppState.currentUser.uid === "admin";
      const canEditVisit = isAdmin || isAlreadyVisitor;
      const canDeleteVisit = isAdmin || (normalizeName(v.visitor) === currentNorm);

      const joinBtn = (!isAlreadyVisitor && AppState.currentUser)
        ? `<button onclick="handleJoinVisit('${v.id}')" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: var(--accent-green); color: var(--accent-green); font-weight: normal; margin-right: 0.25rem;"><i class="fas fa-user-plus"></i> ร่วมเยี่ยม</button>`
        : "";

      const editBtn = canEditVisit
        ? `<button onclick="openEditVisitForm('${v.id}')" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: var(--accent-blue); color: var(--accent-blue); font-weight: normal; margin-right: 0.25rem;"><i class="fas fa-edit"></i> แก้ไข</button>`
        : `<button disabled class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: #cbd5e1; color: #cbd5e1; cursor: not-allowed; opacity: 0.6; margin-right: 0.25rem;" title="แก้ไขได้เฉพาะผู้ลงเยี่ยมหรือผู้ร่วมเยี่ยมเท่านั้น"><i class="fas fa-edit"></i> แก้ไข</button>`;

      const deleteBtn = canDeleteVisit
        ? `<button onclick="handleDeleteVisit('${v.id}')" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: var(--accent-red); color: var(--accent-red); font-weight: normal;"><i class="fas fa-trash-alt"></i> ลบ</button>`
        : `<button disabled class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: #cbd5e1; color: #cbd5e1; cursor: not-allowed; opacity: 0.6;" title="ลบได้เฉพาะผู้บันทึกรอบนี้เท่านั้น"><i class="fas fa-trash-alt"></i> ลบ</button>`;

      const dStr = new Date(v.date).toLocaleDateString("th-TH");
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #f1f5f9";
      tr.innerHTML = `
        <td class="p-3 text-center font-bold" style="color: var(--accent-purple);">${seqNum}</td>
        <td class="p-3 font-semibold" style="color: var(--text-dark);">${v.visitRound || "-"}</td>
        <td class="p-3">${dStr}</td>
        <td class="p-3 font-semibold" style="color: var(--accent-blue);">${v.adl} /20</td>
        <td class="p-3" style="font-size: 0.8rem; color: var(--text-muted);">
          BP: ${v.bp || "-"} | Pulse: ${v.pulse || "-"} | Temp: ${v.temp || "-"} °C
        </td>
        <td class="p-3" style="font-size: 0.8rem;">${visitorDisplay}</td>
        <td class="p-3 text-center" style="white-space: nowrap;">
          ${joinBtn}
          <button onclick="viewDetailReportFromId('${v.id}')" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-right: 0.25rem; font-weight: normal;"><i class="fas fa-file-invoice"></i> รายงาน</button>
          ${editBtn}
          ${deleteBtn}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  showPage("page-eval-dashboard");
}
window.viewPatientDashboard = viewPatientDashboard;

// Action helper functions
function viewDetailReportFromId(visitId) {
  const v = AppState.allHistory.find(h => h.id === visitId);
  if (v) viewDetailReport(v);
}
window.viewDetailReportFromId = viewDetailReportFromId;

function openEditVisitForm(visitId) {
  const v = AppState.allHistory.find(h => h.id === visitId);
  if (v) {
    const currentUserFullName = AppState.currentUser ? `${AppState.currentUser.name} ${AppState.currentUser.lastname}` : "";
    const currentNorm = normalizeName(currentUserFullName);
    const isAlreadyVisitor = normalizeName(v.visitor) === currentNorm || (v.coVisitors && v.coVisitors.some(cv => normalizeName(cv.name) === currentNorm));
    const isAdmin = AppState.currentUser && AppState.currentUser.uid === "admin";
    if (!isAdmin && !isAlreadyVisitor) {
      return alert("คุณไม่มีสิทธิ์แก้ไขรายงานรอบนี้ เนื่องจากไม่ใช่ผู้ลงเยี่ยมหลักหรือผู้ร่วมเยี่ยม");
    }

    openVisitForm(v.patientName, "", true);
    prefillVisitFormFromRecord(v, false);
    showPage("page-form");
  }
}
window.openEditVisitForm = openEditVisitForm;

function openNewVisitForm(patientName) {
  const patient = AppState.patients.find(p => p.name === patientName);
  let pendingSchedId = "";
  if (patient) {
    const pendingSched = AppState.schedules.find(s => s.patientId === patient.id && s.status === 'pending');
    if (pendingSched) {
      pendingSchedId = pendingSched.id;
    }
  }
  openVisitForm(patientName, pendingSchedId);
  const finalDateStr = document.getElementById("f-date").value;
  updateAutoCalculatedRoundName(patientName, finalDateStr);
  showPage("page-form");
}
window.openNewVisitForm = openNewVisitForm;

function openAddScheduleModalForPatient(patientName) {
  openAddScheduleModal();
  const selectEl = document.getElementById("sched-form-patient");
  if (selectEl) {
    selectEl.value = patientName;
  }
}
window.openAddScheduleModalForPatient = openAddScheduleModalForPatient;

let overviewCareGroupChartInstance = null;
let overviewDeptChartInstance = null;

function renderOverviewDashboard() {
  const totalPatients = AppState.patients.length;
  const totalScheduled = AppState.schedules.length;
  const completedVisits = AppState.schedules.filter(s => s.status === 'done').length;
  const pendingVisits = AppState.schedules.filter(s => s.status === 'pending').length;
  
  // Visit Success Rate
  let successRate = 0;
  if (totalScheduled > 0) {
    successRate = (completedVisits / totalScheduled) * 100;
  }
  
  // Average ADL Score of patients (using latest visit ADL, or default to 0 if no visits)
  let totalAdl = 0;
  let patientsWithAdlCount = 0;
  
  AppState.patients.forEach(pat => {
    const patVisits = AppState.allHistory.filter(v => v.patientId === pat.id);
    if (patVisits.length > 0) {
      patVisits.sort((a, b) => b.date.localeCompare(a.date));
      const latestAdl = parseFloat(patVisits[0].adl);
      if (!isNaN(latestAdl)) {
        totalAdl += latestAdl;
        patientsWithAdlCount++;
      }
    }
  });
  
  const avgAdl = patientsWithAdlCount > 0 ? (totalAdl / patientsWithAdlCount).toFixed(1) : "N/A";

  // Update DOM
  document.getElementById("ov-stat-patients").innerText = totalPatients;
  document.getElementById("ov-stat-scheduled").innerText = totalScheduled;
  document.getElementById("ov-stat-completed").innerText = completedVisits;
  document.getElementById("ov-stat-pending").innerText = pendingVisits;
  document.getElementById("ov-stat-rate").innerText = `${successRate.toFixed(1)}%`;
  document.getElementById("ov-stat-avg-adl").innerText = avgAdl;

  // Chart 1: Patients by Care Group
  const groupCounts = { "กลุ่ม 1": 0, "กลุ่ม 2": 0, "กลุ่ม 3": 0, "กลุ่ม 4": 0, "อื่นๆ/ไม่ระบุ": 0 };
  AppState.patients.forEach(p => {
    const cg = p.careGroup ? p.careGroup.trim() : "";
    if (groupCounts[cg] !== undefined) {
      groupCounts[cg]++;
    } else {
      groupCounts["อื่นๆ/ไม่ระบุ"]++;
    }
  });

  const careLabels = Object.keys(groupCounts);
  const careData = Object.values(groupCounts);

  if (overviewCareGroupChartInstance) overviewCareGroupChartInstance.destroy();
  const ctx1 = document.getElementById("ov-care-group-chart").getContext("2d");
  overviewCareGroupChartInstance = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: careLabels,
      datasets: [{
        data: careData,
        backgroundColor: [
          '#10b981', // teal/green
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#ef4444', // red
          '#94a3b8'  // slate
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Kanit' }
          }
        }
      }
    }
  });

  // Chart 2: Visits by Department
  const deptCounts = {};
  AppState.allHistory.forEach(v => {
    const dept = v.dept || "ไม่ระบุแผนก";
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const deptLabels = Object.keys(deptCounts);
  const deptData = Object.values(deptCounts);

  if (overviewDeptChartInstance) overviewDeptChartInstance.destroy();
  const ctx2 = document.getElementById("ov-dept-chart").getContext("2d");
  overviewDeptChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: deptLabels,
      datasets: [{
        label: 'จำนวนครั้งที่เยี่ยมจริง',
        data: deptData,
        backgroundColor: '#7c3aed',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'Kanit' },
          bodyFont: { family: 'Kanit' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        },
        x: {
          ticks: {
            font: { family: 'Kanit', size: 10 }
          }
        }
      }
    }
  });

  // Populate detailed visits table (Counts and Percentages by caregiver's profession/position)
  const deptTableBody = document.getElementById("ov-dept-table-container");
  if (deptTableBody) {
    const positionCounts = {};
    let totalPositionVisits = 0;
    AppState.allHistory.forEach(v => {
      let pos = v.visitorPosition || "";
      if (!pos && v.visitor) {
        const du = DEFAULT_USERS.find(u => `${u.name} ${u.lastname}` === v.visitor);
        if (du) pos = du.position;
      }
      pos = pos || "ไม่ระบุวิชาชีพ";
      positionCounts[pos] = (positionCounts[pos] || 0) + 1;
      totalPositionVisits++;

      // Include co-visitors positions
      if (v.coVisitors && v.coVisitors.length > 0) {
        v.coVisitors.forEach(cv => {
          let cvPos = cv.position || "ไม่ระบุวิชาชีพ";
          positionCounts[cvPos] = (positionCounts[cvPos] || 0) + 1;
          totalPositionVisits++;
        });
      }
    });

    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; margin-top: 0.5rem;">
        <thead>
          <tr style="border-bottom: 2px solid #cbd5e1; color: var(--text-muted);">
            <th style="padding: 0.5rem 0.25rem; text-align: left;">วิชาชีพผู้ลงเยี่ยม</th>
            <th style="padding: 0.5rem 0.25rem; text-align: center; width: 100px;">จำนวน (ครั้ง)</th>
            <th style="padding: 0.5rem 0.25rem; text-align: right; width: 100px;">สัดส่วน (%)</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    if (totalPositionVisits === 0) {
      tableHtml += `
        <tr>
          <td colspan="3" class="text-center p-3 text-muted">ยังไม่มีประวัติการเยี่ยมในระบบ</td>
        </tr>
      `;
    } else {
      Object.entries(positionCounts).sort((a, b) => b[1] - a[1]).forEach(([pos, count]) => {
        const pct = ((count / totalPositionVisits) * 100).toFixed(1);
        tableHtml += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.5rem 0.25rem; font-weight: 500;">${pos}</td>
            <td style="padding: 0.5rem 0.25rem; text-align: center; font-weight: 600; color: var(--text-dark);">${count}</td>
            <td style="padding: 0.5rem 0.25rem; text-align: right; font-weight: 600; color: var(--accent-purple);">${pct}%</td>
          </tr>
        `;
      });
    }
    tableHtml += `</tbody></table>`;
    deptTableBody.innerHTML = tableHtml;
  }
}
window.renderOverviewDashboard = renderOverviewDashboard;

// --- ADMIN MODAL & PAGE HANDLERS ---
function openAdminLoginModal() {
  document.getElementById("modal-admin-login").classList.remove("hidden");
  document.getElementById("admin-pin-input").value = "";
}
window.openAdminLoginModal = openAdminLoginModal;

function closeAdminLoginModal() {
  document.getElementById("modal-admin-login").classList.add("hidden");
}
window.closeAdminLoginModal = closeAdminLoginModal;

function handleAdminLogin() {
  const pin = document.getElementById("admin-pin-input").value;
  if (pin === "demo1234") { // Demo Mock Admin PIN
    closeAdminLoginModal();
    
    // Log in as mock admin
    const adminUser = { uid: "admin", name: "ผู้ดูแลระบบ", lastname: "", position: "ผู้ดูแลระบบ", dept: "ผู้ดูแลระบบ" };
    AppState.currentUser = adminUser;
    localStorage.setItem("session_user", JSON.stringify(adminUser));
    updateUserSidebarUI();
    
    // Show PDPA next
    openPdpaModal();
  } else {
    alert("รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง");
  }
}
window.handleAdminLogin = handleAdminLogin;

// PDPA Modal handlers
function openPdpaModal() {
  document.getElementById("modal-pdpa").classList.remove("hidden");
}
window.openPdpaModal = openPdpaModal;

async function handleAcceptPdpa() {
  document.getElementById("modal-pdpa").classList.add("hidden");
  
  try {
    if (AppState.currentUser && AppState.currentUser.uid === "admin") {
      toggleLoading(true, "กำลังโหลดข้อมูลผู้ดูแลระบบ...");
      await AppState.loadInitialData();
      toggleLoading(false);
      showPage("page-admin-menu");
    } else {
      toggleLoading(true, "กำลังเข้าสู่ระบบ...");
      await AppState.loadInitialData();
      toggleLoading(false);
      showPage("page-patients");
    }
  } catch (err) {
    toggleLoading(false);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
  }
}
window.handleAcceptPdpa = handleAcceptPdpa;

// Admin Render Functions
async function renderAdminUsersList() {
  const tableBody = document.getElementById("admin-users-table-body");
  if (!tableBody) return;
  
  toggleLoading(true, "กำลังดึงรายชื่อสมาชิก...");
  
  let allUsers = [];
  try {
    if (dbService.isReal) {
      const snapshot = await dbService.withTimeout(dbService.db.collection("users").get());
      allUsers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } else {
      allUsers = JSON.parse(localStorage.getItem("users")) || [];
    }
  } catch (err) {
    console.error("Error fetching users list:", err);
    alert("ดึงข้อมูลรายชื่อล้มเหลว: " + err.message);
  } finally {
    toggleLoading(false);
  }
  
  tableBody.innerHTML = "";
  
  // Filter out admin user
  const list = allUsers.filter(u => u.uid !== "admin");
  
  if (list.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-muted">ไม่พบบัญชีสมาชิกรายอื่นในระบบ</td></tr>';
    return;
  }
  
  list.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${u.username || '-'}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${u.name || '-'} ${u.lastname || ''}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${u.position || '-'}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${u.dept || '-'}</td>
      <td class="p-3 text-center" style="border-bottom:1px solid #cbd5e1;">
        <button onclick="handleDeleteUser('${u.uid}')" class="btn btn-danger" style="padding:0.35rem 0.75rem; font-size:0.75rem;"><i class="fas fa-trash-can"></i> ลบ</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
window.renderAdminUsersList = renderAdminUsersList;

async function handleDeleteUser(uid) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีสมาชิกนี้ออกจากระบบ?")) return;
  
  toggleLoading(true, "กำลังลบบัญชีสมาชิก...");
  try {
    await dbService.deleteUser(uid);
    toggleLoading(false);
    alert("ลบบัญชีสมาชิกสำเร็จแล้ว!");
    renderAdminUsersList();
  } catch (err) {
    toggleLoading(false);
    alert("เกิดข้อผิดพลาดในการลบบัญชีสมาชิก: " + err.message);
  }
}
window.handleDeleteUser = handleDeleteUser;

async function renderAdminPatientsList() {
  const tableBody = document.getElementById("admin-patients-table-body");
  if (!tableBody) return;
  
  const search = document.getElementById("admin-search-patient").value.toLowerCase();
  
  // Reload patient list
  AppState.patients = await dbService.getPatients();
  const filtered = AppState.patients.filter(p => p.name.toLowerCase().includes(search));
  
  tableBody.innerHTML = "";
  
  if (filtered.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-muted">ไม่พบข้อมูลคนไข้ตามคำค้นหา</td></tr>';
    return;
  }
  
  filtered.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${p.id}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1; font-weight:600;">${p.name}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${p.visitor || '-'}</td>
      <td class="p-3" style="border-bottom:1px solid #cbd5e1;">${p.careGroup || '-'}</td>
      <td class="p-3 text-center" style="border-bottom:1px solid #cbd5e1;">
        <button onclick="handleDeletePatient('${p.id}')" class="btn btn-danger" style="padding:0.35rem 0.75rem; font-size:0.75rem;"><i class="fas fa-trash-can"></i> ลบข้อมูลทั้งหมด</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
window.renderAdminPatientsList = renderAdminPatientsList;

async function handleDeletePatient(patientId) {
  if (!confirm("ยืนยันการลบข้อมูลคนไข้? การลบนี้จะนำประวัติการเยี่ยมและตารางนัดหมายที่เกี่ยวข้องออกทั้งหมดด้วย")) return;
  
  toggleLoading(true, "กำลังลบข้อมูลคนไข้...");
  try {
    await dbService.deletePatient(patientId);
    toggleLoading(false);
    alert("ลบข้อมูลคนไข้เรียบร้อยแล้ว!");
    renderAdminPatientsList();
  } catch (err) {
    toggleLoading(false);
    alert("เกิดข้อผิดพลาดในการลบข้อมูลคนไข้: " + err.message);
  }
}
window.handleDeletePatient = handleDeletePatient;

// --- ADDITIONAL UTILITY FUNCTIONS FOR REFRESH, IMAGE PREVIEW & VISIT EDITING ---

async function triggerRefresh() {
  toggleLoading(true, "กำลังดึงข้อมูลล่าสุด...");
  try {
    await AppState.loadInitialData();
    const activeScreen = Array.from(document.querySelectorAll(".app-screen")).find(s => !s.classList.contains("hidden"));
    if (activeScreen) {
      const pageId = activeScreen.id;
      if (pageId === "page-calendar") {
        renderCalendar();
      } else if (pageId === "page-history") {
        renderHistoryList();
      } else if (pageId === "page-eval-list") {
        renderEvalPatientList();
      } else if (pageId === "page-my-visits") {
        renderMyVisits();
      } else if (pageId === "page-overview") {
        renderOverviewDashboard();
      } else if (pageId === "page-eval-dashboard") {
        const patientName = document.getElementById("dash-patient-name").innerText;
        const patient = AppState.patients.find(p => p.name === patientName);
        if (patient) {
          viewPatientDashboard(patient.id);
        }
      }
    }
  } catch (err) {
    console.error("Refresh failed:", err);
  } finally {
    toggleLoading(false);
  }
}
window.triggerRefresh = triggerRefresh;

function previewSelectedImage(input) {
  const preview = document.getElementById("form-image-preview");
  if (!preview) return;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}
window.previewSelectedImage = previewSelectedImage;

function startEditVisit(v) {
  AppState.currentEditingVisitId = v.id;
  
  const formTitle = document.getElementById("form-title");
  if (formTitle) {
    formTitle.innerText = "แก้ไขรายงานการเยี่ยมบ้านทีมสหวิชาชีพ";
  }
  const saveBtn = document.querySelector("#page-form button[onclick='handleSaveVisit()']");
  if (saveBtn) {
    saveBtn.innerHTML = `<i class="fas fa-floppy-disk"></i> บันทึกการแก้ไขข้อมูลการเยี่ยมบ้าน`;
  }
  
  document.getElementById("f-date").value = v.date || "";
  document.getElementById("f-patient").value = v.patientName || "";
  document.getElementById("f-dept").value = v.dept || "";
  document.getElementById("f-visitor").value = v.visitor || "";
  
  // Set Year and Round DDLs
  const roundStr = v.visitRound || `1/${new Date(v.date || Date.now()).getFullYear() + 543}`;
  const visitYear = roundStr.split("/")[1];
  document.getElementById("f-visit-year").value = visitYear;
  
  // Load rounds and prefill clinical values
  loadPatientVisitRounds(roundStr);
  
  // Ensure the date is set to the record's date
  document.getElementById("f-date").value = v.date || "";
  
  showPage("page-form");
}
window.startEditVisit = startEditVisit;

// --- CHECKBOX SECTION HELPERS ---

function collectCheckboxSection(cbClassName) {
  const result = [];
  const cbs = document.querySelectorAll(`.${cbClassName}:checked`);
  cbs.forEach(cb => {
    const item = { id: cb.value };
    const textId = cb.getAttribute("data-text-id");
    if (textId) {
      const txtInput = document.getElementById(textId);
      if (txtInput) {
        item.text = txtInput.value.trim();
      }
    }
    result.push(item);
  });
  return result;
}
window.collectCheckboxSection = collectCheckboxSection;

function prefillCheckboxSection(cbClassName, dataArray) {
  const checkboxes = document.querySelectorAll(`.${cbClassName}`);
  checkboxes.forEach(cb => {
    cb.checked = false;
    const textId = cb.getAttribute("data-text-id");
    if (textId) {
      const txtInput = document.getElementById(textId);
      if (txtInput) {
        txtInput.value = "";
        txtInput.classList.add("hidden");
      }
    }
  });

  if (!dataArray || !Array.isArray(dataArray)) return;

  dataArray.forEach(item => {
    const cb = Array.from(checkboxes).find(c => c.value === item.id);
    if (cb) {
      cb.checked = true;
      const textId = cb.getAttribute("data-text-id");
      if (textId && item.text) {
        const txtInput = document.getElementById(textId);
        if (txtInput) {
          txtInput.value = item.text;
          txtInput.classList.remove("hidden");
        }
      }
    }
  });
}
window.prefillCheckboxSection = prefillCheckboxSection;

function toggleCheckboxText(cb) {
  const textId = cb.getAttribute("data-text-id");
  if (!textId) return;
  const txtInput = document.getElementById(textId);
  if (!txtInput) return;
  if (cb.checked) {
    txtInput.classList.remove("hidden");
    txtInput.focus();
  } else {
    txtInput.classList.add("hidden");
    txtInput.value = "";
  }
}
window.toggleCheckboxText = toggleCheckboxText;

function toggleNextVisitUnspecified(cb) {
  const dateInput = document.getElementById("f-nextvisit");
  if (!dateInput) return;
  if (cb.checked) {
    dateInput.disabled = true;
    dateInput.value = "";
  } else {
    dateInput.disabled = false;
  }
}
window.toggleNextVisitUnspecified = toggleNextVisitUnspecified;

function renderCheckboxSectionReport(title, dataArray, optionsList) {
  if (!dataArray || dataArray.length === 0) return "";
  
  let html = `<div style="margin-top: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
    <p style="font-weight:600; margin-bottom:0.25rem; color: var(--text-dark);">${title}</p>`;
    
  dataArray.forEach(item => {
    const opt = optionsList.find(o => o.id === item.id);
    let optText = opt ? opt.text : `ข้อเลือกที่ ${item.id}`;
    
    if (item.text) {
      if (optText.includes("(ระบุ)")) {
        optText = optText.replace(/\(ระบุ\)\.*/g, `(${item.text})`);
      } else {
        optText = `${optText}: ${item.text}`;
      }
    }
    html += `<p style="margin: 0.15rem 0 0.15rem 1rem; font-size: 0.85rem; color: #334155;">• ${optText}</p>`;
  });
  
  html += `</div>`;
  return html;
}
window.renderCheckboxSectionReport = renderCheckboxSectionReport;



async function handleDeleteSchedule(scheduleId, dayStr) {
  const s = AppState.schedules.find(item => item.id === scheduleId);
  if (!s) return;

  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบกำหนดการนัดเยี่ยมบ้านนี้?")) return;
  toggleLoading(true, "กำลังลบกำหนดการนัดหมาย...");
  try {
    const res = await dbService.deleteSchedule(scheduleId);
    if (res.success) {
      // If schedule is 'done', find and delete the corresponding visit record
      if (s.status === 'done') {
        const normVisitor = normalizeName(s.visitorName);
        const matchingVisit = AppState.allHistory.find(v => 
          (v.patientId || "").trim() === (s.patientId || "").trim() && 
          v.date === s.date && 
          normalizeName(v.visitor) === normVisitor
        );
        if (matchingVisit) {
          await dbService.deleteVisit(matchingVisit.id);
        }
      }

      // Reload schedules and visit history
      AppState.schedules = await dbService.getSchedules();
      AppState.allHistory = await dbService.getVisitHistory();
      toggleLoading(false);
      
      // Render calendar
      renderCalendar();
      // Update details list below calendar
      const daySchedules = AppState.schedules.filter(item => item.date === dayStr);
      selectCalendarDay(dayStr, daySchedules);
      alert("ลบกำหนดการเรียบร้อยแล้ว");
    } else {
      toggleLoading(false);
      alert("ไม่สามารถลบกำหนดการได้: " + res.message);
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error deleting schedule:", err);
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
}
window.handleDeleteSchedule = handleDeleteSchedule;

// loadPatientVisitRounds removed as deprecated

function prefillVisitFormFromRecord(v, inheritMode = false) {
  // If editing an existing visit in this round (inheritMode = false), set currentEditingVisitId
  if (!inheritMode) {
    AppState.currentEditingVisitId = v.id;
    const formTitle = document.getElementById("form-title");
    if (formTitle) formTitle.innerText = "แก้ไขรายงานการเยี่ยมบ้านทีมสหวิชาชีพ";
    const saveBtn = document.querySelector("#page-form button[onclick='handleSaveVisit()']");
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-floppy-disk"></i> บันทึกการแก้ไขข้อมูลการเยี่ยมบ้าน`;
    
    // Update the round sequence banner to show actual round number instead of future increment
    const roundInfoEl = document.getElementById("form-patient-round-info");
    if (roundInfoEl) {
      const patientVisitsAsc = AppState.allHistory
        .filter(h => (h.patientId || "").trim() === (v.patientId || "").trim())
        .sort((a, b) => a.date.localeCompare(b.date));
      const chronologicalIndex = patientVisitsAsc.findIndex(h => h.id === v.id);
      const roundSequenceNumber = chronologicalIndex !== -1 ? chronologicalIndex + 1 : 1;
      roundInfoEl.innerText = `การเยี่ยมรอบที่: ${roundSequenceNumber} (คนไข้: ${v.patientName}) (แก้ไขรอบเดิม)`;
      roundInfoEl.style.display = "inline-block";
    }
  } else {
    AppState.currentEditingVisitId = null;
    const formTitle = document.getElementById("form-title");
    if (formTitle) formTitle.innerText = "ฟอร์มบันทึกการเยี่ยมบ้าน";
    const saveBtn = document.querySelector("#page-form button[onclick='handleSaveVisit()']");
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-floppy-disk"></i> บันทึกข้อมูลและประวัติการเยี่ยมบ้าน`;
  }

  // Populate clinical measurements
  document.getElementById("f-consc").value = v.consciousness || "รู้สึกตัวดี";
  document.getElementById("f-temp").value = v.temp || "";
  document.getElementById("f-pulse").value = v.pulse || "";
  document.getElementById("f-resp").value = v.resp || "";
  document.getElementById("f-bp").value = v.bp || "";
  document.getElementById("f-adl").value = v.adl || "0";
  document.getElementById("f-symptoms").value = v.symptoms || "";
  document.getElementById("f-drug").value = v.drugAllergy || "ไม่มีประวัติแพ้ยา";
  document.getElementById("f-food").value = v.foodAllergy || "ไม่มีประวัติแพ้อาหาร";

  document.getElementById("f-waist").value = v.waist || "";
  document.getElementById("f-arm").value = v.arm || "";
  document.getElementById("f-calf").value = v.calf || "";
  document.getElementById("f-weight").value = v.weight || "";
  document.getElementById("f-height").value = v.height || "";
  document.getElementById("f-bmi").value = v.bmi || "";

  document.getElementById("f-motor-ra").value = v.motorRA || "";
  document.getElementById("f-motor-la").value = v.motorLA || "";
  document.getElementById("f-motor-rl").value = v.motorRL || "";
  document.getElementById("f-motor-ll").value = v.motorLL || "";
  document.getElementById("f-care-group").value = v.careGroup || "";

  // TAI (5 items)
  document.getElementById("f-tai-mob").value = v.taiMobility || "";
  document.getElementById("f-tai-act").value = v.taiActivity || "";
  document.getElementById("f-tai-self").value = v.taiSelfCare || "";
  document.getElementById("f-tai-eat").value = v.taiEating || "";
  document.getElementById("f-tai-consc").value = v.taiConscious || "";

  // PPS (4 items)
  document.getElementById("f-pps-mob").value = v.ppsMobility || "";
  document.getElementById("f-pps-ment").value = v.ppsMental || "";
  document.getElementById("f-pps-eat").value = v.ppsEating || "";
  document.getElementById("f-pps-exc").value = v.ppsExcretion || "";

  // Prefill Checklists
  prefillCheckboxSection("f-nursing-diag-cb", v.nursingDiagnosis);
  prefillCheckboxSection("f-service-pre-cb", v.servicePrecautions);
  prefillCheckboxSection("f-short-goal-cb", v.shortTermGoals);
  prefillCheckboxSection("f-long-goal-cb", v.longTermGoals);
  prefillCheckboxSection("f-patient-prob-cb", v.patientProblems);
  prefillCheckboxSection("f-patient-need-cb", v.patientNeeds);
  
  updateSectionCollapseStates();

  // If inheritMode is true, do not copy date/notes/images
  if (inheritMode) {
    document.getElementById("f-note").value = "";
    document.getElementById("f-eval").value = "";
    document.getElementById("f-follow").value = "";
    document.getElementById("f-others").value = "";
    document.getElementById("f-docappt").value = "";
    document.getElementById("f-nextvisit").value = "";
    
    const unspecifiedCb = document.getElementById("f-nextvisit-unspecified");
    if (unspecifiedCb) {
      unspecifiedCb.checked = false;
      document.getElementById("f-nextvisit").disabled = false;
    }
    
    const imgPreview = document.getElementById("form-image-preview");
    if (imgPreview) {
      imgPreview.src = "";
      imgPreview.style.display = "none";
    }
    document.getElementById("f-image").value = "";
  } else {
    if (v.date) {
      document.getElementById("f-date").value = v.date;
    }
    document.getElementById("f-visit-round").value = v.visitRound || "";
    document.getElementById("f-note").value = v.visitNote || "";
    document.getElementById("f-eval").value = v.evaluation || "";
    document.getElementById("f-follow").value = v.followUp || "";
    document.getElementById("f-others").value = v.others || "";
    document.getElementById("f-docappt").value = v.docAppt || "";

    const unspecifiedCb = document.getElementById("f-nextvisit-unspecified");
    if (unspecifiedCb) {
      if (!v.nextVisit) {
        unspecifiedCb.checked = true;
        document.getElementById("f-nextvisit").disabled = true;
        document.getElementById("f-nextvisit").value = "";
      } else {
        unspecifiedCb.checked = false;
        document.getElementById("f-nextvisit").disabled = false;
        document.getElementById("f-nextvisit").value = v.nextVisit;
      }
    } else {
      document.getElementById("f-nextvisit").value = v.nextVisit || "";
    }

    const imgPreview = document.getElementById("form-image-preview");
    if (imgPreview) {
      if (v.imageUrl) {
        imgPreview.src = v.imageUrl;
        imgPreview.style.display = "block";
      } else {
        imgPreview.src = "";
        imgPreview.style.display = "none";
      }
    }
    document.getElementById("f-image").value = "";
  }
}
window.prefillVisitFormFromRecord = prefillVisitFormFromRecord;

function clearFormClinicalInputs() {
  document.getElementById("f-consc").value = "รู้สึกตัวดี";
  document.getElementById("f-temp").value = "";
  document.getElementById("f-pulse").value = "";
  document.getElementById("f-resp").value = "";
  document.getElementById("f-bp").value = "";
  document.getElementById("f-adl").value = "0";
  document.getElementById("f-symptoms").value = "";
  document.getElementById("f-drug").value = "ไม่มีประวัติแพ้ยา";
  document.getElementById("f-food").value = "ไม่มีประวัติแพ้อาหาร";

  document.getElementById("f-waist").value = "";
  document.getElementById("f-arm").value = "";
  document.getElementById("f-calf").value = "";
  document.getElementById("f-weight").value = "";
  document.getElementById("f-height").value = "";
  document.getElementById("f-bmi").value = "";

  document.getElementById("f-motor-ra").value = "";
  document.getElementById("f-motor-la").value = "";
  document.getElementById("f-motor-rl").value = "";
  document.getElementById("f-motor-ll").value = "";
  document.getElementById("f-care-group").value = "";

  document.getElementById("f-tai-mob").value = "";
  document.getElementById("f-tai-act").value = "";
  document.getElementById("f-tai-self").value = "";
  document.getElementById("f-tai-eat").value = "";
  document.getElementById("f-tai-consc").value = "";

  document.getElementById("f-pps-mob").value = "";
  document.getElementById("f-pps-ment").value = "";
  document.getElementById("f-pps-eat").value = "";
  document.getElementById("f-pps-exc").value = "";

  document.getElementById("f-note").value = "";
  document.getElementById("f-eval").value = "";
  document.getElementById("f-follow").value = "";
  document.getElementById("f-others").value = "";
  document.getElementById("f-docappt").value = "";
  document.getElementById("f-nextvisit").value = "";
  
  const unspecifiedCb = document.getElementById("f-nextvisit-unspecified");
  if (unspecifiedCb) {
    unspecifiedCb.checked = false;
    document.getElementById("f-nextvisit").disabled = false;
  }
  
  const imgPreview = document.getElementById("form-image-preview");
  if (imgPreview) {
    imgPreview.src = "";
    imgPreview.style.display = "none";
  }
  document.getElementById("f-image").value = "";

  const checkboxes = document.querySelectorAll(".f-nursing-diag-cb, .f-service-pre-cb, .f-short-goal-cb, .f-long-goal-cb, .f-patient-prob-cb, .f-patient-need-cb");
  checkboxes.forEach(cb => {
    cb.checked = false;
    const textId = cb.getAttribute("data-text-id");
    if (textId) {
      const txtInput = document.getElementById(textId);
      if (txtInput) {
        txtInput.value = "";
        txtInput.classList.add("hidden");
      }
    }
  });
  
  updateSectionCollapseStates();
}
window.clearFormClinicalInputs = clearFormClinicalInputs;

function handlePatientChangeInherit(patientName) {
  clearFormClinicalInputs();
  if (patientName) {
    const patObj = AppState.patients.find(p => p.name === patientName);
    if (patObj) {
      const patientVisits = AppState.allHistory
        .filter(v => (v.patientId || "").trim() === patObj.id.trim())
        .sort((a, b) => a.date.localeCompare(b.date));
      if (patientVisits.length > 0) {
        const latestVisit = patientVisits[patientVisits.length - 1];
        prefillVisitFormFromRecord(latestVisit, true);
      }
    }
  }
}
window.handlePatientChangeInherit = handlePatientChangeInherit;

// Deprecated round management functions removed

// --- Patient Database Page (ฐานข้อมูลคนไข้) Functions ---

function renderPatientsList() {
  const tbody = document.getElementById("patients-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  const searchInput = document.getElementById("p-search");
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

  // Filter patients by search query
  let filtered = AppState.patients || [];
  if (searchValue) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
  }

  // Filter patients by status (Active vs Deceased)
  if (AppState.filterOnlyDeceased) {
    filtered = filtered.filter(p => p.status === "เสียชีวิต");
  } else {
    filtered = filtered.filter(p => p.status !== "เสียชีวิต");
  }

  // Filter patients by visited state if toggled
  if (AppState.filterOnlyVisited && AppState.currentUser) {
    const currentUserFullName = `${AppState.currentUser.name} ${AppState.currentUser.lastname}`;
    const currentNorm = normalizeName(currentUserFullName);
    filtered = filtered.filter(p => {
      const patientVisits = AppState.allHistory.filter(v => (v.patientId || "").trim() === p.id.trim());
      return patientVisits.some(v => {
        if (normalizeName(v.visitor) === currentNorm) return true;
        if (v.coVisitors && v.coVisitors.some(cv => normalizeName(cv.name) === currentNorm)) return true;
        return false;
      });
    });
  }

  // Sort patients alphabetically
  filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'th'));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center p-4" style="color:var(--text-muted);">ไม่พบข้อมูลรายชื่อคนไข้</td>
      </tr>
    `;
    return;
  }

  const currentUser = AppState.currentUser;
  const isAdmin = currentUser && currentUser.uid === "admin";
  const userDisplayName = currentUser ? `${currentUser.name} ${currentUser.lastname}` : "";

  filtered.forEach(p => {
    // Check if the current user is the creator of this patient, or if user is admin
    const canDelete = isAdmin || (p.visitor && p.visitor === userDisplayName);
    const editBtn = `<button onclick="openEditPatientModal('${p.id}')" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-color: var(--accent-blue); color: var(--accent-blue); font-weight: normal; margin-right: 0.25rem;"><i class="fas fa-edit"></i> แก้ไข</button>`;
    const deleteBtn = canDelete 
      ? `<button onclick="handleDeletePatientFromDb('${p.id}')" class="btn btn-danger" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; background: var(--accent-red); border: none;"><i class="fas fa-trash-alt"></i> ลบ</button>`
      : `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">ไม่มีสิทธิ์ลบ</span>`;

    tbody.innerHTML += `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td class="p-3 font-semibold" style="color: var(--accent-blue);">${p.id || '-'}</td>
        <td class="p-3">
          <a href="#" onclick="viewPatientDashboard('${p.id}'); return false;" style="color: var(--accent-blue); font-weight: 600; text-decoration: none; border-bottom: 1.5px dashed var(--accent-blue); cursor: pointer;">
            ${p.name}
          </a>
          ${p.status === 'เสียชีวิต' ? '<span style="background: rgba(220,38,38,0.12); color: #dc2626; font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 4px; margin-left: 0.5rem; font-weight: 600;"><i class="fas fa-heart-broken"></i> เสียชีวิต</span>' : ''}
        </td>
        <td class="p-3"><span class="badge" style="background: rgba(14,165,233,0.1); color: var(--accent-blue); font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px;">${p.careGroup || 'กลุ่ม 1'}</span></td>
        <td class="p-3" style="color: var(--text-muted); font-size: 0.8rem;">${p.visitor || '-'}</td>
        <td class="p-3 text-center" style="white-space: nowrap;">${editBtn}${deleteBtn}</td>
      </tr>
    `;
  });
}
window.renderPatientsList = renderPatientsList;

async function handleAddNewPatient() {
  const firstName = document.getElementById("p-firstname").value.trim();
  const lastName = document.getElementById("p-lastname").value.trim();
  const careGroup = document.getElementById("p-care-group").value;

  if (!firstName || !lastName) {
    return alert("กรุณากรอกทั้งชื่อจริงและนามสกุลของคนไข้");
  }

  const fullName = `${firstName} ${lastName}`;

  // Check for duplicates
  const isDuplicate = AppState.patients.some(p => p.name.toLowerCase() === fullName.toLowerCase());
  if (isDuplicate) {
    return alert("มีคนไข้ชื่อ-นามสกุลนี้อยู่ในฐานข้อมูลแล้ว");
  }

  toggleLoading(true, "กำลังเพิ่มคนไข้...");

  try {
    const creatorName = AppState.currentUser ? `${AppState.currentUser.name} ${AppState.currentUser.lastname}` : "ไม่ระบุ";
    
    // Call getOrCreatePatient which writes to Firestore or localStorage and returns the patient object
    const newPObj = await dbService.getOrCreatePatient(fullName, creatorName);
    const newPId = newPObj.id;

    // update careGroup in db service if it was selected differently (getOrCreatePatient defaults to "กลุ่ม 1")
    if (careGroup && careGroup !== "กลุ่ม 1") {
      await dbService.updatePatientCareGroup(newPId, careGroup);
    }

    // Refresh app state patients
    AppState.patients = await dbService.getPatients();

    // Clear inputs
    document.getElementById("p-firstname").value = "";
    document.getElementById("p-lastname").value = "";
    document.getElementById("p-care-group").value = "กลุ่ม 1";

    toggleLoading(false);
    alert("เพิ่มรายชื่อคนไข้สำเร็จ!");

    // Refresh views
    renderPatientsList();
    
    if (typeof renderAdminPatientsList === "function") {
      renderAdminPatientsList();
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error adding new patient:", err);
    alert("ไม่สามารถเพิ่มคนไข้ได้: " + err.message);
  }
}
window.handleAddNewPatient = handleAddNewPatient;

async function handleDeletePatientFromDb(patientId) {
  const p = AppState.patients.find(pat => pat.id === patientId);
  if (!p) return;

  const confirmDelete = confirm(`คุณต้องการลบคนไข้ "${p.name}" ใช่หรือไม่?\nการลบจะทำให้ประวัติการเยี่ยมและนัดหมายทั้งหมดของคนไข้คนนี้ถูกลบไปด้วย และไม่สามารถกู้คืนได้!`);
  if (!confirmDelete) return;

  toggleLoading(true, "กำลังลบข้อมูลคนไข้...");

  try {
    const res = await dbService.deletePatient(patientId);
    if (res && res.success) {
      // Refresh local state
      AppState.patients = AppState.patients.filter(pat => pat.id !== patientId);
      AppState.allHistory = AppState.allHistory.filter(v => v.patientId !== patientId);
      AppState.schedules = AppState.schedules.filter(s => s.patientId !== patientId);

      toggleLoading(false);
      alert("ลบข้อมูลคนไข้และประวัติที่เกี่ยวข้องเรียบร้อยแล้ว");

      // Refresh pages
      renderPatientsList();
      if (typeof renderAdminPatientsList === "function") {
        renderAdminPatientsList();
      }
    } else {
      toggleLoading(false);
      alert("เกิดข้อผิดพลาดในการลบคนไข้");
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error deleting patient:", err);
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
}
window.handleDeletePatientFromDb = handleDeletePatientFromDb;

function openEditPatientModal(patientId) {
  const p = AppState.patients.find(pat => pat.id === patientId);
  if (!p) return alert("ไม่พบข้อมูลคนไข้");

  // Permission check: only creator, co-visitors, or admin can edit
  const currentUser = AppState.currentUser;
  if (!currentUser) return alert("กรุณาเข้าสู่ระบบก่อน");
  const isAdmin = currentUser.uid === "admin";
  const currentUserFullName = `${currentUser.name} ${currentUser.lastname}`;
  const currentNorm = normalizeName(currentUserFullName);
  const isCreator = p.visitor && normalizeName(p.visitor) === currentNorm;

  // Check if current user has ever visited this patient (as visitor or co-visitor)
  const patientVisits = AppState.allHistory.filter(v => v.patientId === p.id);
  const hasVisited = patientVisits.some(v => {
    if (normalizeName(v.visitor) === currentNorm) return true;
    if (v.coVisitors && v.coVisitors.some(cv => normalizeName(cv.name) === currentNorm)) return true;
    return false;
  });

  if (!isAdmin && !isCreator && !hasVisited) {
    return alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลคนไข้รายนี้\nเฉพาะผู้บันทึก ผู้ที่เคยร่วมเยี่ยม หรือแอดมินเท่านั้น");
  }

  document.getElementById("edit-patient-id").value = p.id;
  document.getElementById("edit-patient-name").value = p.name || "";
  document.getElementById("edit-patient-care-group").value = p.careGroup || "กลุ่ม 1";
  document.getElementById("edit-patient-status").value = p.status || "อยู่ในระหว่างการดูแล";

  const modal = document.getElementById("modal-edit-patient");
  if (modal) {
    modal.classList.remove("hidden");
  }
}
window.openEditPatientModal = openEditPatientModal;

function openEditPatientModalFromDash() {
  const currentPatientName = document.getElementById("dash-patient-name").innerText;
  const p = AppState.patients.find(pat => pat.name === currentPatientName);
  if (!p) {
    // Try to get ID from dashboard text
    const idText = document.getElementById("dash-patient-id").innerText; // e.g. "รหัส: P-123456"
    const matched = idText.match(/P-\d+/);
    if (matched) {
      const patientId = matched[0];
      const p2 = AppState.patients.find(pat => pat.id === patientId);
      if (p2) {
        openEditPatientModal(p2.id);
        return;
      }
    }
    return alert("ไม่พบข้อมูลคนไข้รายนี้ในระบบ");
  }
  openEditPatientModal(p.id);
}
window.openEditPatientModalFromDash = openEditPatientModalFromDash;

function closeEditPatientModal() {
  const modal = document.getElementById("modal-edit-patient");
  if (modal) {
    modal.classList.add("hidden");
  }
}
window.closeEditPatientModal = closeEditPatientModal;

async function handleSavePatientEdit() {
  const patientId = document.getElementById("edit-patient-id").value;
  const name = document.getElementById("edit-patient-name").value.trim();
  const careGroup = document.getElementById("edit-patient-care-group").value;
  const status = document.getElementById("edit-patient-status").value;

  if (!name) return alert("กรุณากรอกชื่อคนไข้");

  toggleLoading(true, "กำลังบันทึกข้อมูล...");

  try {
    await dbService.updatePatientInfo(patientId, name, careGroup, status);

    // Refresh state
    await AppState.loadInitialData();

    toggleLoading(false);
    alert("แก้ไขข้อมูลคนไข้สำเร็จ!");
    closeEditPatientModal();

    // Refresh views
    renderPatientsList();
    if (typeof renderAdminPatientsList === "function") {
      renderAdminPatientsList();
    }

    // If we are currently on the dashboard page, reload it to show updated info
    const dashPage = document.getElementById("page-eval-dashboard");
    if (dashPage && !dashPage.classList.contains("hidden")) {
      viewPatientDashboard(patientId);
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error editing patient:", err);
    alert("ไม่สามารถแก้ไขข้อมูลคนไข้ได้: " + err.message);
  }
}
window.handleSavePatientEdit = handleSavePatientEdit;

function togglePatientsVisitedFilter() {
  AppState.filterOnlyVisited = !AppState.filterOnlyVisited;
  const btn = document.getElementById("btn-filter-visited");
  if (btn) {
    if (AppState.filterOnlyVisited) {
      btn.style.background = "var(--accent-blue)";
      btn.style.color = "white";
      btn.style.borderColor = "var(--accent-blue)";
    } else {
      btn.style.background = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }
  }
  renderPatientsList();
}
window.togglePatientsVisitedFilter = togglePatientsVisitedFilter;

function togglePatientsDeceasedFilter() {
  AppState.filterOnlyDeceased = !AppState.filterOnlyDeceased;
  const btn = document.getElementById("btn-filter-deceased");
  if (btn) {
    if (AppState.filterOnlyDeceased) {
      btn.style.background = "var(--accent-red)";
      btn.style.color = "white";
      btn.style.borderColor = "var(--accent-red)";
    } else {
      btn.style.background = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }
  }
  renderPatientsList();
}
window.togglePatientsDeceasedFilter = togglePatientsDeceasedFilter;

async function handleJoinVisit(visitId) {
  const u = AppState.currentUser;
  if (!u) return alert("กรุณาเข้าสู่ระบบก่อนร่วมเยี่ยม");

  const visitorName = `${u.name} ${u.lastname}`;
  const visitorPosition = u.position || "";
  const visitorDept = u.dept || "";

  toggleLoading(true, "กำลังเข้าร่วมเยี่ยม...");
  try {
    const res = await dbService.joinVisit(visitId, visitorName, visitorPosition, visitorDept);
    toggleLoading(false);
    if (res && res.success) {
      alert("เข้าร่วมการเยี่ยมบ้านรอบนี้สำเร็จ!");
      await AppState.loadInitialData();
      const idText = document.getElementById("dash-patient-id").innerText;
      const matched = idText.match(/P-\d+/);
      if (matched) {
        viewPatientDashboard(matched[0]);
      }
    } else {
      alert(res.message || "เกิดข้อผิดพลาดในการเข้าร่วมเยี่ยม");
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error joining visit:", err);
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
}
async function handleDeleteVisit(visitId) {
  const v = AppState.allHistory.find(h => h.id === visitId);
  if (!v) return;

  const currentUserFullName = AppState.currentUser ? `${AppState.currentUser.name} ${AppState.currentUser.lastname}` : "";
  const currentNorm = normalizeName(currentUserFullName);
  const isAdmin = AppState.currentUser && AppState.currentUser.uid === "admin";
  const canDeleteVisit = isAdmin || (normalizeName(v.visitor) === currentNorm);
  
  if (!canDeleteVisit) {
    return alert("คุณไม่มีสิทธิ์ลบการเยี่ยมรอบนี้ เนื่องจากไม่ได้เป็นผู้ลงบันทึกหลัก");
  }

  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบการเยี่ยมรอบที่ ${v.visitRound || ''} นี้?\n(การลบนี้จะลบข้อมูลทางการแพทย์และผลประเมินในรอบนี้ออกทั้งหมด)`)) return;

  toggleLoading(true, "กำลังลบข้อมูลการเยี่ยม...");
  try {
    const res = await dbService.deleteVisit(visitId);
    toggleLoading(false);
    if (res && res.success) {
      alert("ลบข้อมูลการเยี่ยมเรียบร้อยแล้ว!");
      await AppState.loadInitialData();
      const idText = document.getElementById("dash-patient-id").innerText;
      const matched = idText.match(/P-\d+/);
      if (matched) {
        viewPatientDashboard(matched[0]);
      }
    } else {
      alert(res.message || "เกิดข้อผิดพลาดในการลบข้อมูลการเยี่ยม");
    }
  } catch (err) {
    toggleLoading(false);
    console.error("Error deleting visit:", err);
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
}
window.handleDeleteVisit = handleDeleteVisit;

function normalizeName(name) {
  if (!name) return "";
  return name.toString().replace(/\s+/g, ' ').trim().toLowerCase();
}
window.normalizeName = normalizeName;


// --- DEMO MOCKUP HELPERS ---
function fillDemoLogin(username, pin) {
  const userEl = document.getElementById("login-username");
  const passEl = document.getElementById("login-password");
  if (userEl) userEl.value = username;
  if (passEl) passEl.value = pin;
}
window.fillDemoLogin = fillDemoLogin;

function openDemoDriveNotice() {
  alert("โหมดสาธิต (Demo Mock-up Mode):\nในระบบจริงเมนูนี้จะเชื่อมต่อไปยังอัลบั้มภาพถ่ายผู้ป่วยใน Google Drive (ถูกปิดลิงก์จริงไว้เพื่อความปลอดภัยของข้อมูล)");
}
window.openDemoDriveNotice = openDemoDriveNotice;

function resetDemoData() {
  if (!confirm("ต้องการรีเซ็ตข้อมูลจำลองทั้งหมดในเบราว์เซอร์กลับเป็นค่าเริ่มต้นหรือไม่?")) return;
  localStorage.removeItem("users");
  localStorage.removeItem("patients");
  localStorage.removeItem("visits");
  localStorage.removeItem("schedules");
  localStorage.removeItem("session_user");
  initLocalStorage();
  alert("รีเซ็ตข้อมูลจำลองเรียบร้อยแล้ว");
  location.reload();
}
window.resetDemoData = resetDemoData;
