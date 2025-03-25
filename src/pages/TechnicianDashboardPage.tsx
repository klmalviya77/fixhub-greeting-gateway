
import React from 'react';

const TechnicianDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Technician Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Jobs</h2>
          <p className="text-gray-500">You have no upcoming jobs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Earnings</h2>
          <p className="text-gray-500">No earnings history</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboardPage;
