
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Shield, Clock, ThumbsUp, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-fixhub-black to-black text-white pt-20 pb-10">
      <div className="fixhub-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top - Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          {[
            { 
              icon: <Shield className="h-8 w-8 text-fixhub-blue" />, 
              title: "Trusted Professionals", 
              description: "Background-checked and skilled experts" 
            },
            { 
              icon: <Clock className="h-8 w-8 text-fixhub-blue" />, 
              title: "On-Time Service", 
              description: "Punctual arrivals and efficient work" 
            },
            { 
              icon: <ThumbsUp className="h-8 w-8 text-fixhub-blue" />, 
              title: "Satisfaction Guaranteed", 
              description: "We're not happy until you are" 
            },
            { 
              icon: <Heart className="h-8 w-8 text-fixhub-blue" />, 
              title: "Customer Focused", 
              description: "Your needs are our priority" 
            },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Footer Middle - Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12 border-b border-gray-800">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-fixhub-blue text-white rounded-lg flex items-center justify-center font-bold text-xl">F</div>
              <span className="text-2xl font-bold">
                Fix<span className="text-fixhub-blue">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted platform for professional home services and maintenance. 
              High-quality work guaranteed by verified experts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-fixhub-blue transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-fixhub-blue transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-fixhub-blue transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-fixhub-blue transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-fixhub-blue"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Technicians', path: '/technicians' },
                { label: 'Contact', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-fixhub-blue"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Plumbing', path: '/services' },
                { label: 'Electrical', path: '/services' },
                { label: 'HVAC', path: '/services' },
                { label: 'Cleaning', path: '/services' },
                { label: 'Handyman', path: '/services' },
              ].map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path} 
                    className="text-gray-400 hover:text-white transition-colors inline-block"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-fixhub-blue"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-fixhub-blue mr-3 mt-0.5" />
                <span className="text-gray-400">
                  123 Main Street, Suite 500<br />San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-fixhub-blue mr-3" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-fixhub-blue mr-3" />
                <a href="mailto:support@fixhub.com" className="text-gray-400 hover:text-white transition-colors">
                  support@fixhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom - Copyright */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FixHub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/faq" className="text-gray-500 hover:text-white text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
