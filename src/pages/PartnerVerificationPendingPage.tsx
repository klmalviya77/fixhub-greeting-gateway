
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { usePartnerAuth } from '@/context/PartnerAuthContext';

const PartnerVerificationPendingPage = () => {
  const { partner } = usePartnerAuth();

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="mt-6 text-2xl font-bold">Verification Pending</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Hello {partner?.name}, your account is currently under review by our team.
          </p>
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <p className="text-amber-800">
              We will verify your documents and credentials as soon as possible. You'll be notified once your account is verified.
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium">Application Submitted</h4>
                <p className="text-sm text-muted-foreground">Your registration has been received</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium">Under Review</h4>
                <p className="text-sm text-muted-foreground">Our team is reviewing your application</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            If you have any questions, please contact our support team.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/partner/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PartnerVerificationPendingPage;
