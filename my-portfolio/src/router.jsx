import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Resume from "./Resume";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import About from "./About";
import Projects from "./Projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "resume", element: <Resume /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "About", element: <About /> },
      { path: "Projects", element: <Projects /> },
      { path: "*", element: <NotFound /> }, // Catch-all for 404s
    ],
  },
]);

export default router;