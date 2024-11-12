import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import PredictionPage from "./components/prediction/PredictionPage";
import ResultsPage from "./components/results/ResultsPage";
import SettingsPage from "./components/settings/SettingsPage";
import CreateRoutePage from "./components/CreateRoutePage";
import TestRoutePage from "./components/TestRoutePage";
import ErrorPage from "./components/ErrorPage";
import StatusPage from "./components/StatusPage";
import React from "react";
import "./App.css";

const router = createHashRouter([
  {
    path: "route",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "create-route",
        element: <CreateRoutePage />,
      },
      {
        path: "test-route",
        element: <TestRoutePage />,
      },
    ]
  },
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <PredictionPage />,
      },
      {
        path: "results",
        element: <ResultsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "status",
        element: <StatusPage />,
      }
    ],
  },
]);

const App = () => {




  return (
    <RouterProvider router={router}></RouterProvider>
  )
};

export default App;
