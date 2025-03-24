import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePartnerAuth } from '@/context/PartnerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShieldPlus, Upload, Briefcase, CheckCircle } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone_number: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  shop_name: z.string().min(2, { message: 'Shop name must be at least 2 characters' }),
  shop_address: z.string().min(5, { message: 'Shop address must be at least 5 characters' }),
  shop_area: z.string().min(2, { message: 'Shop area must be at least 2 characters' }),
  shop_pincode: z.string().min(5, { message: 'Shop pincode must be at least 5 characters' }),
  services_offered: z.string().min(2, { message: 'Please enter at least one service' }),
  terms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms and conditions' })
});

const PartnerSignupPage = () => {
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const { signUp, uploadDocument, sendForVerification } = usePartnerAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone_number: '',
      email: '',
      password: '',
      shop_name: '',
      shop_address: '',
      shop_area: '',
      shop_pincode: '',
      services_offered: '',
      terms: false
    }
  });

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    if (!aadharFile) {
      toast.error('Please upload your Aadhar card');
      return;
    }

    if (certificateFiles.length === 0) {
      toast.error('Please upload at least one certificate');
      return;
    }

    try {
      setIsLoading(true);
      
      // Convert services string to array
      const services_offered = values.services_offered.split(',').map(s => s.trim());
      
      // Submit partner data
      const partnerData = {
        name: values.name,
        phone_number: values.phone_number,
        email: values.email,
        password: values.password,
        shop_name: values.shop_name,
        shop_address: values.shop_address,
        shop_area: values.shop_area,
        shop_pincode: values.shop_pincode,
        services_offered
      };
      
      const id = await signUp(partnerData);
      setPartnerId(id);
      
      // Upload documents
      setIsUploading(true);
      
      // Upload Aadhar
      const aadharUrl = await uploadDocument(aadharFile, 'aadhar', id);
      
      // Upload certificates
      const certificateUrls = [];
      for (const file of certificateFiles) {
        const url = await uploadDocument(file, 'certificate', id);
        certificateUrls.push(url);
      }
      
      // Update partner record with document URLs
      const { error: updateError } = await supabase
        .from('partners')
        .update({
          aadhar_card: aadharUrl,
          certificates: certificateUrls
        })
        .eq('id', id);
      
      if (updateError) {
        toast.error(`Error updating document info: ${updateError.message}`);
        throw updateError;
      }
      
      setIsRegistrationComplete(true);
      toast.success('Registration complete! Please send your details for verification.');
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleVerificationRequest = async () => {
    if (!partnerId) return;
    
    try {
      setIsLoading(true);
      await sendForVerification(partnerId);
      navigate('/partner/verification-pending');
    } catch (error: any) {
      console.error('Verification request failed:', error);
      toast.error(error.message || 'Failed to send verification request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharFile(e.target.files[0]);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificateFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="container py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <ShieldPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Partner Registration</CardTitle>
          <CardDescription className="text-center">
            Register as a service partner to offer your services on our platform
          </CardDescription>
        </CardHeader>
        
        {isRegistrationComplete ? (
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Registration Complete!</h3>
              <p className="text-center mb-6">
                Your information has been successfully submitted. Please click the button below to send your details for verification.
              </p>
              <Button 
                className="w-full" 
                onClick={handleVerificationRequest}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Send for Verification'}
              </Button>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="********" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Shop Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shop_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Services" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shop_area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Area</FormLabel>
                          <FormControl>
                            <Input placeholder="Downtown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shop_pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="400001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="services_offered"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services Offered</FormLabel>
                          <FormControl>
                            <Input placeholder="Plumbing, Electrical, etc." {...field} />
                          </FormControl>
                          <FormDescription>Separate multiple services with commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="shop_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Document Upload
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Card</Label>
                      <Input
                        id="aadhar"
                        type="file"
                        onChange={handleAadharChange}
                        accept="image/*,.pdf"
                      />
                      {aadharFile && (
                        <p className="text-sm text-green-600">File selected: {aadharFile.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certificates">Certificates</Label>
                      <Input
                        id="certificates"
                        type="file"
                        onChange={handleCertificateChange}
                        accept="image/*,.pdf"
                        multiple
                      />
                      {certificateFiles.length > 0 && (
                        <p className="text-sm text-green-600">{certificateFiles.length} file(s) selected</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="terms">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">terms and conditions</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
                  {isLoading ? 'Submitting...' : isUploading ? 'Uploading Documents...' : 'Register as Partner'}
                </Button>
                <div className="text-center text-sm">
                  Already have a partner account?{' '}
                  <Link to="/partner/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default PartnerSignupPage;
