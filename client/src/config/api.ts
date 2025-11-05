

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://grz.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  RESERVATIONS: {
    CREATE: `${API_BASE_URL}/api/reservations`,
    GET_ALL: `${API_BASE_URL}/api/reservations`,
    GET_BY_DATE: (date: string, serviceType?: string) => 
      `${API_BASE_URL}/api/reservations/date/${date}${serviceType ? `?service_type=${serviceType}` : ''}`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/reservations/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/reservations/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/reservations/${id}`,
  },
  PHOTOS: {
    // CREATE - Upload before/after photos
    UPLOAD: (type: 'before' | 'after') => `${API_BASE_URL}/api/photos/${type}`,
    // READ - Get all photos (optional: ?type=before or ?type=after)
    GET_ALL: `${API_BASE_URL}/api/photos`,
    // READ - Get photo by ID
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
    // UPDATE - Update photo caption
    UPDATE: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
    // DELETE - Delete photo
    DELETE: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
  },
};

