import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import PredictionPage from "./components/prediction/PredictionPage";
import ResultsPage from "./components/results/ResultsPage";
import SettingsPage from "./components/settings/SettingsPage";
import ErrorPage from "./components/ErrorPage";
import Setup from "./components/setup/Setup";
import StatusPage from "./components/StatusPage";
import { OpenAPI } from './httpfunctions';
import useCreateRouterIfNotExists from "./hooks/useGetRoute";
import useGetRoute from "./hooks/useGetRoute";

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


  const { loading, routeId, error } = useGetRoute();

  if (loading){
    return <p>loading</p>
  }

  if(!routeId){
    return <Setup/>
  }

  return (
    <RouterProvider router={router}></RouterProvider>
  )
};

export default App;
