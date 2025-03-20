
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Container from './ui/container';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-subtle py-3' : 'bg-transparent py-5'
      )}
    >
      <Container className="flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-heading font-semibold text-fixhub-black transition-transform duration-300 hover:scale-[1.02]"
        >
          FixHub
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <NavLink href="/service-page">Services</NavLink>
            <NavLink href="/technician/signup">Join as a Professional</NavLink>
            <NavLink href="/about-us">About Us</NavLink>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/user/login"
              className="fixhub-button fixhub-button-ghost px-3 py-2"
            >
              Log in
            </Link>
            <Link
              to="/service-page"
              className="fixhub-button fixhub-button-primary px-4 py-2 spring-effect"
            >
              Book a Service
            </Link>
          </div>
        </div>
        
        <button 
          className="block md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-6 text-lg">
          <MobileNavLink href="/service-page" onClick={() => setIsMobileMenuOpen(false)}>
            Services
          </MobileNavLink>
          <MobileNavLink href="/technician/signup" onClick={() => setIsMobileMenuOpen(false)}>
            Join as a Professional
          </MobileNavLink>
          <MobileNavLink href="/about-us" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </MobileNavLink>
          <MobileNavLink href="/user/login" onClick={() => setIsMobileMenuOpen(false)}>
            Log in
          </MobileNavLink>
          
          <Link
            to="/service-page"
            className="fixhub-button fixhub-button-primary px-4 py-3 w-full flex justify-center mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book a Service
          </Link>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link 
      to={href} 
      className="text-fixhub-off-black font-medium relative overflow-hidden hover:text-fixhub-blue transition-colors duration-300 group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fixhub-blue transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick }: NavLinkProps) => {
  return (
    <Link 
      to={href} 
      className="text-fixhub-off-black font-medium block py-2 border-b border-fixhub-gray"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header;
