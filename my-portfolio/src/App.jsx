import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import "./index.css"; // Tailwind styles

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Navbar at the top */}
      <Navbar />

      {/* Page content will be rendered here */}
      <div className="mt-4 w-full max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
}
