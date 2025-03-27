
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Wrench, Shield, Clock, Star } from 'lucide-react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-fixhub-gray">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-fixhub-black leading-tight">
                Home Maintenance <span className="text-fixhub-blue">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-fixhub-off-black max-w-md">
                Your one-stop solution for reliable home services and maintenance, delivered by verified professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="shadow-button px-6 py-6 text-base">
                  <Link to="/services" className="flex items-center">
                    Browse Services <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="shadow-subtle px-6 py-6 text-base">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-elevated animate-fade-up-delay-1">
              <div className="aspect-video bg-fixhub-light-blue flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Home service professional" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-fixhub-black/80 to-transparent p-6">
                <span className="inline-flex items-center rounded-full bg-fixhub-blue/90 px-3 py-1 text-sm font-medium text-white">
                  <Star className="mr-1 h-4 w-4" /> 4.9/5 Customer Rating
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Why Choose FixHub</h2>
            <p className="text-fixhub-dark-gray max-w-2xl mx-auto">Experience premium home services with our vetted professionals and seamless booking system.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Wrench className="h-12 w-12 text-fixhub-blue" />,
                title: "Expert Professionals",
                description: "All our technicians are vetted and certified to provide top-quality service."
              },
              {
                icon: <Shield className="h-12 w-12 text-fixhub-blue" />,
                title: "Satisfaction Guaranteed",
                description: "Not satisfied? We'll make it right or your money back."
              },
              {
                icon: <Clock className="h-12 w-12 text-fixhub-blue" />,
                title: "Prompt Service",
                description: "Schedule services at your convenience with our punctual professionals."
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle hover:shadow-card transition-shadow duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <div className="bg-fixhub-light-blue p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-fixhub-dark-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-fixhub-blue text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-heading font-bold mb-4">Ready to get started?</h2>
              <p className="text-white/90">Join thousands of satisfied customers who trust FixHub for their home maintenance needs.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-fixhub-blue hover:bg-fixhub-gray hover:text-fixhub-blue border-none">
                <Link to="/signup">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
