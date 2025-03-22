
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const TechnicianDashboardPage = () => {
  const { technician, isAuthenticated, signOut } = useTechnicianAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/technician/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isAuthenticated || !technician) {
    return null; // Will redirect via useEffect
  }

  const isPending = technician.verification_status === 'Pending';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Technician Dashboard</h1>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {technician.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold">{technician.name}</p>
                <p className="text-gray-500 text-sm">{technician.email}</p>
              </div>
            </div>
            
            {isPending && (
              <Alert className="mt-4 border-yellow-300 bg-yellow-50">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-600">
                  Your account is still pending verification. You'll be able to access all features once approved.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {!isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No upcoming appointments found.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No recent earnings to display.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Account Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Waiting for Verification</h3>
                  <p className="text-gray-600 mb-4">
                    Your account is currently under review. This process usually takes 24-48 hours.
                    You'll be notified once your account is approved.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/technician/verification-pending">
                      View Verification Status
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
};

export default TechnicianDashboardPage;
