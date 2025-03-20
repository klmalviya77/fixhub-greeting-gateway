
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Container from './ui/container';
import AnimatedText from './AnimatedText';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-fixhub-light-blue/20 to-transparent -z-10" />
      
      {/* Background dots */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(#e0edff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
      
      {/* Floating Blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-fixhub-blue/5 blur-3xl animate-float -z-10" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-fixhub-blue/10 blur-3xl animate-float animation-delay-1000 -z-10" />
      
      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <div className="bg-fixhub-light-blue text-fixhub-blue px-4 py-1.5 rounded-full text-sm font-medium animate-fade-up-delay-1">
              Professional Home Services at Your Fingertips
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight animate-fade-up-delay-2">
            <AnimatedText 
              text="Expert Solutions for Every" 
              element="span" 
              className="block"
            />
            <AnimatedText 
              text="Home Problem" 
              element="span" 
              className="block text-fixhub-blue"
              delay={100}
            />
          </h1>
          
          <p className="text-lg md:text-xl text-fixhub-off-black/80 mb-10 md:mb-12 animate-fade-up-delay-3">
            The most reliable platform connecting you with skilled professionals. Get your home repairs done right, every time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-up-delay-3">
            <Link
              to="/service-page"
              className="fixhub-button fixhub-button-primary px-8 py-3.5 text-base rounded-md spring-effect w-full sm:w-auto"
            >
              Book a Service
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              to="/technician/signup"
              className="fixhub-button fixhub-button-secondary px-8 py-3.5 text-base rounded-md spring-effect w-full sm:w-auto"
            >
              Join as a Professional
            </Link>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 md:mt-24 pb-8 border-b border-fixhub-gray/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TrustIndicator number="10k+" label="Satisfied Customers" />
            <TrustIndicator number="500+" label="Expert Technicians" />
            <TrustIndicator number="50+" label="Service Categories" />
            <TrustIndicator number="4.8" label="Average Rating" />
          </div>
        </div>
      </Container>
    </section>
  );
};

interface TrustIndicatorProps {
  number: string;
  label: string;
}

const TrustIndicator = ({ number, label }: TrustIndicatorProps) => {
  return (
    <div className="text-center animate-scale-in">
      <p className="text-2xl md:text-3xl font-bold text-fixhub-blue mb-1">{number}</p>
      <p className="text-sm md:text-base text-fixhub-dark-gray">{label}</p>
    </div>
  );
};

export default Hero;
