
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const UserDashboardLayout = () => {
  // For now, we're skipping authentication check
  const isAuthenticated = true;
  const loading = false;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold mb-6">User Dashboard</h2>
        <nav className="space-y-2">
          <a href="/user-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</a>
          <a href="/user-dashboard/bookings" className="block py-2 px-4 rounded hover:bg-gray-700">My Bookings</a>
          <a href="/user-dashboard/profile" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
