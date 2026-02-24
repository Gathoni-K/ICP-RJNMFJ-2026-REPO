const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token'); // Assuming auth logic
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
        },
    });

        if (!response.ok) throw new Error('API request failed');
        return response.json();
}