import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Resume from "./Resume";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import About from "./About";
import Projects from "./Projects";

// --- Import the new Admin components ---
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

// --- This component protects your admin dashboard ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  // If there's no token, redirect to the /admin login page
  return token ? children : <Navigate to="/admin" replace />;
};

const router = createBrowserRouter([
  // --- This is your existing public site layout ---
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
  
  // --- Add the new Admin routes here ---
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;