import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  Snap, 
  CreateSnapData,
  Friend 
} from '../../types';

class RealApiService {
  private client: AxiosInstance;
  private token: string | null = null;
  private apiKey: string = 'YOUR_API_KEY_HERE'; // ← Reemplazar con tu API key

  constructor() {
    this.client = axios.create({
      baseURL: 'https://snapchat.epihub.eu',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey, // Header obligatorio
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('token');
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
        
        if (error.response?.status === 401) {
          await this.clearAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    AsyncStorage.setItem('token', token);
  }

  async clearAuth() {
    this.token = null;
    await AsyncStorage.multiRemove(['token', 'user']);
  }

  // ===== AUTH ENDPOINTS =====
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await this.client.post('/user', {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username,
      });

      const { data } = response;
      console.log('Register response:', data);
      
      return {
        user: {
          id: data.id || data._id,
          email: data.email,
          username: data.username,
          profilePicture: data.profilePicture,
        },
        token: 'registered', // El token se obtiene con login
      };
    } catch (error: any) {
      console.error('Register API Error:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erreur d\'inscription');
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Usar PUT /user para login (según API doc)
      const response = await this.client.put('/user', {
        email: credentials.email,
        password: credentials.password,
      });

      const { data } = response;
      console.log('Login response:', data);
      
      // El token debería estar en la respuesta
      const token = data.token || data.access_token || response.headers['authorization'];
      
      if (token) {
        this.setToken(token);
      }
      
      return {
        user: {
          id: data.id || data._id,
          email: data.email,
          username: data.username,
          profilePicture: data.profilePicture,
        },
        token: token || 'login_success',
      };
    } catch (error: any) {
      console.error('Login API Error:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erreur de connexion');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await this.clearAuth();
    }
  }

  // ===== USER ENDPOINTS =====
  async getAllUsers(): Promise<Friend[]> {
    try {
      const response = await this.client.get('/user/friends');
      return response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
    }
  }

  async getUserProfile(): Promise<User> {
    try {
      const response = await this.client.get('/user');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  // ===== SNAP ENDPOINTS =====
  async sendSnap(snapData: CreateSnapData): Promise<Snap> {
    try {
      // Convertir image URI a base64 si nécessaire
      const imageBase64 = await this.convertImageToBase64(snapData.image);
      
      const response = await this.client.post('/snap', {
        to: snapData.to,
        image: imageBase64,
        duration: snapData.duration,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du snap');
    }
  }

  async getSnaps(): Promise<Snap[]> {
    try {
      const response = await this.client.get('/snap');
      return response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des snaps');
    }
  }

  async markSnapAsViewed(snapId: string): Promise<void> {
    try {
      await this.client.put(`/snap/seen/${snapId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage du snap');
    }
  }

  async deleteSnap(snapId: string): Promise<void> {
    try {
      await this.client.delete(`/snap/${snapId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du snap');
    }
  }

  // ===== HELPER METHODS =====
  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      if (imageUri.startsWith('data:')) {
        return imageUri; // Déjà en base64
      }

      // Pour React Native, utiliser fetch pour convertir
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return imageUri; // Fallback
    }
  }

  // Test de connexion API
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const realApiService = new RealApiService();