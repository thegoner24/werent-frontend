import { apiFetch, endpoints } from './index';

export interface PaymentRequest {
  booking_id: number[];
  payment_method: 'CC' | 'QRIS' | 'TRANSFER' | 'CASH';
  payment_type: 'RENT';
  total_price: number;
  user_id: number;
}

export interface PaymentResponse {
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

export const createPayment = async (
  paymentData: PaymentRequest,
  accessToken: string
): Promise<PaymentResponse> => {
  return await apiFetch(endpoints.payments, {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }, accessToken);
};