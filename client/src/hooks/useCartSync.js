import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useProducts } from "../context/ProductsContext.js";
import { getApiUrl, getAuthHeaders } from "../utils/authHeader.js";
import { resolveImageUrl } from "../utils/imageUrl.js";
import { clearGuestCart, readGuestCart, writeGuestCart } from "../utils/guestCartCookie.js";

const SAVE_DELAY_MS = 400;

const toLines = (items) =>
  items.map((i) => ({ productId: String(i.productId || i._id || i.id), quantity: Number(i.quantity) || 1 }));

/**
 * ตะกร้าที่จำสถานะได้
 * - ยังไม่ล็อกอิน: เก็บในคุกกี้
 * - ล็อกอิน/สมัคร: ย้ายตะกร้าในคุกกี้เข้าบัญชี (merge) แล้วซิงก์กับ DB ทุกครั้งที่เปลี่ยน
 * - ล็อกเอาต์: ล้างตะกร้า (ล็อกอินใหม่จะดึงตะกร้าของบัญชีนั้นกลับมา)
 */
export default function useCartSync() {
  const { currentUser, token } = useAuth();
  const { products = [] } = useProducts() || {};
  const [cartItems, setCartItems] = useState([]);

  const userKey = currentUser && token ? String(currentUser.id || currentUser._id) : "guest";
  const hydratedFor = useRef(null); // โหลดตะกร้าของใครเสร็จแล้ว (กันบันทึกทับก่อนโหลดเสร็จ)
  const prevUserKey = useRef(null);
  const productsRef = useRef(products);
  const skipSaveRef = useRef(false); // ข้อมูลเพิ่งโหลดจาก DB → ไม่ต้องบันทึกกลับ
  const pendingSaveRef = useRef(false); // มีการแก้ไขที่รอบันทึกอยู่ → ห้ามรีเฟรชทับ
  productsRef.current = products;

  // แปลงรายการ (productId + จำนวน) เป็นรายการที่หน้าเว็บใช้ โดยเติมข้อมูลจากสินค้า
  const toCartItems = (lines) =>
    lines
      .map((line) => {
        const p = productsRef.current.find((prod) => String(prod._id || prod.id) === String(line.productId));
        if (!p && !line.name) return null;
        const name = line.name || p?.nameTh || p?.name || "สินค้า";
        return {
          _id: String(line.productId),
          id: String(line.productId),
          productId: String(line.productId),
          name,
          nameTh: name,
          price: Number(line.price ?? p?.price) || 0,
          quantity: Number(line.quantity) || 1,
          imageUrl: resolveImageUrl(line.imageUrl || (Array.isArray(p?.imageUrl) ? p.imageUrl[0] : p?.imageUrl) || ""),
          region: p?.regionNameTh || p?.region || "",
        };
      })
      .filter(Boolean);

  // โหลดตะกร้าเมื่อสถานะล็อกอินเปลี่ยน
  useEffect(() => {
    const wasUser = prevUserKey.current && prevUserKey.current !== "guest";
    prevUserKey.current = userKey;
    hydratedFor.current = null;

    if (userKey === "guest") {
      if (wasUser) {
        // ล็อกเอาต์ → ล้างตะกร้า
        clearGuestCart();
        setCartItems([]);
        hydratedFor.current = "guest";
      } else if (productsRef.current.length > 0) {
        setCartItems(toCartItems(readGuestCart()));
        hydratedFor.current = "guest";
      }
      // ถ้าสินค้ายังโหลดไม่เสร็จ รอ effect ด้านล่างเติมข้อมูลก่อน (กันเขียนคุกกี้ว่างทับ)
      return undefined;
    }

    let alive = true;
    const guestLines = readGuestCart();
    const request = guestLines.length
      ? fetch(`${getApiUrl()}/api/v2/cart/merge`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ items: guestLines }),
        })
      : fetch(`${getApiUrl()}/api/v2/cart`, { headers: getAuthHeaders() });

    request
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!alive) return;
        if (guestLines.length) clearGuestCart(); // ย้ายเข้าบัญชีแล้ว
        setCartItems(toCartItems(data.items || []));
        hydratedFor.current = userKey;
      })
      .catch((err) => {
        console.warn("โหลดตะกร้าจากเซิร์ฟเวอร์ไม่สำเร็จ:", err.message);
        if (alive) hydratedFor.current = userKey;
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

  // สินค้าโหลดเสร็จทีหลัง → เติมชื่อ/ราคา/รูปให้รายการในคุกกี้
  useEffect(() => {
    if (userKey !== "guest" || products.length === 0 || hydratedFor.current === "guest") return;
    setCartItems(toCartItems(readGuestCart()));
    hydratedFor.current = "guest";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, userKey]);

  // รีเฟรชตะกร้าจาก DB (เรียกตอนเปลี่ยนหน้า) — ราคา/ชื่อล่าสุดจาก server
  // ข้ามถ้ายังมีการแก้ไขที่รอบันทึก เพื่อไม่ให้ทับของที่ผู้ใช้เพิ่งกด
  const refreshCart = useCallback(async () => {
    if (hydratedFor.current !== userKey) return;
    if (userKey === "guest") {
      if (productsRef.current.length > 0) {
        skipSaveRef.current = true;
        setCartItems(toCartItems(readGuestCart()));
      }
      return;
    }
    if (pendingSaveRef.current) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/v2/cart`, { headers: getAuthHeaders() });
      if (!res.ok || pendingSaveRef.current || hydratedFor.current !== userKey) return;
      const data = await res.json();
      skipSaveRef.current = true; // ข้อมูลมาจาก DB แล้ว ไม่ต้องเขียนกลับ
      setCartItems(toCartItems(data.items || []));
    } catch (err) {
      console.warn("รีเฟรชตะกร้าไม่สำเร็จ:", err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

  // บันทึกทุกครั้งที่ตะกร้าเปลี่ยน (หลังโหลดเสร็จแล้วเท่านั้น)
  useEffect(() => {
    if (hydratedFor.current !== userKey) return undefined;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return undefined;
    }
    if (userKey === "guest") {
      writeGuestCart(cartItems);
      return undefined;
    }
    pendingSaveRef.current = true;
    const timer = setTimeout(() => {
      fetch(`${getApiUrl()}/api/v2/cart`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ items: toLines(cartItems) }),
      })
        .catch((err) => console.warn("บันทึกตะกร้าไม่สำเร็จ:", err.message))
        .finally(() => {
          pendingSaveRef.current = false;
        });
    }, SAVE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      pendingSaveRef.current = false;
    };
  }, [cartItems, userKey]);

  return [cartItems, setCartItems, refreshCart];
}
