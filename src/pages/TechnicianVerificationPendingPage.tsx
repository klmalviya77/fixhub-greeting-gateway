
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/ui/container';

const TechnicianVerificationPendingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-fixhub-blue">FixHub</h1>
          </Link>
          
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Verification Pending</h2>
              
              <p className="text-gray-600 mb-6">
                Your account is waiting for admin verification. We've sent your details to our team for review.
                You'll receive an email once your account is approved.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-gray-800 mb-2">What happens next?</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Our admin team will verify your documents</li>
                    <li>This usually takes 24-48 hours</li>
                    <li>You'll receive an email notification once verified</li>
                    <li>After approval, you can log in and start accepting jobs</li>
                  </ul>
                </div>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
                
                <p className="text-sm text-gray-500">
                  If you have any questions, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default TechnicianVerificationPendingPage;
