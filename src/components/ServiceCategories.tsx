
import React, { useState } from 'react';
import { ChevronRight, Wrench, Home, Zap, Monitor, Droplet, Thermometer, Brush, Smartphone } from 'lucide-react';
import Container from './ui/container';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';

// Mock data for service categories
// In a real implementation, this would be fetched from the Supabase categories table
const categoryData = [
  {
    id: 1,
    name: "Plumbing",
    description: "Pipes, drains, fixtures installation & repair",
    icon: Droplet,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Electrical",
    description: "Wiring, lights, electrical system services",
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: 3,
    name: "Appliance Repair",
    description: "Fix refrigerators, washers, dryers & more",
    icon: Home,
    color: "bg-green-50 text-green-600",
  },
  {
    id: 4,
    name: "HVAC",
    description: "Heating, ventilation & AC installation & repair",
    icon: Thermometer,
    color: "bg-red-50 text-red-600",
  },
  {
    id: 5,
    name: "Home Renovation",
    description: "Home remodeling and renovation services",
    icon: Wrench,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 6,
    name: "Electronics",
    description: "TV mounting, smart home setup & more",
    icon: Monitor,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 7,
    name: "Painting",
    description: "Interior & exterior painting services",
    icon: Brush,
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: 8,
    name: "Mobile Repair",
    description: "Smartphone & tablet screen repair & more",
    icon: Smartphone,
    color: "bg-gray-50 text-gray-600",
  },
];

const ServiceCategories = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((category, index) => (
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
                  <category.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-fixhub-dark-gray text-sm mb-4 flex-grow">{category.description}</p>
                
                <div className="flex items-center text-fixhub-blue text-sm font-medium mt-auto">
                  <span>View services</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform-gpu group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
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
