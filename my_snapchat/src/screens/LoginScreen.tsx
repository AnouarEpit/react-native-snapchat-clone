import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import OptimizedInput from "../components/OptimizedInput";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre mot de passe");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erreur", "Email invalide");
      console.log("Email invalide");
      return;
    }

    try {
      console.log("Tentative de connexion:", email);
      await login({ email: email.trim(), password });

      console.log("Connexion réussie!");
    } catch (error: any) {
      console.error(" Erreur de connexion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#0a0e27", "#1a1a2e", "#16213e", "#0f3460"] as const}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.decorContainer}>
        <Animatable.View
          animation="fadeIn"
          delay={500}
          style={[styles.hexagon, { top: 100, right: 40 }]}
        />

        <Animatable.View
          animation="fadeIn"
          delay={800}
          style={[
            styles.hexagon,
            { bottom: 200, left: 30, width: 35, height: 35 },
          ]}
        />
      </View>

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          accessible={true}
          accessibilityLabel="Retour"
          accessibilityRole="button"
        >
          <BlurView intensity={20} style={styles.backButtonBlur}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </BlurView>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.content}>
          <Animatable.View
            animation="fadeInDown"
            duration={800}
            style={styles.titleSection}
          >
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Accédez à votre compte MY_SNAPCHAT
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
            <OptimizedInput
              placeholder="Adresse email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon="mail-outline"
              autoComplete="email"
              testID="email-input"
            />

            <OptimizedInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              icon="lock-closed-outline"
              showEye={true}
              autoComplete="password"
              testID="password-input"
            />

            {error && (
              <Animatable.View animation="shake" style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </Animatable.View>
            )}

            <Pressable
              onPress={onForgotPassword}
              style={styles.forgotPassword}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessible={true}
              accessibilityLabel="Mot de passe oublié"
              accessibilityRole="button"
            >
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="Se connecter"
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading }}
            >
              <BlurView intensity={30} style={styles.loginButtonBlur}>
                <LinearGradient
                  colors={
                    [
                      "rgba(255,255,255,0.15)",
                      "rgba(255,255,255,0.05)",
                    ] as const
                  }
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <Animatable.View
                      animation="rotate"
                      iterationCount="infinite"
                      duration={1000}
                    >
                      <Ionicons name="refresh" size={20} color="#FFFFFF" />
                    </Animatable.View>
                  ) : (
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  )}
                </LinearGradient>
              </BlurView>
            </Pressable>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={600}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Nouveau sur MY_SNAPCHAT ?</Text>
            <Pressable
              onPress={onBack}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessible={true}
              accessibilityLabel="Créer un compte"
              accessibilityRole="button"
            >
              <Text style={styles.signUpLink}>Créer un compte</Text>
            </Pressable>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },

  decorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  hexagon: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.03)",
    transform: [{ rotate: "45deg" }],
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },

  backButtonBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  titleSection: {
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "400",
  },

  form: {
    gap: 8,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,107,0.1)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
  },

  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 24,
    minHeight: 56,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonBlur: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  loginButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "400",
  },
  signUpLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
