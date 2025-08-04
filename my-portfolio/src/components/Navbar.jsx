import { Link } from "react-router-dom";
import { useState } from "react";
import { EnvelopeIcon, UserIcon, CodeBracketIcon, SwatchIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar-background shadow-md p-4 bg-contrast text-text w-full fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Left Side: Logo & Navigation Links */}
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-text px-4 py-2">
            Lucas Kronenfeld
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 ml-8">
            <Link to="/" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Home</Link>
            <Link to="/resume" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Resume</Link>
            <Link to="/portfolio" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Portfolio</Link>
            <Link to="/projects" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Projects</Link>
            <Link to="/blog" className="px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Blog</Link>
          </div>
        </div>

        {/* Right Side: Social Media Icons & Mobile Menu */}
        <div className="flex items-center">
          {/* Social Icons (always visible on desktop) */}
          <div className="hidden md:flex space-x-6">
            <a href="mailto:kronenfeldlucas@gmail.com" className="hover:text-white"><EnvelopeIcon className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" className="hover:text-white"><UserIcon className="w-6 h-6" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" className="hover:text-white"><CodeBracketIcon className="w-6 h-6" /></a>
            <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" className="hover:text-white"><SwatchIcon className="w-6 h-6" /></a>
          </div>

          {/* Mobile Menu Button (Hidden on desktop) */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text ml-4 z-50">
            {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Only visible when open) */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4 bg-contrast text-text p-4 rounded-lg absolute top-16 left-0 w-full z-50 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Home</Link>
          <Link to="/resume" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Resume</Link>
          <Link to="/portfolio" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Portfolio</Link>
          <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Projects</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-darkback hover:text-white rounded-lg transition-all">Blog</Link>

          {/* Social Icons in Mobile Menu */}
          <div className="flex justify-center space-x-6 pt-4">
            <a href="mailto:kronenfeldlucas@gmail.com" onClick={() => setIsOpen(false)} className="hover:text-white"><EnvelopeIcon className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" onClick={() => setIsOpen(false)} className="hover:text-white"><UserIcon className="w-6 h-6" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" onClick={() => setIsOpen(false)} className="hover:text-white"><CodeBracketIcon className="w-6 h-6" /></a>
            <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" onClick={() => setIsOpen(false)} className="hover:text-white"><SwatchIcon className="w-6 h-6" /></a>
          </div>
        </div>
      )}
    </nav>
  );
}
