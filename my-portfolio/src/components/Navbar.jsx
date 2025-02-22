import { Link } from "react-router-dom";
import { useState } from "react";
import { EnvelopeIcon, UserIcon, CodeBracketIcon, SwatchIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar-background shadow-md p-4 bg-contrast text-text w-full">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-text px-4 py-2">
          Lucas Kronenfeld
        </Link>

        {/* Hamburger Menu (Mobile Only) */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text">
          {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>

        {/* Navigation Links */}
        <div className={`absolute md:static top-16 left-0 w-full md:w-auto bg-contrast md:bg-transparent flex flex-col md:flex-row md:space-x-8 items-center md:items-center text-lg transition-all 
          ${isOpen ? "flex" : "hidden md:flex"}`}>
          <Link to="/" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all w-full md:w-auto text-center">Home</Link>
          <Link to="/resume" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all w-full md:w-auto text-center">Resume</Link>
          <Link to="/portfolio" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all w-full md:w-auto text-center">Portfolio</Link>
          <Link to="/projects" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all w-full md:w-auto text-center">Projects</Link>
        </div>

        {/* Social Media Icons */}
        <div className="hidden md:flex space-x-6">
          <a href="mailto:kronenfeldlucas@gmail.com" className="hover:text-white"><EnvelopeIcon className="w-6 h-6" /></a>
          <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" className="hover:text-white"><UserIcon className="w-6 h-6" /></a>
          <a href="https://github.com/LucasKronenfeld" target="_blank" className="hover:text-white"><CodeBracketIcon className="w-6 h-6" /></a>
          <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" className="hover:text-white"><SwatchIcon className="w-6 h-6" /></a>
        </div>
      </div>
    </nav>
  );
}
