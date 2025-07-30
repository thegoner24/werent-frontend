"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, UpdateProfilePayload, ProfileValidationError } from '../../api/profile';
import ProfileAvatar from '../../components/ui/ProfileAvatar';

// Country codes data
const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+45', country: 'DK', flag: '🇩🇰' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+30', country: 'GR', flag: '🇬🇷' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+54', country: 'AR', flag: '🇦🇷' },
  { code: '+56', country: 'CL', flag: '🇨🇱' },
  { code: '+57', country: 'CO', flag: '🇨🇴' },
  { code: '+51', country: 'PE', flag: '🇵🇪' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+212', country: 'MA', flag: '🇲🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
];

const ProfileTab: React.FC = () => {
  const { user, accessToken, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Parse existing phone number to extract country code and number
  const parsePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return { countryCode: '+1', number: '' };
    
    const cleanPhone = phoneNumber.replace(/\s+/g, ''); // Remove spaces
    const matchedCode = countryCodes.find(cc => cleanPhone.startsWith(cc.code));
    
    if (matchedCode) {
      return {
        countryCode: matchedCode.code,
        number: cleanPhone.substring(matchedCode.code.length)
      };
    }
    
    // Default to +1 if no match found
    return { countryCode: '+1', number: cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone };
  };

  const initialPhone = parsePhoneNumber(user?.phone_number || '');
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    country_code: initialPhone.countryCode,
    phone_number: initialPhone.number,
    profile_image: user?.profile_image || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to prevent spaces
    let processedValue = value;
    if (name === 'phone_number') {
      processedValue = value.replace(/\s/g, ''); // Remove all spaces
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name] || (name === 'phone_number' && fieldErrors['phone_number'])) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        if (name === 'country_code' || name === 'phone_number') {
          delete newErrors['phone_number']; // Clear phone_number errors for both fields
        }
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({
          ...prev,
          profile_image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setFieldErrors({});

    // Client-side validation
    const clientErrors: { [key: string]: string[] } = {};
    
    if (!formData.first_name.trim()) {
      clientErrors.first_name = ['First name is required'];
    }
    
    if (!formData.last_name.trim()) {
      clientErrors.last_name = ['Last name is required'];
    }

    // Phone number validation (optional field, but if provided should be valid)
    if (formData.phone_number.trim()) {
      const phoneDigits = formData.phone_number.replace(/\D/g, ''); // Remove non-digits
      if (phoneDigits.length < 7 || phoneDigits.length > 12) {
        clientErrors.phone_number = ['Phone number must be between 7-12 digits (excluding country code)'];
      }
      
      // Check if phone number contains only valid characters (digits, hyphens, parentheses)
      if (!/^[\d\-\(\)]*$/.test(formData.phone_number)) {
        clientErrors.phone_number = ['Phone number can only contain digits, hyphens, and parentheses'];
      }
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setMessage({ 
        type: 'error', 
        text: 'Please fix the validation errors below.' 
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const fullPhoneNumber = formData.phone_number.trim() 
        ? `${formData.country_code}${formData.phone_number.trim()}`
        : '';

      const payload: UpdateProfilePayload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: fullPhoneNumber,
        ...(formData.profile_image && { profile_image: formData.profile_image })
      };

      const response = await updateProfile(payload, accessToken);
      
      if (response.success) {
        // Update user context with new data
        updateUser(response.data.user);
        setMessage({ type: 'success', text: response.message });
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error instanceof ProfileValidationError) {
        // Handle validation errors
        setFieldErrors(error.fieldErrors);
        setMessage({ 
          type: 'error', 
          text: 'Please fix the validation errors below.' 
        });
      } else {
        // Handle other errors
        setMessage({ 
          type: 'error', 
          text: error instanceof Error ? error.message : 'Failed to update profile' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string | null => {
    const errors = fieldErrors[fieldName];
    return errors && errors.length > 0 ? errors[0] : null;
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20">
              <ProfileAvatar 
                user={{
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  profile_image: formData.profile_image
                }} 
                size="lg"
                className="w-20 h-20 text-2xl"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getFieldError('first_name') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
          />
          {getFieldError('first_name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('first_name')}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getFieldError('last_name') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
          />
          {getFieldError('last_name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('last_name')}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            {/* Country Code Dropdown */}
            <select
              name="country_code"
              value={formData.country_code}
              onChange={handleInputChange}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[120px] ${
                getFieldError('phone_number') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            >
              {countryCodes.map((cc) => (
                <option key={cc.code} value={cc.code}>
                  {cc.flag} {cc.code} {cc.country}
                </option>
              ))}
            </select>
            
            {/* Phone Number Input */}
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="1234567890"
              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                getFieldError('phone_number') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
          </div>
          {getFieldError('phone_number') ? (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone_number')}</p>
          ) : (
            <div className="mt-1">
              <p className="text-xs text-gray-500">
                Enter your phone number without country code. No spaces allowed.
              </p>
              {formData.phone_number.trim() && (
                <p className="text-xs text-purple-600 mt-1">
                  Full number: {formData.country_code}{formData.phone_number}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
