import { createBrowserRouter, createHashRouter, RouterProvider, useNavigate } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
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



  const { loading, routeId, error } = useGetRoute();
  const config = useConfig()

  if(loading){
    return <></>
  }

  if(!routeId && !loading && window.location.pathname.split("/")[1] != "route"){
    window.location.replace('/route/create-route')
  }
  else{
    OpenAPI.BASE = 'http://localhost:8000/v1'
    //OpenAPI.BASE = config.baseUrl+'/api/routes/'+routeId+"/run"
    OpenAPI.WITH_CREDENTIALS = true
  }



  return (
    <RouterProvider router={router}></RouterProvider>
  )
};

export default App;
