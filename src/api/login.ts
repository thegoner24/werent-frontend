import { apiFetch, endpoints } from './index';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  return apiFetch(endpoints.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
