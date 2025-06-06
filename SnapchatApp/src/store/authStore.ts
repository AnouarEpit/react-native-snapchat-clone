import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthState 
{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => void;
  register: (credentials: RegisterCredentials) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: credentials.email.split('@')[0]
      };
      
      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 1000);
  },

  register: (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    
    setTimeout(() => {
      const mockUser: User = {
        id: '2',
        email: credentials.email,
        username: credentials.username
      };
      
      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 1000);
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
