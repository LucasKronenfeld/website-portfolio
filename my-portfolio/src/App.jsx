import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <nav className="flex gap-4 text-lg">
        <Link to="/">Home</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/portfolio">Portfolio</Link>
      </nav>
      <div className="mt-4 w-full max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
}
