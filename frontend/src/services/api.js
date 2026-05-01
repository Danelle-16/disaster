const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = {
  // Events
  getEvents: (params) => `${API_BASE_URL}/api/events?${new URLSearchParams(params)}`,
  getEvent: (id) => `${API_BASE_URL}/api/events/${id}`,
  getNearbyEvents: (lat, lon, radius) => 
    `${API_BASE_URL}/api/events/nearby?lat=${lat}&lon=${lon}&radius=${radius}`,
  getAnalytics: () => `${API_BASE_URL}/api/events/analytics`,
  
  // Auth
  register: () => `${API_BASE_URL}/api/auth/register`,
  login: () => `${API_BASE_URL}/api/auth/login`,
  
  // User
  getUserLocation: () => `${API_BASE_URL}/api/user/location`,
  setUserLocation: () => `${API_BASE_URL}/api/user/location`,
  getPreferences: () => `${API_BASE_URL}/api/user/preferences`,
  savePreference: () => `${API_BASE_URL}/api/user/preferences`,
  deletePreference: (id) => `${API_BASE_URL}/api/user/preferences/${id}`,
  
  // Admin
  syncEvents: () => `${API_BASE_URL}/api/admin/sync-events`
};
