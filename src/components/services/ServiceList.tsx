
import React from 'react';
import ServiceCard from './ServiceCard';
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  onBookService: (serviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, isLoading, onBookService }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6">
            <Skeleton className="h-7 rounded mb-4 w-3/4" />
            <Skeleton className="h-4 rounded mb-2 w-full" />
            <Skeleton className="h-4 rounded mb-2 w-5/6" />
            <Skeleton className="h-4 rounded mb-6 w-4/6" />
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 rounded w-1/3" />
              <Skeleton className="h-6 rounded w-1/4" />
            </div>
            <Skeleton className="h-10 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 text-center">
        <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
        <p className="text-gray-500 mb-4">
          There are currently no services available in this category.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          service={service}
          onBookService={onBookService}
        />
      ))}
    </div>
  );
};

export default ServiceList;
