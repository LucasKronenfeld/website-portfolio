import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import "./index.css"; // Tailwind styles

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background text-text">
      {/* Navbar at the top, aligned to the left */}
      <div className="w-full flex justify-start">
        <Navbar />
      </div>

      {/* Page content will be rendered here */}
      <div className="mt-4 w-full max-w-3xl bg-background text-text rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
