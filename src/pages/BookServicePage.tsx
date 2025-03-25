
import React from 'react';
import { useParams } from 'react-router-dom';

const BookServicePage = () => {
  const { serviceId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Book Service</h1>
        <p className="mb-4">Service ID: {serviceId}</p>
        <p className="mb-6">Complete the form below to schedule your service</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Time</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Morning (8AM-12PM)</option>
              <option>Afternoon (12PM-4PM)</option>
              <option>Evening (4PM-8PM)</option>
            </select>
          </div>
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Schedule Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
