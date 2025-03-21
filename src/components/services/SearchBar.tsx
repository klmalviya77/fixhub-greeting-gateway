
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

interface SearchBarProps {
  onSelectService: (categoryId: string, serviceId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="mt-8 mb-6 relative">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
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
        <div className="absolute z-10 bg-white w-full mt-1 rounded-lg shadow-lg border border-gray-200" onClick={(e) => e.stopPropagation()}>
          {searchResults.map((service) => (
            <div 
              key={service.id}
              onClick={() => {
                onSelectService(service.category_id, service.id);
                setSearchQuery('');
                setShowSearchResults(false);
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
  );
};

export default SearchBar;
