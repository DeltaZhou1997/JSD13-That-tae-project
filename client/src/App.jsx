import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'

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
      {
        path: "admin",
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard />
      },
      {
        path: "admin/orders",
        element: <AdminOrderList />
      },
      {
        path: "admin/users",
        element: <AdminUserList />
      },
      {
        path: "admin/products",
        element: <AdminProductList />,
      },
      {
        path: "admin/products/new",
        element: <ProductForm />,
      },
      {
        path: "admin/products/edit/:id",
        element: <ProductForm />,
      },
      {
        path: "admin/ingredients",
        element: <AdminIngredientList />
      },
      {
        path: "admin/ingredients/new",
        element: <IngredientForm />
      },
      {
        path: "admin/ingredients/edit/:id",
        element: <IngredientForm />
      },
      {
        path: "admin/recipe-builder",
        element: <AdminRecipeBuilder />
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
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
        element: <OrdersPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/edit",
        element: <ProfilePage />,
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
