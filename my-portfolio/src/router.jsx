import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Resume from "./Resume";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import About from "./About";
import Projects from "./Projects";
import Blog from "./Blog"; // <-- 1. IMPORT THE NEW COMPONENT
import BlogPost from "./BlogPost";

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
      { path: "about", element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "blog", element: <Blog /> }, // <-- 2. ADD THE NEW ROUTE
      { path: "blog/:id", element: <BlogPost /> }, // Blog post detail page

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