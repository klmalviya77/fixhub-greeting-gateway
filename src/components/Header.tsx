
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, Phone, BookOpen, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Services', path: '/services', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="fixhub-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-fixhub-blue text-white rounded-lg flex items-center justify-center font-bold text-xl transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">F</div>
              <span className="text-2xl font-bold text-fixhub-black group-hover:text-fixhub-blue transition-colors">
                Fix<span className="text-fixhub-blue">Hub</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-fixhub-blue bg-fixhub-light-blue'
                    : 'text-gray-700 hover:text-fixhub-blue hover:bg-fixhub-light-blue/50'
                }`}
              >
                {isActive(link.path) && link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:bg-fixhub-light-blue hover:text-fixhub-blue">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-fixhub-blue hover:bg-fixhub-dark-blue text-white shadow-button">
                Sign up
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2 border-fixhub-light-blue text-fixhub-blue hover:bg-fixhub-light-blue/50">
                  For Professionals
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-fixhub-light-blue/50 p-1">
                <DropdownMenuItem className="focus:bg-fixhub-light-blue focus:text-fixhub-blue cursor-pointer">
                  <Link to="/technician/login" className="w-full">Technician Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-fixhub-light-blue focus:text-fixhub-blue cursor-pointer">
                  <Link to="/technician/signup" className="w-full">Become a Technician</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-fixhub-blue hover:bg-fixhub-light-blue/50 transition-colors"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-fixhub-blue bg-fixhub-light-blue'
                    : 'text-gray-700 hover:bg-fixhub-light-blue/50 hover:text-fixhub-blue'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-100">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full bg-fixhub-light-blue p-2 text-fixhub-blue" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">Account</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-3">
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fixhub-light-blue/50 hover:text-fixhub-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fixhub-light-blue/50 hover:text-fixhub-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Link
                  to="/technician/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fixhub-light-blue/50 hover:text-fixhub-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Technician Login
                </Link>
                <Link
                  to="/technician/signup"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fixhub-light-blue/50 hover:text-fixhub-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Technician
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
