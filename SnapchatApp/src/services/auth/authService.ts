import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials } from '../../types';

export interface AuthData {
  user: User;
  token: string;
}

export class AuthService {
  // Mock login para desarrollo
  async login(credentials: LoginCredentials): Promise<AuthData> {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock_' + Date.now(),
        email: credentials.email,
        username: credentials.email.split('@')[0],
        profilePicture: undefined,
      };

      const mockToken = 'mock_token_' + Date.now();

      const authData: AuthData = {
        user: mockUser,
        token: mockToken,
      };

      // Stocker les données
      await this.storeAuthData(authData);
      
      return authData;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
  }

  // Mock register pour développement
  async register(credentials: RegisterCredentials): Promise<AuthData> {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock_' + Date.now(),
        email: credentials.email,
        username: credentials.username,
        profilePicture: undefined,
      };

      const mockToken = 'mock_token_' + Date.now();

      const authData: AuthData = {
        user: mockUser,
        token: mockToken,
      };

      // Stocker les données
      await this.storeAuthData(authData);
      
      return authData;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur d\'inscription');
    }
  }

  async logout(): Promise<void> {
    await this.clearAuthData();
  }

  async getStoredAuth(): Promise<AuthData | null> {
    try {
      const [tokenStr, userStr] = await AsyncStorage.multiGet(['token', 'user']);
      
      const token = tokenStr[1];
      const userJson = userStr[1];
      
      if (!token || !userJson) {
        return null;
      }

      return {
        user: JSON.parse(userJson),
        token
      };
    } catch (error) {
      await this.clearAuthData();
      return null;
    }
  }

  private async storeAuthData(authData: AuthData): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['token', authData.token],
        ['user', JSON.stringify(authData.user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Erreur de sauvegarde des données de connexion');
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export const authService = new AuthService();