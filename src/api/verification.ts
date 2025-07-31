import { apiFetch } from './index';

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export async function resendVerification(accessToken: string): Promise<ResendVerificationResponse> {
  return apiFetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}
