import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/index.js";
import HomePage from "./pages/Home.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ElementQuizPage from "./pages/ElementQuizPage.jsx";
import MenuRandomizerPage from "./pages/MenuRandomizerPage.jsx";
import SpinningWheel from "./pages/SpinningWheel.jsx";

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
        path: "spinningWheel",
        element: <SpinningWheel />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
