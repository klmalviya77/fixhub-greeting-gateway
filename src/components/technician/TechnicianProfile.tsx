import React from 'react';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, MapPin, Star, Award, Wrench } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export function TechnicianProfile() {
  const { technician } = useTechnicianAuth();
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as Category[] || [];
    }
  });
  
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Not specified';
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };
  
  const handleRequestProfileUpdate = () => {
    // Format a WhatsApp message with the technician's details
    const message = `Hello Admin, I would like to request an update to my profile details. My technician ID is ${technician?.id}. Thank you.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-formatted message
    window.open(`https://wa.me/+911234567890?text=${encodedMessage}`, '_blank');
  };
  
  if (!technician) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your profile details and service information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{technician.name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{technician.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{technician.phone}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{getCategoryName(technician.category_id)}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{technician.area}, {technician.pincode}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <p className="font-medium">
                    {technician.rating ? technician.rating.toFixed(1) : 'No ratings yet'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">
                    {technician.verification_status === 'Verified' ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-yellow-600">{technician.verification_status}</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Availability</p>
                <p className="font-medium">
                  {technician.availability ? (
                    <span className="text-green-600">Available</span>
                  ) : (
                    <span className="text-red-600">Not Available</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleRequestProfileUpdate}>
              Request Profile Update
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Your account verification information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                {technician.verification_status === 'Verified' ? (
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-12 w-12 text-green-600" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-12 w-12 text-yellow-600" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">
                  {technician.verification_status === 'Verified' 
                    ? 'Verified Account' 
                    : 'Verification Pending'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {technician.verification_status === 'Verified'
                    ? 'Your account has been verified by our team'
                    : 'Your account is under review by our admin team'}
                </p>
                
                {technician.verification_status !== 'Verified' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm">
                    <p>
                      If your verification is taking too long, please contact our
                      support team for assistance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
