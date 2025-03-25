
import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">About FixHub</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <p className="text-lg mb-4">
          FixHub connects homeowners with professional service providers for all their home maintenance and repair needs.
        </p>
        <p className="text-lg mb-4">
          Our mission is to make home services accessible, reliable, and hassle-free.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
