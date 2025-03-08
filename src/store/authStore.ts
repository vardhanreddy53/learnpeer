import { create } from 'zustand';
import axios from 'axios';
import { User, TeacherCredentials } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  submitTeacherCredentials: (userId: string, credentials: TeacherCredentials) => Promise<void>;
  validateTeacher: (userId: string, isApproved: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      set({ 
        user: data,
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
    }
  },
  
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      set({ 
        user: data,
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, isAuthenticated: false });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  submitTeacherCredentials: async (userId, credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(
        `/api/users/${userId}/teacher-credentials`,
        credentials
      );
      
      set(state => ({
        user: data,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to submit credentials', 
        isLoading: false 
      });
    }
  },
  
  validateTeacher: async (userId, isApproved) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(
        `/api/users/${userId}/validate-teacher`,
        { isApproved }
      );
      
      set(state => ({
        user: data,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to validate teacher', 
        isLoading: false 
      });
    }
  }
}));

// Initialize auth state from localStorage
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Fetch user profile
  axios.get('/api/users/profile')
    .then(({ data }) => {
      useAuthStore.setState({ 
        user: data,
        isAuthenticated: true
      });
    })
    .catch(() => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    });
}