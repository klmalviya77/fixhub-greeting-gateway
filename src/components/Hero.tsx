
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Container from './ui/container';
import AnimatedText from './AnimatedText';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-fixhub-light-blue/30 to-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(#e0edff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
      
      {/* Floating Blobs */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-fixhub-blue/5 blur-3xl animate-float -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-fixhub-blue/10 blur-3xl animate-float animation-delay-1000 -z-10" />
      
      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="mb-6 inline-block">
              <div className="bg-fixhub-light-blue text-fixhub-blue px-4 py-1.5 rounded-full text-sm font-medium animate-fade-up-delay-1">
                Professional Home Services at Your Fingertips
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-up-delay-2">
              <AnimatedText 
                text="Expert Solutions for" 
                element="span" 
                className="block"
              />
              <AnimatedText 
                text="Every Home Problem" 
                element="span" 
                className="block text-fixhub-blue"
                delay={100}
              />
            </h1>
            
            <p className="text-lg md:text-xl text-fixhub-off-black/80 animate-fade-up-delay-3 max-w-xl">
              The most reliable platform connecting you with skilled professionals. 
              Get your home repairs done right, every time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 animate-fade-up-delay-3 pt-4">
              <Link
                to="/services"
                className="fixhub-button fixhub-button-primary px-8 py-3.5 text-base rounded-md spring-effect flex items-center"
              >
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/technician/signup"
                className="fixhub-button fixhub-button-secondary px-8 py-3.5 text-base rounded-md spring-effect"
              >
                Join as a Professional
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-fixhub-gray/50 mt-12">
              <TrustIndicator number="10k+" label="Satisfied Customers" />
              <TrustIndicator number="500+" label="Expert Technicians" />
              <TrustIndicator number="50+" label="Service Categories" />
              <TrustIndicator number="4.8" label="Average Rating" />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-full h-full rounded-xl bg-fixhub-blue/10 -z-10 transform rotate-3"></div>
            <div className="w-full relative overflow-hidden rounded-xl shadow-elevated animate-fade-up-delay-3">
              <img 
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Professional home service" 
                className="w-full h-auto object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-fixhub-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-fixhub-blue/90 px-3 py-1 text-sm font-medium text-white">
                    Quality Guaranteed
                  </span>
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <img 
                        key={i}
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 20}.jpg`}
                        alt="Customer" 
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-fixhub-blue flex items-center justify-center text-white text-xs border-2 border-white">
                      +5k
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    <div className="animate-scale-in">
      <p className="text-2xl md:text-3xl font-bold text-fixhub-blue mb-1">{number}</p>
      <p className="text-sm md:text-base text-fixhub-dark-gray">{label}</p>
    </div>
  );
};

export default Hero;
