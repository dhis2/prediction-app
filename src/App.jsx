import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import PredictionPage from "./components/prediction/PredictionPage";
import ResultsPage from "./components/results/ResultsPage";
import SettingsPage from "./components/settings/SettingsPage";
import ErrorPage from "./components/ErrorPage";
<<<<<<< HEAD
import StatusPage from "./components/StatusPage";
import { OpenAPI } from './httpfunctions';
=======
import useCreateRouterIfNotExists from "./hooks/useGetRoute";
>>>>>>> route-config

const router = createHashRouter([
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
      },
    ],
  },
]);

const App = () => {
  OpenAPI.BASE = 'http://localhost:8000'

  const { loading, error } = useCreateRouterIfNotExists();

  if (loading){
    return <p>loading</p>
  }

  return (
    <RouterProvider router={router}></RouterProvider>
  )
};

export default App;
