import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar-background shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold text-blue-600">My Portfolio</h1>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link 
            to="/" 
            className="px-4 py-2 rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all"
          >
            About
          </Link>
          <Link 
            to="/resume" 
            className="px-4 py-2 rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all"
          >
            Resume
          </Link>
          <Link 
            to="/portfolio" 
            className="px-4 py-2 rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </nav>
  );
}