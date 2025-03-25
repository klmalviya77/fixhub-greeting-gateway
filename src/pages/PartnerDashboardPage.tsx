import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePartnerAuth } from '@/context/PartnerAuthContext';
import { LogOut, ShieldCheck, Store, Package } from 'lucide-react';

const PartnerDashboardPage = () => {
  const { partner, signOut } = usePartnerAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {partner?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Partner Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {partner?.status === 'Verified' ? 'Active' : 'Pending'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {partner?.status === 'Verified' 
                    ? 'Your account is active and verified' 
                    : 'Your account is pending verification'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shop Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">{partner?.shop_name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {partner?.shop_area}, {partner?.shop_pincode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {partner?.services_offered?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Services offered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Shop Details</CardTitle>
          <CardDescription>
            Information about your shop and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Shop Name</h3>
              <p>{partner?.shop_name}</p>
            </div>
            <div>
              <h3 className="font-medium">Address</h3>
              <p>{partner?.shop_address}</p>
            </div>
            <div>
              <h3 className="font-medium">Area</h3>
              <p>{partner?.shop_area}</p>
            </div>
            <div>
              <h3 className="font-medium">Pincode</h3>
              <p>{partner?.shop_pincode}</p>
            </div>
            <div>
              <h3 className="font-medium">Services Offered</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {partner?.services_offered?.map((service, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon...</CardTitle>
          <CardDescription>
            More features will be available soon to help manage your services and bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on adding features like:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Service management</li>
            <li>Booking management</li>
            <li>Customer reviews</li>
            <li>Payment tracking</li>
            <li>Reporting tools</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerDashboardPage;
