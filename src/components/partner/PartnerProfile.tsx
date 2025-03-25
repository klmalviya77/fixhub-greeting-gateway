
import React from 'react';
import { usePartnerAuth } from '@/context/PartnerAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { User, Phone, MapPin, Store, Package, ShieldCheck } from 'lucide-react';

export function PartnerProfile() {
  const { partner } = usePartnerAuth();
  
  const handleRequestProfileUpdate = () => {
    // Format a WhatsApp message with the partner's details
    const message = `Hello Admin, I would like to request an update to my profile details. My partner ID is ${partner?.id}. Thank you.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-formatted message
    window.open(`https://wa.me/+911234567890?text=${encodedMessage}`, '_blank');
  };
  
  if (!partner) {
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
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>
              Your shop details and service information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shop Name</p>
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{partner.shop_name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Owner Name</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{partner.name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{partner.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{partner.phone_number}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shop Address</p>
                <p className="font-medium">{partner.shop_address}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{partner.shop_area}, {partner.shop_pincode}</p>
                </div>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Services Offered</p>
                <div className="flex flex-wrap gap-2">
                  {partner.services_offered?.map((service, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      {service}
                    </div>
                  )) || <p>No services specified</p>}
                </div>
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
                {partner.status === 'Verified' ? (
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-12 w-12 text-green-600" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-12 w-12 text-yellow-600" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">
                  {partner.status === 'Verified' 
                    ? 'Verified Account' 
                    : 'Verification Pending'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {partner.status === 'Verified'
                    ? 'Your account has been verified by our team'
                    : 'Your account is under review by our admin team'}
                </p>
                
                {partner.status !== 'Verified' && (
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
