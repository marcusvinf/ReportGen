import { createBrowserRouter } from "react-router-dom";
import React from "react";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { MainLayout } from "../pages/MainLayout/MainLayout";
import { Results } from "../pages/Results/Results";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "follow-up",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "results",
        element: <Results />,
      },
    ],
  },
]);
