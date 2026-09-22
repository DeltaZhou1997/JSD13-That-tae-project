import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useProducts } from "../../context/ProductsContext.js";
function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function AdminProductList() {
  const { products, deleteProduct } = useProducts();
  const [loading, setLoading] = useState(true);
  // เก็บ id ของแถวที่กดลบไว้ เพื่อถามยืนยันในแถวนั้นแทนการใช้ popup ของเบราว์เซอร์
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    // แสดง skeleton ชั่วครู่ขณะโหลดข้อมูล
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirmDelete = (id) => {
    deleteProduct(id);
    setPendingDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f08]">
            จัดการรายการ Cooking Kit (Admin)
          </h1>
          <p className="mt-1 text-sm text-[#6b3215]">
            {loading ? (
              <span className="skeleton-warm inline-block h-3.5 w-24 rounded align-middle" />
            ) : (
              `ทั้งหมด ${products.length} รายการ`
            )}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#4c1f08] px-4 py-2 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
        >
          <PlusIcon className="h-4 w-4" />
          เพิ่มเมนูใหม่
        </Link>
      </div>

      <div className="rounded-xl border border-[#f1ead7] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[760px]">
            {/* หัวตาราง ตรึงอยู่กับที่ด้านบน ไม่มี scrollbar กวนสายตา */}
            <div className="border-b border-[#dfd1c1] bg-[#f1ead7] px-4 py-3.5 text-sm font-semibold text-[#4c1f08]">
              <div className="grid grid-cols-[64px_1fr_120px_100px_90px_140px] items-center gap-3">
                <div>รูปภาพ</div>
                <div>ชื่อเมนู</div>
                <div>ภูมิภาค</div>
                <div>ราคา (บาท)</div>
                <div>สต็อก (ชุด)</div>
                <div className="text-center">การจัดการ</div>
              </div>
            </div>

            {/* เนื้อหาตาราง เลื่อนได้เฉพาะส่วนนี้ scrollbar อยู่เฉพาะช่วงเนื้อหา ไม่ยาวขึ้นไปถึงหัวข้อ */}
            <div className="custom-scrollbar max-h-[calc(100vh-220px)] min-h-[320px] overflow-y-auto px-4 divide-y divide-[#f1ead7]">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[64px_1fr_120px_100px_90px_140px] items-center gap-3 py-3 animate-pulse"
                  >
                    <div className="skeleton-warm h-12 w-12 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="skeleton-warm h-4 w-3/4 rounded" />
                      <div className="skeleton-warm h-3 w-1/3 rounded" />
                    </div>
                    <div>
                      <div className="skeleton-warm h-4 w-16 rounded" />
                    </div>
                    <div>
                      <div className="skeleton-warm h-4 w-14 rounded" />
                    </div>
                    <div>
                      <div className="skeleton-warm h-4 w-10 rounded" />
                    </div>
                    <div className="flex justify-center gap-2">
                      <div className="skeleton-warm h-7 w-14 rounded-full" />
                      <div className="skeleton-warm h-7 w-12 rounded-full" />
                    </div>
                  </div>
                ))
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-[#6b3215]">
                  ยังไม่มีรายการสินค้าในคลัง
                </div>
              ) : (
                products.map((product) => {
                  const prodId = product._id || product.id;
                  return (
                    <div
                      key={prodId}
                      className="grid grid-cols-[64px_1fr_120px_100px_90px_140px] items-center gap-3 py-3 text-sm transition-colors hover:bg-[#fff8f5]"
                    >
                      {/* รูปภาพ */}
                      <div>
                        {product.imageUrl ? (
                          <img
                            src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-[#f1ead7]"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1ead7] text-xs text-[#6b3215]">
                            ไม่มีรูป
                          </div>
                        )}
                      </div>

                      {/* ชื่อเมนู */}
                      <div className="font-semibold text-[#4c1f08] truncate" title={product.name}>
                        {product.name}
                      </div>

                      {/* ภูมิภาค */}
                      <div className="text-[#6b3215]">
                        {product.regionNameTh || product.region}
                      </div>

                      {/* ราคา (บาท) */}
                      <div className="text-[#6b3215] font-medium">
                        {Number(product.price)?.toLocaleString()}
                      </div>

                      {/* สต็อก (ชุด) */}
                      <div className="text-[#6b3215]">
                        {product.quantity}
                      </div>

                      {/* การจัดการ */}
                      <div className="text-center">
                        {pendingDeleteId === prodId ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-xs text-red-600 font-medium">
                              ยืนยันลบ &quot;{product.name}&quot;?
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(prodId)}
                                className="rounded-full bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700 cursor-pointer"
                              >
                                ยืนยันลบ
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(null)}
                                className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-800 transition hover:bg-gray-300 cursor-pointer"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/products/edit/${prodId}`}
                              className="rounded-full bg-[#4c1f08] px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-[#6b3215]"
                            >
                              แก้ไข
                            </Link>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(prodId)}
                              className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-red-700 cursor-pointer"
                            >
                              ลบ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductList;
