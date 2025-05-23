
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
import { TechnicianDashboardLayout } from './components/technician/TechnicianDashboardLayout';
import TechnicianDashboardPage from './pages/TechnicianDashboardPage';
import TechnicianBookingsPage from './pages/TechnicianBookingsPage';
import TechnicianProfilePage from './pages/TechnicianProfilePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { TechnicianAuthProvider } from './context/TechnicianAuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TechnicianAuthProvider>
            <div className="min-h-[100dvh] flex flex-col">
              <Toaster position="top-center" richColors closeButton />
              <Header />
              <main className="flex-grow">
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
                </Routes>
              </main>
              <Footer />
            </div>
          </TechnicianAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
