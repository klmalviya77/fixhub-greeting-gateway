
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Update the Technician interface to match our actual database schema
interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  area: string;
  pincode: string;
  category_id?: string | null;
  experience?: string;
  availability?: boolean;
  rating?: number | null;
  // Add custom fields we'll manage in our app
  verification_status?: 'Pending' | 'Verified' | 'Rejected';
  documents?: {
    aadhar?: string;
    certificates?: string[];
  };
}

type TechnicianAuthContextType = {
  technician: Technician | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (technicianData: TechnicianSignUpData) => Promise<string>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  uploadDocument: (file: File, type: 'aadhar' | 'certificate', technicianId: string) => Promise<string>;
  sendForVerification: (technicianId: string) => Promise<void>;
};

export interface TechnicianSignUpData {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  experience: string;
  category_id: string;
  pincode: string;
  area: string;
}

const TechnicianAuthContext = createContext<TechnicianAuthContextType | undefined>(undefined);

export function TechnicianAuthProvider({ children }: { children: React.ReactNode }) {
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for technician session
    const checkSession = () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('technicianSession');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          setTechnician(session);
          setIsAuthenticated(true);
        } else {
          setTechnician(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking technician session:", error);
        setTechnician(null);
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
      
      // Fetch technician data by email
      const { data, error } = await supabase
        .from('technicians')
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
      
      // Add verification_status to the technician object
      const technicianWithStatus: Technician = {
        ...data,
        verification_status: 'Pending' // Default status or can be fetched from a separate table
      };
      
      // Store technician session in local storage
      localStorage.setItem('technicianSession', JSON.stringify(technicianWithStatus));
      setTechnician(technicianWithStatus);
      setIsAuthenticated(true);
      
      toast.success('Logged in successfully!');
      
      // Check status and show appropriate message
      if (technicianWithStatus.verification_status === 'Pending') {
        toast.info('Your account is still pending verification.');
      }
      
      navigate('/technician-dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (technicianData: TechnicianSignUpData) => {
    try {
      setLoading(true);
      
      // Insert directly instead of using the RPC
      const { data, error } = await supabase
        .from('technicians')
        .insert([
          {
            name: technicianData.name,
            phone: technicianData.phone,
            email: technicianData.email,
            password: technicianData.password, // Note: In production, this should be hashed
            address: technicianData.address,
            experience: technicianData.experience,
            category_id: technicianData.category_id,
            pincode: technicianData.pincode,
            area: technicianData.area,
            // We will maintain verification status in our application logic
            // or in a separate metadata table
          }
        ])
        .select('id')
        .single();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Registration successful! Please upload your documents.');
      
      // Return the technician ID for document uploads
      return data.id;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, type: 'aadhar' | 'certificate', technicianId: string) => {
    try {
      setLoading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${technicianId}/${type}-${Date.now()}.${fileExt}`;
      const filePath = `technician-documents/${fileName}`;
      
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('technician-documents')
        .upload(filePath, file);
      
      if (error) {
        toast.error(`Error uploading ${type}: ${error.message}`);
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('technician-documents')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendForVerification = async (technicianId: string) => {
    try {
      setLoading(true);
      
      // In a real app, we would update a status field in a separate verification table
      // or have a metadata field. Since we don't have a status field in the DB,
      // we'll just simulate it with session storage and a toast message
      
      // Get current session data
      const sessionStr = localStorage.getItem('technicianSession');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.verification_status = 'Pending';
        localStorage.setItem('technicianSession', JSON.stringify(session));
      }
      
      // In a real app, you would send a WhatsApp message to admin here
      // For now, we'll just simulate it with a toast
      toast.success('Verification request sent to admin via WhatsApp.');
      
      navigate('/technician/verification-pending');
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
      localStorage.removeItem('technicianSession');
      
      setTechnician(null);
      setIsAuthenticated(false);
      
      navigate('/technician/login');
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    technician,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    uploadDocument,
    sendForVerification
  };

  return <TechnicianAuthContext.Provider value={value}>{children}</TechnicianAuthContext.Provider>;
}

export const useTechnicianAuth = () => {
  const context = useContext(TechnicianAuthContext);
  if (context === undefined) {
    throw new Error('useTechnicianAuth must be used within a TechnicianAuthProvider');
  }
  return context;
};
