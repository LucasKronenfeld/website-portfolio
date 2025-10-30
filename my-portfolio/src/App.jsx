import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  return (
    // The main container for your app's layout
    <div className="min-h-screen flex flex-col items-center bg-background text-text pt-20">
      <header className="w-full">
        <Navbar />
      </header>
      {/* The mt-20 is no longer needed here since padding is added to the parent */}
      <main className="w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl bg-accent text-text rounded-lg shadow-lg p-4 sm:p-6">
        <Outlet /> {/* Your pages defined in router.jsx will render here */}
      </main>
    </div>
  );
}
