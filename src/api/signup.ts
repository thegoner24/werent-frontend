import { apiFetch, endpoints } from './index';

export interface SignupPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
}

export async function signup(payload: SignupPayload) {
  console.log('Signup payload:', payload);
  return apiFetch(endpoints.signup, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
