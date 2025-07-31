// src/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Resume from "./Resume";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import About from "./About";
import Projects from "./Projects";
import Blog from "./Blog"; // <-- 1. IMPORT THE NEW COMPONENT

// ... (Your ProtectedRoute and Admin imports are here) ...

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
      { path: "blog", element: <Blog /> }, // <-- 2. ADD THE NEW ROUTE
      { path: "*", element: <NotFound /> },
    ],
  },
  
  // ... (Your admin routes are here) ...
]);

export default router;