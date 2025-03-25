
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { TechnicianSidebar } from './TechnicianSidebar';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';

export function TechnicianDashboardLayout() {
  const { isAuthenticated, loading } = useTechnicianAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/technician/login" />;
  }
  
  return (
    <div className="min-h-screen flex">
      <TechnicianSidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
