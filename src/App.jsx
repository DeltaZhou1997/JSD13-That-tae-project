import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'
import HomePage from './pages/Home.jsx'
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import AdminProductList from './pages/admin/AdminProductList.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import ProductsProvider from './context/ProductsProvider.jsx'

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
      }
    ]
  }
]);

function App() {
  return (
    <ProductsProvider>
      <RouterProvider router={router} />
    </ProductsProvider>
  );
}

export default App
