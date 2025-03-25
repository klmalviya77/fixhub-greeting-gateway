
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to FixHub</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Your one-stop solution for home services and maintenance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/services" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Browse Services
        </Link>
        <Link to="/login" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
