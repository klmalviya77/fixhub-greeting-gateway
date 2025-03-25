
import React, { useEffect, useState } from 'react';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Stats {
  pendingJobs: number;
  completedJobs: number;
  totalEarnings: number;
  activeBookings: number;
}

export function TechnicianHome() {
  const { technician } = useTechnicianAuth();
  const [stats, setStats] = useState<Stats>({
    pendingJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    activeBookings: 0
  });
  
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
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
      
      return data || [];
    },
    enabled: !!technician?.id
  });
  
  useEffect(() => {
    if (bookingsData) {
      const pendingJobs = bookingsData.filter(booking => booking.status === 'Pending' || booking.status === 'Accepted').length;
      const completedJobs = bookingsData.filter(booking => booking.status === 'Completed').length;
      const totalEarnings = bookingsData
        .filter(booking => booking.status === 'Completed')
        .reduce((sum, booking) => sum + (booking.final_amount || booking.amount), 0);
      const activeBookings = bookingsData.filter(booking => booking.status === 'Accepted').length;
      
      setStats({
        pendingJobs,
        completedJobs,
        totalEarnings,
        activeBookings
      });
    }
  }, [bookingsData]);
  
  const statCards = [
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      description: 'Jobs awaiting action',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      description: 'Currently assigned jobs',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      description: 'Successfully finished jobs',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings.toFixed(2)}`,
      description: 'Revenue from completed jobs',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {technician?.name}</CardTitle>
            <CardDescription>
              Here's a summary of your recent activity and upcoming jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <p>Loading your data...</p>
            ) : (
              <div className="space-y-4">
                <p>
                  You have {stats.pendingJobs} pending jobs that require your attention.
                </p>
                <p>
                  Your total earnings from {stats.completedJobs} completed jobs is ₹{stats.totalEarnings.toFixed(2)}.
                </p>
                <p className="text-sm text-muted-foreground">
                  Head over to the "My Jobs" section to manage your assigned tasks.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
