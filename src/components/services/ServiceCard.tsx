
import React from 'react';
import { Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

interface ServiceCardProps {
  service: Service;
  onBookService: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService }) => {
  return (
    <div
      id={`service-${service.id}`}
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
      
      <Button
        onClick={() => onBookService(service.id)}
        className="w-full bg-blue-500 text-white font-medium"
      >
        Book Now
      </Button>
    </div>
  );
};

export default ServiceCard;
