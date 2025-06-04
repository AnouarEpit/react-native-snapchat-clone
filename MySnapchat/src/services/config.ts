import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../utils/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'x-api-key': API_CONFIG.API_KEY,
    'Content-Type': 'application/json',
  },
});


// Interceptor para añadir token automáticamente
api.interceptors.request.use(async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  });
  
  // Interceptor para manejar respuestas
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado - limpiar storage
        AsyncStorage.multiRemove(['userToken', 'userData']);
      }
      return Promise.reject(error);
    }
  );
  
  export { api };
  
