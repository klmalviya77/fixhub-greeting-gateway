
import React, { useState, useEffect } from 'react';
import { ChevronRight, Wrench, Home, Zap, Monitor, Droplet, Thermometer, Brush, Smartphone } from 'lucide-react';
import Container from './ui/container';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import { supabase } from "@/integrations/supabase/client";

// Type definitions
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const ServiceCategories = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Map icon strings to Lucide icon components
  const iconMap: Record<string, React.ElementType> = {
    'Wrench': Wrench,
    'Home': Home,
    'Zap': Zap,
    'Monitor': Monitor,
    'Droplet': Droplet,
    'Thermometer': Thermometer,
    'Brush': Brush,
    'Smartphone': Smartphone
  };
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <section className="fixhub-section bg-white" id="services">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-fixhub-light-blue text-fixhub-blue text-xs font-medium rounded-full">
              Our Services
            </span>
          </div>
          <AnimatedText 
            text="Expert Solutions for Every Need" 
            element="h2" 
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <p className="text-fixhub-dark-gray max-w-2xl mx-auto">
            Browse through our comprehensive range of professional home services 
            designed to address all your household needs with precision and care.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-gray-200 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Wrench;
              
              return (
                <Link 
                  key={category.id} 
                  to={`/service-page?category=${category.id}`}
                  className={`bg-white rounded-xl p-6 transition-all duration-300 
                    ${hoveredCard === category.id ? 'shadow-elevated -translate-y-1' : 'shadow-card hover:shadow-elevated'}
                    transform-gpu`}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-fixhub-dark-gray text-sm mb-4 flex-grow">{category.description}</p>
                    
                    <div className="flex items-center text-fixhub-blue text-sm font-medium mt-auto">
                      <span>View services</span>
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform-gpu group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            to="/service-page" 
            className="fixhub-button fixhub-button-secondary px-8 py-3 inline-flex items-center spring-effect"
          >
            View All Services
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ServiceCategories;
