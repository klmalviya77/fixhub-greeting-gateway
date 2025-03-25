
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, IndianRupee, MapPin, Phone, User } from 'lucide-react';
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
  user_profile: {
    name: string;
    phone?: string;
  } | null;
  commission: number;
}

const TechnicianBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const queryClient = useQueryClient();

  // Fetch the technician ID - in a real app, this would come from auth context
  const { data: technicianData } = useQuery({
    queryKey: ['technicianProfile'],
    queryFn: async () => {
      const { data: technician, error } = await supabase
        .from('technicians')
        .select('id')
        .single();

      if (error) throw error;
      return technician;
    }
  });

  const technicianId = technicianData?.id;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['technicianBookings', technicianId, activeTab],
    queryFn: async () => {
      if (!technicianId) return [];

      let statusFilter;
      if (activeTab === 'pending') {
        statusFilter = ['Pending', 'Confirmed'];
      } else if (activeTab === 'in-progress') {
        statusFilter = ['In Progress'];
      } else {
        statusFilter = ['Completed'];
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:service_id (name, description),
          user_profile:user_id (name, phone)
        `)
        .eq('technician_id', technicianId)
        .in('status', statusFilter)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      return data as Booking[];
    },
    enabled: !!technicianId
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicianBookings'] });
      toast.success('Booking status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending': return 'Confirmed';
      case 'Confirmed': return 'In Progress';
      case 'In Progress': return 'Completed';
      default: return currentStatus;
    }
  };

  const getStatusButtonLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending': return 'Confirm';
      case 'Confirmed': return 'Start Job';
      case 'In Progress': return 'Complete';
      default: return 'Update';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'pending' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={activeTab === 'in-progress' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress
        </Button>
        <Button 
          variant={activeTab === 'completed' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('completed')}
        >
          Completed
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
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-500">You don't have any assigned jobs</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
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
                    <div className="flex items-start text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <div>
                        {booking.address}, {booking.area}, {booking.pincode}
                      </div>
                    </div>
                    
                    {booking.user_profile && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium mb-1">Customer Details</p>
                        <div className="flex items-center text-sm mb-1">
                          <User className="h-4 w-4 mr-2" />
                          {booking.user_profile.name}
                        </div>
                        {booking.user_profile.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2" />
                            {booking.user_profile.phone}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex justify-between">
                        <span>Service Cost:</span>
                        <span>₹{booking.amount}</span>
                      </div>
                      
                      {booking.discount_applied && (
                        <div className="text-sm text-green-600 flex justify-between">
                          <span>Discount Applied:</span>
                          <span>-₹{booking.discount_value}</span>
                        </div>
                      )}
                      
                      <div className="text-sm font-medium flex justify-between pt-1 border-t">
                        <span>Total Amount:</span>
                        <span>₹{booking.final_amount}</span>
                      </div>
                      
                      <div className="text-sm text-blue-600 flex justify-between pt-1">
                        <span>Your Commission:</span>
                        <span>₹{booking.commission || Math.round(booking.final_amount * 0.2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                <CardFooter className="pt-2">
                  <Button 
                    onClick={() => 
                      updateBookingStatus.mutate({
                        id: booking.id,
                        status: getNextStatus(booking.status)
                      })
                    }
                    disabled={updateBookingStatus.isPending}
                    className="mr-2"
                  >
                    {getStatusButtonLabel(booking.status)}
                  </Button>
                  
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => 
                        updateBookingStatus.mutate({
                          id: booking.id,
                          status: 'Cancelled'
                        })
                      }
                      disabled={updateBookingStatus.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianBookingsPage;
