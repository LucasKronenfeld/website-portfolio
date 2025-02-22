import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import "./index.css"; // Tailwind styles

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background text-text">
      {/* Navbar should be full width */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Page content */}
      <div className="mt-4 w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl bg-accent text-text rounded-lg shadow-lg p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
}

