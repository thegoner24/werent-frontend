import { apiFetch } from './index';

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  data: {
    access_token: string;
  };
  message: string;
  success: boolean;
}

/**
 * Refresh the access token using the refresh token
 * @param refreshToken The refresh token
 * @returns Promise with new access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const payload: RefreshTokenPayload = {
    refresh_token: refreshToken
  };

  return apiFetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}