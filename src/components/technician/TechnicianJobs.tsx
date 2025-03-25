
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, User, Phone, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  user_id: string | null;
  service_id: string;
  date: string;
  time: string;
  address: string;
  area: string;
  pincode: string;
  status: string;
  amount: number;
  final_amount: number | null;
  payment_method: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
}

interface UserProfile {
  id: string;
  name: string;
  address: string | null;
  area: string | null;
  pincode: string | null;
  city: string | null;
}

export function TechnicianJobs() {
  const { technician } = useTechnicianAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['technician-bookings', technician?.id],
    queryFn: async () => {
      if (!technician?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('technician_id', technician.id);
        
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      return data as Booking[] || [];
    },
    enabled: !!technician?.id
  });
  
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return data as Service[] || [];
    }
  });
  
  const { data: userProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
      }
      
      return data as UserProfile[] || [];
    }
  });
  
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-bookings'] });
      toast.success('Booking status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  });
  
  const completeBookingMutation = useMutation({
    mutationFn: async ({ id, paymentMethod }: { id: string; paymentMethod: string }) => {
      // Start a transaction by updating multiple tables
      
      // 1. Update booking status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          status: 'Completed',
          payment_method: paymentMethod
        })
        .eq('id', id)
        .select()
        .single();
        
      if (bookingError) {
        throw bookingError;
      }
      
      // 2. Create a payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: id,
          amount: booking.final_amount || booking.amount,
          payment_method: paymentMethod,
          status: 'Success'
        });
        
      if (paymentError) {
        throw paymentError;
      }
      
      // 3. Create a commission record
      const commissionAmount = (booking.final_amount || booking.amount) * 0.2; // 20% commission
      const { error: commissionError } = await supabase
        .from('commissions')
        .insert({
          booking_id: id,
          technician_id: technician?.id,
          amount: commissionAmount,
          status: 'Pending',
          payment_method: paymentMethod
        });
        
      if (commissionError) {
        throw commissionError;
      }
      
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-bookings'] });
      setIsPaymentModalOpen(false);
      setSelectedBooking(null);
      toast.success('Job marked as completed successfully');
    },
    onError: (error) => {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete job');
    }
  });
  
  const handleAcceptJob = (id: string) => {
    updateBookingStatusMutation.mutate({ id, status: 'Accepted' });
  };
  
  const handleRejectJob = (id: string) => {
    updateBookingStatusMutation.mutate({ id, status: 'Rejected' });
  };
  
  const handleMarkComplete = (id: string) => {
    setSelectedBooking(id);
    setIsPaymentModalOpen(true);
  };
  
  const handleCompletePayment = () => {
    if (selectedBooking) {
      completeBookingMutation.mutate({ 
        id: selectedBooking, 
        paymentMethod 
      });
    }
  };
  
  const getServiceName = (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };
  
  const getUserName = (userId: string | null) => {
    if (!userId) return 'Guest User';
    const user = userProfiles?.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };
  
  const pendingBookings = bookings?.filter(booking => 
    booking.status === 'Pending'
  ) || [];
  
  const activeBookings = bookings?.filter(booking => 
    booking.status === 'Accepted'
  ) || [];
  
  const completedBookings = bookings?.filter(booking => 
    booking.status === 'Completed'
  ) || [];
  
  if (isLoading) {
    return <div>Loading your jobs...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Jobs</h1>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No pending jobs found</p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map(booking => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{getServiceName(booking.service_id)}</CardTitle>
                  <CardDescription>Booking #{booking.id.slice(0, 8)}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getUserName(booking.user_id)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {booking.address}, {booking.area}, {booking.pincode}
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      ₹{booking.amount.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleRejectJob(booking.id)}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleAcceptJob(booking.id)}
                  >
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {activeBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No active jobs found</p>
              </CardContent>
            </Card>
          ) : (
            activeBookings.map(booking => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{getServiceName(booking.service_id)}</CardTitle>
                  <CardDescription>Booking #{booking.id.slice(0, 8)}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getUserName(booking.user_id)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {booking.address}, {booking.area}, {booking.pincode}
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      ₹{booking.amount.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={() => handleMarkComplete(booking.id)}
                  >
                    Mark as Completed
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No completed jobs found</p>
              </CardContent>
            </Card>
          ) : (
            completedBookings.map(booking => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{getServiceName(booking.service_id)}</CardTitle>
                  <CardDescription>
                    Booking #{booking.id.slice(0, 8)} - {booking.payment_method || 'Cash'} Payment
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getUserName(booking.user_id)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {booking.address}, {booking.area}, {booking.pincode}
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      Amount: ₹{(booking.final_amount || booking.amount).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Job & Process Payment</CardTitle>
              <CardDescription>
                Select payment method to complete this job
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={paymentMethod === 'Cash' ? 'default' : 'outline'}
                    className="flex items-center justify-center"
                    onClick={() => setPaymentMethod('Cash')}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Cash
                  </Button>
                  
                  <Button
                    type="button"
                    variant={paymentMethod === 'Online' ? 'default' : 'outline'}
                    className="flex items-center justify-center"
                    onClick={() => setPaymentMethod('Online')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Online
                  </Button>
                </div>
                
                <div className="bg-muted p-4 rounded-md text-sm">
                  {paymentMethod === 'Cash' && (
                    <p>
                      For cash payments, you will need to pay the admin commission manually.
                      Please make sure to collect the full payment from the customer.
                    </p>
                  )}
                  
                  {paymentMethod === 'Online' && (
                    <p>
                      For online payments, a QR code will be generated for the customer.
                      The admin commission will be automatically deducted from the transaction.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCompletePayment}>
                Complete Job
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
