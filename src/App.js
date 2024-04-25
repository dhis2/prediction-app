import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import PredictionPage from "./components/prediction/PredictionPage";
import SettingsPage from "./components/settings/SettingsPage";
import ErrorPage from "./components/ErrorPage";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <AboutPage />,
      },
      {
        path: "prediction",
        element: <PredictionPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router}></RouterProvider>;

export default App;
