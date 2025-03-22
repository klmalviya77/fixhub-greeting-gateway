
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Ensures that a bucket for technician documents exists
 * Creates it if it doesn't exist
 */
export const ensureTechnicianDocumentsBucket = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: getBucketsError } = await supabase
      .storage
      .listBuckets();

    if (getBucketsError) {
      console.error("Error checking for technician-documents bucket:", getBucketsError);
      throw getBucketsError;
    }

    // If the bucket doesn't exist, create it
    const bucketExists = buckets.some(bucket => bucket.name === 'technician-documents');
    
    if (!bucketExists) {
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('technician-documents', {
          public: true, // Changed to true to make documents publicly accessible
          fileSizeLimit: 5242880, // 5MB
        });

      if (createBucketError) {
        console.error("Error creating technician-documents bucket:", createBucketError);
        throw createBucketError;
      }
      
      console.log("Created technician-documents bucket successfully");
      // Note: You cannot directly create policies via the JavaScript client
      // Policies would need to be managed through the Supabase dashboard or SQL commands
    }

    return true;
  } catch (error) {
    console.error("Error ensuring technician-documents bucket:", error);
    toast.error("Failed to initialize storage for documents");
    throw error;
  }
};
