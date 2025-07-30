import React from 'react';

// Country codes data
export const countryCodes = [
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

export interface PhoneNumberInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
  showPreview?: boolean;
  className?: string;
  selectClassName?: string;
  inputClassName?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  required = false,
  placeholder = "1234567890",
  label = "Phone Number",
  helperText,
  showPreview = true,
  className = "",
  selectClassName = "",
  inputClassName = ""
}) => {
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces automatically
    const value = e.target.value.replace(/\s/g, '');
    onPhoneNumberChange(value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryCodeChange(e.target.value);
  };

  const getDefaultErrorClasses = (hasError: boolean) => 
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-300';

  const fullPhoneNumber = phoneNumber.trim() ? `${countryCode}${phoneNumber}` : '';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[120px] ${
            selectClassName || getDefaultErrorClasses(!!error)
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
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            inputClassName || getDefaultErrorClasses(!!error)
          }`}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper Text or Preview */}
      {!error && (
        <div className="mt-1">
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
          {showPreview && fullPhoneNumber && (
            <p className="text-xs text-purple-600 mt-1">
              Full number: {fullPhoneNumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;
