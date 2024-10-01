import { createBrowserRouter, createHashRouter, RouterProvider, useNavigate } from "react-router-dom";
import Root from "./components/Root";
import PredictionPage from "./components/prediction/PredictionPage";
import ResultsPage from "./components/results/ResultsPage";
import SettingsPage from "./components/settings/SettingsPage";
import CreateRoutePage from "./components/CreateRoutePage";
import TestRoutePage from "./components/TestRoutePage";
import ErrorPage from "./components/ErrorPage";
import Setup from "./components/setup/CreateRoute";
import StatusPage from "./components/StatusPage";
import { OpenAPI } from './httpfunctions';
import useCreateRouterIfNotExists from "./hooks/useGetRoute";
import useGetRoute from "./hooks/useGetRoute";
import { useConfig } from "@dhis2/app-runtime";
import React from "react";

const router = createBrowserRouter([
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
    path: "",
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

  const config = useConfig()
    OpenAPI.BASE = config.baseUrl+'/api/routes/'+"chap"+"/run"
    OpenAPI.WITH_CREDENTIALS = true

  return (
    <RouterProvider router={router}></RouterProvider>
  )
};

export default App;
