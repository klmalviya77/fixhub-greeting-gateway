
import React from 'react';
import { Link } from 'react-router-dom';

const TechnicianSignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Technician Registration</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-6">
          Join our platform as a service technician.
        </p>
        <Link to="/technician/login" className="block text-center text-blue-600 hover:underline mt-4">
          Already registered? Log in
        </Link>
      </div>
    </div>
  );
};

export default TechnicianSignupPage;
