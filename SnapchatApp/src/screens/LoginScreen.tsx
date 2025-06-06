import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

const LoginScreen: React.FC = () => {
  const { isLoading, login, register } = useAuthStore();

  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  const handleRegister = () => {
    register({
      email: 'nuevo@example.com',
      password: 'password123',
      username: 'nuevo_usuario'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}></Text>
        <Text style={styles.title}>SNAPCHAT</Text>
        <Text style={styles.subtitle}>Captures the moment</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.description}>
            Inicia sesión para ver y enviar snaps a tus amigos
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
            />
            
            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              variant="secondary"
              loading={isLoading}
              size="large"
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>ETAPA 4: UI Premium </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  
  title: {
    ...typography.largeTitle,
    color: colors.snapchat,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    ...typography.callout,
    color: colors.grayText,
    textAlign: 'center',
  },
  
  content: {
    flex: 2,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  
  card: {
    backgroundColor: colors.glassDark,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  
  welcomeText: {
    ...typography.title1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  description: {
    ...typography.body,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  
  buttonContainer: {
    gap: spacing.md,
  },
  
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  
  version: {
    ...typography.caption,
    color: colors.success,
    textAlign: 'center',
  },
});

export default LoginScreen;
