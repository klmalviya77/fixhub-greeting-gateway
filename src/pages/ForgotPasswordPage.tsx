
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import Container from '@/components/ui/container';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/user/reset-password',
      });
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset password email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-fixhub-blue">FixHub</h1>
          </Link>
          <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
          <p className="text-fixhub-dark-gray">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                We'll send you an email with a link to reset your password
              </CardDescription>
            </CardHeader>
            
            {error && (
              <CardContent className="pt-0">
                <Alert variant="destructive" className="mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            )}
            
            {success && (
              <CardContent className="pt-0">
                <Alert className="mb-4 border-green-500 text-green-700">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertDescription>
                    Reset link sent. Please check your email.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading || success}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <p className="text-sm text-center">
                  Remember your password?{' '}
                  <Link to="/user/login" className="text-fixhub-blue hover:underline">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
