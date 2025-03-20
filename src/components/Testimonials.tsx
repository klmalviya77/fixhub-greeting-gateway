
import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './ui/container';
import AnimatedText from './AnimatedText';
import { supabase } from "@/integrations/supabase/client";

// Type definitions
interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  review: string;
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const goToPrevious = () => {
    if (testimonials.length === 0) return;
    
    setAnimationDirection('slide-right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    }, 300);
  };
  
  const goToNext = () => {
    if (testimonials.length === 0) return;
    
    setAnimationDirection('slide-left');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 300);
  };
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('rating', { ascending: false });
          
        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }
        
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  useEffect(() => {
    // Only start auto-sliding if we have testimonials
    if (testimonials.length > 0) {
      const interval = setInterval(goToNext, 8000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);
  
  useEffect(() => {
    if (animationDirection) {
      const timer = setTimeout(() => {
        setAnimationDirection('');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [animationDirection]);
  
  // Return loading state or empty state if no testimonials
  if (loading) {
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
            <div className="bg-white rounded-2xl p-12 shadow-card relative z-10 animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }
  
  if (testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }
  
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
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-fixhub-light-blue"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/256?text=User';
                  }}
                />
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl font-medium mb-6">
                  "{testimonials[currentIndex].review}"
                </blockquote>
                
                <div>
                  <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                  <p className="text-fixhub-dark-gray text-sm">{testimonials[currentIndex].location}</p>
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
              {testimonials.map((_, index) => (
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
