
import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-6">
          Have questions or feedback? Reach out to our team.
        </p>
        <div className="space-y-4">
          <p><strong>Email:</strong> support@fixhub.com</p>
          <p><strong>Phone:</strong> +1 (123) 456-7890</p>
          <p><strong>Hours:</strong> Monday-Friday, 9am-5pm</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
