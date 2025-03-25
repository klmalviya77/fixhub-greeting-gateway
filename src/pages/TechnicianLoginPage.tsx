
import React from 'react';
import { Link } from 'react-router-dom';

const TechnicianLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Technician Login</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-6">
          Sign in to your technician account.
        </p>
        <Link to="/technician/signup" className="block text-center text-blue-600 hover:underline mt-4">
          Need an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default TechnicianLoginPage;
