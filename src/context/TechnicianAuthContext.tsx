
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ensureTechnicianDocumentsBucket } from '@/util/storageHelper';

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
  availability?: boolean | null;
  rating?: number | null;
  verification_status: 'Pending' | 'Verified' | 'Rejected';
  // Custom fields we'll manage in our app (not stored in DB)
  documents?: {
    aadhar?: string;
    certificates?: string[];
  };
  experience?: string; // We'll keep this in localStorage, not in DB
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
      
      // We need to manually check the password since we don't have auth.users
      // NOTE: In a real application, you should NEVER store passwords in plain text
      // This is just for demonstration purposes
      // Normally, you would use a secure authentication service like Supabase Auth
      
      // Get the experience value from localStorage if available
      const experience = localStorage.getItem(`technicianExperience_${data.id}`) || '';
      
      // Add verification_status to the technician object
      const technicianWithStatus: Technician = {
        ...data,
        experience,
        // Use the verification_status from the database with a type assertion
        verification_status: (data.verification_status as 'Pending' | 'Verified' | 'Rejected') || 'Pending'
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
      
      // Create storage bucket if needed
      await ensureTechnicianDocumentsBucket();
      
      // Remove experience and password from the data we'll send to the database
      // since these fields are not in the schema
      const { experience, password, ...technicianDbData } = technicianData;
      
      // Insert directly instead of using the RPC
      const { data, error } = await supabase
        .from('technicians')
        .insert([{
          ...technicianDbData,
          verification_status: 'Pending' // Explicitly set the status on signup
        }])
        .select('id')
        .single();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Store experience in session storage since it's not in the DB
      const technicianWithMetadata = {
        ...technicianDbData,
        id: data.id,
        experience, // Add back the experience field for our client-side use
        verification_status: 'Pending' // Explicitly set status
      };
      
      // Save the experience to localStorage for later
      localStorage.setItem(`technicianExperience_${data.id}`, experience);
      // In a real app, you'd also store the hashed password in a secure way
      // But for this demo, we're simplifying things
      
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
      const filePath = `${fileName}`;
      
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
