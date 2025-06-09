import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import OptimizedInput from '../components/OptimizedInput';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: (email: string, password: string, username: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signUp, isLoading, error } = useAuth();

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username.trim()) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur est requis');
      return false;
    }
    if (username.length < 3) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur doit faire au moins 3 caractères');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et _');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Erreur', 'L\'email est requis');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Email invalide');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Erreur', 'Le mot de passe est requis');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      console.log('📝 Tentative d\'inscription:', formData.email, formData.username);
      await signUp({
        email: formData.email.trim(),
        password: formData.password,
        username: formData.username.trim(),
      });
      console.log('✅ Inscription réussie!');
      onBack();
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#0a0e27', '#1a1a2e', '#16213e', '#0f3460'] as const}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.decorContainer}>
        <Animatable.View
          animation="fadeIn"
          delay={300}
          style={[styles.hexagon, { top: 120, right: 40 }]}
        />
        <Animatable.View
          animation="fadeIn"
          delay={600}
          style={[styles.hexagon, { bottom: 180, left: 20, width: 35, height: 35 }]}
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            
            <Animatable.View animation="fadeInDown" duration={800} style={styles.titleSection}>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>Créez votre compte MY_SNAPCHAT</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
              
              <OptimizedInput
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                icon="person-outline"
                autoComplete="username"
                testID="username-input"
              />

              <OptimizedInput
                placeholder="Adresse email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                icon="mail-outline"
                autoComplete="email"
                testID="email-input"
              />

              <OptimizedInput
                placeholder="Mot de passe"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry={true}
                icon="lock-closed-outline"
                showEye={true}
                autoComplete="password"
                testID="password-input"
              />

              <OptimizedInput
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry={true}
                icon="lock-closed-outline"
                showEye={true}
                autoComplete="password"
                testID="confirm-password-input"
              />

              {error && (
                <Animatable.View animation="shake" style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{error}</Text>
                </Animatable.View>
              )}

              <View style={styles.termsContainer}>
                <View style={styles.termsBox}>
                  <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.termsText}>
                    En créant un compte, vous acceptez nos{' '}
                    <Text style={styles.termsLink}>Conditions d'utilisation</Text>
                    {' '}et notre{' '}
                    <Text style={styles.termsLink}>Politique de confidentialité</Text>
                  </Text>
                </View>
              </View>

              <Pressable
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
                accessible={true}
                accessibilityLabel="Créer mon compte"
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading }}
              >
                <BlurView intensity={30} style={styles.signUpButtonBlur}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'] as const}
                    style={styles.signUpButtonGradient}
                  >
                    {isLoading ? (
                      <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                      </Animatable.View>
                    ) : (
                      <>
                        <Text style={styles.signUpButtonText}>Créer mon compte</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </BlurView>
              </Pressable>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={600} style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ?</Text>
              <Pressable 
                onPress={onBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessible={true}
                accessibilityLabel="Se connecter"
                accessibilityRole="button"
              >
                <Text style={styles.loginLink}>Se connecter</Text>
              </Pressable>
            </Animatable.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  decorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hexagon: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '45deg' }],
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
    overflow: 'hidden',
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: height * 0.8,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  form: {
    gap: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  termsContainer: {
    marginVertical: 16,
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  termsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  signUpButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    minHeight: 56,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonBlur: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  signUpButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;