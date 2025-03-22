import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTechnicianAuth, TechnicianSignUpData } from '@/context/TechnicianAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Container from '@/components/ui/container';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface UploadState {
  aadhar: { file: File | null; url: string | null; uploading: boolean };
  certificates: { files: File[]; urls: string[]; uploading: boolean };
}

const TechnicianSignupPage = () => {
  const [formData, setFormData] = useState<TechnicianSignUpData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    experience: '',
    category_id: '',
    pincode: '',
    area: '',
  });

  const [uploads, setUploads] = useState<UploadState>({
    aadhar: { file: null, url: null, uploading: false },
    certificates: { files: [], urls: [], uploading: false }
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'documents' | 'verification'>('form');
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  
  const { isAuthenticated, signUp, uploadDocument, sendForVerification } = useTechnicianAuth();
  const navigate = useNavigate();

  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error('Error fetching categories:', error.message);
        toast.error('Failed to load categories');
        return [];
      }
    }
  });

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/technician-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category_id: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhar' | 'certificates') => {
    if (!e.target.files?.length) return;
    
    if (type === 'aadhar') {
      const file = e.target.files[0];
      setUploads(prev => ({
        ...prev,
        aadhar: { ...prev.aadhar, file }
      }));
    } else if (type === 'certificates') {
      const files = Array.from(e.target.files);
      setUploads(prev => ({
        ...prev,
        certificates: { 
          ...prev.certificates, 
          files: [...prev.certificates.files, ...files]
        }
      }));
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setUploads(prev => ({
      ...prev,
      certificates: {
        ...prev.certificates,
        files: prev.certificates.files.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.email || !formData.password || 
        !formData.address || !formData.experience || !formData.category_id || 
        !formData.pincode || !formData.area) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Register the technician
      const techId = await signUp(formData);
      
      // Save the technician ID for the document upload step
      setTechnicianId(techId);
      
      // Move to document upload step
      setRegistrationStep('documents');
      
      toast.success('Registration successful! Please upload your documents.');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!technicianId) {
      setError('Registration information is missing. Please try again.');
      return;
    }
    
    if (!uploads.aadhar.file) {
      setError('Aadhar card is required');
      return;
    }
    
    if (uploads.certificates.files.length === 0) {
      setError('At least one certificate is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload Aadhar
      setUploads(prev => ({
        ...prev,
        aadhar: { ...prev.aadhar, uploading: true }
      }));
      
      const aadharUrl = await uploadDocument(uploads.aadhar.file, 'aadhar', technicianId);
      
      setUploads(prev => ({
        ...prev,
        aadhar: { ...prev.aadhar, url: aadharUrl, uploading: false }
      }));
      
      // Upload Certificates
      setUploads(prev => ({
        ...prev,
        certificates: { ...prev.certificates, uploading: true }
      }));
      
      const certificateUrls: string[] = [];
      
      for (const file of uploads.certificates.files) {
        const url = await uploadDocument(file, 'certificate', technicianId);
        certificateUrls.push(url);
      }
      
      setUploads(prev => ({
        ...prev,
        certificates: { 
          ...prev.certificates, 
          urls: certificateUrls, 
          uploading: false 
        }
      }));
      
      // Instead of trying to store the documents in columns that don't exist,
      // we'll store them in session storage for now
      // In a real app, you would create a separate documents table in the database
      
      const technicianData = {
        id: technicianId,
        documents: {
          aadhar: aadharUrl,
          certificates: certificateUrls
        }
      };
      
      // Store this in session for persistence
      localStorage.setItem('technicianDocuments', JSON.stringify(technicianData));
      
      // Move to verification step
      setRegistrationStep('verification');
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForVerification = async () => {
    if (!technicianId) {
      setError('Registration information is missing. Please try again.');
      return;
    }
    
    try {
      setIsLoading(true);
      await sendForVerification(technicianId);
    } catch (error: any) {
      setError(error.message || 'Failed to send verification request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-fixhub-blue">FixHub</h1>
          </Link>
          <h2 className="text-2xl font-semibold mb-2">Technician Registration</h2>
          <p className="text-fixhub-dark-gray">
            Join FixHub as a technician to offer your services
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {registrationStep === 'form' && 'Register as Technician'}
                {registrationStep === 'documents' && 'Upload Documents'}
                {registrationStep === 'verification' && 'Send for Verification'}
              </CardTitle>
              <CardDescription>
                {registrationStep === 'form' && 'Fill in your details to register as a technician'}
                {registrationStep === 'documents' && 'Upload your identification and certification documents'}
                {registrationStep === 'verification' && 'Submit your profile for verification'}
              </CardDescription>
            </CardHeader>
            
            {error && (
              <CardContent className="pt-0">
                <Alert variant="destructive" className="mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            )}
            
            {registrationStep === 'form' && (
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={handleCategoryChange} value={formData.category_id}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St, Apartment 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input 
                        id="pincode"
                        name="pincode"
                        type="text"
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input 
                        id="area"
                        name="area"
                        type="text"
                        placeholder="Bandra"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input 
                        id="experience"
                        name="experience"
                        type="text"
                        placeholder="5"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm leading-none pt-1"
                    >
                      I agree to the{' '}
                      <Link to="/terms" className="text-fixhub-blue hover:underline">
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Continue to Document Upload'}
                  </Button>
                  <p className="text-sm text-center">
                    Already registered?{' '}
                    <Link to="/technician/login" className="text-fixhub-blue hover:underline">
                      Sign In
                    </Link>
                  </p>
                </CardFooter>
              </form>
            )}
            
            {registrationStep === 'documents' && (
              <form onSubmit={handleUploadDocuments}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Card</Label>
                    <Input 
                      id="aadhar"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'aadhar')}
                      disabled={isLoading || uploads.aadhar.uploading}
                    />
                    {uploads.aadhar.file && (
                      <p className="text-sm text-green-600">
                        Selected: {uploads.aadhar.file.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificates">Certificates (add multiple)</Label>
                    <Input 
                      id="certificates"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'certificates')}
                      disabled={isLoading || uploads.certificates.uploading}
                      multiple
                    />
                    {uploads.certificates.files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium">Selected Certificates:</p>
                        <ul className="text-sm space-y-1">
                          {uploads.certificates.files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span>{file.name}</span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveCertificate(index)}
                                disabled={isLoading || uploads.certificates.uploading}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading || uploads.aadhar.uploading || uploads.certificates.uploading}>
                    {(isLoading || uploads.aadhar.uploading || uploads.certificates.uploading) 
                      ? 'Uploading...' 
                      : 'Upload Documents'}
                  </Button>
                </CardFooter>
              </form>
            )}
            
            {registrationStep === 'verification' && (
              <CardContent className="space-y-6 text-center">
                <div className="py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Documents Uploaded Successfully</h3>
                  <p className="text-gray-600 mb-6">
                    Your documents have been uploaded successfully. Click the button below to send your profile for verification.
                  </p>
                  <Button 
                    onClick={handleSendForVerification} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Send for Verification'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default TechnicianSignupPage;
