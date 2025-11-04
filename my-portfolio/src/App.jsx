import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import WindowWrapper from "./components/ui/WindowWrapper";
import "./index.css";

export default function App() {
  const location = useLocation();
  const titleMap = {
    '/': 'Home',
    '/resume': 'Resume',
    '/portfolio': 'Portfolio',
    '/projects': 'Projects',
    '/blog': 'Blog',
    '/about': 'About'
  };
  const path = location.pathname.toLowerCase();
  const windowTitle = Object.entries(titleMap).find(([p]) => path === p)?.[1] || 'Window';

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-text pt-20">
      <header className="w-full">
        <Navbar />
      </header>
      <main className="w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl px-4 sm:px-6">
        <WindowWrapper title={`Lucas • ${windowTitle}`}>
          <Outlet />
        </WindowWrapper>
      </main>
    </div>
  );
}
