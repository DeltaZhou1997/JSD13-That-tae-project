import { createContext, useContext, useState } from 'react';

// สร้าง Context
const AppContext = createContext();

// สร้าง Provider จำลองเพื่อให้หน้าเว็บรันได้
export function AppProvider({ children }) {
  const [language, setLanguage] = useState('th'); // จำลอง state ภาษา
  const [isCartOpen, setIsCartOpen] = useState(false); // จำลอง state ตะกร้า

  // ฟังก์ชันจำลองการเพิ่มลงตะกร้า
  const addToCart = (menu, quantity) => {
    console.log(`Added ${quantity} of ${menu.nameTh} to cart`);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, addToCart, isCartOpen, setIsCartOpen }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook สำหรับเรียกใช้ Context
export function useApp() {
  return useContext(AppContext);
}