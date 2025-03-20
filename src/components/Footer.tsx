
import React from 'react';
import { Link } from 'react-router-dom';
import Container from './ui/container';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 border-t border-fixhub-gray/50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          <div>
            <Link to="/" className="text-2xl font-heading font-semibold text-fixhub-black mb-6 block">
              FixHub
            </Link>
            <p className="text-fixhub-dark-gray mb-6 max-w-xs">
              Connecting homeowners with skilled professionals for all home service needs.
              Trust, quality, and reliability in every service.
            </p>
            <div className="flex space-x-4">
              <SocialButton icon={<Facebook size={18} />} href="#facebook" />
              <SocialButton icon={<Twitter size={18} />} href="#twitter" />
              <SocialButton icon={<Instagram size={18} />} href="#instagram" />
              <SocialButton icon={<Linkedin size={18} />} href="#linkedin" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <FooterLink href="/service-page">Services</FooterLink>
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/technician/signup">Join as a Professional</FooterLink>
              <FooterLink href="/partner/login">Partner Portal</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-fixhub-blue shrink-0 mt-0.5 mr-3" />
                <span className="text-fixhub-dark-gray">
                  1234 Market Street, Suite 1000<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-fixhub-blue shrink-0 mr-3" />
                <span className="text-fixhub-dark-gray">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-fixhub-blue shrink-0 mr-3" />
                <span className="text-fixhub-dark-gray">support@fixhub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      
      <div className="border-t border-fixhub-gray/50 py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-fixhub-dark-gray text-sm">
              © {new Date().getFullYear()} FixHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-fixhub-dark-gray text-sm hover:text-fixhub-blue transition-colors">
                <Link to="/privacy-policy">Privacy Policy</Link>
              </span>
              <span className="text-fixhub-dark-gray text-sm hover:text-fixhub-blue transition-colors">
                <Link to="/terms">Terms of Service</Link>
              </span>
              <span className="text-fixhub-dark-gray text-sm hover:text-fixhub-blue transition-colors">
                <Link to="/sitemap">Sitemap</Link>
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
  return (
    <li>
      <Link 
        to={href} 
        className="text-fixhub-dark-gray hover:text-fixhub-blue transition-colors"
      >
        {children}
      </Link>
    </li>
  );
};

interface SocialButtonProps {
  icon: React.ReactNode;
  href: string;
}

const SocialButton = ({ icon, href }: SocialButtonProps) => {
  return (
    <a 
      href={href} 
      className="w-9 h-9 rounded-full bg-fixhub-gray flex items-center justify-center text-fixhub-dark-gray hover:bg-fixhub-blue hover:text-white transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
};

export default Footer;
