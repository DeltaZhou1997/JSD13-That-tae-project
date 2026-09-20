import { reviews } from "../../mock-data/index.js";

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
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map(({ id, quote, name, detail, rating, avatar }) => (
              <blockquote
                key={id}
                className="flex h-full flex-col rounded-[1.8rem] border border-white/60 bg-[#fdfbf7] p-7 shadow-[0_18px_45px_rgba(61,44,46,0.06)]"
              >
                <div className="text-[#c58a42]" aria-label={`${rating} ดาว`}>
                  {"★".repeat(rating)}
                </div>
                <p className="mb-6 mt-5 text-lg leading-8 text-[#2f2119]">
                  “{quote}”
                </p>
                <footer className="mt-auto flex items-center justify-between gap-4 border-t border-[#e8dfd1] pt-5">
                  <div>
                    <strong className="block text-2xl">{name}</strong>
                    <span className="text-lg text-[#6f675f]">{detail}</span>
                  </div>
                  <img
                    src={avatar}
                    alt={`ภาพผู้รีวิว ${name}`}
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-md"
                    loading="lazy"
                  />
                </footer>
              </blockquote>
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
