
import React from 'react';

const UserBookingsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-500">You don't have any bookings yet</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Book a Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBookingsPage;
