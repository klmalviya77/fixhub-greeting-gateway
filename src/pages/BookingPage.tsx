
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, IndianRupee, Gift, AlertTriangle } from 'lucide-react';
import Container from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { 
  getApplicableOffers, 
  createBooking, 
  calculateDiscount,
  BookingDetails
} from '@/utils/bookingUtils';

// Type definitions
interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  duration: number;
  category_id: string;
}

interface Offer {
  id: string;
  name: string;
  description: string | null;
  discount_type: 'Percentage' | 'Flat Amount';
  discount_value: number;
  valid_for: 'New Users' | 'All Users';
  service_id: string | null;
}

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
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
    isLoading: isServiceLoading,
    error: serviceError
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

  // Fetch applicable offers (only if authenticated)
  const { 
    data: offers = [], 
    isLoading: isOffersLoading 
  } = useQuery({
    queryKey: ['offers', serviceId, isAuthenticated],
    queryFn: async () => {
      if (!serviceId) return [];
      // Check if user is newly registered (if authenticated)
      const isNewUser = !!user && new Date(user.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
      return getApplicableOffers(serviceId, isNewUser);
    },
    enabled: !!serviceId && isAuthenticated
  });

  // Calculate final amount with discount if applicable
  const calculateFinalAmount = () => {
    if (!service) return { originalAmount: 0, discountValue: 0, finalAmount: 0 };
    
    const originalAmount = service.rate;
    
    if (!selectedOffer) {
      return { originalAmount, discountValue: 0, finalAmount: originalAmount };
    }
    
    const { discountValue, finalAmount } = calculateDiscount(originalAmount, selectedOffer);
    
    return { originalAmount, discountValue, finalAmount };
  };
  
  const { originalAmount, discountValue, finalAmount } = calculateFinalAmount();
  
  // Handle offer selection
  const handleOfferSelect = (offer: Offer | null) => {
    setSelectedOffer(offer);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    setIsSubmitting(true);
    
    try {
      if (!isAuthenticated) {
        // Store booking details in localStorage and redirect to login
        const bookingDetails: BookingDetails = {
          serviceId: service.id,
          date,
          time,
          name,
          address,
          area,
          pincode,
          amount: service.rate
        };
        
        localStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
        toast.info('Please log in to complete your booking');
        navigate('/login');
        return;
      }
      
      // Create booking in Supabase (only for authenticated users)
      const bookingDetails: BookingDetails = {
        userId: user?.id,
        serviceId: service.id,
        date,
        time,
        name,
        address,
        area,
        pincode,
        amount: service.rate
      };
      
      const bookingId = await createBooking(bookingDetails, user?.id, selectedOffer);
      
      if (bookingId) {
        toast.success('Booking successful!');
        // Navigate to a confirmation page or home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Error state
  if (serviceError) {
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
        {!isAuthenticated && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="flex items-start p-4">
              <AlertTriangle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Please log in to complete your booking</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You'll need to <Link to="/login" className="underline font-medium">log in or create an account</Link> to confirm your booking and receive service updates.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
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
                      <Label htmlFor="area">Area</Label>
                      <Input 
                        id="area" 
                        value={area} 
                        onChange={(e) => setArea(e.target.value)} 
                        required 
                        placeholder="Andheri"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input 
                        id="pincode" 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)} 
                        required 
                        placeholder="400053"
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
                  <Button type="submit" className="w-full" disabled={isSubmitting || isServiceLoading}>
                    {isSubmitting ? 'Processing...' : isAuthenticated ? 'Confirm Booking' : 'Continue to Login'}
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
                {isServiceLoading ? (
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
                    
                    {isAuthenticated && offers.length > 0 && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center">
                          <Gift className="w-4 h-4 mr-1 text-green-600" />
                          Available Offers
                        </h4>
                        <div className="space-y-2">
                          <div 
                            className={`p-2 border rounded-md cursor-pointer transition ${
                              selectedOffer === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => handleOfferSelect(null)}
                          >
                            <p className="font-medium">No Offer</p>
                            <p className="text-xs text-fixhub-dark-gray">Regular price</p>
                          </div>
                          
                          {offers.map(offer => (
                            <div 
                              key={offer.id}
                              className={`p-2 border rounded-md cursor-pointer transition ${
                                selectedOffer?.id === offer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                              onClick={() => handleOfferSelect(offer)}
                            >
                              <p className="font-medium">{offer.name}</p>
                              <p className="text-xs text-fixhub-dark-gray">{offer.description}</p>
                              <p className="text-xs text-green-600 mt-1">
                                {offer.discount_type === 'Percentage' 
                                  ? `${offer.discount_value}% off` 
                                  : `₹${offer.discount_value} off`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-fixhub-dark-gray">Original Price</span>
                        <span>₹{originalAmount}</span>
                      </div>
                      
                      {discountValue > 0 && (
                        <div className="flex justify-between items-center text-green-600 mt-1">
                          <span className="text-sm">Discount</span>
                          <span>- ₹{discountValue}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-lg font-semibold mt-2 pt-2 border-t border-dashed border-gray-200">
                        <span>Total</span>
                        <span>₹{finalAmount}</span>
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
