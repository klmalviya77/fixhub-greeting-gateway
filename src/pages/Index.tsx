
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServiceCategories from '@/components/ServiceCategories';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import Container from '@/components/ui/container';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="fixhub-section bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Shield className="w-6 h-6" />} 
                title="Vetted Professionals" 
                description="Every technician is background-checked and skill-verified before joining our platform."
              />
              <FeatureCard 
                icon={<Clock className="w-6 h-6" />} 
                title="On-Time Service" 
                description="Our professionals respect your time with punctual arrivals and efficient service."
              />
              <FeatureCard 
                icon={<Award className="w-6 h-6" />} 
                title="Satisfaction Guaranteed" 
                description="If you're not completely satisfied, we'll work to make it right."
              />
            </div>
          </Container>
        </section>
        
        <ServiceCategories />
        
        <section className="fixhub-section bg-white">
          <Container>
            <div className="bg-fixhub-blue rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Join Our Network of Professional Technicians
                  </h2>
                  <p className="text-white/90 mb-8">
                    Are you a skilled professional looking to grow your business? 
                    Join FixHub to connect with customers in your area, manage your 
                    schedule, and increase your earnings.
                  </p>
                  <div>
                    <Link
                      to="/technician/signup"
                      className="inline-flex items-center bg-white text-fixhub-blue px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all spring-effect"
                    >
                      Become a FixHub Pro
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
                
                <div className="hidden md:block relative h-full min-h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-fixhub-blue/80 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                    alt="Professional technician" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        <Testimonials />
        
        <section className="fixhub-section bg-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-fixhub-dark-gray mb-8">
                Book your first service today and experience the FixHub difference. 
                Professional, reliable home services are just a few clicks away.
              </p>
              <Link
                to="/service-page"
                className="fixhub-button fixhub-button-primary px-8 py-3.5 text-base rounded-md spring-effect"
              >
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </Container>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-fixhub-gray p-6 rounded-xl transition-transform duration-300 hover:transform hover:scale-[1.02]">
      <div className="w-12 h-12 rounded-lg bg-fixhub-blue/10 text-fixhub-blue flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-fixhub-dark-gray">{description}</p>
    </div>
  );
};

export default Index;
