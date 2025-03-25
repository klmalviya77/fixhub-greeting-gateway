
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
}

interface Commission {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  timestamp: string;
}

export function TechnicianEarnings() {
  const { technician } = useTechnicianAuth();
  
  const { data: bookings } = useQuery({
    queryKey: ['technician-completed-bookings', technician?.id],
    queryFn: async () => {
      if (!technician?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('technician_id', technician.id)
        .eq('status', 'Completed');
        
      if (error) {
        console.error('Error fetching completed bookings:', error);
        throw error;
      }
      
      return data as Booking[] || [];
    },
    enabled: !!technician?.id
  });
  
  const { data: commissions } = useQuery({
    queryKey: ['technician-commissions', technician?.id],
    queryFn: async () => {
      if (!technician?.id) return [];
      
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('technician_id', technician.id);
        
      if (error) {
        console.error('Error fetching commissions:', error);
        throw error;
      }
      
      return data as Commission[] || [];
    },
    enabled: !!technician?.id
  });
  
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id,name');
        
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return data as Service[] || [];
    }
  });
  
  const getServiceName = (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };
  
  const totalEarnings = bookings?.reduce((sum, booking) => 
    sum + (booking.final_amount || booking.amount), 0
  ) || 0;
  
  const totalCommissions = commissions?.reduce((sum, commission) => 
    sum + commission.amount, 0
  ) || 0;
  
  const netEarnings = totalEarnings - totalCommissions;
  
  const pendingCommissions = commissions?.filter(commission => 
    commission.status === 'Pending'
  ).reduce((sum, commission) => sum + commission.amount, 0) || 0;
  
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
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
            <CardDescription>From {bookings?.length || 0} completed jobs</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Admin Commission</CardTitle>
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommissions.toFixed(2)}</div>
            <CardDescription>20% of your total earnings</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{netEarnings.toFixed(2)}</div>
            <CardDescription>Total after deducting commission</CardDescription>
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
            <CardTitle>Commission Status</CardTitle>
            <CardDescription>Pending and paid commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Pending Commission</span>
                <span className="text-xl font-bold">₹{pendingCommissions.toFixed(2)}</span>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ 
                      width: `${totalCommissions ? (pendingCommissions / totalCommissions) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Paid Commission</span>
                <span className="text-xl font-bold">
                  ₹{(totalCommissions - pendingCommissions).toFixed(2)}
                </span>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ 
                      width: `${totalCommissions ? ((totalCommissions - pendingCommissions) / totalCommissions) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
          <CardDescription>Your most recent completed jobs</CardDescription>
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
              No completed jobs yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
