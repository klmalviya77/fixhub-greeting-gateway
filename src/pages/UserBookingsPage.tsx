
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, IndianRupee, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Booking {
  id: string;
  service_id: string;
  date: string;
  time: string;
  address: string;
  area: string;
  pincode: string;
  status: string;
  amount: number;
  discount_applied: boolean;
  discount_value: number;
  final_amount: number;
  created_at: string;
  service: {
    name: string;
    description: string;
  };
  technician: {
    name: string;
    phone: string;
  } | null;
}

const UserBookingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:service_id (name, description),
          technician:technician_id (name, phone)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw new Error(error.message);
      }

      return data as Booking[];
    },
    enabled: !!isAuthenticated && !!user
  });

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status === 'Pending' || booking.status === 'Confirmed';
    } else if (activeTab === 'completed') {
      return booking.status === 'Completed';
    } else {
      return booking.status === 'Cancelled';
    }
  });

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (error: any) {
      toast.error('Failed to cancel booking: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-4">Please log in to view your bookings</p>
        <Button>Go to Login</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </Button>
        <Button 
          variant={activeTab === 'completed' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </Button>
        <Button 
          variant={activeTab === 'cancelled' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          An error occurred while fetching your bookings. Please try again.
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-500">You don't have any {activeTab} bookings yet</p>
            <Button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Book a Service
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{booking.service.name}</CardTitle>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <CardDescription>
                  Booking ID: {booking.id.slice(0, 8)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      {booking.time}
                    </div>
                    <div className="flex items-start text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <div>
                        {booking.address}, {booking.area}, {booking.pincode}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex justify-between">
                        <span>Service Cost:</span>
                        <span>₹{booking.amount}</span>
                      </div>
                      
                      {booking.discount_applied && (
                        <div className="text-sm text-green-600 flex justify-between">
                          <span>Discount:</span>
                          <span>-₹{booking.discount_value}</span>
                        </div>
                      )}
                      
                      <div className="text-sm font-medium flex justify-between pt-1 border-t">
                        <span>Total:</span>
                        <span>₹{booking.final_amount}</span>
                      </div>
                    </div>
                    
                    {booking.technician && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium mb-1">Technician Details</p>
                        <p className="text-sm">{booking.technician.name}</p>
                        <p className="text-sm">{booking.technician.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              {activeTab === 'upcoming' && (
                <CardFooter className="pt-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => cancelBooking(booking.id)}
                    disabled={booking.status === 'Cancelled'}
                  >
                    Cancel Booking
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
