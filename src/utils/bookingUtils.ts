
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Offer {
  id: string;
  name: string;
  description: string | null;
  discount_type: 'Percentage' | 'Flat Amount';
  discount_value: number;
  valid_for: 'New Users' | 'All Users';
  service_id: string | null;
}

interface Technician {
  id: string;
  name: string;
  area: string;
  pincode: string;
  category_id: string;
  availability: boolean;
}

export interface BookingDetails {
  userId?: string;
  serviceId: string;
  date: string;
  time: string;
  name: string;
  address: string;
  area: string;
  pincode: string;
  amount: number;
}

// Get applicable offers for a service and user
export const getApplicableOffers = async (
  serviceId: string, 
  isNewUser: boolean
): Promise<Offer[]> => {
  try {
    const today = new Date().toISOString();
    
    let query = supabase
      .from('offers')
      .select('*')
      .eq('status', 'Active')
      .lte('start_date', today)
      .gte('end_date', today);
    
    // Filter by service if serviceId is provided
    if (serviceId) {
      query = query.or(`service_id.eq.${serviceId},service_id.is.null`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
    
    // Filter offers based on user status (new or existing) and properly cast types
    return data
      .filter(offer => {
        if (offer.valid_for === 'All Users') return true;
        if (offer.valid_for === 'New Users' && isNewUser) return true;
        return false;
      })
      .map(offer => ({
        ...offer,
        discount_type: offer.discount_type as 'Percentage' | 'Flat Amount',
        valid_for: offer.valid_for as 'New Users' | 'All Users'
      }));
  } catch (error) {
    console.error('Error in getApplicableOffers:', error);
    return [];
  }
};

// Calculate discount amount based on an offer
export const calculateDiscount = (
  originalAmount: number,
  offer: Offer
): { discountValue: number; finalAmount: number } => {
  let discountValue = 0;
  
  if (offer.discount_type === 'Percentage') {
    discountValue = (originalAmount * offer.discount_value) / 100;
  } else if (offer.discount_type === 'Flat Amount') {
    discountValue = offer.discount_value;
  }
  
  // Ensure discount doesn't exceed the original amount
  discountValue = Math.min(discountValue, originalAmount);
  
  const finalAmount = originalAmount - discountValue;
  
  return { discountValue, finalAmount };
};

// Find available technician based on area, pincode, and service category
export const findAvailableTechnician = async (
  area: string,
  pincode: string,
  categoryId: string
): Promise<Technician | null> => {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('availability', true)
      .eq('category_id', categoryId)
      .or(`area.ilike.%${area}%,pincode.eq.${pincode}`);
    
    if (error) {
      console.error('Error finding technician:', error);
      return null;
    }
    
    // Return the first available technician or null if none found
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in findAvailableTechnician:', error);
    return null;
  }
};

// Create a new booking in Supabase
export const createBooking = async (
  bookingDetails: BookingDetails,
  userId: string | undefined,
  offer?: Offer | null
): Promise<string | null> => {
  try {
    let discountApplied = false;
    let discountValue = 0;
    let finalAmount = bookingDetails.amount;
    
    // Apply discount if offer is provided
    if (offer) {
      const discount = calculateDiscount(bookingDetails.amount, offer);
      discountApplied = true;
      discountValue = discount.discountValue;
      finalAmount = discount.finalAmount;
    }
    
    // Get service category for technician matching
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('category_id')
      .eq('id', bookingDetails.serviceId)
      .single();
    
    if (serviceError) {
      console.error('Error fetching service category:', serviceError);
      throw new Error('Could not fetch service category');
    }
    
    // Find available technician
    const technician = await findAvailableTechnician(
      bookingDetails.area,
      bookingDetails.pincode,
      serviceData.category_id
    );
    
    // Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        technician_id: technician?.id || null,
        service_id: bookingDetails.serviceId,
        date: bookingDetails.date,
        time: bookingDetails.time,
        address: bookingDetails.address,
        area: bookingDetails.area,
        pincode: bookingDetails.pincode,
        status: 'Pending',
        amount: bookingDetails.amount,
        discount_applied: discountApplied,
        discount_value: discountValue,
        final_amount: finalAmount,
        commission: finalAmount * 0.2 // 20% commission as an example
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
    
    // Create a pending payment record
    await supabase.from('payments').insert({
      booking_id: data.id,
      payment_method: 'Cash', // Default to Cash
      amount: finalAmount,
      status: 'Pending'
    });
    
    if (technician) {
      // Create a pending commission record
      await supabase.from('commissions').insert({
        booking_id: data.id,
        technician_id: technician.id,
        amount: finalAmount * 0.2, // 20% commission
        status: 'Pending',
        payment_method: 'Cash' // Default to Cash
      });
    }
    
    toast.success('Booking created successfully!');
    return data.id;
  } catch (error: any) {
    console.error('Error in createBooking:', error);
    toast.error(error.message || 'Failed to create booking');
    return null;
  }
};
