import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BookServicePage from './pages/BookServicePage';
import UserDashboardLayout from './components/user/UserDashboardLayout';
import UserDashboardPage from './pages/UserDashboardPage';
import UserBookingsPage from './pages/UserBookingsPage';
import UserProfilePage from './pages/UserProfilePage';
import TechnicianSignupPage from './pages/TechnicianSignupPage';
import TechnicianLoginPage from './pages/TechnicianLoginPage';
import TechnicianDashboardLayout from './components/technician/TechnicianDashboardLayout';
import TechnicianDashboardPage from './pages/TechnicianDashboardPage';
import TechnicianBookingsPage from './pages/TechnicianBookingsPage';
import TechnicianProfilePage from './pages/TechnicianProfilePage';
import { TooltipProvider } from "@/components/ui/tooltip"
import PartnerSignupPage from './pages/PartnerSignupPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';

// Import new partner dashboard components
import { PartnerDashboardLayout } from './components/partner/PartnerDashboardLayout';
import PartnerServicesPage from './pages/PartnerServicesPage';
import PartnerEarningsPage from './pages/PartnerEarningsPage';
import PartnerProfilePage from './pages/PartnerProfilePage';
const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-[100dvh]">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/book-service/:serviceId" element={<BookServicePage />} />
              
              {/* User Routes */}
              <Route path="/user-dashboard" element={<UserDashboardLayout />}>
                <Route index element={<UserDashboardPage />} />
                <Route path="bookings" element={<UserBookingsPage />} />
                <Route path="profile" element={<UserProfilePage />} />
              </Route>
              
              <Route path="/technician/signup" element={<TechnicianSignupPage />} />
              <Route path="/technician/login" element={<TechnicianLoginPage />} />
              
              {/* Technician Routes */}
              <Route path="/technician-dashboard" element={<TechnicianDashboardLayout />}>
                <Route index element={<TechnicianDashboardPage />} />
                <Route path="bookings" element={<TechnicianBookingsPage />} />
                <Route path="profile" element={<TechnicianProfilePage />} />
              </Route>

              {/* Partner Routes */}
              <Route path="/partner/signup" element={<PartnerSignupPage />} />
              <Route path="/partner/login" element={<PartnerLoginPage />} />
              
              {/* Partner Routes */}
              <Route path="/partner-dashboard" element={<PartnerDashboardLayout />}>
                <Route index element={<PartnerDashboardPage />} />
                <Route path="services" element={<PartnerServicesPage />} />
                <Route path="earnings" element={<PartnerEarningsPage />} />
                <Route path="profile" element={<PartnerProfilePage />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
