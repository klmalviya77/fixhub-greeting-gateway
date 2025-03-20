
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, IndianRupee } from 'lucide-react';
import Container from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

// Type definition
interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate next 7 available dates
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return format(date, 'yyyy-MM-dd');
  });
  
  // Generate time slots from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9;
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });
  
  // Fetch service details
  const { 
    data: service, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) return null;
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching service:', error);
        throw new Error(error.message);
      }
      
      return data as Service;
    },
    enabled: !!serviceId
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    setIsSubmitting(true);
    
    // Here you would typically save this to a bookings table in Supabase
    // For now, we'll just simulate the API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Booking submitted successfully!');
      
      // Redirect to confirmation page or home
      navigate('/');
    }, 1500);
  };
  
  // Error state
  if (error) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Service</h2>
          <p className="text-fixhub-dark-gray mb-6">We encountered an issue while loading the service details.</p>
          <Button onClick={() => navigate('/service-page')}>
            Back to Services
          </Button>
        </div>
      </Container>
    );
  }
  
  // No service selected state
  if (!serviceId) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">No Service Selected</h2>
          <p className="text-fixhub-dark-gray mb-6">Please select a service to book from our services page.</p>
          <Button onClick={() => navigate('/service-page')}>
            Browse Services
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-6">
            <Link to="/service-page" className="inline-flex items-center text-fixhub-blue font-medium mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
            <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
            <p className="text-fixhub-dark-gray">Fill out the form below to schedule your service</p>
          </div>
        </Container>
      </div>
      
      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your contact details so we can reach you regarding your booking
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address</Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        placeholder="123 Main Street, Mumbai"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <select 
                        id="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        required
                      >
                        <option value="">Select a date</option>
                        {availableDates.map((date) => (
                          <option key={date} value={date}>
                            {format(new Date(date), 'EEEE, MMM d, yyyy')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <select 
                        id="time" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)}
                        required
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((timeSlot) => (
                          <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Any specific instructions or details about your service request..."
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          {/* Service Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Service Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ) : service ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-fixhub-dark-gray mb-4">{service.description}</p>
                    
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-fixhub-dark-gray flex items-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          Rate
                        </span>
                        <span className="font-medium">₹{service.rate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fixhub-dark-gray flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Duration
                        </span>
                        <span>{service.duration} minutes</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{service.rate}</span>
                      </div>
                      <p className="text-xs text-fixhub-dark-gray mt-1">
                        * Final amount may vary based on additional requirements
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-fixhub-dark-gray">No service selected</p>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-fixhub-blue mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-fixhub-blue">Booking Information</h4>
                  <p className="text-sm text-fixhub-dark-gray mt-1">
                    After submitting your booking, one of our representatives will contact you to confirm the date and time. 
                    You may also receive appointment reminders via SMS or email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingPage;
