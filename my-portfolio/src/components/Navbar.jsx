import { Link } from "react-router-dom";
import { useState } from "react";
import { EnvelopeIcon, UserIcon, CodeBracketIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/resume", text: "Resume" },
    { to: "/portfolio", text: "Portfolio" },
    { to: "/projects", text: "Projects" },
    { to: "/blog", text: "Blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-white/10" style={{ transform: 'translateZ(0)' }}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            Lucas Kronenfeld
          </span>
        </Link>

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

        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-6 mr-4">
            <a href="mailto:kronenfeldlucas@gmail.com" className="text-muted hover:text-primary transition-colors"><EnvelopeIcon className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><UserIcon className="w-6 h-6" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><CodeBracketIcon className="w-6 h-6" /></a>
            <Link to="/admin" className="text-muted hover:text-primary transition-colors"><ArrowRightOnRectangleIcon className="w-6 h-6" /></Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text z-50">
            {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

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
          <div className="flex justify-center space-x-8 pt-8">
            <a href="mailto:kronenfeldlucas@gmail.com" className="text-muted hover:text-primary transition-colors"><EnvelopeIcon className="w-8 h-8" /></a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><UserIcon className="w-8 h-8" /></a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors"><CodeBracketIcon className="w-8 h-8" /></a>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-muted hover:text-primary transition-colors"><ArrowRightOnRectangleIcon className="w-8 h-8" /></Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
