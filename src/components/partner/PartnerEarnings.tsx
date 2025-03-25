
import React from 'react';
import { usePartnerAuth } from '@/context/PartnerAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Booking {
  id: string;
  service_id: string;
  date: string;
  final_amount: number | null;
  amount: number;
  status: string;
  payment_method: string | null;
}

interface Service {
  id: string;
  name: string;
  partner_id: string;
}

export function PartnerEarnings() {
  const { partner } = usePartnerAuth();
  
  // Fetch services offered by this partner
  const { data: partnerServices } = useQuery({
    queryKey: ['partner-services', partner?.id],
    queryFn: async () => {
      if (!partner?.id) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('partner_id', partner.id);
        
      if (error) {
        console.error('Error fetching partner services:', error);
        throw error;
      }
      
      return data as Service[] || [];
    },
    enabled: !!partner?.id
  });
  
  // Get service IDs offered by this partner
  const partnerServiceIds = partnerServices?.map(service => service.id) || [];
  
  // Fetch bookings for partner's services
  const { data: bookings } = useQuery({
    queryKey: ['partner-bookings', partnerServiceIds],
    queryFn: async () => {
      if (!partnerServiceIds.length) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('service_id', partnerServiceIds)
        .eq('status', 'Completed');
        
      if (error) {
        console.error('Error fetching partner bookings:', error);
        throw error;
      }
      
      return data as Booking[] || [];
    },
    enabled: !!partnerServiceIds.length
  });
  
  const getServiceName = (serviceId: string) => {
    const service = partnerServices?.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };
  
  const totalEarnings = bookings?.reduce((sum, booking) => 
    sum + (booking.final_amount || booking.amount), 0
  ) || 0;
  
  const adminShare = totalEarnings * 0.2; // Assuming 20% admin commission
  const partnerEarnings = totalEarnings - adminShare;
  
  const getMonthlyData = () => {
    if (!bookings) return [];
    
    const monthlyData: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      
      monthlyData[month] += (booking.final_amount || booking.amount);
    });
    
    return Object.entries(monthlyData).map(([month, value]) => ({
      month,
      earnings: value
    }));
  };
  
  const chartData = getMonthlyData();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
            <CardDescription>From {bookings?.length || 0} completed bookings</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Admin Share</CardTitle>
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{adminShare.toFixed(2)}</div>
            <CardDescription>20% of your total revenue</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{partnerEarnings.toFixed(2)}</div>
            <CardDescription>Net earnings after admin share</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your earnings trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    Not enough data to display chart
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payout Status</CardTitle>
            <CardDescription>Your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <span className="text-xl font-bold">₹{partnerEarnings.toFixed(2)}</span>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">Up to date</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Next Payout</span>
                <span className="font-medium">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your most recent completed bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 5).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getServiceName(booking.service_id)}</TableCell>
                    <TableCell>{booking.payment_method || 'Cash'}</TableCell>
                    <TableCell className="text-right">
                      ₹{(booking.final_amount || booking.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No completed bookings yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
