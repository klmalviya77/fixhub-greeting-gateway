
import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './ui/container';
import AnimatedText from './AnimatedText';

// Mock data for testimonials
// In a real implementation, this would be fetched from the Supabase reviews table
const testimonialData = [
  {
    id: 1,
    name: "Emily Johnson",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    text: "The plumber arrived on time and fixed our leak in less than an hour. The service was professional and the price was exactly as quoted. Will definitely use FixHub again!"
  },
  {
    id: 2,
    name: "Michael Davis",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    text: "I needed urgent help with my HVAC system during a heatwave. The technician from FixHub came within hours of my request and got my AC working again. Exceptional service!"
  },
  {
    id: 3,
    name: "Sophia Martinez",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
    text: "I hired an electrician through FixHub to install new lighting fixtures throughout my home. The work was done efficiently and the results look amazing. The booking process was seamless."
  },
  {
    id: 4,
    name: "David Wilson",
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    text: "I've used FixHub three times now for different services, and each experience has been fantastic. The app makes it easy to find reliable professionals, and the quality of work is consistently high."
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('');
  
  const goToPrevious = () => {
    setAnimationDirection('slide-right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonialData.length - 1 : prevIndex - 1
      );
    }, 300);
  };
  
  const goToNext = () => {
    setAnimationDirection('slide-left');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
      );
    }, 300);
  };
  
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (animationDirection) {
      const timer = setTimeout(() => {
        setAnimationDirection('');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [animationDirection]);
  
  return (
    <section className="fixhub-section bg-fixhub-gray">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-fixhub-light-blue text-fixhub-blue text-xs font-medium rounded-full">
              Testimonials
            </span>
          </div>
          <AnimatedText 
            text="What Our Customers Say" 
            element="h2" 
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <p className="text-fixhub-dark-gray max-w-2xl mx-auto">
            Discover why thousands of homeowners trust FixHub for their home service needs.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-0 left-12 -mt-6 text-fixhub-blue opacity-30">
            <Quote size={80} />
          </div>
          
          <div className={`bg-white rounded-2xl p-8 md:p-12 shadow-card relative z-10 transition-opacity duration-300 
            ${animationDirection === 'slide-left' ? 'animate-slide-left' : ''}
            ${animationDirection === 'slide-right' ? 'animate-slide-right' : ''}
          `}>
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
              <div className="shrink-0">
                <img 
                  src={testimonialData[currentIndex].image} 
                  alt={testimonialData[currentIndex].name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-fixhub-light-blue"
                />
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {[...Array(testimonialData[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - testimonialData[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl font-medium mb-6">
                  "{testimonialData[currentIndex].text}"
                </blockquote>
                
                <div>
                  <h4 className="font-semibold">{testimonialData[currentIndex].name}</h4>
                  <p className="text-fixhub-dark-gray text-sm">{testimonialData[currentIndex].location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            <button 
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full bg-white shadow-button flex items-center justify-center text-fixhub-off-black hover:bg-fixhub-blue hover:text-white transition-colors spring-effect"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-1.5 items-center">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                    ${index === currentIndex ? 'bg-fixhub-blue w-8' : 'bg-fixhub-dark-gray/30'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-white shadow-button flex items-center justify-center text-fixhub-off-black hover:bg-fixhub-blue hover:text-white transition-colors spring-effect"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
