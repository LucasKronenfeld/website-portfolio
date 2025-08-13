import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/about', text: 'About' },
    { to: '/projects', text: 'Projects' },
    { to: '/portfolio', text: 'Portfolio' },
    { to: '/blog', text: 'Blog' },
    { to: '/resume', text: 'Resume' },
  ];

  const linkClass = ({ isActive }) =>
    `block py-2 px-3 rounded-md text-base font-medium transition-colors duration-300 ${
      isActive
        ? 'text-white bg-black/20'
        : 'text-gray-800 hover:bg-black/10'
    }`;
  
  const mobileLinkClass = ({ isActive }) =>
    `block py-2 px-3 rounded-md text-base font-medium transition-colors duration-300 ${
      isActive
        ? 'text-white bg-black/20'
        : 'text-gray-200 hover:bg-white/20'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-bold text-gray-900">
              Lucas Gray
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon */}
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-black/80 backdrop-blur-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} className={mobileLinkClass} onClick={() => setIsOpen(false)}>
                  {link.text}
                </NavLink>
              ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
