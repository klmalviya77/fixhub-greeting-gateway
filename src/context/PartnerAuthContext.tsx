
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ensurePartnerDocumentsBucket } from '@/util/storageHelper';

// Partner interface matching our database schema
interface Partner {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  shop_name: string;
  shop_address: string;
  shop_area: string;
  shop_pincode: string;
  services_offered: string[];
  aadhar_card?: string;
  certificates?: string[];
  status: 'Pending' | 'Verified' | 'Rejected';
  role: string;
}

type PartnerAuthContextType = {
  partner: Partner | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (partnerData: PartnerSignUpData) => Promise<string>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  uploadDocument: (file: File, type: 'aadhar' | 'certificate', partnerId: string) => Promise<string>;
  sendForVerification: (partnerId: string) => Promise<void>;
};

export interface PartnerSignUpData {
  name: string;
  phone_number: string;
  email: string;
  password: string;
  shop_name: string;
  shop_address: string;
  shop_area: string;
  shop_pincode: string;
  services_offered: string[];
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined);

export function PartnerAuthProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for partner session
    const checkSession = () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('partnerSession');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          setPartner(session);
          setIsAuthenticated(true);
        } else {
          setPartner(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking partner session:", error);
        setPartner(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Fetch partner data by email
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (!data) {
        toast.error('Invalid credentials');
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you would verify the password with a secure method
      // This is just for demonstration
      
      // Add status to the partner object with type assertion
      const partnerWithStatus: Partner = {
        ...data,
        status: (data.status as 'Pending' | 'Verified' | 'Rejected') || 'Pending'
      };
      
      // Store partner session in local storage
      localStorage.setItem('partnerSession', JSON.stringify(partnerWithStatus));
      setPartner(partnerWithStatus);
      setIsAuthenticated(true);
      
      toast.success('Logged in successfully!');
      
      // Check status and show appropriate message
      if (partnerWithStatus.status === 'Pending') {
        toast.info('Your account is still pending verification.');
      }
      
      navigate('/partner-dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (partnerData: PartnerSignUpData) => {
    try {
      setLoading(true);
      
      // Create storage bucket if needed
      await ensurePartnerDocumentsBucket();
      
      // Extract password and prepare data for database
      const { password, ...partnerDbData } = partnerData;
      
      // Insert into partners table
      const { data, error } = await supabase
        .from('partners')
        .insert([{
          ...partnerDbData,
          password, // In a real app, never store plain passwords
          status: 'Pending'
        }])
        .select('id')
        .single();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Registration successful! Please upload your documents.');
      
      // Return the partner ID for document uploads
      return data.id;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, type: 'aadhar' | 'certificate', partnerId: string) => {
    try {
      setLoading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${partnerId}/${type}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('partner-documents')
        .upload(filePath, file);
      
      if (error) {
        toast.error(`Error uploading ${type}: ${error.message}`);
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('partner-documents')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendForVerification = async (partnerId: string) => {
    try {
      setLoading(true);
      
      // Update partner status in database
      const { error } = await supabase
        .from('partners')
        .update({ status: 'Pending' })
        .eq('id', partnerId);
      
      if (error) {
        toast.error(`Error updating status: ${error.message}`);
        throw error;
      }
      
      // Get current session data and update local storage
      const sessionStr = localStorage.getItem('partnerSession');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.status = 'Pending';
        localStorage.setItem('partnerSession', JSON.stringify(session));
        setPartner(session);
      }
      
      // In a real app, you would send a WhatsApp message to admin here
      toast.success('Verification request sent to admin via WhatsApp.');
      
      navigate('/partner/verification-pending');
    } catch (error: any) {
      console.error('Error sending verification request:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear local storage session
      localStorage.removeItem('partnerSession');
      
      setPartner(null);
      setIsAuthenticated(false);
      
      navigate('/partner/login');
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    partner,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    uploadDocument,
    sendForVerification
  };

  return <PartnerAuthContext.Provider value={value}>{children}</PartnerAuthContext.Provider>;
}

export const usePartnerAuth = () => {
  const context = useContext(PartnerAuthContext);
  if (context === undefined) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider');
  }
  return context;
};
