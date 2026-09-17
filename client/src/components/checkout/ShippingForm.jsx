import React from "react";

const DELIVERY_SCHEDULES = [
  { day: "SUN", date: "12", month: "พ.ย." },
  { day: "SUN", date: "19", month: "พ.ย." },
  { day: "SUN", date: "26", month: "พ.ย." },
];

export default function ShippingForm({ formData, onChange, onDateChange }) {
  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">🚚</span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ข้อมูลการจัดส่ง</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            ชื่อ - นามสกุล
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            ที่อยู่จัดส่ง
          </label>
          <textarea
            name="address"
            rows="2"
            value={formData.address}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            อำเภอ/เขต
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            จังหวัด
          </label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#6f675f] mb-1">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChange}
            className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
            required
          />
        </div>
      </div>

      <div className="mt-6 border-t border-[#e8dfd1] pt-4">
        <label className="block text-xs font-semibold text-[#6f675f] mb-2">
          เลือกรอบรับสินค้า (จัดส่งทุกวันอาทิตย์)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DELIVERY_SCHEDULES.map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => onDateChange(item.date)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.deliveryDate === item.date
                  ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                  : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
              }`}
            >
              <div className="text-[10px] opacity-80">{item.day}</div>
              <div className="text-xl font-bold">{item.date}</div>
              <div className="text-[10px] opacity-80">{item.month}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
