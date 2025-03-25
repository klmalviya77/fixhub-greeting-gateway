
import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-6">
          Create your account to get started with FixHub services.
        </p>
        <Link to="/login" className="block text-center text-blue-600 hover:underline mt-4">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
