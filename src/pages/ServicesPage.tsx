
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    { id: '1', name: 'Plumbing', description: 'Pipe repairs, drainage, fixture installation' },
    { id: '2', name: 'Electrical', description: 'Wiring, fixtures, troubleshooting' },
    { id: '3', name: 'Carpentry', description: 'Furniture assembly, repairs, custom builds' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <Link 
              to={`/book-service/${service.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Book Service
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
