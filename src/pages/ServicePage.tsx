
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Clock, IndianRupee, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/container';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Type definitions
interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

const ServicePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message);
      }
      
      console.log('Categories fetched:', data);
      return data || [];
    }
  });
  
  // Get active category (either from query param or first category)
  const activeCategory = categoryId || (categories.length > 0 ? categories[0]?.id : null);
  
  // Set active category when categories load if not already set
  useEffect(() => {
    if (!categoryId && categories.length > 0 && !categoriesLoading) {
      console.log('Setting initial category to:', categories[0].id);
      setSearchParams({ category: categories[0].id });
    }
  }, [categories, categoriesLoading, categoryId, setSearchParams]);
  
  // Fetch services for selected category
  const { 
    data: services = [], 
    isLoading: servicesLoading,
    error: servicesError
  } = useQuery({
    queryKey: ['services', activeCategory],
    queryFn: async () => {
      if (!activeCategory) {
        console.log('No active category yet, skipping service fetch');
        return [];
      }
      
      console.log('Fetching services for category:', activeCategory);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', activeCategory);
      
      if (error) {
        console.error('Error fetching services:', error);
        throw new Error(error.message);
      }
      
      console.log('Services fetched:', data);
      return data || [];
    },
    enabled: !!activeCategory
  });
  
  // Handle category tab click
  const handleCategoryClick = (categoryId: string) => {
    setSearchParams({ category: categoryId });
    setSearchQuery('');
    setShowSearchResults(false);
  };
  
  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length >= 2) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(5);
          
        if (error) throw error;
        
        setSearchResults(data || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search services');
      }
    } else {
      setShowSearchResults(false);
    }
  };
  
  // Handle booking
  const handleBookService = (serviceId: string) => {
    // Navigate to the booking page with the service ID
    navigate(`/booking?service=${serviceId}`);
  };
  
  // Display error states
  if (categoriesError) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Categories</h2>
          <p className="text-fixhub-dark-gray">We encountered an issue while loading service categories.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto">
            {JSON.stringify(categoriesError, null, 2)}
          </pre>
        </div>
      </Container>
    );
  }
  
  if (servicesError && activeCategory) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Services</h2>
          <p className="text-fixhub-dark-gray">We encountered an issue while loading services for this category.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto">
            {JSON.stringify(servicesError, null, 2)}
          </pre>
        </div>
      </Container>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-6">
            <Link to="/" className="inline-flex items-center text-fixhub-blue font-medium mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Professional Services</h1>
            <p className="text-fixhub-dark-gray">Find the right service for your needs</p>
          </div>
        </Container>
      </div>
      
      <Container>
        {/* Search Bar */}
        <div className="mt-8 mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fixhub-blue focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 bg-white w-full mt-1 rounded-lg shadow-lg border border-gray-200">
              {searchResults.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => {
                    // Find the category of this service
                    setSearchParams({ category: service.category_id });
                    setSearchQuery('');
                    setShowSearchResults(false);
                    
                    // Scroll to the service card after a short delay
                    setTimeout(() => {
                      const element = document.getElementById(`service-${service.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        element.classList.add('highlight-service');
                        setTimeout(() => element.classList.remove('highlight-service'), 3000);
                      }
                    }, 300);
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-fixhub-dark-gray truncate">{service.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && (
            <div className="absolute z-10 bg-white w-full mt-1 rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 text-center text-fixhub-dark-gray">
                No services found matching your search
              </div>
            </div>
          )}
        </div>
        
        {/* Category Tabs */}
        {categoriesLoading ? (
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Services */}
        {servicesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-7 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-4/6"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
            <p className="text-gray-500 mb-4">
              There are currently no services available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                id={`service-${service.id}`}
                key={service.id}
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-700">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    <span className="font-medium">{service.rate}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Add CSS for highlighting searched service */}
      <style>{`
        .highlight-service {
          animation: pulse-highlight 2s;
        }
        
        @keyframes pulse-highlight {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  );
};

export default ServicePage;
