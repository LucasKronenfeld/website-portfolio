import { Link } from "react-router-dom";
import { useState } from "react";
import { EnvelopeIcon, UserIcon, CodeBracketIcon, SwatchIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Define nav links for easier reuse
  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/resume", text: "Resume" },
    { to: "/portfolio", text: "Portfolio" },
    { to: "/projects", text: "Projects" },
    { to: "/blog", text: "Blog" },
    { to: "/admin", text: "Admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            Lucas Kronenfeld
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="px-4 py-2 text-muted hover:text-text transition-colors duration-300 rounded-lg"
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Right Side: Social Media Icons & Mobile Menu */}
        <div className="flex items-center">
          <div className="hidden md:flex space-x-6 mr-6">
            <a href="mailto:kronenfeldlucas@gmail.com" className="text-muted hover:text-primary transition-colors"><EnvelopeIcon className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><UserIcon className="w-6 h-6" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><CodeBracketIcon className="w-6 h-6" /></a>
            <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><SwatchIcon className="w-6 h-6" /></a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text z-50">
            {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen bg-surface/95 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-2xl text-muted hover:text-text transition-colors duration-300"
            >
              {link.text}
            </Link>
          ))}
          {/* Social Icons in Mobile Menu */}
          <div className="flex justify-center space-x-8 pt-8">
            <a href="mailto:kronenfeldlucas@gmail.com" className="text-muted hover:text-primary transition-colors"><EnvelopeIcon className="w-8 h-8" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><UserIcon className="w-8 h-8" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><CodeBracketIcon className="w-8 h-8" /></a>
            <a href="/AdobeColor-FlamingosLife.jpeg" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><SwatchIcon className="w-8 h-8" /></a>
          </div>
        </div>
      </div>
    </nav>
  );
}
