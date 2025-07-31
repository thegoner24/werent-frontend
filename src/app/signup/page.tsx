"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import PhoneNumberInput from '../../components/ui/PhoneNumberInput';
import { useAuth } from '../../contexts/AuthContext';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  country_code: string;
  phone: string;
}

interface FieldErrors {
  [key: string]: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    country_code: '+1',
    phone: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // First name validation
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    // Last name validation
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    // Phone validation (optional field, but if provided should be valid)
    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, ''); // Remove non-digits
      if (phoneDigits.length < 7 || phoneDigits.length > 12) {
        errors.phone = 'Phone number must be between 7-12 digits (excluding country code)';
      }
      
      // Check if phone number contains only valid characters (digits, hyphens, parentheses)
      if (!/^[\d\-\(\)]*$/.test(formData.phone)) {
        errors.phone = 'Phone number can only contain digits, hyphens, and parentheses';
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...apiData } = formData;
      // Map to backend expected keys if needed
      const signupPayload = {
        email: apiData.email,
        first_name: apiData.first_name,
        last_name: apiData.last_name,
        password: apiData.password,
        phone_number: apiData.country_code + apiData.phone
      };
      // Use new API function
      await import('../../api/signup').then(({ signup }) =>
        signup(signupPayload)
      );
      // Success - redirect to login
      router.push('/login?message=Account created successfully! Please log in.');
    } catch (error: any) {
      // Attempt to parse error message
      try {
        const errObj = JSON.parse(error.message);
        if (errObj.field_errors) {
          setFieldErrors(errObj.field_errors);
        } else {
          setGeneralError(errObj.message || 'Registration failed. Please try again.');
        }
      } catch {
        setGeneralError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left side - Signup Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="bg-[#ff6b98] text-white h-10 w-10 rounded-md flex items-center justify-center font-bold text-xl">DB</div>
              <span className="ml-2 text-xl font-semibold">Dress Boutique</span>
            </div>
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sign Up
              </h1>
              <p className="text-gray-600">Create an account to start renting designer dresses for your special occasions.</p>
            </div>

            {/* General Error */}
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{generalError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Signup Button */}
              <button
                type="button"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 mb-6"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                    fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                      fieldErrors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                  {fieldErrors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                      fieldErrors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                  {fieldErrors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <PhoneNumberInput
                countryCode={formData.country_code}
                phoneNumber={formData.phone}
                onCountryCodeChange={(value) => {
                  setFormData(prev => ({ ...prev, country_code: value }));
                  // Clear field error
                  if (fieldErrors['phone']) {
                    setFieldErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                onPhoneNumberChange={(value) => {
                  setFormData(prev => ({ ...prev, phone: value }));
                  // Clear field error
                  if (fieldErrors['phone']) {
                    setFieldErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                error={fieldErrors.phone}
                label="Phone Number"
                helperText="Enter your phone number without country code. No spaces allowed. (Optional)"
                showPreview={true}
                selectClassName={`px-3 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                inputClassName={`flex-1 px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                  fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                    fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="At least 8 characters"
                />
                {fieldErrors.password && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Password must be at least 8 characters and contain at least one uppercase letter.</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                    fieldErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b98] text-white py-3 px-4 rounded-md hover:bg-[#ff6b98]/90 focus:ring-2 focus:ring-[#ff6b98] focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#ff6b98] hover:text-[#ff6b98]/80 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Testimonial */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#ff6b98]/10 via-[#ffd1dc]/20 to-[#ff6b98]/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b98]/10 via-[#ffd1dc]/20 to-[#ff6b98]/10">
            {/* Testimonial Card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <p className="text-gray-700 mb-4">
                The dress rental process has never been easier. I found the perfect gown for my wedding, and the personalized styling advice was exceptional.
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Alex Thompson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Emily Johnson</p>
                  <p className="text-gray-600 text-sm">Bride & Fashion Enthusiast</p>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
