
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Ensures that a bucket for technician documents exists
 * Returns true if bucket is available for use
 */
export const ensureTechnicianDocumentsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: getBucketsError } = await supabase
      .storage
      .listBuckets();

    if (getBucketsError) {
      console.error("Error checking for technician-documents bucket:", getBucketsError);
      toast.error("Failed to access document storage");
      throw getBucketsError;
    }

    // Check if the bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === 'technician-documents');
    
    if (!bucketExists) {
      console.error("The technician-documents bucket doesn't exist");
      toast.error("Document storage is not configured properly");
      return false;
    }
    
    console.log("Technician-documents bucket is available");
    return true;
  } catch (error) {
    console.error("Error ensuring technician-documents bucket:", error);
    toast.error("Failed to initialize storage for documents");
    return false;
  }
};

/**
 * Ensures that a bucket for partner documents exists
 * Returns true if bucket is available for use
 */
export const ensurePartnerDocumentsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: getBucketsError } = await supabase
      .storage
      .listBuckets();

    if (getBucketsError) {
      console.error("Error checking for partner-documents bucket:", getBucketsError);
      toast.error("Failed to access document storage");
      throw getBucketsError;
    }

    // Check if the bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === 'partner-documents');
    
    if (!bucketExists) {
      console.error("The partner-documents bucket doesn't exist");
      toast.error("Document storage is not configured properly");
      return false;
    }
    
    console.log("Partner-documents bucket is available");
    return true;
  } catch (error) {
    console.error("Error ensuring partner-documents bucket:", error);
    toast.error("Failed to initialize storage for documents");
    return false;
  }
};
