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

