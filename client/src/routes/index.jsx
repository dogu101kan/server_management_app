import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "../layouts/main/index";
import { ManagementLayer } from "../layouts/management/index";
import { Login } from "../pages/login";
import { Home } from "../pages/home";
import { Register } from "../pages/register";
import { Management } from "../pages/management";
import { NotFound } from "../pages/not-found";
import { OutletProps } from "../components/outletProps";
import PrivateRoute from "../components/private-route";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/management",
    element: <PrivateRoute />,
    children: [
      {
        path: "/management",
        element: <ManagementLayer />,
        children: [
          {
            index: true,
            element: <OutletProps />,
          },
        ],
      },
    ],
  },
]);

export default routes;
