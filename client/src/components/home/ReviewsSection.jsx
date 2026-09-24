import { reviews } from "../../mock-data/index.js";

// รีวิวเพิ่มเติม (ตัวอย่าง) — ไม่มีรูปใช้อักษรแรกของชื่อแทน
const EXTRA_REVIEWS = [
  { id: "REV-101", quote: "แกงฮังเลหอมเครื่องเทศเหมือนกินที่เชียงใหม่ วัตถุดิบตวงมาพอดี ไม่เหลือทิ้งเลย", name: "คุณนุ่น", detail: "สมาชิก Size M", rating: 5 },
  { id: "REV-102", quote: "ทำงานเลิกดึกแต่ยังได้กินอาหารไทยทำเอง ใช้เวลาไม่ถึง 30 นาทีจริง", name: "คุณบอส", detail: "สั่งรายชุด", rating: 5 },
  { id: "REV-103", quote: "ชอบที่บอกธาตุเจ้าเรือนกับรสยา ทำให้เลือกเมนูได้เหมาะกับตัวเองมากขึ้น", name: "คุณมิ้นท์", detail: "สมาชิก Size S", rating: 5 },
  { id: "REV-104", quote: "ส้มตำกับแกงอ่อมรสชาติจัดจ้านแบบอีสานแท้ ๆ แม่ยังชมว่าอร่อย", name: "คุณต้น", detail: "สมาชิก Size L", rating: 4 },
  { id: "REV-105", quote: "ขั้นตอนเขียนเข้าใจง่ายมาก คนไม่เคยเข้าครัวแบบผมก็ทำได้", name: "คุณเจมส์", detail: "สั่งรายชุด", rating: 5 },
  { id: "REV-106", quote: "กรองเมนูโซเดียมต่ำได้ สะดวกมากสำหรับคุณพ่อที่ต้องคุมความดัน", name: "คุณฝน", detail: "สมาชิก Size M", rating: 5 },
  { id: "REV-107", quote: "แพ็กเกจรายสัปดาห์คุ้มกว่าซื้อแยก ได้ลองอาหารครบทั้ง 4 ภาค", name: "ครอบครัวคุณเก่ง", detail: "สมาชิก Size XL", rating: 5 },
  { id: "REV-108", quote: "วัตถุดิบสดมาก ผักยังกรอบ แพ็กมาดี จัดส่งตรงเวลา", name: "คุณแอน", detail: "สมาชิก Size S", rating: 4 },
  { id: "REV-109", quote: "ไก่กอแระหอมเครื่องแกงใต้ ลูก ๆ ขอให้สั่งซ้ำทุกอาทิตย์", name: "คุณหมิว", detail: "สมาชิก Size L", rating: 5 },
  { id: "REV-110", quote: "ได้เรียนรู้ที่มาของแต่ละเมนูไปด้วย เหมือนได้เที่ยวเมืองไทยผ่านอาหาร", name: "คุณปาล์ม", detail: "สั่งรายชุด", rating: 5 },
];
const ALL_REVIEWS = [...reviews, ...EXTRA_REVIEWS];

const AVATAR_COLORS = ["#8d593a", "#b5764e", "#9b6747", "#6e432a", "#a77b45", "#7b5139"];
const avatarColor = (name) => AVATAR_COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length];

export default function ReviewsSection() {
  return (
    <>
      <section className="home-section bg-[#e8dfd1]">
        <div className="home-container">
          <div className="home-heading">
            <h2 className="mt-4">มื้อแรกก็ทำได้จริง</h2>
            <span className="text-2xl">
              เรื่องเล่าจากคนที่อยากทำอาหารไทยเอง และค้นพบว่ามันง่ายกว่าที่คิด
            </span>
          </div>
        </div>

        {/* รีวิวไหลวนต่อเนื่อง (ไม่หยุดเมื่อเมาส์ชี้) — ขอบซ้าย/ขวาค่อย ๆ จาง */}
        <style>{`
          @keyframes reviewsMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .reviews-track { animation: reviewsMarquee 70s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .reviews-track { animation-duration: 240s; } }
        `}</style>
        <div
          className="relative w-full overflow-hidden py-2"
          style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
        >
          <div className="reviews-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-6 pr-6" aria-hidden={copy === 1}>
                {ALL_REVIEWS.map(({ id, quote, name, detail, rating, avatar }) => (
                  <blockquote
                    key={`${copy}-${id}`}
                    className="flex w-[300px] shrink-0 flex-col rounded-[1.8rem] border border-white/60 bg-[#fdfbf7] p-6 shadow-[0_18px_45px_rgba(61,44,46,0.06)] sm:w-[360px] sm:p-7"
                  >
                    <div className="text-[#c58a42]" aria-label={`${rating} ดาว`}>
                      {"★".repeat(rating)}
                      <span className="text-[#e3d3bd]">{"★".repeat(5 - rating)}</span>
                    </div>
                    <p className="mb-6 mt-4 text-base leading-7 text-[#2f2119] sm:text-lg sm:leading-8">“{quote}”</p>
                    <footer className="mt-auto flex items-center justify-between gap-4 border-t border-[#e8dfd1] pt-5">
                      <div className="min-w-0">
                        <strong className="block truncate text-xl">{name}</strong>
                        <span className="text-base text-[#6f675f]">{detail}</span>
                      </div>
                      {avatar ? (
                        <img src={avatar} alt={`ภาพผู้รีวิว ${name}`} className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-md" loading="lazy" />
                      ) : (
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-white text-xl font-bold text-white shadow-md" style={{ background: avatarColor(name) }}>
                          {name.replace(/^(คุณ|ครอบครัว)/, "").trim().charAt(0)}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#fdfbf7] py-8 sm:py-12">
        <div className="home-container relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#8d593a_0%,#b5764e_50%,#9b6747_100%)] px-6 py-12 text-center text-white shadow-[0_24px_70px_rgba(123,81,57,0.28)] sm:px-12 sm:py-16">
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            คืนนี้ ให้ครัวไทยมาอยู่ในบ้านคุณ
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#f3e8df]">
            เริ่มจาก 4 Kits ต่อสัปดาห์ ได้ทั้งวัตถุดิบ สูตร และเรื่องราวดี ๆ
            ในทุกกล่อง
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#kits"
              className="shimmer-button inline-flex w-full justify-center rounded-full bg-white px-6 py-4 text-lg font-bold text-[#3d2c2e] transition-colors hover:bg-[#f1dec9] sm:w-auto sm:px-8"
            >
              เริ่มเลือกเมนูของคุณ →
            </a>
            <a
              href="#plans"
              className="inline-flex w-full justify-center rounded-full border border-white/35 bg-white/10 px-6 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto sm:px-8"
            >
              ดูแพ็กเกจทั้งหมด
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
