
import { supabase } from '@/integrations/supabase/client';

// Check if the technician-documents bucket exists, and create it if it doesn't
export const ensureTechnicianDocumentsBucket = async () => {
  try {
    // List all buckets to check if technician-documents exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'technician-documents');
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket('technician-documents', {
        public: false, // Set to true if you want all files to be publicly accessible
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['image/*', 'application/pdf']
      });
      
      if (createError) {
        console.error('Error creating technician-documents bucket:', createError);
        return false;
      }
      
      // Set bucket policy to allow authenticated users to upload
      const { error: policyError } = await supabase.storage.from('technician-documents').createPolicy('authenticated-upload', {
        name: 'authenticated-upload',
        definition: 'authenticated',
        type: 'INSERT'
      });
      
      if (policyError) {
        console.error('Error creating bucket policy:', policyError);
      }
      
      console.log('Created technician-documents bucket successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error setting up storage bucket:', error);
    return false;
  }
};
