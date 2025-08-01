'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FinePaymentData {
  booking_id: number[];
  payment_method: string;
  payment_type: string;
  total_price: number;
  user_id: number;
}

interface PaymentResponse {
  data: {
    booking_id: number[];
    id: number;
    payment_date: string;
    payment_method: string;
    payment_type: string;
    total_price: number;
    user_id: number;
  };
  message: string;
  success: boolean;
}

const FinePaymentContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken, isAuthenticated } = useAuth();
  const authenticatedApi = useAuthenticatedApi();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  
  // Get booking details from URL params
  const bookingId = searchParams.get('bookingId');
  const itemName = searchParams.get('itemName');
  const totalPrice = searchParams.get('totalPrice');
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'CC',
      name: 'Credit Card',
      icon: '💳',
      description: 'Pay with your credit or debit card'
    },
    {
      id: 'QRIS',
      name: 'QRIS',
      icon: '📱',
      description: 'Pay using QR code scan'
    },
    {
      id: 'TRANSFER',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Direct bank transfer'
    },
    {
      id: 'Cash',
      name: 'Cash',
      icon: '💵',
      description: 'Pay with cash'
    }
  ];
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  const calculateFineAmount = () => {
    const basePrice = parseFloat(totalPrice || '1');
    // Industry standard: 10% base fee + $5 per day overdue
    const baseFine = basePrice * 0.10; // 10% of rental amount
    const dailyFine = 5; // $5 per day (simplified for this example)
    return baseFine + dailyFine;
  };

  const getFineCalculationDetails = () => {
    const basePrice = parseFloat(totalPrice || '1');
    const baseFine = basePrice * 0.10;
    const dailyFine = 5;
    const daysOverdue = 1; // Simplified for this example
    
    return { baseFine, dailyFine, daysOverdue };
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    if (!bookingId || !user?.id) {
      setError('Missing booking or user information');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const paymentData: Record<string, unknown> = {
        booking_id: [parseInt(bookingId)],
        payment_method: selectedPaymentMethod,
        payment_type: 'FINE',
        total_price: calculateFineAmount(),
        user_id: user.id
      };
      
      const response = await authenticatedApi.post('/payments/', paymentData) as unknown as PaymentResponse;
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard?tab=rentals');
        }, 2000);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your fine has been paid successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-6">
            <h1 className="text-2xl font-bold">Pay Fine</h1>
            <p className="text-red-100 mt-1">Complete your overdue rental payment</p>
          </div>
          
          {/* Booking Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-semibold text-gray-900">#{bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Item</p>
                  <p className="font-semibold text-gray-900">{itemName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fine Amount</p>
                  <p className="font-semibold text-red-600 text-lg">${calculateFineAmount().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    PAST DUE
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : `Pay $${calculateFineAmount().toFixed(2)}`}
              </button>
            </div>
            
            {/* Fine Calculation Details */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="flex items-start">
                  <span className="text-red-500 mr-1">*</span>
                  <span>
                    <strong>Fine Calculation:</strong> Base fee (10% of rental amount): ${getFineCalculationDetails().baseFine.toFixed(2)} + 
                    Daily penalty (${getFineCalculationDetails().daysOverdue} day × $5.00): ${getFineCalculationDetails().dailyFine.toFixed(2)} = 
                    Total: ${calculateFineAmount().toFixed(2)}
                  </span>
                </p>
                <p className="mt-2 flex items-start">
                  <span className="text-red-500 mr-1">*</span>
                  <span>
                    <strong>Terms:</strong> Late return fines are calculated using industry-standard rates: 10% base fee of the original rental amount plus $5.00 per day overdue. 
                    Fines help cover administrative costs and ensure equipment availability for other customers.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinePaymentPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
      <FinePaymentContent />
    </Suspense>
  );
};

export default FinePaymentPage;