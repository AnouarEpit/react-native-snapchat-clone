import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config, getApiUrl } from "../constants/Config";

// Types pour les réponses de l'API
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
}

interface Snap {
  id: string;
  from: string;
  to: string;
  image: string;
  duration: number;
  createdAt: string;
  seen: boolean;
}

class ApiServiceClass {
  private api: AxiosInstance;
  private apiKey: string =
    "REDACTED_API_KEY";

  constructor() {
    this.api = axios.create({
      baseURL: Config.API.BASE_URL,
      timeout: Config.API.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur pour ajouter les headers automatiquement
    this.api.interceptors.request.use(
      async (config) => {
        // ✅ Verificación simplificada
        if (this.apiKey && this.apiKey.length > 50) {
          config.headers["x-api-key"] = this.apiKey;
          console.log(
            "🔑 API Key ajoutée aux headers (longueur:",
            this.apiKey.length,
            ")"
          );
        } else {
          console.error(
            "❌ API Key manquante ou invalide:",
            this.apiKey?.substring(0, 20) + "..."
          );
        }

        // Ajouter le token d'authentification si disponible
        const token = await AsyncStorage.getItem(
          Config.STORAGE_KEYS.USER_TOKEN
        );
        if (token) {
          config.headers["authorization"] = `Bearer ${token}`;
          console.log("🎟️ Token ajouté aux headers");
        }

        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      async (error) => {
        console.error(
          "❌ Response Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          // Token expiré ou invalide
          await AsyncStorage.multiRemove([
            Config.STORAGE_KEYS.USER_TOKEN,
            Config.STORAGE_KEYS.USER_DATA,
          ]);
        }
        return Promise.reject(error);
      }
    );
  }

  // Définir/Mettre à jour la clé API
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    console.log("🔑 API Key configurée");
  }

  // Vérifier si l'API est configurée
  isConfigured(): boolean {
    const isValid = !!(this.apiKey && this.apiKey.length > 50);
    console.log(
      "🔍 API configurée?",
      isValid,
      "(longueur:",
      this.apiKey?.length,
      ")"
    );
    return isValid;
  }

  // === MÉTHODES D'AUTHENTIFICATION ===

  async signUp(
    email: string,
    password: string,
    username: string,
    date: string
  ): Promise<ApiResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: "Clé API non configurée. Veuillez configurer votre clé API.",
        };
      }

      const response = await this.api.post(Config.ENDPOINTS.USER_SIGNUP, {
        email,
        password,
        username,
        date,
      });

      return {
        success: true,
        data: response.data,
        message: "Compte créé avec succès",
      };
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: "Clé API non configurée. Veuillez configurer votre clé API.",
        };
      }

      const response = await this.api.put(Config.ENDPOINTS.USER_LOGIN, {
        email,
        password,
      });

      console.log("🔍 Structure de la réponse login:", response.data);

      // La réponse de l'API a cette structure:
      // { token: { data: { token: "...", username: "...", _id: "..." } }, user: {...} }

      let actualToken: string;
      let actualUser: any;

      if (response.data.token && response.data.token.data) {
        // Structure de l'API réelle - EXTRAIRE SEULEMENT LE STRING DEL TOKEN
        actualToken = response.data.token.data.token; // ✅ SOLO EL STRING
        actualUser = {
          id: response.data.token.data._id,
          email: response.data.token.data.email || email,
          username: response.data.token.data.username,
          profilePicture: response.data.token.data.profilePicture || "",
        };
      } else {
        // Fallback au cas où la structure change
        actualToken = response.data.token || response.data;
        actualUser = response.data.user || {
          id: "user_id",
          email,
          username: email.split("@")[0],
        };
      }

      // ✅ VERIFICACIÓN CRÍTICA: Asegurar que actualToken es un STRING
      if (typeof actualToken === "object") {
        console.error("❌ Token es objeto, extrayendo string...", actualToken);
        actualToken =
          (actualToken as any).data?.token ||
          (actualToken as any).token ||
          JSON.stringify(actualToken);
      }

      console.log(
        "✅ Token extrait FINAL (debe ser string):",
        typeof actualToken,
        (actualToken as string).substring(0, 50) + "..."
      );
      console.log("✅ User extrait:", actualUser);

      return {
        success: true,
        token: actualToken,
        user: actualUser,
        message: "Connexion réussie",
      };
    } catch (error: any) {
      console.error("❌ Erreur connexion:", error);
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.api.get(Config.ENDPOINTS.USER_PROFILE, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // === MÉTHODES UTILISATEUR ===

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get(Config.ENDPOINTS.USER_PROFILE);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse> {
    try {
      const response = await this.api.patch(
        Config.ENDPOINTS.USER_PROFILE,
        userData
      );
      return {
        success: true,
        data: response.data,
        message: "Profil mis à jour avec succès",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async deleteUser(): Promise<ApiResponse> {
    try {
      await this.api.delete(Config.ENDPOINTS.USER_PROFILE);
      return {
        success: true,
        message: "Compte supprimé avec succès",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const url = getApiUrl(Config.ENDPOINTS.USER_BY_ID, { id });
      const response = await this.api.get(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  // === MÉTHODES AMIS ===

  async getFriends(): Promise<ApiResponse<User[]>> {
    try {
      const response = await this.api.get(Config.ENDPOINTS.FRIENDS);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async addFriend(userId: string): Promise<ApiResponse> {
    try {
      await this.api.post(Config.ENDPOINTS.FRIENDS, { userId });
      return {
        success: true,
        message: "Ami ajouté avec succès",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async removeFriend(userId: string): Promise<ApiResponse> {
    try {
      await this.api.delete(Config.ENDPOINTS.FRIENDS, {
        data: { userId },
      });
      return {
        success: true,
        message: "Ami supprimé avec succès",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  // === MÉTHODES SNAPS ===

  async getSnaps(): Promise<ApiResponse<Snap[]>> {
    try {
      const response = await this.api.get(Config.ENDPOINTS.SNAPS);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async sendSnap(formData: FormData): Promise<ApiResponse> {
    try {
      const response = await this.api.post(Config.ENDPOINTS.SNAPS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        data: response.data,
        message: "Snap envoyé avec succès",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async getSnapById(id: string): Promise<ApiResponse<Snap>> {
    try {
      const url = getApiUrl(Config.ENDPOINTS.SNAP_BY_ID, { id });
      const response = await this.api.get(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async markSnapAsSeen(id: string): Promise<ApiResponse> {
    try {
      const url = getApiUrl(Config.ENDPOINTS.SNAP_SEEN, { id });
      const response = await this.api.put(url);
      return {
        success: true,
        message: "Snap marqué comme vu",
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  // Méthode utilitaire pour extraire les messages d'erreur
  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return "Une erreur inattendue s'est produite";
  }
}

// Export de l'instance singleton
export const ApiService = new ApiServiceClass();

// Export des types pour utilisation dans d'autres fichiers
export type { User, Snap, ApiResponse };
