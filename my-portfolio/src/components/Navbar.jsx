import { Link } from "react-router-dom";
import { useState } from "react";
import Icon from "./ui/Icon";
import { getSiteLinks } from "../siteLinks";

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface border-b-2 border-ink" style={{ transform: 'translateZ(0)' }}>
      <div className="container mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold truncate max-w-[60%] sm:max-w-none text-ink font-mono leading-100">
          <span>Lucas Kronenfeld</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="px-2 xl:px-3 py-1 text-sm xl:text-base leading-110 text-muted hover:text-text transition-colors border-2 border-transparent hover:border-ink"
            >
              {link.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(() => { const links = getSiteLinks(); return null; })()}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a href={`mailto:${getSiteLinks().email}`} className="text-muted hover:text-primary transition-colors" title="Email">
              <Icon name="mail" className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <a href={getSiteLinks().linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" title="LinkedIn">
              <Icon name="user" className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <a href={getSiteLinks().github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" title="GitHub">
              <Icon name="code" className="w-5 h-5 xl:w-6 xl:h-6" />
            </a>
            <Link to="/admin" className="text-muted hover:text-primary transition-colors" title="Admin">
              <Icon name="login" className="w-5 h-5 xl:w-6 xl:h-6" />
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-text z-50 relative p-1.5 border-2 border-ink bg-paper"
            aria-label="Toggle menu"
          >
            {isOpen ? <Icon name="close" className="w-7 h-7 sm:w-8 sm:h-8" /> : <Icon name="menu" className="w-7 h-7 sm:w-8 sm:h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only visible when isOpen is true */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-screen bg-surface z-40 lg:hidden"
          style={{ paddingTop: '80px' }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-6">
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
            <div className="flex justify-center space-x-8 sm:space-x-10 pt-6 border-t border-white/10 w-full max-w-sm">
              <a 
                href={`mailto:${getSiteLinks().email}`} 
                className="text-muted hover:text-primary transition-colors"
                title="Email"
              >
                <Icon name="mail" className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <a 
                href={getSiteLinks().linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-primary transition-colors"
                title="LinkedIn"
              >
                <Icon name="user" className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <a 
                href={getSiteLinks().github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-primary transition-colors"
                title="GitHub"
              >
                <Icon name="code" className="w-8 h-8 sm:w-10 sm:h-10" />
              </a>
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="text-muted hover:text-primary transition-colors"
                title="Admin"
              >
                <Icon name="login" className="w-8 h-8 sm:w-10 sm:h-10" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
