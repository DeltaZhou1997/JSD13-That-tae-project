import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout, ProtectedRoute } from './components/index.js'

import HomePage from "./pages/Home.jsx";

import ToastProvider from './context/ToastProvider.jsx'
import { AppProvider } from './context/AppContext.jsx';
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProductList from './pages/admin/AdminProductList.jsx'
import AdminOrderList from './pages/admin/AdminOrderList.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import AdminUserList from './pages/admin/AdminUserList.jsx'
import AdminIngredientList from './pages/admin/AdminIngredientList.jsx'
import IngredientForm from './pages/admin/IngredientForm.jsx'
import AdminRecipeBuilder from './pages/admin/AdminRecipeBuilder.jsx'
import ProductsProvider from './context/ProductsProvider.jsx'
import IngredientsProvider from './context/IngredientsProvider.jsx'
import AuthProvider from './context/AuthProvider.jsx'

import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ElementQuizPage from "./pages/ElementQuizPage.jsx";
import MenuRandomizerPage from "./pages/MenuRandomizerPage.jsx";

import MenuOverview from "./pages/MenuOverview";
import MenuDetail from "./pages/MenuDetail";

import Cart from "./components/cart/Cart.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// 🆕 Stripe — โหลด Stripe SDK ด้วย Publishable Key จาก .env
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // 🔒 โซนผู้ดูแลระบบ (Admin Only) — ป้องกันไม่ให้ลูกค้าทั่วไปหรือผู้ยังไม่ล็อกอินเข้าถึง
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "orders",
            element: <AdminOrderList />,
          },
          {
            path: "users",
            element: <AdminUserList />,
          },
          {
            path: "products",
            element: <AdminProductList />,
          },
          {
            path: "products/new",
            element: <ProductForm />,
          },
          {
            path: "products/edit/:id",
            element: <ProductForm />,
          },
          {
            path: "ingredients",
            element: <AdminIngredientList />,
          },
          {
            path: "ingredients/new",
            element: <IngredientForm />,
          },
          {
            path: "ingredients/edit/:id",
            element: <IngredientForm />,
          },
          {
            path: "recipe-builder",
            element: <AdminRecipeBuilder />,
          },
        ],
      },
      // 🌐 เส้นทางสาธารณะ (Public Routes)
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      // 🔒 เส้นทางสำหรับผู้ใช้งานที่เข้าสู่ระบบแล้วเท่านั้น (Protected User Routes)
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
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
        path: "quiz",
        element: <Navigate to="/element-quiz" replace />,
      },

      {
        path: "menu-randomizer",
        element: <MenuRandomizerPage />,
      },

      {
        path: "/menus",
        element: <MenuOverview />,
      },

      {
        path: "/menus/:id",
        element: <MenuDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <IngredientsProvider>
          <ToastProvider>
     <Elements stripe={stripePromise}>
            <RouterProvider router={router} />
              </Elements>
          </ToastProvider>
        </IngredientsProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
