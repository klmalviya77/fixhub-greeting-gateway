
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  isLoading: boolean;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory, 
  isLoading, 
  onCategoryChange 
}) => {
  if (isLoading) {
    return (
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
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
  );
};

export default CategoryTabs;
