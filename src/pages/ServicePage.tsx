
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import Container from '@/components/ui/container';

// Import the components
import ServicePageHeader from '@/components/services/ServicePageHeader';
import SearchBar from '@/components/services/SearchBar';
import CategoryTabs from '@/components/services/CategoryTabs';
import ServiceList from '@/components/services/ServiceList';
import HighlightStyle from '@/components/services/HighlightStyle';

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
  };
  
  // Handle service selection from search
  const handleSelectService = (categoryId: string, serviceId: string) => {
    // Update the category in URL params
    setSearchParams({ category: categoryId });
    
    // Scroll to the service card after a short delay
    setTimeout(() => {
      const element = document.getElementById(`service-${serviceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight-service');
        setTimeout(() => element.classList.remove('highlight-service'), 3000);
      }
    }, 300);
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
      <ServicePageHeader />
      
      <Container>
        {/* Search Bar */}
        <SearchBar onSelectService={handleSelectService} />
        
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          isLoading={categoriesLoading}
          onCategoryChange={handleCategoryClick}
        />
        
        {/* Services */}
        <ServiceList
          services={services}
          isLoading={servicesLoading}
          onBookService={handleBookService}
        />
      </Container>

      {/* Add CSS for highlighting searched service */}
      <HighlightStyle />
    </div>
  );
};

export default ServicePage;
