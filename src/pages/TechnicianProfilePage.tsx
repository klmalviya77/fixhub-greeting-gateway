
import React from 'react';

const TechnicianProfilePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Technician Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-500 text-sm">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm">Phone</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Skills & Experience</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-500 text-sm">Services Offered</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Carpentry</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">Years of Experience</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          </div>
        </div>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TechnicianProfilePage;
