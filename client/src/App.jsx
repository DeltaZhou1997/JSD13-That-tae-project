import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'

import HomePage from './pages/Home.jsx'

import ToastProvider from './context/ToastProvider.jsx'
import { AppProvider } from './context/AppContext.jsx';
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import AdminProductList from './pages/admin/AdminProductList.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import ProductsProvider from './context/ProductsProvider.jsx'
import AuthProvider from './context/AuthProvider.jsx'

import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ElementQuizPage from "./pages/ElementQuizPage.jsx";
import MenuRandomizerPage from "./pages/MenuRandomizerPage.jsx";

import MenuOverview from './pages/MenuOverview'
import MenuDetail from './pages/MenuDetail'

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
  
  



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "admin/products",
        element: <AdminProductList />
      },
      {
        path: "admin/products/new",
        element: <ProductForm />
      },
      {
        path: "admin/products/edit/:id",
        element: <ProductForm />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "element-quiz",
        element: <ElementQuizPage />,
      },

      {
        path: "menu-randomizer",
        element: <MenuRandomizerPage />,
      },

      {
        path: "/menus",
        element: <MenuOverview />
      },

      {
        path: "/menus/:id",
        element: <MenuDetail />
      },
        {
          path: "cart",
          element: <Cart />
        }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}

export default App

