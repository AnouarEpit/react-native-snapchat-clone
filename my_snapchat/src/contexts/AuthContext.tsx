import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ApiService } from "../services/ApiService";

// Types
interface AuthUser {
  id: string;
  email: string;
  username: string;
  token: string;
  profilePicture?: string;
  date?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: {
    email: string;
    password: string;
    username: string;
    date: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // ✅ DESACTIVAR AUTO-LOGIN - siempre empezar en Welcome
    console.log("🔍 Inicio sin auto-login, directo a Welcome");
    setIsInitialized(true);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    console.log("🔐 Début de la connexion pour:", credentials.email);
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡 Appel API login...");
      const response = await ApiService.login(
        credentials.email,
        credentials.password
      );
      console.log("📡 Réponse API login:", response);

      if (response.success && response.token && response.user) {
        // ✅ VERIFICACIÓN CRÍTICA: Asegurar que el token es un string
        let tokenString = response.token;
        if (typeof response.token === "object") {
          console.error(
            "❌ Token es objeto en AuthContext, convirtiendo a string..."
          );
          tokenString =
            (response.token as any).data?.token ||
            (response.token as any).token ||
            JSON.stringify(response.token);
        }

        const authUser: AuthUser = {
          ...response.user,
          token: tokenString as string,
        };

        console.log("💾 Sauvegarde des données utilisateur...");
        console.log(
          "🔍 Token à sauvegarder (debe ser string):",
          typeof tokenString,
          (tokenString as string).substring(0, 50) + "..."
        );
        console.log("🔍 User à sauvegarder:", response.user);

        // ✅ Sauvegarder en tant que strings
        await AsyncStorage.setItem("userToken", tokenString as string);
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));

        setUser(authUser);
        console.log("✅ Connexion réussie pour:", authUser.username);
        Alert.alert("Succès", "Connexion réussie !");
      } else {
        const errorMsg = response.message || "Erreur de connexion";
        console.log("❌ Échec de la connexion:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Erreur de connexion";
      console.error("❌ Erreur dans login():", errorMessage);
      setError(errorMessage);
      Alert.alert("Erreur", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      console.log("🔐 Fin de la tentative de connexion");
    }
  };

  const signUp = async (credentials: {
    email: string;
    password: string;
    username: string;
    date: string;
  }) => {
    console.log(
      "📝 Début de l'inscription pour:",
      credentials.email,
      credentials.username
    );
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡Appel API signUp...");

      const response = await ApiService.signUp(
        credentials.email,
        credentials.password,
        credentials.username,
        credentials.date
      );
      console.log(" Réponse API signUp:", response);

      if (response.success) {
        console.log(" Inscription réussie pour:", credentials.username);
        Alert.alert(
          "Succès",
          "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
        );
      } else {
        const errorMsg =
          response.message || "Erreur lors de la création du compte";
        console.log(" Échec de l'inscription:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Erreur lors de la création du compte";
      console.error(" Erreur dans signUp():", errorMessage);
      setError(errorMessage);
      Alert.alert("Erreur", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      console.log("Fin de la tentative d'inscription");
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Déconnexion...");
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      setUser(null);
      console.log("✅ Déconnexion réussie");
    } catch (error) {
      console.error("❌ Erreur déconnexion:", error);
    }
  };

  const clearError = () => {
    console.log("🧹 Effacement de l'erreur");
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    signUp,
    logout,
    clearError,
  };

  console.log("🔄 AuthContext state:", {
    isAuthenticated,
    isInitialized,
    isLoading,
    hasUser: !!user,
    username: user?.username || "none",
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
};

export default AuthContext;