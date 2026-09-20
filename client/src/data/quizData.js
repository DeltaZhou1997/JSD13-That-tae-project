import earthIcon from "../assets/element-earth.png";
import waterIcon from "../assets/element-water.png";
import airIcon from "../assets/element-wind.png";
import fireIcon from "../assets/element-fire.png";
import q1_c1 from "../assets/quiz/quiz1_c1.png";
import q1_c2 from "../assets/quiz/quiz1_c2.png";
import q1_c3 from "../assets/quiz/quiz1_c3.png";
import q1_c4 from "../assets/quiz/quiz1_c4.png";
import q2_c1 from "../assets/quiz/quiz2_c1.png";
import q2_c2 from "../assets/quiz/quiz2_c2.png";
import q2_c3 from "../assets/quiz/quiz2_c3.png";
import q2_c4 from "../assets/quiz/quiz2_c4.png";
import q3_c1 from "../assets/quiz/quiz3_c1.png";
import q3_c2 from "../assets/quiz/quiz3_c2.png";
import q3_c3 from "../assets/quiz/quiz3_c3.png";
import q3_c4 from "../assets/quiz/quiz3_c4.png";
import q4_c1 from "../assets/quiz/quiz4_c1.png";
import q4_c2 from "../assets/quiz/quiz4_c2.png";
import q4_c3 from "../assets/quiz/quiz4_c3.png";
import q4_c4 from "../assets/quiz/quiz4_c4.png";
import q5_c1 from "../assets/quiz/quiz5_c1.png";
import q5_c2 from "../assets/quiz/quiz5_c2.png";
import q5_c3 from "../assets/quiz/quiz5_c3.png";
import q5_c4 from "../assets/quiz/quiz5_c4.png";

export const ELEMENT_INFO = {
  earth: {
    id: "earth",
    nameTh: "ธาตุดิน",
    icon: earthIcon,
    months: "ตุลาคม - ธันวาคม",
    desc: "ผู้มีธาตุดินเป็นเจ้าเรือน มักมีโครงสร้างร่างกายแข็งแรง รูปร่างสูงใหญ่ หนักแน่น ระบบย่อยอาหารทำงานดีแต่เผาผลาญช้า ทำให้น้ำหนักขึ้นได้ง่าย",
    advice:
      "ควรกินอาหารรสฝาด หวาน มัน เค็ม (ในปริมาณพอเหมาะ) เพื่อช่วยบำรุงเนื้อและกระดูก",
  },
  water: {
    id: "water",
    nameTh: "ธาตุน้ำ",
    icon: waterIcon,
    months: "มกราคม - มีนาคม",
    desc: "ผู้มีธาตุน้ำเป็นเจ้าเรือน มักมีผิวพรรณสดใส สดชื่น แต่ระบบทางเดินหายใจอ่อนไหวได้ง่าย มักมีปัญหาเรื่องเสมหะ หรือป่วยง่ายเมื่ออากาศเปลี่ยน",
    advice:
      "ควรกินอาหารรสเปรี้ยว ขม เพื่อช่วยกัดเสมหะ ฟอกโลหิต และทำให้ร่างกายสดชื่น ชุ่มคอ",
  },
  air: {
    id: "air",
    nameTh: "ธาตุลม",
    icon: airIcon,
    months: "เมษายน - มิถุนายน",
    desc: "ผู้มีธาตุลมเป็นเจ้าเรือน มักมีรูปร่างโปร่ง เคลื่อนไหวเร็ว ระบบย่อยอาหารไม่ค่อยสม่ำเสมอ มักมีอาการท้องอืด ท้องเฟ้อ ลมในท้องเยอะ",
    advice:
      "ควรกินอาหารรสเผ็ดร้อน เพื่อช่วยขับลม กระตุ้นการย่อย และเพิ่มความอบอุ่นให้ร่างกาย",
  },
  fire: {
    id: "fire",
    nameTh: "ธาตุไฟ",
    icon: fireIcon,
    months: "กรกฎาคม - กันยายน",
    desc: "ผู้มีธาตุไฟเป็นเจ้าเรือน มักขี้ร้อน เหงื่อออกง่าย ระบบเผาผลาญสูง หิวบ่อย และอาจเกิดอาการร้อนใน อักเสบ หรือหงุดหงิดง่ายเมื่อเจออากาศร้อน",
    advice:
      "ควรกินอาหารรสขม เย็น จืด เพื่อช่วยลดความร้อนในร่างกาย ดับพิษไข้ และถอนพิษร้อน",
  },
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "1. คุณเกิดในกลุ่มเดือนใด?",
    options: [
      {
        text: "ตุลาคม - ธันวาคม",
        subtext: "ฤดูหนาว อบอุ่น มั่นคง",
        element: "earth",
        image: q1_c1,
      },
      {
        text: "มกราคม - มีนาคม",
        subtext: "ฤดูร้อน สดใส มีพลัง",
        element: "water",
        image: q1_c2,
      },
      {
        text: "เมษายน - มิถุนายน",
        subtext: "ฤดูฝน เย็นชุ่มชื้น สมดุล",
        element: "air",
        image: q1_c3,
      },
      {
        text: "กรกฎาคม - กันยายน",
        subtext: "ปลายฝน ต้นหนาว สดชื่น",
        element: "fire",
        image: q1_c4,
      },
    ],
  },
  {
    id: 2,
    title: "2. ลักษณะรูปร่างและโครงสร้างร่างกายของคุณใกล้เคียงข้อใดที่สุด?",
    options: [
      {
        text: "กระดูกใหญ่ อวบอิ่ม",
        subtext: "น้ำหนักขึ้นง่าย มีความอดทนสูง",
        element: "earth",
        image: q2_c1,
      },
      {
        text: "สมส่วน ผิวพรรณเต่งตึง",
        subtext: "สมบูรณ์ มีน้ำมีนวล สดใส",
        element: "water",
        image: q2_c2,
      },
      {
        text: "รูปร่างผอมโปร่ง",
        subtext: "กระดูกเห็นชัด เคลื่อนไหวรวดเร็ว",
        element: "air",
        image: q2_c3,
      },
      {
        text: "รูปร่างปานกลาง",
        subtext: "ขี้ร้อน เหงื่อออกง่าย",
        element: "fire",
        image: q2_c4,
      },
    ],
  },
  {
    id: 3,
    title: "3. เมื่ออากาศเปลี่ยน หรือเมื่อไม่สบาย มักมีอาการแบบใดบ่อยที่สุด?",
    options: [
      {
        text: "หนักเนื้อหนักตัว",
        subtext: "ปวดเมื่อยตามข้อ ปวดหลัง",
        element: "earth",
        image: q3_c1,
      },
      {
        text: "หวัด ไอ มีเสมหะ",
        subtext: "น้ำมูกไหลบ่อยเมื่ออากาศเปลี่ยน",
        element: "water",
        image: q3_c2,
      },
      {
        text: "ท้องอืด ท้องเฟ้อ",
        subtext: "เวียนหัว มึนศีรษะ ลมจับบ่อย",
        element: "air",
        image: q3_c3,
      },
      {
        text: "เป็นร้อนใน แผลในปาก",
        subtext: "ตัวร้อนง่าย ผิวหนังอักเสบ",
        element: "fire",
        image: q3_c4,
      },
    ],
  },
  {
    id: 4,
    title: "4. พฤติกรรมหรืออุปนิสัยประจำตัวของคุณคือข้อใด?",
    options: [
      {
        text: "เรียบง่าย มั่นคง",
        subtext: "รักสงบ ชอบนอนหลับลึก",
        element: "earth",
        image: q4_c1,
      },
      {
        text: "ใจดี อารมณ์ดี",
        subtext: "ช่างพูด ชื่นชอบความสดชื่น",
        element: "water",
        image: q4_c2,
      },
      {
        text: "คิดเร็ว ทำเร็ว",
        subtext: "คล่องแคล่ว ตื่นตัวง่าย",
        element: "air",
        image: q4_c3,
      },
      {
        text: "จริงจัง มีพลังสูง",
        subtext: "มุ่งมั่น หงุดหงิดง่ายเมื่อร้อน",
        element: "fire",
        image: q4_c4,
      },
    ],
  },
  {
    id: 5,
    title: "5. รสชาติอาหารที่คุณรู้สึกว่ากินแล้วสบายตัวและชอบเป็นพิเศษคือ?",
    options: [
      {
        text: "รสกลมกล่อม หวาน มัน เค็ม",
        subtext: "อาหารประเภทแกงกะทิ อบอุ่น",
        element: "earth",
        image: q5_c1,
      },
      {
        text: "รสเปรี้ยว จี๊ดจ๊าด",
        subtext: "ยำ ต้มยำ สดชื่น ชุ่มคอ",
        element: "water",
        image: q5_c2,
      },
      {
        text: "รสเผ็ดร้อน หอมสมุนไพร",
        subtext: "ผัดเผ็ด เครื่องเทศ ขับลม",
        element: "air",
        image: q5_c3,
      },
      {
        text: "รสจืด เย็นๆ ขมเบาๆ",
        subtext: "เมนูผัก สมุนไพรดับร้อน",
        element: "fire",
        image: q5_c4,
      },
    ],
  },
];
