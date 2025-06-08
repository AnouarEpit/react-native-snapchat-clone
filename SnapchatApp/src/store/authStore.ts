import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from  '../services/auth/authService';
import { realApiService } from '../services/api/realApiService';

const USE_REAL_API = true; // Cambiar a true para usar API real

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    try {
      let authData;
      
      if (USE_REAL_API) {
        // Usar API real
        console.log('🌐 Using REAL API for login');
        authData = await realApiService.login(credentials);
      } else {
        // Usar Mock
        console.log('🎭 Using MOCK API for login');
        authData = await authService.login(credentials);
      }
      
      set({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    
    try {
      let authData;
      
      if (USE_REAL_API) {
        // Usar API real
        console.log('🌐 Using REAL API for register');
        authData = await realApiService.register(credentials);
      } else {
        // Usar Mock
        console.log('🎭 Using MOCK API for register');
        authData = await authService.register(credentials);
      }
      
      set({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      if (USE_REAL_API) {
        await realApiService.logout();
      } else {
        await authService.logout();
      }
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      // Même si l'API échoue, on déconnecte localement
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    
    try {
      const storedAuth = await authService.getStoredAuth();
      
      if (storedAuth) {
        // Vérifier si le token est toujours valide avec l'API appropriée
        let isValid = true;
        
        if (USE_REAL_API) {
          try {
            realApiService.setToken(storedAuth.token);
            await realApiService.getUserProfile();
          } catch (error) {
            isValid = false;
          }
        }
        
        if (isValid) {
          set({
            user: storedAuth.user,
            token: storedAuth.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          await authService.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Error loading stored auth:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Método para cambiar entre Mock y Real API
  toggleApiMode: () => {
    // Esta función se puede usar para testing
    console.log(`🔄 API Mode: ${USE_REAL_API ? 'REAL' : 'MOCK'}`);
  },
}));