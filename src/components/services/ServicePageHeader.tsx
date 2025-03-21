
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/container';

const ServicePageHeader = () => {
  return (
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
  );
};

export default ServicePageHeader;
