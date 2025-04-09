
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Clock, Star, ArrowRight, CheckCircle, Home } from 'lucide-react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Services Preview Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <span className="bg-fixhub-light-blue text-fixhub-blue text-sm font-medium px-4 py-1.5 rounded-full">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-6">Premium Home Services</h2>
            <p className="text-fixhub-dark-gray max-w-2xl mx-auto">
              From electrical work to plumbing, cleaning to HVAC maintenance, our vetted professionals 
              deliver quality service every time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="h-8 w-8 text-white" />,
                title: "Home Cleaning",
                description: "Professional cleaning services to keep your home spotless and healthy.",
                color: "bg-gradient-to-r from-violet-500 to-purple-500"
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                title: "Electrical Services",
                description: "Expert electrical repairs, installations, and maintenance you can trust.",
                color: "bg-gradient-to-r from-blue-500 to-cyan-500"
              },
              {
                icon: <Clock className="h-8 w-8 text-white" />,
                title: "Plumbing Solutions",
                description: "Quick and reliable plumbing services to fix any issue in your home.",
                color: "bg-gradient-to-r from-amber-500 to-orange-500"
              },
            ].map((service, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`${service.color} p-6 h-full`}>
                  <div className="bg-white/20 p-3 rounded-lg inline-flex mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-white/90 mb-6">{service.description}</p>
                  <Link to="/services" className="inline-flex items-center text-white font-medium">
                    Learn more <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services"
              className="inline-flex items-center bg-fixhub-blue hover:bg-fixhub-dark-blue text-white px-6 py-3 rounded-md transition-colors shadow-lg hover:shadow-xl"
            >
              View All Services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-fixhub-gray to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Professional technician" 
                className="rounded-xl shadow-xl"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="bg-fixhub-light-blue text-fixhub-blue text-sm font-medium px-4 py-1.5 rounded-full">
                  Why Choose FixHub
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-6">
                  We Deliver Excellence in Every Service
                </h2>
                <p className="text-fixhub-dark-gray mb-8">
                  At FixHub, we're committed to providing top-quality home services with professionalism, 
                  reliability, and attention to detail. Here's why customers trust us:
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: "Screened and verified professionals with years of experience" },
                  { text: "100% satisfaction guarantee on all services" },
                  { text: "Transparent pricing with no hidden fees" },
                  { text: "Prompt and reliable scheduling to fit your timetable" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-fixhub-blue mr-3 flex-shrink-0" />
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center bg-fixhub-blue hover:bg-fixhub-dark-blue text-white px-6 py-3 rounded-md transition-colors shadow-lg hover:shadow-xl"
                >
                  Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Testimonial Preview */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <span className="bg-fixhub-light-blue text-fixhub-blue text-sm font-medium px-4 py-1.5 rounded-full">
              Customer Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-6">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="text-5xl text-fixhub-blue opacity-40 mb-4">"</div>
            <p className="text-xl md:text-2xl text-fixhub-black italic mb-8">
              FixHub connected me with an amazing electrician who fixed my wiring issues in no time. 
              The booking process was seamless, and the technician was professional and knowledgeable. 
              I'll definitely be using FixHub for all my home service needs in the future!
            </p>
            
            <div className="flex items-center">
              <div className="mr-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/45.jpg" 
                  alt="Customer" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-fixhub-light-blue"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                <div className="flex text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/testimonials"
              className="inline-flex items-center text-fixhub-blue hover:text-fixhub-dark-blue font-medium transition-colors"
            >
              View All Testimonials <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-fixhub-blue to-fixhub-dark-blue text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
            <div className="max-w-xl">
              <h2 className="text-3xl font-heading font-bold mb-4">Ready to get started?</h2>
              <p className="text-white/90">
                Join thousands of satisfied customers who trust FixHub for their home maintenance needs.
                Book your first service today!
              </p>
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
