
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/container';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-fixhub-blue">FixHub</h1>
          </Link>
          <h2 className="text-2xl font-semibold mb-2">Login or Create Account</h2>
          <p className="text-fixhub-dark-gray">
            Join FixHub to book services and manage your appointments
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
