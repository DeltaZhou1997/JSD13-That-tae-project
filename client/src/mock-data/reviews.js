import praewAvatar from "./assets/reviews/praew.jpg";
import artFamilyAvatar from "./assets/reviews/art-family.jpg";
import mayAvatar from "./assets/reviews/may.jpg";

const reviews = [
  {
    id: "REV-001",
    quote:
      "ไม่ต้องซื้อสมุนไพรเป็นกำแล้วใช้ไม่หมด สูตรละเอียดมาก ข้าวซอยมื้อแรกก็สำเร็จเลย",
    name: "แพรว",
    detail: "สมาชิก Size S",
    rating: 5,
    avatar: praewAvatar,
  },
  {
    id: "REV-002",
    quote:
      "เด็ก ๆ ได้ช่วยกันทำอาหารและได้เรียนรู้ว่าแต่ละเมนูมาจากภาคไหน เป็นเวลาครอบครัวที่ดีมาก",
    name: "ครอบครัวคุณอาร์ต",
    detail: "สมาชิก Size XL",
    rating: 5,
    avatar: artFamilyAvatar,
  },
  {
    id: "REV-003",
    quote:
      "ชอบที่เห็นข้อมูลโภชนาการก่อนเลือก ทำให้คุมอาหารได้โดยไม่ต้องกินเมนูเดิมซ้ำ ๆ",
    name: "เมย์",
    detail: "สมาชิก Size M",
    rating: 5,
    avatar: mayAvatar,
  },
];

export default reviews;
