
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Technician {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

type TechnicianAuthContextType = {
  technician: Technician | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (technicianData: TechnicianSignUpData) => Promise<void>;
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
      // Use the custom function we created to authenticate technicians
      const { data, error } = await supabase.rpc('authenticate_technician', {
        email_input: email,
        password_input: password
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (!data.authenticated) {
        toast.error(data.message || 'Invalid credentials');
        throw new Error(data.message || 'Invalid credentials');
      }
      
      // Store technician session in local storage
      localStorage.setItem('technicianSession', JSON.stringify(data));
      setTechnician(data);
      setIsAuthenticated(true);
      
      toast.success('Logged in successfully!');
      
      // Check status and show appropriate message
      if (data.status === 'Pending') {
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
      
      // Register the technician using our custom function
      const { data, error } = await supabase.rpc('register_technician', {
        name_input: technicianData.name,
        phone_input: technicianData.phone,
        email_input: technicianData.email,
        password_input: technicianData.password,
        address_input: technicianData.address,
        experience_input: technicianData.experience,
        category_id_input: technicianData.category_id,
        pincode_input: technicianData.pincode,
        area_input: technicianData.area,
        aadhar_card_input: '', // Will be updated after upload
        certificates_input: [] // Will be updated after upload
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (!data.success) {
        toast.error(data.message);
        throw new Error(data.message);
      }
      
      toast.success('Registration successful! Please upload your documents.');
      
      // Return the technician ID for document uploads
      return data.technician_id;
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
      
      // Update technician status to pending (already default, but just in case)
      const { error } = await supabase
        .from('technicians')
        .update({ status: 'Pending' })
        .eq('id', technicianId);
      
      if (error) {
        toast.error(error.message);
        throw error;
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
