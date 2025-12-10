export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    CONTACT: `${API_BASE_URL}/api/reservations/contact`,
  },
  PHOTOS: {
    UPLOAD: (type: 'before' | 'after') => `${API_BASE_URL}/api/photos/${type}`,
    GET_ALL: `${API_BASE_URL}/api/photos`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
  },
};

