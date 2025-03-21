
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';

const UserDashboardPage = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/user/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p>You are logged in as: {user.email}</p>
            <div className="mt-4">
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            <p className="text-gray-500">No bookings found.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserDashboardPage;
