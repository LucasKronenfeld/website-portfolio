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
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-white/10 shadow-lg" style={{ transform: 'translateZ(0)' }}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold truncate max-w-[60%] sm:max-w-none">
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            Lucas Kronenfeld
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-muted hover:text-text transition-colors duration-300 rounded-lg"
            >
              {link.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a href="mailto:kronenfeldlucas@gmail.com" className="text-muted hover:text-primary transition-colors" title="Email">
              <EnvelopeIcon className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <a href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" title="LinkedIn">
              <UserIcon className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <a href="https://github.com/LucasKronenfeld" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" title="GitHub">
              <CodeBracketIcon className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <Link to="/admin" className="text-muted hover:text-primary transition-colors" title="Admin">
              <ArrowRightOnRectangleIcon className="w-5 h-5 xl:w-6 xl:h-6" />
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-text z-50 relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-7 h-7 sm:w-8 sm:h-8" /> : <Bars3Icon className="w-7 h-7 sm:w-8 sm:h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only visible when isOpen is true */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-screen bg-surface z-40 lg:hidden"
          style={{ paddingTop: '80px' }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="text-2xl sm:text-3xl text-muted hover:text-text transition-colors duration-300"
              >
                {link.text}
              </Link>
            ))}
            <div className="flex justify-center space-x-8 sm:space-x-10 pt-8 border-t border-white/10 w-full max-w-sm">
              <a 
                href="mailto:kronenfeldlucas@gmail.com" 
                className="text-muted hover:text-primary transition-colors"
                title="Email"
              >
                <EnvelopeIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <a 
                href="https://www.linkedin.com/in/lucas-kronenfeld-872040269/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-primary transition-colors"
                title="LinkedIn"
              >
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <a 
                href="https://github.com/LucasKronenfeld" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-primary transition-colors"
                title="GitHub"
              >
                <CodeBracketIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="text-muted hover:text-primary transition-colors"
                title="Admin"
              >
                <ArrowRightOnRectangleIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
