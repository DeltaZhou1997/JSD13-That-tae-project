import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'
import HomePage from './pages/Home.jsx'
import MenuOverview from './pages/MenuOverview'
import MenuDetail from './pages/MenuDetail'

import { AppProvider } from './context/AppContext.jsx';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />
        }
      ]
    },
    {
        path: "/menus", 
        element: <MenuOverview /> 
      },
          {
        path: "/menus/:id", 
        element: <MenuDetail /> 
      }
  ]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
