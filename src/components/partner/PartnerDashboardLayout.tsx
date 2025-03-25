
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { PartnerSidebar } from './PartnerSidebar';
import { usePartnerAuth } from '@/context/PartnerAuthContext';

export function PartnerDashboardLayout() {
  const { isAuthenticated, loading } = usePartnerAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/partner/login" />;
  }
  
  return (
    <div className="min-h-screen flex">
      <PartnerSidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
