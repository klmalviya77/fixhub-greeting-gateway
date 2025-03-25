
import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { TechnicianDashboardLayout } from '@/components/technician/TechnicianDashboardLayout';
import { TechnicianHome } from '@/components/technician/TechnicianHome';
import { TechnicianJobs } from '@/components/technician/TechnicianJobs';
import { TechnicianEarnings } from '@/components/technician/TechnicianEarnings';
import { TechnicianProfile } from '@/components/technician/TechnicianProfile';

const TechnicianDashboardPage = () => {
  const { technician, isAuthenticated } = useTechnicianAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/technician/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !technician) {
    return null; // Will redirect via useEffect
  }

  return (
    <Routes>
      <Route element={<TechnicianDashboardLayout />}>
        <Route index element={<TechnicianHome />} />
        <Route path="jobs" element={<TechnicianJobs />} />
        <Route path="earnings" element={<TechnicianEarnings />} />
        <Route path="profile" element={<TechnicianProfile />} />
      </Route>
    </Routes>
  );
};

export default TechnicianDashboardPage;
