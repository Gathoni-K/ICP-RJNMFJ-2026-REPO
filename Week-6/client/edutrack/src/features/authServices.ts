import { apiRequest } from '../lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store the token for the authMiddleware to use in lib/api.ts
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  signup: async (name: string, email: string, pass: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass }),
    });
  }
};