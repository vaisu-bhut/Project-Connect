import axios from 'axios';
import { Contact } from '@/types';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',    
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for handling tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // For example, redirect to login page
    }
    return Promise.reject(error);
  }
);

// Contact-related API calls
export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const { data } = await api.get('/contacts');
    return data;
  },

  getById: async (id: string): Promise<Contact> => {
    const { data } = await api.get(`/contacts/${id}`);
    return data;
  },

  create: async (contact: Omit<Contact, '_id'>): Promise<Contact> => {
    const { data } = await api.post('/contacts', contact);
    return data;
  },

  update: async (id: string, contact: Partial<Contact>): Promise<Contact> => {
    console.log('API Update Request:', { id, contact });
    try {
      const { data } = await api.put(`/contacts/${id}`, contact);
      console.log('API Update Response:', data);
      return data;
    } catch (error) {
      console.error('API Update Error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  }
};

export const interactionsApi = {
  create: async (data: {
    userId: string;
    contactIds: string[];
    type: string;
    title: string;
    date: string;
    time: string;
    notes?: string;
    location?: string;
    reminders?: Array<{
      date: string;
      time: string;
      message: string;
      minutes: number;
    }>;
  }) => {
    const { data: response } = await api.post('/interactions', data);
    return response;
  },

  getAll: async () => {
    const { data } = await api.get('/interactions');
    return data;
  },

  getByUser: async (userId: string) => {
    const { data } = await api.get(`/interactions/user/${userId}`);
    return data;
  },

  getByContact: async (contactId: string) => {
    const { data } = await api.get(`/interactions/contact/${contactId}`);
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/interactions/${id}`);
    return data;
  },

  update: async (id: string, data: {
    userId: string;
    contactIds: string[];
    type: string;
    title: string;
    date: string;
    time: string;
    notes?: string;
    location?: string;
    reminders?: Array<{
      date: string;
      time: string;
      message: string;
      minutes: number;
    }>;
  }) => {
    const { data: response } = await api.put(`/interactions/${id}`, data);
    return response;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/interactions/${id}`);
    return data;
  },

  uploadAttachments: async (eventId: string, formData: FormData) => {
    const { data } = await api.post(`/interactions/${eventId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default api; 