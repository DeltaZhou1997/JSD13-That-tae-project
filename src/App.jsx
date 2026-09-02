import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'
import HomePage from './pages/Home.jsx'
import Cart from './components/Cream/Cart.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    alert(`เพิ่ม ${product.nameTh} ลงตะกร้าแล้ว!`);
  };


  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item._id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // ส่ง props ชื่อ context ไปให้ Layout
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout context={{ cartItems, handleAddToCart, handleUpdateQuantity, handleRemoveItem }} />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "cart",
          element: <Cart />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
