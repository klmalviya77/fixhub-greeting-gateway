
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicePage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import UserLoginPage from "./pages/UserLoginPage";
import UserSignupPage from "./pages/UserSignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import TechnicianLoginPage from "./pages/TechnicianLoginPage";
import TechnicianSignupPage from "./pages/TechnicianSignupPage";
import TechnicianVerificationPendingPage from "./pages/TechnicianVerificationPendingPage";
import TechnicianDashboardPage from "./pages/TechnicianDashboardPage";
import { AuthProvider } from "./context/AuthContext";
import { TechnicianAuthProvider } from "./context/TechnicianAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TechnicianAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/service-page" element={<ServicePage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/user/login" element={<UserLoginPage />} />
              <Route path="/user/signup" element={<UserSignupPage />} />
              <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/user-dashboard" element={<UserDashboardPage />} />
              
              {/* Technician Routes */}
              <Route path="/technician/login" element={<TechnicianLoginPage />} />
              <Route path="/technician/signup" element={<TechnicianSignupPage />} />
              <Route path="/technician/verification-pending" element={<TechnicianVerificationPendingPage />} />
              <Route path="/technician-dashboard" element={<TechnicianDashboardPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TechnicianAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
