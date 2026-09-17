import { useState } from "react";
import { Link } from "react-router-dom";

import { useProducts } from "../../context/ProductsContext.js";

function AdminProductList() {
  const { products, deleteProduct } = useProducts();
  // เก็บ id ของแถวที่กดลบไว้ เพื่อถามยืนยันในแถวนั้นแทนการใช้ popup ของเบราว์เซอร์
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleConfirmDelete = (id) => {
    deleteProduct(id);
    setPendingDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f08]">
            จัดการรายการ Cooking Kit (Admin)
          </h1>
          <p className="mt-1 text-sm text-[#6b3215]">
            ทั้งหมด {products.length} รายการ
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-[#4c1f08] px-4 py-2 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
        >
          + เพิ่มเมนูใหม่
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#f1ead7] bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#f1ead7] bg-[#f1ead7] text-[#4c1f08]">
              <th className="p-3">รูปภาพ</th>
              <th className="p-3">ชื่อเมนู</th>
              <th className="p-3">ภูมิภาค</th>
              <th className="p-3">ราคา (บาท)</th>
              <th className="p-3">สต็อก (ชุด)</th>
              <th className="p-3 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-[#6b3215]">
                  ยังไม่มีรายการสินค้าในคลัง
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-[#f1ead7] transition-colors hover:bg-[#fff8f5]"
                >
                  <td className="p-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      // เมนูที่เพิ่งเพิ่มเองอาจยังไม่มีรูป จึงแสดงกล่องว่างแทนรูปที่โหลดไม่ขึ้น
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-[#f1ead7] text-xs text-[#6b3215]">
                        ไม่มีรูป
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#4c1f08]">{product.name}</td>
                  <td className="p-3 text-[#6b3215]">
                    {product.regionNameTh || product.region}
                  </td>
                  <td className="p-3 text-[#6b3215]">{product.price}</td>
                  <td className="p-3 text-[#6b3215]">{product.quantity}</td>
                  <td className="p-3">
                    {pendingDeleteId === product._id ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-red-600">
                          ยืนยันลบ &quot;{product.name}&quot;?
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(product._id)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                          >
                            ยืนยันลบ
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-800 transition hover:bg-gray-400"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="rounded bg-[#4c1f08] px-3 py-1 text-sm text-white transition hover:bg-[#6b3215]"
                        >
                          แก้ไข
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(product._id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                        >
                          ลบ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductList;
