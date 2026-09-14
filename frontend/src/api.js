export const API_KEY = import.meta.env.VITE_API_KEY;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

let accessToken = localStorage.getItem('access_token');
let refreshToken = localStorage.getItem('refresh_token');

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem('access_token', access);
  else localStorage.removeItem('access_token');
  
  if (refresh) localStorage.setItem('refresh_token', refresh);
  else localStorage.removeItem('refresh_token');
};

export const logout = () => {
  setTokens(null, null);
  window.location.href = '/login';
};

const doFetch = async (endpoint, options = {}) => {
  const headers = {
    'Accept': 'application/json',
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  // If unauthorized and we have a refresh token, try to refresh
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setTokens(data.access_token, data.refresh_token || refreshToken);
      // Retry original request
      headers['Authorization'] = `Bearer ${data.access_token}`;
      res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      // Refresh failed
      logout();
    }
  }
  
  return res;
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    throw new Error(await res.text());
  }
  
  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
};

export const api = {
  get: (endpoint) => doFetch(endpoint),
  post: (endpoint, body) => doFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  delete: (endpoint) => doFetch(endpoint, { method: 'DELETE' })
};
