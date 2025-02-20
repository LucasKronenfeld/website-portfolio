import { Link } from "react-router-dom";
import { EnvelopeIcon, UserIcon, CodeBracketIcon, SwatchIcon } from '@heroicons/react/24/outline';  // Updated import statements

export default function Navbar() {
  return (
    <nav className="navbar-background shadow-md p-4 bg-contrast text-text w-full"> {/* Full width navbar */}
      <div className="flex justify-between items-center w-full"> {/* Full width flex container */}
        {/* Logo / Brand */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-text rounded-lg hover:rounded-lg hover:shadow-lg transition-all px-4 py-2"
        >
          Lucas Kronenfeld
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className="px-4 py-2 rounded-lg hover:bg-darkback hover:text-white hover:shadow-lg hover:rounded-lg transition-all"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 rounded-lg hover:bg-darkback hover:text-white hover:shadow-lg hover:rounded-lg transition-all"
          >
            About
          </Link>
          <Link 
            to="/resume" 
            className="px-4 py-2 rounded-lg hover:bg-darkback hover:text-white hover:shadow-lg hover:rounded-lg transition-all"
          >
            Resume
          </Link>
          <Link 
            to="/portfolio" 
            className="px-4 py-2 rounded-lg hover:bg-darkback hover:text-white hover:shadow-lg hover:rounded-lg transition-all"
          >
            Portfolio
          </Link>
          <Link 
            to="/Projects" 
            className="px-4 py-2 rounded-lg hover:bg-darkback hover:text-white hover:shadow-lg hover:rounded-lg transition-all"
          >
            Projects
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6 ml-auto"> {/* Push icons to the far right */}
          <a href="mailto:kronenfeldlucas@gmail.com" target="_blank" rel="noopener noreferrer" className="text-text hover:text-white">
            <EnvelopeIcon className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-text hover:text-white">
            <UserIcon className="w-6 h-6" />
          </a>
          <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-text hover:text-white">
            <CodeBracketIcon className="w-6 h-6" />
          </a>
          {/* Color Palette Icon */}
          <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" rel="noopener noreferrer" className="text-text hover:text-white">
            <SwatchIcon className="w-6 h-6" /> {/* Add the color swatch icon */}
          </a>
        </div>
      </div>
    </nav>
  );
}
